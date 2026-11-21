/**
 * Génère un nonce cryptographique aléatoire de 128 bits encodé en base64.
 * Compatible avec les runtimes Edge (`proxy.ts`) et Node.js via l'API Web Crypto standard.
 */
export function generateCspNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

/**
 * Construit l'en-tête Content-Security-Policy avec nonce dynamique par requête.
 * Supprime `'unsafe-inline'` de `script-src` grâce à `'nonce-...'` et `'strict-dynamic'`.
 */
export function buildCspHeader(nonce: string, isProd: boolean): string {
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isProd ? "" : " 'unsafe-eval'"} https://www.googletagmanager.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://twizxowdhtmhwsytlztr.supabase.co https://images.unsplash.com https://www.google-analytics.com https://www.googletagmanager.com",
    "font-src 'self' data:",
    "connect-src 'self' https://twizxowdhtmhwsytlztr.supabase.co https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://vitals.vercel-insights.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isProd ? ["upgrade-insecure-requests"] : []),
  ];

  return directives.join("; ");
}
