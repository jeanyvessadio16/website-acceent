import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Règle générale : autoriser tout sauf les zones privées
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/dashboard/", "/auth/"],
      },
      // Robots des moteurs de recherche classiques — accès complet au contenu public
      {
        userAgent: ["Googlebot", "Bingbot", "Slurp", "DuckDuckBot", "Baiduspider"],
        allow: "/",
        disallow: ["/api/", "/admin/", "/dashboard/", "/auth/"],
      },
      // Robots IA / LLMs — accès autorisé au contenu public pour indexation GEO
      // GEO (Generative Engine Optimization) : permettre aux IA de lire le site
      {
        userAgent: [
          "GPTBot",           // OpenAI ChatGPT
          "ChatGPT-User",     // OpenAI ChatGPT navigation
          "OAI-SearchBot",    // OpenAI SearchGPT
          "PerplexityBot",    // Perplexity AI
          "ClaudeBot",        // Anthropic Claude
          "anthropic-ai",     // Anthropic
          "Google-Extended",  // Google Gemini / Bard
          "Gemini-Bot",       // Google Gemini
          "Applebot",         // Apple Intelligence
          "Meta-ExternalAgent", // Meta AI
          "YouBot",           // You.com
          "CCBot",            // Common Crawl (base d'entraînement LLM)
          "cohere-ai",        // Cohere
          "AI2Bot",           // Allen Institute for AI
        ],
        allow: "/",
        disallow: ["/api/", "/admin/", "/dashboard/", "/auth/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
