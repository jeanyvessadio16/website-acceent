import { headers } from "next/headers";

export const DEFAULT_PUBLIC_SITE_URL = "https://www.acceent.org";

const LOCAL_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "[::1]",
]);

function isLocalHostname(hostname: string): boolean {
  const normalized = hostname.toLowerCase();
  return LOCAL_HOSTNAMES.has(normalized) || normalized.endsWith(".local");
}

function parsePublicHttpOrigin(raw?: string): string | null {
  const trimmed = raw?.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return null;
    }
    const hostname = parsed.hostname.toLowerCase();
    if (!hostname || isLocalHostname(hostname) || hostname.endsWith(".vercel.app")) {
      return null;
    }
    return parsed.origin;
  } catch {
    return null;
  }
}

export async function getClientIp(): Promise<string> {
  try {
    const h = await headers();
    const vercelIp = h.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
    if (vercelIp) return vercelIp;

    const cfIp = h.get("cf-connecting-ip")?.trim();
    if (cfIp) return cfIp;

    const realIp = h.get("x-real-ip")?.trim();
    if (realIp) return realIp;

    const xff = h.get("x-forwarded-for");
    if (xff) {
      const first = xff.split(",")[0]?.trim();
      if (first) return first;
    }
  } catch {
    // Hors contexte requête HTTP
  }
  return "unknown";
}

/**
 * Retourne l'origine publique canonique du site (jamais localhost ni schéma non HTTP(S)).
 */
export function getPublicSiteOrigin(rawConfigured?: string): string {
  return (
    parsePublicHttpOrigin(rawConfigured ?? process.env.NEXT_PUBLIC_SITE_URL) ??
    DEFAULT_PUBLIC_SITE_URL
  );
}

/**
 * Résout l'origine utilisée dans les liens d'e-mails Auth (confirmation, réinitialisation).
 * Ne renvoie jamais une URL locale (`localhost`, `127.0.0.1`, `[::1]`) ni `.vercel.app`.
 */
export async function getRequestOrigin(): Promise<string> {
  const configuredOrigin = parsePublicHttpOrigin(process.env.NEXT_PUBLIC_SITE_URL);
  if (configuredOrigin) {
    return configuredOrigin;
  }

  try {
    const h = await headers();
    const rawHost = (h.get("x-forwarded-host") || h.get("host"))?.split(",")[0]?.trim();
    if (rawHost) {
      const protoHeader = h.get("x-forwarded-proto")?.split(",")[0]?.trim();
      const proto = protoHeader === "http" || protoHeader === "https" ? protoHeader : "https";
      const headerOrigin = parsePublicHttpOrigin(`${proto}://${rawHost}`);
      if (headerOrigin) {
        return headerOrigin;
      }
    }
  } catch {
    // Hors contexte requête HTTP
  }

  return DEFAULT_PUBLIC_SITE_URL;
}
