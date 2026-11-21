import type { PoolConfig } from "pg";
import { SUPABASE_ROOT_2021_CA_PEM } from "./supabase-ca";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

export interface BuildPgPoolOptions {
  customCa?: string;
  allowInsecureSsl?: boolean;
}

function isSupabaseHost(host: string): boolean {
  return host.endsWith(".supabase.co") || host.endsWith(".supabase.com");
}

function normalizePem(rawCa: string | undefined): string {
  if (!rawCa) return "";
  return rawCa.replace(/\\n/g, "\n").trim();
}

/**
 * Construit la configuration `pg.Pool` avec vérification TLS stricte (`rejectUnauthorized: true`)
 * par défaut en s'appuyant sur la CA racine officielle de Supabase (`Supabase Root 2021 CA`) ou
 * une CA personnalisée (`DATABASE_SSL_CA`), tout en retirant `sslmode` de la query string pour
 * éviter l'erreur `SELF_SIGNED_CERT_IN_CHAIN` de `pg@8`.
 */
export function buildPgPoolConfig(
  rawUrl: string | undefined,
  max: number,
  options?: BuildPgPoolOptions
): PoolConfig {
  const rawCustomCa =
    options && "customCa" in options ? options.customCa : process.env.DATABASE_SSL_CA;
  const normalizedCustomCa = normalizePem(rawCustomCa);
  const allowInsecureSsl =
    options && "allowInsecureSsl" in options
      ? Boolean(options.allowInsecureSsl)
      : process.env.DATABASE_SSL_INSECURE === "true";

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

  if (sslmode === "disable") {
    return baseConfig;
  }

  if (isLocalHost && !sslmode && !normalizedCustomCa) {
    return baseConfig;
  }

  url.searchParams.delete("sslmode");
  url.searchParams.delete("uselibpqcompat");

  const cleanUrl = url.toString();

  if (allowInsecureSsl) {
    return {
      ...baseConfig,
      connectionString: cleanUrl,
      ssl: { rejectUnauthorized: false },
    };
  }

  if (normalizedCustomCa) {
    return {
      ...baseConfig,
      connectionString: cleanUrl,
      ssl: { ca: normalizedCustomCa, rejectUnauthorized: true },
    };
  }

  if (isSupabaseHost(host)) {
    return {
      ...baseConfig,
      connectionString: cleanUrl,
      ssl: { ca: SUPABASE_ROOT_2021_CA_PEM, rejectUnauthorized: true },
    };
  }

  return {
    ...baseConfig,
    connectionString: cleanUrl,
    ssl: { rejectUnauthorized: true },
  };
}
