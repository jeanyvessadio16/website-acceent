import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getPublicSiteOrigin, getRequestOrigin } from "@/lib/core/request";

describe("Public Site & Auth Redirect Origin", () => {
  it("normalise une origine publique configurée et rejette les hôtes locaux ou non-HTTP", () => {
    const prev = process.env.NEXT_PUBLIC_SITE_URL;
    try {
      delete process.env.NEXT_PUBLIC_SITE_URL;

      assert.equal(getPublicSiteOrigin("https://www.acceent.org/"), "https://www.acceent.org");
      assert.equal(getPublicSiteOrigin("https://acceent.org/auth"), "https://acceent.org");
      assert.equal(getPublicSiteOrigin("http://localhost:3000"), "https://www.acceent.org");
      assert.equal(getPublicSiteOrigin("http://127.0.0.1:3000"), "https://www.acceent.org");
      assert.equal(getPublicSiteOrigin("http://[::1]:3000"), "https://www.acceent.org");
      assert.equal(getPublicSiteOrigin("https://preview.vercel.app"), "https://www.acceent.org");
      assert.equal(getPublicSiteOrigin("javascript:alert(1)"), "https://www.acceent.org");
      assert.equal(getPublicSiteOrigin(undefined), "https://www.acceent.org");
    } finally {
      if (prev === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
      else process.env.NEXT_PUBLIC_SITE_URL = prev;
    }
  });

  it("getRequestOrigin ne retourne jamais localhost même lorsque NEXT_PUBLIC_SITE_URL est local ou vide", async () => {
    const prev = process.env.NEXT_PUBLIC_SITE_URL;
    try {
      process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
      assert.equal(await getRequestOrigin(), "https://www.acceent.org");

      delete process.env.NEXT_PUBLIC_SITE_URL;
      assert.equal(await getRequestOrigin(), "https://www.acceent.org");

      process.env.NEXT_PUBLIC_SITE_URL = "https://www.acceent.org/";
      assert.equal(await getRequestOrigin(), "https://www.acceent.org");
    } finally {
      if (prev === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
      else process.env.NEXT_PUBLIC_SITE_URL = prev;
    }
  });
});
