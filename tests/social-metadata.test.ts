import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  OG_IMAGE,
  OG_IMAGE_PATH,
  SITE_URL,
  createPageMetadata,
  rootMetadata,
} from "@/lib/seo";

describe("Open Graph & Social Sharing Image", () => {
  it("dispose d'une image OG PNG valide en 1200x630 et < 300 Ko", () => {
    const filePath = path.join(process.cwd(), "public", "og-acceent.png");
    assert.equal(fs.existsSync(filePath), true);

    const buf = fs.readFileSync(filePath);
    assert.ok(buf.length < 300_000, `Taille OG trop élevée: ${buf.length} octets`);

    // Signature PNG standard
    assert.deepEqual(
      Array.from(buf.subarray(0, 8)),
      [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
    );

    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);
    assert.equal(width, 1200);
    assert.equal(height, 630);
  });

  it("configure rootMetadata et createPageMetadata avec l'image sociale officielle sans doublon dans other", () => {
    const expectedUrl = new URL(OG_IMAGE_PATH, SITE_URL).toString();
    if (!process.env.NEXT_PUBLIC_SITE_URL) {
      assert.equal(SITE_URL, "https://www.acceent.org");
      assert.equal(expectedUrl, "https://www.acceent.org/og-acceent.png");
    }
    assert.equal(OG_IMAGE_PATH, "/og-acceent.png");
    assert.equal(OG_IMAGE.width, 1200);
    assert.equal(OG_IMAGE.height, 630);

    const rootImages = Array.isArray(rootMetadata.openGraph?.images)
      ? rootMetadata.openGraph.images
      : [];
    assert.equal(rootImages.length, 1);
    const rootPrimary = rootImages[0] as { url: string; width?: number; height?: number };
    assert.equal(rootPrimary.url, expectedUrl);
    assert.equal(rootPrimary.width, 1200);
    assert.equal(rootPrimary.height, 630);

    const twitterObj = rootMetadata.twitter as {
      card?: string;
      images?: Array<{ url: string; alt?: string }>;
    };
    assert.equal(twitterObj.card, "summary_large_image");
    assert.equal(twitterObj.images?.[0]?.url, expectedUrl);

    const pageMeta = createPageMetadata({
      title: "À propos",
      description: "Présentation de l'association ACCEENT",
      path: "/about",
    });

    const pageOther = pageMeta.other as Record<string, unknown>;
    assert.equal(pageOther["geo.region"], "SN-ZG");
    assert.equal("og:image" in pageOther, false);
    assert.equal("og:image:width" in pageOther, false);
  });

  it("priorise l'image d'un article avec /og-acceent.png en repli", () => {
    const fallbackUrl = new URL(OG_IMAGE_PATH, SITE_URL).toString();
    const articleImage = "https://twizxowdhtmhwsytlztr.supabase.co/storage/v1/object/public/news-images/articles/demo.jpg";

    const meta = createPageMetadata({
      title: "Nouvel atelier numérique",
      description: "Retour sur l'atelier numérique à Ziguinchor",
      path: "/actualites/demo-id",
      type: "article",
      dateModified: "2026-11-21T12:00:00.000Z",
      image: { url: articleImage, alt: "Atelier numérique" },
    });

    const og = meta.openGraph as {
      type?: string;
      images?: Array<{ url: string; alt?: string }>;
    };
    assert.equal(og.type, "article");
    assert.equal(og.images?.length, 2);
    assert.equal(og.images?.[0]?.url, articleImage);
    assert.equal(og.images?.[1]?.url, fallbackUrl);

    const tw = meta.twitter as {
      card?: string;
      images?: Array<{ url: string }>;
    };
    assert.equal(tw.card, "summary_large_image");
    assert.equal(tw.images?.[0]?.url, articleImage);
  });
});
