import { AdminShell } from "@/components/admin/AdminShell";
import { ArticleList } from "@/components/admin/ArticleList";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function ArticlesPage() {
  const session = await getSession();
  const currentUser = session
    ? {
        name: `${session.firstname} ${session.lastname}`,
        email: session.email,
        role: session.role,
      }
    : null;

  // Récupération de tous les articles avec leur auteur depuis PostgreSQL via Prisma
  const dbArticles = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          firstname: true,
          lastname: true,
          email: true,
        },
      },
    },
  });

  const formattedArticles = dbArticles.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    content: a.content,
    imageUrl: a.imageUrl,
    published: a.published,
    authorName: a.author
      ? `${a.author.firstname} ${a.author.lastname}`
      : "Auteur inconnu",
    createdAt: a.createdAt.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  }));

  return (
    <AdminShell
      title="Articles"
      subtitle="Gestion des publications dans la base de données"
      user={currentUser}
    >
      <ArticleList articles={formattedArticles} />
    </AdminShell>
  );
}
