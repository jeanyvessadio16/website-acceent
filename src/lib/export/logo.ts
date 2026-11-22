import fs from "node:fs";
import path from "node:path";

let cachedLogoBase64: string | null | undefined;

/**
 * Charge et met en cache le logo blanc ACCEENT (PNG RGBA) en base64 brut
 * pour l'intégration dans les en-têtes Excel et PDF côté serveur.
 */
export function getAcceentLogoBase64(): string | null {
  if (cachedLogoBase64 !== undefined) {
    return cachedLogoBase64;
  }

  try {
    const logoPath = path.join(process.cwd(), "public", "logo", "logo-acceent.png");
    cachedLogoBase64 = fs.readFileSync(logoPath).toString("base64");
  } catch {
    cachedLogoBase64 = null;
  }

  return cachedLogoBase64;
}

/**
 * Retourne le logo ACCEENT sous forme de Data URI PNG pour `@react-pdf/renderer`.
 */
export function getAcceentLogoDataUri(): string | null {
  const base64 = getAcceentLogoBase64();
  return base64 ? `data:image/png;base64,${base64}` : null;
}
