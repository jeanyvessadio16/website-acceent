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

async function uploadToServerApi(
  file: File,
  kind: "image" | "document",
  folder: string
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("kind", kind);
  formData.append("folder", folder);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const payload = (await response.json().catch(() => null)) as {
    url?: string;
    error?: string;
  } | null;

  if (!response.ok || !payload?.url) {
    throw new Error(
      payload?.error || "Échec du téléversement du fichier. Veuillez réessayer."
    );
  }

  return payload.url;
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

  return uploadToServerApi(file, "image", folder);
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

  return uploadToServerApi(file, "document", folder);
}
