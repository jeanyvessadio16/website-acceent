import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildCspHeader, generateCspNonce } from "@/lib/core/csp";

describe("Content Security Policy (CSP) & Nonce", () => {
  it("génère des nonces base64 uniques de 16 octets", () => {
    const n1 = generateCspNonce();
    const n2 = generateCspNonce();

    assert.notEqual(n1, n2);
    assert.equal(Buffer.from(n1, "base64").length, 16);
    assert.equal(Buffer.from(n2, "base64").length, 16);
  });

  it("produit une CSP de production stricte avec nonce et sans unsafe-inline/unsafe-eval dans script-src", () => {
    const nonce = "test-nonce-value==";
    const csp = buildCspHeader(nonce, true);
    const directives = csp.split("; ");

    const scriptSrc = directives.find((d) => d.startsWith("script-src "));
    assert.ok(scriptSrc);
    assert.ok(scriptSrc.includes(`'nonce-${nonce}'`));
    assert.ok(scriptSrc.includes("'strict-dynamic'"));
    assert.equal(scriptSrc.includes("'unsafe-inline'"), false);
    assert.equal(scriptSrc.includes("'unsafe-eval'"), false);

    assert.equal(csp.includes("api.web3forms.com"), false);
    assert.ok(directives.includes("object-src 'none'"));
    assert.ok(directives.includes("frame-ancestors 'none'"));
    assert.ok(directives.includes("upgrade-insecure-requests"));
  });

  it("inclut unsafe-eval et omet upgrade-insecure-requests en développement", () => {
    const nonce = "dev-nonce==";
    const csp = buildCspHeader(nonce, false);
    const directives = csp.split("; ");
    const scriptSrc = directives.find((d) => d.startsWith("script-src "));

    assert.ok(scriptSrc);
    assert.ok(scriptSrc.includes("'unsafe-eval'"));
    assert.ok(scriptSrc.includes(`'nonce-${nonce}'`));
    assert.equal(directives.includes("upgrade-insecure-requests"), false);
  });
});
