import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Éducation, Entrepreneuriat & Numérique à Ziguinchor`,
    short_name: SITE_NAME,
    description:
      "Association sénégalaise à Ziguinchor (Santhiaba) : éducation, entrepreneuriat et inclusion numérique pour les jeunes et les femmes en Casamance.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f172a",
    lang: "fr",
    dir: "ltr",
    scope: "/",
    categories: ["education", "social", "nonprofit"],
    id: SITE_URL,
    icons: [
      {
        src: "/logo/logo-acceent.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo/logoACCEENT.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Éducation",
        short_name: "Éducation",
        description: "Découvrir nos programmes d'éducation",
        url: "/education",
        icons: [{ src: "/logo/logo-acceent.png", sizes: "96x96" }],
      },
      {
        name: "Entrepreneuriat",
        short_name: "Entrepreneuriat",
        description: "Découvrir nos programmes d'entrepreneuriat",
        url: "/entreprenariat",
        icons: [{ src: "/logo/logo-acceent.png", sizes: "96x96" }],
      },
      {
        name: "Numérique",
        short_name: "Numérique",
        description: "Découvrir nos programmes numériques",
        url: "/numerique",
        icons: [{ src: "/logo/logo-acceent.png", sizes: "96x96" }],
      },
    ],
  };
}
