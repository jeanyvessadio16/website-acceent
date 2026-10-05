import type { Metadata } from "next";
import { buildSocialSharingMetadata } from "@/lib/social-metadata";

export const SITE_NAME = "ACCEENT";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://acceent.org";

export const DEFAULT_DESCRIPTION =
  "ACCEENT est une association sénégalaise basée à Ziguinchor (Santhiaba). Elle agit pour l'éducation, l'entrepreneuriat et le numérique au service des jeunes et des femmes en Casamance, Sénégal.";

export const DEFAULT_KEYWORDS = [
  // Nom et identité
  "ACCEENT",
  "ACCEENT Ziguinchor",
  "ACCEENT Santhiaba",
  "association Ziguinchor",
  "association Santhiaba",
  "ONG Ziguinchor",
  "ONG Casamance",
  // Domaines d'action
  "éducation Ziguinchor",
  "entrepreneuriat Sénégal",
  "numérique Casamance",
  "inclusion numérique Ziguinchor",
  "formation jeunes Ziguinchor",
  // Programmes
  "ACCEENT Elles",
  "ACCEENT4ELLES",
  "Tut-Tank Ziguinchor",
  "ACCEENT Incub incubateur Ziguinchor",
  "Forum Entrepreneur Ziguinchor",
  "Atelier Entrepreneuriat Casamance",
  "WRO Sénégal World Robot Olympiad",
  "AI4Good intelligence artificielle Ziguinchor",
  // Cibles
  "femmes tech Sénégal",
  "autonomisation femmes Ziguinchor",
  "mentorat jeunes filles Ziguinchor",
  "jeunes Casamance",
  // Territoire
  "développement territorial Sénégal",
  "innovation sociale Ziguinchor",
  "Casamance développement",
];

export const OG_IMAGE_PATH = "/logo/logoACCEENT.png";

export const OG_IMAGE = {
  url: OG_IMAGE_PATH,
  width: 1200,
  height: 630,
  alt: "Logo ACCEENT — Éducation, Entrepreneuriat et Numérique à Ziguinchor, Sénégal",
};

/** Balises GEO géographiques (Ziguinchor, Sénégal) */
export const GEO_METADATA = {
  "geo.region": "SN-ZG",
  "geo.placename": "Ziguinchor, Santhiaba, Sénégal",
  "geo.position": "12.5683;-16.2733",
  ICBM: "12.5683, -16.2733",
};

/** Routes statiques du site — utilisées par le sitemap et la navigation */
export const siteRoutes = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/actualites", priority: 0.85, changeFrequency: "daily" as const },
  { path: "/education", priority: 0.9, changeFrequency: "weekly" as const },
  {
    path: "/entreprenariat",
    priority: 0.9,
    changeFrequency: "weekly" as const,
  },
  { path: "/numerique", priority: 0.9, changeFrequency: "weekly" as const },
  {
    path: "/acceent-elles",
    priority: 0.85,
    changeFrequency: "monthly" as const,
  },
  { path: "/tut-tank", priority: 0.85, changeFrequency: "monthly" as const },
  {
    path: "/acceent-incub",
    priority: 0.85,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/atelier-entreprenariat",
    priority: 0.85,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/forum-entrepreneur",
    priority: 0.85,
    changeFrequency: "monthly" as const,
  },
  { path: "/wro", priority: 0.85, changeFrequency: "monthly" as const },
  // Correction : la route réelle est /ai4good (pas /ia4good)
  { path: "/ai4good", priority: 0.85, changeFrequency: "monthly" as const },
];

type CreatePageMetadataOptions = {
  title: string;
  description?: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
  skipCanonical?: boolean;
  /** Date de dernière modification (ISO 8601). Améliore la fraîcheur pour Google. */
  dateModified?: string;
};

export function createPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  keywords,
  noIndex = false,
  skipCanonical = false,
  dateModified,
}: CreatePageMetadataOptions): Metadata {
  const social = buildSocialSharingMetadata({ title, description, path });
  const canonicalUrl = path.startsWith("/") ? path : `/${path}`;

  return {
    title,
    description,
    keywords: keywords ?? DEFAULT_KEYWORDS,
    ...(skipCanonical
      ? {}
      : {
          alternates: {
            canonical: canonicalUrl,
            // hreflang pour les moteurs localisés (fr-SN = Sénégal)
            languages: {
              "fr-SN": `${SITE_URL}${canonicalUrl}`,
              "fr-FR": `${SITE_URL}${canonicalUrl}`,
              "fr": `${SITE_URL}${canonicalUrl}`,
              "x-default": `${SITE_URL}${canonicalUrl}`,
            },
          },
        }),
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    other: {
      ...GEO_METADATA,
      ...(social.other ?? {}),
      // GEO enrichi — aide les IA/LLMs à situer le contenu géographiquement
      "place:location:latitude": "12.5683",
      "place:location:longitude": "-16.2733",
      // Date de modification pour la fraîcheur du contenu
      ...(dateModified ? { "article:modified_time": dateModified } : {}),
    },
    ...social,
  };
}

const rootSocial = buildSocialSharingMetadata({
  title: `${SITE_NAME} — Éducation, entrepreneuriat et numérique à Ziguinchor`,
  description: DEFAULT_DESCRIPTION,
  path: "/",
});

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Éducation, entrepreneuriat et numérique à Ziguinchor`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "nonprofit",
  classification: "Education, Entrepreneurship, Digital Inclusion",
  icons: {
    icon: [
      { url: "/logo/favicon.ico" },
      { url: "/logo/logo-acceent.png", type: "image/png" },
    ],
    shortcut: "/logo/favicon.ico",
    apple: "/logo/logoACCEENT.png",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: rootSocial.openGraph,
  twitter: rootSocial.twitter,
  other: {
    ...GEO_METADATA,
    ...(rootSocial.other ?? {}),
    "place:location:latitude": "12.5683",
    "place:location:longitude": "-16.2733",
  },
};
