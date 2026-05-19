import type { Metadata } from "next";

export const SITE_NAME = "ACCEENT";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://acceent.vercel.app";

export const DEFAULT_DESCRIPTION =
  "ACCEENT est une association sénégalaise basée à Ziguinchor (Santhiaba). Elle agit pour l'éducation, l'entrepreneuriat et le numérique au service des jeunes et des femmes.";

export const DEFAULT_KEYWORDS = [
  "ACCEENT",
  "association Ziguinchor",
  "éducation Ziguinchor",
  "entrepreneuriat Sénégal",
  "numérique Casamance",
  "formation jeunes Ziguinchor",
  "femmes tech Sénégal",
  "ONG Ziguinchor",
];

const OG_IMAGE_PATH = "/logo/logoACCEENT.png";

export const OG_IMAGE = {
  url: OG_IMAGE_PATH,
  width: 1200,
  height: 630,
  alt: "Logo ACCEENT — Action pour la Contribution Collective pour l'Éducation, l'Entrepreneuriat et le Numérique des Territoires",
};

export const siteRoutes = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
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
  { path: "/ia", priority: 0.6, changeFrequency: "monthly" as const },
];

type CreatePageMetadataOptions = {
  title: string;
  description?: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  keywords,
  noIndex = false,
}: CreatePageMetadataOptions): Metadata {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  return {
    title,
    description,
    keywords: keywords ?? DEFAULT_KEYWORDS,
    alternates: {
      canonical: canonicalPath,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true },
        },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonicalPath,
      siteName: SITE_NAME,
      locale: "fr_SN",
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [OG_IMAGE_PATH],
    },
  };
}

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
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "fr_SN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Éducation, entrepreneuriat et numérique`,
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Éducation, entrepreneuriat et numérique`,
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE_PATH],
  },
};
