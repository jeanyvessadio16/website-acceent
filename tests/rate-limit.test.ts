import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { checkRateLimit, resetRateLimiter } from "@/lib/core/rate-limit";

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
