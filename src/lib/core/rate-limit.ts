import prisma from "@/lib/prisma";
import { logger } from "./logger";

export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
}

export type RateLimitDbExecutor = (
  key: string,
  windowMs: number
) => Promise<{ count: number; resetAt: Date }>;

const globalForRateLimit = globalThis as unknown as {
  __acceentRateLimitStore?: Map<string, number[]>;
};

const store: Map<string, number[]> =
  globalForRateLimit.__acceentRateLimitStore ?? new Map<string, number[]>();

if (process.env.NODE_ENV !== "production") {
  globalForRateLimit.__acceentRateLimitStore = store;
}

function pruneExpiredKeys(now: number, maxWindowMs: number): void {
  if (store.size <= 500) return;
  const cutoff = now - maxWindowMs;
  for (const [k, timestamps] of store.entries()) {
    const active = timestamps.filter((t) => t > cutoff);
    if (active.length === 0) {
      store.delete(k);
    } else if (active.length !== timestamps.length) {
      store.set(k, active);
    }
  }
}

export function checkRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const windowStart = now - options.windowMs;

  pruneExpiredKeys(now, options.windowMs);

  const existing = store.get(key) ?? [];
  const active = existing.filter((t) => t > windowStart);

  if (active.length >= options.limit) {
    const oldest = active[0] ?? now;
    const retryAfterMs = Math.max(1000, oldest + options.windowMs - now);
    store.set(key, active);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.ceil(retryAfterMs / 1000),
    };
  }

  active.push(now);
  store.set(key, active);

  return {
    allowed: true,
    remaining: Math.max(0, options.limit - active.length),
    retryAfterSec: 0,
  };
}

let distributedOpsCount = 0;

async function defaultDbExecutor(
  key: string,
  windowMs: number
): Promise<{ count: number; resetAt: Date }> {
  const rows = await prisma.$queryRaw<Array<{ count: number; resetAt: Date }>>`
    INSERT INTO public.rate_limit_buckets ("key", "count", "resetAt", "updatedAt")
    VALUES (${key}, 1, NOW() + (${windowMs} * INTERVAL '1 millisecond'), NOW())
    ON CONFLICT ("key") DO UPDATE
    SET
      "count" = CASE
        WHEN public.rate_limit_buckets."resetAt" <= NOW() THEN 1
        ELSE public.rate_limit_buckets."count" + 1
      END,
      "resetAt" = CASE
        WHEN public.rate_limit_buckets."resetAt" <= NOW() THEN NOW() + (${windowMs} * INTERVAL '1 millisecond')
        ELSE public.rate_limit_buckets."resetAt"
      END,
      "updatedAt" = NOW()
    RETURNING "count", "resetAt"
  `;

  distributedOpsCount += 1;
  if (distributedOpsCount % 50 === 0) {
    prisma.$executeRaw`
      DELETE FROM public.rate_limit_buckets
      WHERE "resetAt" < NOW() - INTERVAL '1 hour'
    `.catch(() => {});
  }

  const row = rows[0];
  if (!row) {
    throw new Error("Rate limit upsert returned no row");
  }

  return {
    count: Number(row.count),
    resetAt: row.resetAt instanceof Date ? row.resetAt : new Date(row.resetAt),
  };
}

/**
 * Rate limiter distribué basé sur PostgreSQL (`public.rate_limit_buckets`),
 * partagé entre toutes les instances serverless Vercel, avec bascule automatique
 * sur le store mémoire local en cas d'indisponibilité temporaire de la base.
 */
export async function checkDistributedRateLimit(
  key: string,
  options: RateLimitOptions,
  executor: RateLimitDbExecutor = defaultDbExecutor
): Promise<RateLimitResult> {
  try {
    const { count, resetAt } = await executor(key, options.windowMs);
    const allowed = count <= options.limit;
    const remaining = Math.max(0, options.limit - count);
    const retryAfterSec = allowed
      ? 0
      : Math.max(1, Math.ceil((resetAt.getTime() - Date.now()) / 1000));

    return { allowed, remaining, retryAfterSec };
  } catch (error) {
    logger.warn("rateLimit.distributed", "Bascule sur le rate-limiter mémoire local", {
      key,
      error: error instanceof Error ? error.message : String(error),
    });
    return checkRateLimit(key, options);
  }
}

export function resetRateLimiter(): void {
  store.clear();
}
