import type { PoolConfig } from "pg";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);
const WEAK_SSL_MODES = new Set(["require", "prefer", "verify-ca"]);

/**
 * Construit la configuration `pg.Pool` en évitant l'erreur `SELF_SIGNED_CERT_IN_CHAIN`
 * déclenchée par `pg@8` lorsque `DATABASE_URL` contient `sslmode=require` (ou `prefer`/`verify-ca`)
 * avec les poolers managés comme Supabase Supavisor.
 */
export function buildPgPoolConfig(rawUrl: string | undefined, max: number): PoolConfig {
  const baseConfig: PoolConfig = {
    connectionString: rawUrl,
    max,
    idleTimeoutMillis: 20_000,
    connectionTimeoutMillis: 10_000,
    allowExitOnIdle: true,
  };

  if (!rawUrl || !rawUrl.trim()) {
    return baseConfig;
  }

  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return baseConfig;
  }

  const host = url.hostname.toLowerCase();
  const isLocalHost = LOCAL_HOSTS.has(host);
  const sslmode = url.searchParams.get("sslmode")?.toLowerCase();

  if (sslmode === "disable" || sslmode === "verify-full") {
    return baseConfig;
  }

  if ((sslmode && WEAK_SSL_MODES.has(sslmode)) || !isLocalHost) {
    url.searchParams.delete("sslmode");
    url.searchParams.delete("uselibpqcompat");
    return {
      ...baseConfig,
      connectionString: url.toString(),
      ssl: { rejectUnauthorized: false },
    };
  }

  return baseConfig;
}
