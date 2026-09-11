import type { MetadataRoute } from "next";
import { SITE_URL, siteRoutes } from "@/lib/seo";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = siteRoutes.map(
    ({ path, changeFrequency, priority }) => ({
      url: `${SITE_URL}${path === "/" ? "" : path}`,
      lastModified,
      changeFrequency,
      priority,
    }),
  );

  let postEntries: MetadataRoute.Sitemap = [];

  try {
    const dbPosts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });

    postEntries = dbPosts.map((post) => ({
      url: `${SITE_URL}/actualites/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Erreur lors de la génération des articles dans sitemap:", error);
  }

  return [...staticEntries, ...postEntries];
}
