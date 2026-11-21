import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  checkDistributedRateLimit,
  checkRateLimit,
  resetRateLimiter,
} from "@/lib/core/rate-limit";

describe("In-Memory Sliding-Window Rate Limiter", () => {
  beforeEach(() => {
    resetRateLimiter();
  });

  it("autorise les requêtes jusqu'au quota puis bloque", () => {
    const opts = { limit: 3, windowMs: 60_000 };

    const r1 = checkRateLimit("login:1.2.3.4:user@acceent.org", opts);
    assert.equal(r1.allowed, true);
    assert.equal(r1.remaining, 2);

    const r2 = checkRateLimit("login:1.2.3.4:user@acceent.org", opts);
    assert.equal(r2.allowed, true);
    assert.equal(r2.remaining, 1);

    const r3 = checkRateLimit("login:1.2.3.4:user@acceent.org", opts);
    assert.equal(r3.allowed, true);
    assert.equal(r3.remaining, 0);

    const r4 = checkRateLimit("login:1.2.3.4:user@acceent.org", opts);
    assert.equal(r4.allowed, false);
    assert.equal(r4.remaining, 0);
    assert.ok(r4.retryAfterSec >= 1);
  });

  it("isole les compteurs par clé distincte", () => {
    const opts = { limit: 1, windowMs: 60_000 };

    const a = checkRateLimit("ip-a", opts);
    const b = checkRateLimit("ip-b", opts);

    assert.equal(a.allowed, true);
    assert.equal(b.allowed, true);
    assert.equal(checkRateLimit("ip-a", opts).allowed, false);
  });
});

describe("Distributed PostgreSQL Rate Limiter", () => {
  beforeEach(() => {
    resetRateLimiter();
  });

  it("autorise jusqu'au quota puis bloque avec retryAfterSec calculé depuis resetAt", async () => {
    let counter = 0;
    const mockExecutor = async (_key: string, windowMs: number) => {
      counter += 1;
      return {
        count: counter,
        resetAt: new Date(Date.now() + windowMs),
      };
    };

    const opts = { limit: 2, windowMs: 60_000 };

    const r1 = await checkDistributedRateLimit("contact:1.2.3.4", opts, mockExecutor);
    assert.equal(r1.allowed, true);
    assert.equal(r1.remaining, 1);
    assert.equal(r1.retryAfterSec, 0);

    const r2 = await checkDistributedRateLimit("contact:1.2.3.4", opts, mockExecutor);
    assert.equal(r2.allowed, true);
    assert.equal(r2.remaining, 0);

    const r3 = await checkDistributedRateLimit("contact:1.2.3.4", opts, mockExecutor);
    assert.equal(r3.allowed, false);
    assert.equal(r3.remaining, 0);
    assert.ok(r3.retryAfterSec >= 55 && r3.retryAfterSec <= 61);
  });

  it("bascule automatiquement sur le fallback mémoire si la base échoue", async () => {
    const failingExecutor = async () => {
      throw new Error("DB connection unavailable");
    };

    const opts = { limit: 2, windowMs: 60_000 };
    const r1 = await checkDistributedRateLimit("fallback:key", opts, failingExecutor);
    const r2 = await checkDistributedRateLimit("fallback:key", opts, failingExecutor);
    const r3 = await checkDistributedRateLimit("fallback:key", opts, failingExecutor);

    assert.equal(r1.allowed, true);
    assert.equal(r1.remaining, 1);
    assert.equal(r2.allowed, true);
    assert.equal(r2.remaining, 0);
    assert.equal(r3.allowed, false);
    assert.ok(r3.retryAfterSec >= 1);
  });
});
