export interface DocumentHeaderInput {
  isApplication: boolean;
  ext: string;
  mimeType: string;
  filename: string;
}

/**
 * Construit les en-têtes HTTP de téléchargement/prévisualisation d'un document privé.
 * Force le téléchargement (`attachment`) et le bac à sable CSP (`sandbox`) pour toute pièce
 * déposée par un utilisateur (`applications/*`) ainsi que pour les formats non PDF.
 */
export function buildDocumentResponseHeaders({
  isApplication,
  ext,
  mimeType,
  filename,
}: DocumentHeaderInput): Record<string, string> {
  const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_") || "document";
  const serveInline = !isApplication && ext.toLowerCase() === "pdf";

  return {
    "Content-Type": mimeType,
    "Content-Disposition": `${serveInline ? "inline" : "attachment"}; filename="${safeFilename}"`,
    "Content-Security-Policy": serveInline
      ? "default-src 'none'; object-src 'self'; frame-ancestors 'self'"
      : "default-src 'none'; sandbox",
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "private, no-store",
  };
}
