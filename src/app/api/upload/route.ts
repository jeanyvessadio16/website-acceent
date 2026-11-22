import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { checkDistributedRateLimit, logger } from "@/lib/core";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 Mo
const MAX_DOC_SIZE = 15 * 1024 * 1024; // 15 Mo

const IMAGE_TYPES: Record<string, { extAliases: string[]; canonicalExt: string }> = {
  "image/jpeg": { extAliases: ["jpg", "jpeg"], canonicalExt: "jpg" },
  "image/png": { extAliases: ["png"], canonicalExt: "png" },
  "image/webp": { extAliases: ["webp"], canonicalExt: "webp" },
  "image/gif": { extAliases: ["gif"], canonicalExt: "gif" },
};

const DOC_TYPES: Record<string, { ext: string; sig: "pdf" | "zip" | "ole2" }> = {
  "application/pdf": { ext: "pdf", sig: "pdf" },
  "application/msword": { ext: "doc", sig: "ole2" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    ext: "docx",
    sig: "zip",
  },
  "application/vnd.ms-powerpoint": { ext: "ppt", sig: "ole2" },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
    ext: "pptx",
    sig: "zip",
  },
};

const DOC_EXT_TO_MIME: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

const ALLOWED_IMAGE_FOLDERS = new Set([
  "articles",
  "events",
  "partners",
  "testimonials",
  "uploads",
]);

function startsWithBytes(buf: Uint8Array, sig: number[], offset = 0): boolean {
  if (buf.length < offset + sig.length) return false;
  for (let i = 0; i < sig.length; i += 1) {
    if (buf[offset + i] !== sig[i]) return false;
  }
  return true;
}

function detectImageSignature(bytes: Uint8Array): "jpg" | "png" | "gif" | "webp" | null {
  if (startsWithBytes(bytes, [0xff, 0xd8, 0xff])) return "jpg";
  if (startsWithBytes(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "png";
  if (startsWithBytes(bytes, [0x47, 0x49, 0x46, 0x38])) return "gif";
  if (
    startsWithBytes(bytes, [0x52, 0x49, 0x46, 0x46], 0) &&
    startsWithBytes(bytes, [0x57, 0x45, 0x42, 0x50], 8)
  ) {
    return "webp";
  }
  return null;
}

function detectDocumentSignature(bytes: Uint8Array): "pdf" | "zip" | "ole2" | null {
  if (startsWithBytes(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d])) return "pdf";
  if (
    startsWithBytes(bytes, [0x50, 0x4b, 0x03, 0x04]) ||
    startsWithBytes(bytes, [0x50, 0x4b, 0x05, 0x06]) ||
    startsWithBytes(bytes, [0x50, 0x4b, 0x07, 0x08])
  ) {
    return "zip";
  }
  if (startsWithBytes(bytes, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])) return "ole2";
  return null;
}

function cleanBaseName(fileName: string): string {
  const baseName = fileName.includes(".")
    ? fileName.substring(0, fileName.lastIndexOf("."))
    : fileName;
  return (
    baseName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "fichier"
  );
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  const rate = await checkDistributedRateLimit(`upload:${session.userId}`, {
    limit: 30,
    windowMs: 15 * 60 * 1000,
  });
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Trop de téléversements récents. Veuillez patienter avant de réessayer." },
      { status: 429 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Requête invalide (FormData attendu)." }, { status: 400 });
  }

  const file = formData.get("file");
  const kind = formData.get("kind");
  const rawFolder = formData.get("folder");

  if (!(file instanceof File) || file.size <= 0) {
    return NextResponse.json({ error: "Aucun fichier valide sélectionné." }, { status: 400 });
  }

  if (kind !== "image" && kind !== "document") {
    return NextResponse.json({ error: "Type de téléversement invalide." }, { status: 400 });
  }

  const isStaff = session.role === "ADMIN" || session.role === "AUTHOR";
  const folderInput = typeof rawFolder === "string" ? rawFolder.trim().toLowerCase() : "";

  if (kind === "image" && !isStaff) {
    return NextResponse.json(
      { error: "Action réservée aux auteurs et administrateurs." },
      { status: 403 }
    );
  }

  if (kind === "document" && folderInput !== "applications" && !isStaff) {
    return NextResponse.json(
      { error: "Action réservée aux auteurs et administrateurs." },
      { status: 403 }
    );
  }

  const maxAllowedSize = kind === "image" ? MAX_IMAGE_SIZE : MAX_DOC_SIZE;
  if (file.size > maxAllowedSize) {
    return NextResponse.json(
      {
        error:
          kind === "image"
            ? "L'image dépasse la taille maximale autorisée (10 Mo)."
            : "Le document dépasse la taille maximale autorisée (15 Mo).",
      },
      { status: 400 }
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const rawExt = (file.name.split(".").pop() || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
  const cleanBase = cleanBaseName(file.name);
  const declaredMime = (file.type || "").toLowerCase();

  try {
    const supabase = await createSupabaseServerClient();

    if (kind === "image") {
      const mimeMeta = IMAGE_TYPES[declaredMime];
      if (!mimeMeta || !mimeMeta.extAliases.includes(rawExt)) {
        return NextResponse.json(
          { error: "Format d'image non autorisé. Formats acceptés : JPG, PNG, WebP, GIF." },
          { status: 400 }
        );
      }

      const detectedSig = detectImageSignature(bytes);
      const expectedSig = mimeMeta.canonicalExt;
      if (!detectedSig || detectedSig !== expectedSig) {
        return NextResponse.json(
          { error: "Le contenu du fichier ne correspond pas à une image valide." },
          { status: 400 }
        );
      }

      const safeFolder = ALLOWED_IMAGE_FOLDERS.has(folderInput) ? folderInput : "uploads";
      const filePath = `${safeFolder}/${cleanBase}-${uniqueSuffix}.${rawExt}`;

      const { error } = await supabase.storage
        .from("news-images")
        .upload(filePath, bytes, {
          contentType: declaredMime,
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        logger.error("api.upload", "Échec téléversement image Supabase Storage", error, {
          userId: session.userId,
          filePath,
        });
        return NextResponse.json(
          { error: "Impossible de téléverser l'image pour le moment." },
          { status: 500 }
        );
      }

      const { data: publicUrlData } = supabase.storage
        .from("news-images")
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        return NextResponse.json(
          { error: "L'URL publique de l'image n'a pas pu être générée." },
          { status: 500 }
        );
      }

      return NextResponse.json({ url: publicUrlData.publicUrl });
    }

    // kind === "document"
    const expectedMime = DOC_EXT_TO_MIME[rawExt];
    if (!expectedMime) {
      return NextResponse.json(
        { error: "Extension non autorisée. Formats acceptés : PDF, DOC, DOCX, PPT, PPTX." },
        { status: 400 }
      );
    }

    if (declaredMime && !DOC_TYPES[declaredMime]) {
      return NextResponse.json(
        { error: "Format de document non autorisé. Formats acceptés : PDF, Word, PowerPoint." },
        { status: 400 }
      );
    }

    const expectedMeta = DOC_TYPES[expectedMime];
    const detectedSig = detectDocumentSignature(bytes);
    if (!detectedSig || detectedSig !== expectedMeta.sig) {
      return NextResponse.json(
        { error: "Le contenu du fichier ne correspond pas au format de document déclaré." },
        { status: 400 }
      );
    }

    const bucket = process.env.NEXT_PUBLIC_SUPABASE_DOCS_BUCKET || "documents";
    const filePath =
      folderInput === "applications"
        ? `applications/${session.userId}/${cleanBase}-${uniqueSuffix}.${rawExt}`
        : `resources/${cleanBase}-${uniqueSuffix}.${rawExt}`;

    const { error } = await supabase.storage.from(bucket).upload(filePath, bytes, {
      contentType: expectedMime,
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      logger.error("api.upload", "Échec téléversement document Supabase Storage", error, {
        userId: session.userId,
        bucket,
        filePath,
      });
      return NextResponse.json(
        { error: "Impossible de téléverser le document pour le moment." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: `/api/storage/documents/${filePath}` });
  } catch (error) {
    logger.error("api.upload", "Erreur inattendue lors du téléversement", error);
    return NextResponse.json(
      { error: "Une erreur inattendue est survenue lors du téléversement." },
      { status: 500 }
    );
  }
}
