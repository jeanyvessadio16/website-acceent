import prisma from "@/lib/prisma";
import { formatDateFr, logger } from "@/lib/core";
import type { PublishedPost } from "@/components/actualites/PostCard";
import type { PostCategoryKey } from "@/lib/constants/platform";

export interface AdminArticleDTO {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl: string;
  link: string | null;
  category: PostCategoryKey | string;
  tags: string[];
  published: boolean;
  authorId: string;
  authorName: string;
  createdAt: string;
}

export async function findPublishedPosts(limit?: number): Promise<PublishedPost[]> {
  try {
    const dbPosts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      ...(limit ? { take: limit } : {}),
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        imageUrl: true,
        link: true,
        category: true,
        tags: true,
        createdAt: true,
        author: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
      },
    });

    return dbPosts.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      content: p.content,
      imageUrl: p.imageUrl,
      link: p.link,
      category: p.category,
      tags: p.tags,
      authorName: p.author
        ? `${p.author.firstname} ${p.author.lastname}`
        : "ACCEENT",
      createdAt: formatDateFr(p.createdAt),
    }));
  } catch (error) {
    logger.error("post.repository", "Impossible de récupérer les articles publiés", error);
    return [];
  }
}

export async function findPublishedPostByIdOrSlug(idOrSlug: string) {
  try {
    const post = await prisma.post.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        imageUrl: true,
        link: true,
        category: true,
        tags: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
      },
    });

    if (!post) return null;
    return {
      ...post,
      authorName: post.author
        ? `${post.author.firstname} ${post.author.lastname}`
        : "ACCEENT",
      formattedDate: formatDateFr(post.createdAt),
    };
  } catch (error) {
    logger.error("post.repository", "Impossible de récupérer le détail de l'article", error, {
      idOrSlug,
    });
    return null;
  }
}

export async function findAllPostsForAdmin(authorId?: string): Promise<AdminArticleDTO[]> {
  const dbArticles = await prisma.post.findMany({
    where: authorId ? { authorId } : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      imageUrl: true,
      link: true,
      category: true,
      tags: true,
      published: true,
      authorId: true,
      createdAt: true,
      author: {
        select: {
          firstname: true,
          lastname: true,
        },
      },
    },
  });

  return dbArticles.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    content: a.content,
    imageUrl: a.imageUrl,
    link: a.link,
    category: a.category,
    tags: a.tags,
    published: a.published,
    authorId: a.authorId,
    authorName: a.author
      ? `${a.author.firstname} ${a.author.lastname}`
      : "Auteur inconnu",
    createdAt: formatDateFr(a.createdAt, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  }));
}
