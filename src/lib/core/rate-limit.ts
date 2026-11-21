export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
}

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

export function resetRateLimiter(): void {
  store.clear();
}
