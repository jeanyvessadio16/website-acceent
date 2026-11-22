import type { Metadata } from "next";
import { redirect } from "next/navigation";
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
  if (!session || (session.role !== "ADMIN" && session.role !== "AUTHOR")) {
    redirect("/auth/login");
  }

  const isAuthorOnly = session.role === "AUTHOR";
  const [sp, formattedArticles] = await Promise.all([
    searchParams,
    findAllPostsForAdmin(isAuthorOnly ? session?.userId : undefined),
  ]);

  const initialOpenCreate = sp.new === "true" || sp.action === "new";

  return (
    <ArticleList
      articles={formattedArticles}
      currentUserId={session?.userId}
      currentUserRole={session?.role}
      initialOpenCreate={initialOpenCreate}
    />
  );
}
