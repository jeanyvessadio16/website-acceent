import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DOC_MIME_MAP: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

const SAFE_SEGMENT_REGEX = /^[a-zA-Z0-9._-]+$/;

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Authentification requise." }, { status: 401 });
  }

  const { path: rawSegments } = await context.params;
  if (
    !Array.isArray(rawSegments) ||
    rawSegments.length === 0 ||
    rawSegments.some(
      (seg) => !seg || seg === "." || seg === ".." || !SAFE_SEGMENT_REGEX.test(seg)
    )
  ) {
    return NextResponse.json({ error: "Chemin de document invalide." }, { status: 400 });
  }

  const [root, ownerOrFile, maybeFile] = rawSegments;
  const isResource = root === "resources" && rawSegments.length === 2;
  const isApplication = root === "applications" && rawSegments.length === 3 && Boolean(maybeFile);

  if (!isResource && !isApplication) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  if (
    isApplication &&
    session.role !== "ADMIN" &&
    ownerOrFile !== session.userId
  ) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const filename = rawSegments[rawSegments.length - 1] ?? "document";
  const ext = filename.includes(".")
    ? filename.split(".").pop()?.toLowerCase() ?? ""
    : "";
  const mimeType = DOC_MIME_MAP[ext];

  if (!mimeType) {
    return NextResponse.json({ error: "Format de document non pris en charge." }, { status: 400 });
  }

  const bucket = process.env.NEXT_PUBLIC_SUPABASE_DOCS_BUCKET || "documents";
  const objectPath = rawSegments.join("/");

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.storage.from(bucket).download(objectPath);

  if (error || !data) {
    return NextResponse.json({ error: "Document introuvable." }, { status: 404 });
  }

  const bytes = await data.arrayBuffer();
  const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const dispositionType = ext === "pdf" ? "inline" : "attachment";

  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": mimeType,
      "Content-Disposition": `${dispositionType}; filename="${safeFilename}"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
