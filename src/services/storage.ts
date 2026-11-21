import { supabase } from "@/lib/supabase";

const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 Mo

const ALLOWED_DOC_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

const ALLOWED_DOC_EXTENSIONS = ["pdf", "doc", "docx", "ppt", "pptx"];
const MAX_DOC_SIZE = 15 * 1024 * 1024; // 15 Mo

function buildCleanPath(folder: string, fileName: string, ext: string): string {
  const safeFolder = folder.replace(/[^a-z0-9-_]/gi, "") || "uploads";
  const baseName = fileName.includes(".")
    ? fileName.substring(0, fileName.lastIndexOf("."))
    : fileName;
  const cleanFileName =
    baseName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 40) || "fichier";

  const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  return `${safeFolder}/${cleanFileName}-${uniqueId}.${ext}`;
}

export async function uploadImage(file: File, folder = "articles"): Promise<string> {
  if (!file) {
    throw new Error("Aucun fichier sélectionné.");
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type.toLowerCase())) {
    throw new Error(
      "Format d'image non autorisé. Formats acceptés : JPG, PNG, WebP, GIF."
    );
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Le fichier dépasse la taille maximale autorisée (10 Mo).");
  }

  const rawExt = file.name.split(".").pop() || "png";
  const fileExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, "");

  if (!ALLOWED_IMAGE_EXTENSIONS.includes(fileExt)) {
    throw new Error("Extension de fichier non autorisée.");
  }

  const filePath = buildCleanPath(folder, file.name, fileExt);

  const { error } = await supabase.storage
    .from("news-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("[Supabase Image Upload Error]", error);
    throw new Error(`Échec du téléversement Supabase : ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from("news-images")
    .getPublicUrl(filePath);

  if (!publicUrlData?.publicUrl) {
    throw new Error("L'URL publique n'a pas pu être générée.");
  }

  return publicUrlData.publicUrl;
}

export async function uploadPostImage(file: File): Promise<string> {
  return uploadImage(file, "articles");
}

export async function uploadDocument(file: File, folder = "resources"): Promise<string> {
  if (!file) {
    throw new Error("Aucun fichier sélectionné.");
  }

  const rawExt = file.name.split(".").pop() || "";
  const fileExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, "");

  if (!ALLOWED_DOC_EXTENSIONS.includes(fileExt)) {
    throw new Error(
      "Extension non autorisée. Formats acceptés : PDF, DOC, DOCX, PPT, PPTX."
    );
  }

  if (file.type && !ALLOWED_DOC_MIME_TYPES.includes(file.type.toLowerCase())) {
    throw new Error(
      "Format de document non autorisé. Formats acceptés : PDF, Word, PowerPoint."
    );
  }

  if (file.size > MAX_DOC_SIZE) {
    throw new Error("Le document dépasse la taille maximale autorisée (15 Mo).");
  }

  const filePath = buildCleanPath(folder, file.name, fileExt);
  const preferredBucket = process.env.NEXT_PUBLIC_SUPABASE_DOCS_BUCKET || "documents";

  let usedBucket = preferredBucket;
  let uploadResult = await supabase.storage
    .from(preferredBucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  // Fallback vers le bucket news-images si le bucket "documents" n'existe pas encore
  if (
    uploadResult.error &&
    /bucket.*not found|not found/i.test(uploadResult.error.message) &&
    preferredBucket !== "news-images"
  ) {
    usedBucket = "news-images";
    uploadResult = await supabase.storage
      .from("news-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });
  }

  if (uploadResult.error) {
    console.error("[Supabase Document Upload Error]", uploadResult.error);
    throw new Error(
      `Échec du téléversement du document : ${uploadResult.error.message}`
    );
  }

  const { data: publicUrlData } = supabase.storage
    .from(usedBucket)
    .getPublicUrl(filePath);

  if (!publicUrlData?.publicUrl) {
    throw new Error("L'URL publique du document n'a pas pu être générée.");
  }

  return publicUrlData.publicUrl;
}
