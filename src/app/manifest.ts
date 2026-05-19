import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description:
      "Association sénégalaise à Ziguinchor : éducation, entrepreneuriat et numérique pour les jeunes et les femmes.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f172a",
    lang: "fr",
    scope: "/",
    icons: [
      {
        src: "/logo/logoACCEENT.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    id: SITE_URL,
  };
}
