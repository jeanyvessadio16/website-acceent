import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/dashboard/"],
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Google-Extended", "Bingbot"],
        allow: "/",
        disallow: ["/api/", "/admin/", "/dashboard/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
