import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { ArticleList } from "@/components/admin/ArticleList";
import { getSession } from "@/lib/session";
import { findAllPostsForAdmin } from "@/repositories/post.repository";

export const metadata: Metadata = {
  title: "Articles",
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; action?: string }>;
}) {
  const session = await getSession();
  const isAuthorOnly = session?.role === "AUTHOR";
  const [sp, formattedArticles] = await Promise.all([
    searchParams,
    findAllPostsForAdmin(isAuthorOnly ? session?.userId : undefined),
  ]);

  const initialOpenCreate = sp.new === "true" || sp.action === "new";
  const currentUser = session
    ? {
        name: `${session.firstname} ${session.lastname}`,
        email: session.email,
        role: session.role,
      }
    : null;

  return (
    <AdminShell
      title={isAuthorOnly ? "Mes Articles" : "Articles & Actualités"}
      subtitle={
        isAuthorOnly
          ? "Vos articles personnels, brouillons et publications ACCEENT"
          : "Gestion, rédaction et publication des articles ACCEENT"
      }
      user={currentUser}
    >
      <ArticleList
        articles={formattedArticles}
        currentUserId={session?.userId}
        currentUserRole={session?.role}
        initialOpenCreate={initialOpenCreate}
      />
    </AdminShell>
  );
}
