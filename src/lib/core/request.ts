import { headers } from "next/headers";

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

export async function getRequestOrigin(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (process.env.NODE_ENV === "production" && configured) {
    return configured.replace(/\/$/, "");
  }

  try {
    const h = await headers();
    const host = (h.get("x-forwarded-host") || h.get("host"))?.trim();
    if (host) {
      const protoHeader = h.get("x-forwarded-proto")?.split(",")[0]?.trim();
      const proto =
        protoHeader ||
        (host.startsWith("localhost") || host.startsWith("127.0.0.1")
          ? "http"
          : "https");
      return `${proto}://${host}`;
    }
  } catch {
    // Hors contexte requête HTTP
  }

  return (configured || "https://acceent.org").replace(/\/$/, "");
}
