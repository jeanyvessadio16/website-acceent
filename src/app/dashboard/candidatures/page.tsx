import { redirect } from "next/navigation";
import { ApplicationManager } from "@/components/dashboard/ApplicationManager";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import {
  type ApplicationStatusKey,
  type ProgramPoleKey,
} from "@/lib/constants/platform";
import { resolveInitialProgramSlug } from "@/lib/core/program-settings";
import { getActivePrograms } from "@/repositories/program.repository";

export default async function CandidaturesMemberPage({
  searchParams,
}: {
  searchParams: Promise<{ program?: string; new?: string }>;
}) {
  const [session, sp] = await Promise.all([getSession(), searchParams]);
  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard/candidatures");
  }

  const [activePrograms, dbApps] = await Promise.all([
    getActivePrograms(),
    prisma.programApplication.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const validProgramSlug = resolveInitialProgramSlug(sp.program, activePrograms);
  const initialOpenCreate =
    activePrograms.length > 0 && Boolean(validProgramSlug || sp.new === "true");

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
    <ApplicationManager
      applications={formatted}
      availablePrograms={activePrograms}
      initialOpenCreate={initialOpenCreate}
      initialProgramSlug={validProgramSlug}
    />
  );
}
