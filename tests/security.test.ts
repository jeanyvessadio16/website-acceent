import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  isSafeUrl,
  escapeCsvCell,
  isOptimizableImageUrl,
  getProgramBySlug,
} from "@/lib/constants/platform";
import { slugify } from "@/lib/core/strings";
import { generateAuthToken, hashAuthToken } from "@/lib/core/tokens";
import { RESET_TOKEN_REGEX } from "@/validation/patterns";

describe("Security & Sanitization Helpers", () => {
  it("autorise uniquement les URLs http/https et chemins relatifs simples", () => {
    assert.equal(isSafeUrl("https://acceent.org/contact"), true);
    assert.equal(isSafeUrl("http://localhost:3000/test"), true);
    assert.equal(isSafeUrl("/actualites/123"), true);

    assert.equal(isSafeUrl("javascript:alert(1)"), false);
    assert.equal(isSafeUrl("JAVASCRIPT:void(0)"), false);
    assert.equal(isSafeUrl("data:text/html,<script>alert(1)</script>"), false);
    assert.equal(isSafeUrl("//evil.example.com/phish"), false);
    assert.equal(isSafeUrl(""), false);
  });

  it("neutralise les injections de formules CSV (Excel/Calc)", () => {
    assert.equal(escapeCsvCell("ACCEENT Ziguinchor"), '"ACCEENT Ziguinchor"');
    assert.equal(escapeCsvCell('A "quoted" value'), '"A ""quoted"" value"');
    assert.equal(escapeCsvCell("=CMD|' /C calc'!A0"), '"\'=CMD|\' /C calc\'!A0"');
    assert.equal(escapeCsvCell("+1+1"), '"\'+1+1"');
    assert.equal(escapeCsvCell("-10"), '"\'-10"');
    assert.equal(escapeCsvCell("@SUM(A1:A2)"), '"\'@SUM(A1:A2)"');
    assert.equal(escapeCsvCell(null), '""');
  });

  it("identifie correctement les images optimisables par Next/Image", () => {
    assert.equal(isOptimizableImageUrl("/logo/logoACCEENT.png"), true);
    assert.equal(
      isOptimizableImageUrl(
        "https://twizxowdhtmhwsytlztr.supabase.co/storage/v1/object/public/news-images/a.png"
      ),
      true
    );
    assert.equal(
      isOptimizableImageUrl("https://images.unsplash.com/photo-123"),
      true
    );
    assert.equal(isOptimizableImageUrl("https://untrusted-cdn.example.org/logo.png"), false);
    assert.equal(isOptimizableImageUrl("//cdn.example.org/a.png"), false);
  });

  it("génère des slugs propres sans accents ni caractères spéciaux", () => {
    assert.equal(
      slugify("Éducation & Entrepreneuriat à Ziguinchor !"),
      "education-entrepreneuriat-a-ziguinchor"
    );
    assert.equal(slugify("  ACCEENT--Incub 2026  "), "acceent-incub-2026");
  });

  it("retourne les métadonnées des programmes ACCEENT valides", () => {
    const incub = getProgramBySlug("acceent-incub");
    assert.ok(incub);
    assert.equal(incub.pole, "ENTREPRENEURIAT");
    assert.equal(getProgramBySlug("inconnu"), undefined);
  });

  it("génère des jetons de confirmation valides et un hachage SHA-256 déterministe", () => {
    const rawA = generateAuthToken();
    const rawB = generateAuthToken();
    assert.equal(rawA.length, 64);
    assert.equal(RESET_TOKEN_REGEX.test(rawA), true);
    assert.notEqual(rawA, rawB);
    assert.equal(hashAuthToken(rawA), hashAuthToken(rawA));
    assert.equal(hashAuthToken(rawA).length, 64);
    assert.notEqual(hashAuthToken(rawA), hashAuthToken(rawB));
  });
});
