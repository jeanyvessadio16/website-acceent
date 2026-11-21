import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ApplicationAdminList } from "@/components/admin/ApplicationAdminList";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import type { ApplicationStatusKey, ProgramPoleKey } from "@/lib/constants/platform";

export const metadata: Metadata = {
  title: "Candidatures",
};

export default async function AdminCandidaturesPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/admin");
  }

  const dbApps = await prisma.programApplication.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { firstname: true, lastname: true, email: true } },
    },
  });

  const formatted = dbApps.map((a) => ({
    id: a.id,
    programSlug: a.programSlug,
    programName: a.programName,
    pole: a.pole as ProgramPoleKey,
    phone: a.phone,
    city: a.city,
    projectTitle: a.projectTitle,
    motivation: a.motivation,
    documentUrl: a.documentUrl,
    status: a.status as ApplicationStatusKey,
    adminNotes: a.adminNotes,
    applicantName: `${a.user.firstname} ${a.user.lastname}`,
    applicantEmail: a.user.email,
    createdAt: a.createdAt.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  }));

  return (
    <AdminShell
      title="Candidatures Programmes"
      subtitle="Examen et validation des dossiers reçus pour l'incubateur et les formations"
      user={{
        name: `${session.firstname} ${session.lastname}`,
        email: session.email,
        role: session.role,
      }}
    >
      <ApplicationAdminList applications={formatted} />
    </AdminShell>
  );
}
