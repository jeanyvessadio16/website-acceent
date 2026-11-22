import { redirect } from "next/navigation";
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

  return <ResourceLibrary resources={formatted} />;
}
