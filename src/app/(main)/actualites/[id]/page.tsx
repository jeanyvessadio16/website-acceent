import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { createPageMetadata } from "@/lib/seo";
import { PostDetailView } from "@/components/actualites/PostDetailView";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PostPageProps) {
  const { id } = await params;
  try {
    const post = await prisma.post.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!post) {
      return createPageMetadata({
        title: "Article introuvable",
        description: "L'article demandé n'existe pas ou n'est plus disponible.",
        path: `/actualites/${id}`,
      });
    }

    return createPageMetadata({
      title: post.title,
      description: post.content.slice(0, 160),
      path: `/actualites/${post.id}`,
    });
  } catch {
    return createPageMetadata({
      title: "Actualités ACCEENT",
      description: "Découvrez les actualités d'ACCEENT.",
      path: `/actualites/${id}`,
    });
  }
}

export default async function PostDetailPage({ params }: PostPageProps) {
  const { id } = await params;

  let post = null;

  try {
    post = await prisma.post.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        author: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Erreur de connexion à la base de données dans PostDetailPage:", error);
  }

  if (!post || !post.published) {
    notFound();
  }

  const formattedDate = post.createdAt.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const authorName = post.author
    ? `${post.author.firstname} ${post.author.lastname}`
    : "ACCEENT";

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.content.slice(0, 160)}
        url={`/actualites/${post.id}`}
        imageUrl={post.imageUrl ?? undefined}
        datePublished={post.createdAt.toISOString()}
        authorName={authorName}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", item: "/" },
          { name: "Actualités", item: "/actualites" },
          { name: post.title, item: `/actualites/${post.id}` },
        ]}
      />
      <main className="min-h-screen bg-slate-50/50 py-12 sm:py-16">
        <PostDetailView
          post={{
            id: post.id,
            title: post.title,
            slug: post.slug || post.id,
            content: post.content,
            imageUrl: post.imageUrl,
            createdAt: formattedDate,
            authorName,
          }}
        />
      </main>
    </>
  );
}
