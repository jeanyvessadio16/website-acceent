import { redirect } from "next/navigation";
import { UserShell } from "@/components/dashboard/UserShell";
import { ApplicationManager } from "@/components/dashboard/ApplicationManager";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import {
  ACCEENT_PROGRAMS,
  type ApplicationStatusKey,
  type ProgramPoleKey,
} from "@/lib/constants/platform";

export default async function CandidaturesMemberPage({
  searchParams,
}: {
  searchParams: Promise<{ program?: string; new?: string }>;
}) {
  const [session, sp] = await Promise.all([getSession(), searchParams]);
  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard/candidatures");
  }

  const validProgramSlug =
    sp.program && ACCEENT_PROGRAMS.some((p) => p.slug === sp.program)
      ? sp.program
      : undefined;
  const initialOpenCreate = Boolean(validProgramSlug || sp.new === "true");

  const dbApps = await prisma.programApplication.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  const formatted = dbApps.map((app) => ({
    id: app.id,
    programSlug: app.programSlug,
    programName: app.programName,
    pole: app.pole as ProgramPoleKey,
    phone: app.phone,
    city: app.city,
    projectTitle: app.projectTitle,
    motivation: app.motivation,
    documentUrl: app.documentUrl,
    status: app.status as ApplicationStatusKey,
    adminNotes: app.adminNotes,
    createdAt: app.createdAt.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    reviewedAt: app.reviewedAt
      ? app.reviewedAt.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : null,
  }));

  return (
    <UserShell
      title="Mes Candidatures"
      subtitle="Postulez aux programmes ACCEENT et suivez l'avancement de vos dossiers"
      user={{
        name: `${session.firstname} ${session.lastname}`,
        email: session.email,
        role: session.role,
      }}
    >
      <ApplicationManager
        applications={formatted}
        initialOpenCreate={initialOpenCreate}
        initialProgramSlug={validProgramSlug}
      />
    </UserShell>
  );
}
