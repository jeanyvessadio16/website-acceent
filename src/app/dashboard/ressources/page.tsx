import { redirect } from "next/navigation";
import { UserShell } from "@/components/dashboard/UserShell";
import { ResourceLibrary } from "@/components/dashboard/ResourceLibrary";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import type { ProgramPoleKey, ResourceTypeKey } from "@/lib/constants/platform";

export default async function MemberRessourcesPage() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard/ressources");
  }

  const dbResources = await prisma.resource.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
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
    downloadCount: r.downloadCount,
    createdAt: r.createdAt.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  }));

  return (
    <UserShell
      title="Ressources Pédagogiques"
      subtitle="Fiches pratiques, guides Tut-Tank, supports AI4Good et modèles entrepreneuriaux"
      user={{
        name: `${session.firstname} ${session.lastname}`,
        email: session.email,
        role: session.role,
      }}
    >
      <ResourceLibrary resources={formatted} />
    </UserShell>
  );
}
