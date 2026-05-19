import type { Metadata } from "next";
import {
  FACEBOOK_APP_ID,
  SOCIAL_PROFILES,
  X_HANDLE,
} from "@/data/social-profiles";
import { OG_IMAGE, OG_IMAGE_PATH, SITE_NAME, SITE_URL } from "@/lib/seo";

type SocialSharingOptions = {
  title: string;
  description: string;
  path: string;
};

/**
 * Métadonnées de partage pour :
 * - Open Graph → Facebook, Instagram, WhatsApp, TikTok
 * - `twitter:*` → X (ex-Twitter ; nom de champ conservé par Next.js)
 */
export function buildSocialSharingMetadata({
  title,
  description,
  path,
}: SocialSharingOptions): Pick<Metadata, "openGraph" | "twitter" | "other"> {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const imageSecureUrl = new URL(OG_IMAGE_PATH, SITE_URL).toString();
  const xHandle = `@${X_HANDLE.replace(/^@/, "")}`;

  const openGraph: NonNullable<Metadata["openGraph"]> = {
    title: fullTitle,
    description,
    url: canonicalPath,
    siteName: SITE_NAME,
    locale: "fr_SN",
    alternateLocale: ["fr_FR"],
    type: "website",
    images: [
      {
        url: OG_IMAGE_PATH,
        secureUrl: imageSecureUrl,
        width: OG_IMAGE.width,
        height: OG_IMAGE.height,
        alt: OG_IMAGE.alt,
        type: "image/png",
      },
    ],
  };

  /** X — le champ Metadata `twitter` génère les balises consommées par x.com */
  const twitter: NonNullable<Metadata["twitter"]> = {
    card: "summary_large_image",
    site: xHandle,
    creator: xHandle,
    title: fullTitle,
    description,
    images: [
      {
        url: OG_IMAGE_PATH,
        alt: OG_IMAGE.alt,
      },
    ],
  };

  const other: NonNullable<Metadata["other"]> = {
    // Open Graph renforcé — lu par Facebook, Instagram, WhatsApp et TikTok
    "og:image:secure_url": imageSecureUrl,
    "og:image:type": "image/png",
    "og:locale:alternate": "fr_FR",
    // Facebook (Sharing Debugger)
    "article:publisher": SOCIAL_PROFILES.facebook.url,
    "og:see_also": SOCIAL_PROFILES.instagram.url,
  };

  if (FACEBOOK_APP_ID) {
    other["fb:app_id"] = FACEBOOK_APP_ID;
  }

  return { openGraph, twitter, other };
}
