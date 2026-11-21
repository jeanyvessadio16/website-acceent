import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ResourceAdminList } from "@/components/admin/ResourceAdminList";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import type { ProgramPoleKey, ResourceTypeKey } from "@/lib/constants/platform";

export const metadata: Metadata = {
  title: "Ressources",
};

export default async function AdminRessourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string; action?: string }>;
}) {
  const [session, sp] = await Promise.all([getSession(), searchParams]);
  if (!session || (session.role !== "ADMIN" && session.role !== "AUTHOR")) {
    redirect("/auth/login");
  }

  const initialOpenCreate = sp.new === "true" || sp.action === "new";
  const isAuthorOnly = session.role === "AUTHOR";

  const dbResources = await prisma.resource.findMany({
    where: isAuthorOnly ? { createdById: session.userId } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      createdBy: { select: { firstname: true, lastname: true } },
    },
  });

  const formatted = dbResources.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    pole: r.pole as ProgramPoleKey,
    programTag: r.programTag,
    type: r.type as ResourceTypeKey,
    fileUrl: r.fileUrl,
    fileSize: r.fileSize,
    published: r.published,
    downloadCount: r.downloadCount,
    createdById: r.createdById,
    authorName: `${r.createdBy.firstname} ${r.createdBy.lastname}`,
    createdAt: r.createdAt.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  }));

  return (
    <AdminShell
      title="Ressources Pédagogiques"
      subtitle="Bibliothèque de cours, guides et modèles partagés aux membres (Tut-Tank, AI4Good…)"
      user={{
        name: `${session.firstname} ${session.lastname}`,
        email: session.email,
        role: session.role,
      }}
    >
      <ResourceAdminList
        resources={formatted}
        currentUserId={session.userId}
        currentUserRole={session.role}
        initialOpenCreate={initialOpenCreate}
      />
    </AdminShell>
  );
}
