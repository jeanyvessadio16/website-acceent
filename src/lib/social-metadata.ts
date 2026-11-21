import type { Metadata } from "next";
import {
  FACEBOOK_APP_ID,
  SOCIAL_PROFILES,
  X_HANDLE,
} from "@/data/social-profiles";
import { OG_IMAGE, OG_IMAGE_PATH, SITE_NAME, SITE_URL } from "@/lib/seo";

export type SocialImageInput = {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  type?: string;
};

type SocialSharingOptions = {
  title: string;
  description: string;
  path: string;
  image?: SocialImageInput;
  type?: "website" | "article";
};

function resolveAbsoluteUrl(rawUrl: string): string | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      return new URL(trimmed).toString();
    } catch {
      return null;
    }
  }
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    try {
      return new URL(trimmed, SITE_URL).toString();
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Métadonnées de partage pour :
 * - Open Graph → Facebook, Instagram, WhatsApp, TikTok, LinkedIn
 * - `twitter:*` → X — les balises portent encore ce nom technique ; Next.js et X les lisent ainsi
 */
export function buildSocialSharingMetadata({
  title,
  description,
  path,
  image,
  type = "website",
}: SocialSharingOptions): Pick<Metadata, "openGraph" | "twitter" | "other"> {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = new URL(canonicalPath, SITE_URL).toString();
  const defaultImageUrl = new URL(OG_IMAGE_PATH, SITE_URL).toString();
  const xHandle = `@${X_HANDLE.replace(/^@/, "")}`;

  const defaultOgImage = {
    url: defaultImageUrl,
    secureUrl: defaultImageUrl,
    width: OG_IMAGE.width,
    height: OG_IMAGE.height,
    alt: OG_IMAGE.alt,
    type: OG_IMAGE.type,
  };

  const customUrl = image?.url ? resolveAbsoluteUrl(image.url) : null;
  const customOgImage =
    customUrl && customUrl !== defaultImageUrl
      ? {
          url: customUrl,
          secureUrl: customUrl,
          alt: image?.alt || fullTitle,
          ...(image?.width ? { width: image.width } : {}),
          ...(image?.height ? { height: image.height } : {}),
          ...(image?.type ? { type: image.type } : {}),
        }
      : null;

  const ogImages = customOgImage
    ? [customOgImage, defaultOgImage]
    : [defaultOgImage];
  const primaryImage = ogImages[0];

  const openGraph: NonNullable<Metadata["openGraph"]> = {
    title: fullTitle,
    description,
    url: canonicalUrl,
    siteName: SITE_NAME,
    locale: "fr_SN",
    alternateLocale: ["fr_FR"],
    type,
    images: ogImages,
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
        url: primaryImage.url,
        alt: primaryImage.alt,
      },
    ],
  };

  const other: NonNullable<Metadata["other"]> = {
    // Facebook (Sharing Debugger)
    "article:publisher": SOCIAL_PROFILES.facebook.url,
    "og:see_also": SOCIAL_PROFILES.instagram.url,
  };

  if (FACEBOOK_APP_ID) {
    other["fb:app_id"] = FACEBOOK_APP_ID;
  }

  return { openGraph, twitter, other };
}
