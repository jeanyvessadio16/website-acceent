"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import {
  APPLICATION_STATUSES,
  getProgramBySlug,
  type ApplicationStatusKey,
} from "@/lib/constants/platform";
import { sendApplicationStatusEmail } from "@/services/emailService";
import { checkRateLimit, handleActionError, recordAuditLog } from "@/lib/core";
import {
  submitApplicationSchema,
  updateApplicationStatusSchema,
  type SubmitApplicationInput,
  type UpdateApplicationStatusInput,
} from "@/validation/application";

export async function submitApplicationAction(data: SubmitApplicationInput) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Vous devez être connecté·e pour candidater." };
  }

  const rate = checkRateLimit(`apply:${session.userId}`, {
    limit: 10,
    windowMs: 60 * 60 * 1000,
  });
  if (!rate.allowed) {
    return {
      success: false,
      message: "Vous avez déposé plusieurs dossiers récemment. Veuillez patienter avant de soumettre une nouvelle candidature.",
    };
  }

  const parsed = submitApplicationSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Formulaire invalide.",
    };
  }

  const program = getProgramBySlug(parsed.data.programSlug);
  if (!program) {
    return { success: false, message: "Programme introuvable." };
  }

  try {
    const existingActive = await prisma.programApplication.findFirst({
      where: {
        userId: session.userId,
        programSlug: program.slug,
        status: { in: ["PENDING", "REVIEWING"] },
      },
      select: { id: true },
    });

    if (existingActive) {
      return {
        success: false,
        message: `Vous avez déjà une candidature active pour ${program.name}.`,
      };
    }

    const application = await prisma.programApplication.create({
      data: {
        userId: session.userId,
        programSlug: program.slug,
        programName: program.name,
        pole: program.pole,
        phone: parsed.data.phone,
        city: parsed.data.city,
        projectTitle: parsed.data.projectTitle || null,
        motivation: parsed.data.motivation,
        documentUrl: parsed.data.documentUrl || null,
        status: "PENDING",
      },
    });

    await recordAuditLog({
      session,
      action: "APPLICATION_SUBMITTED",
      entity: "ProgramApplication",
      entityId: application.id,
      metadata: { programSlug: program.slug, pole: program.pole },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/candidatures");
    revalidatePath("/dashboard/programmes");
    revalidatePath("/admin/candidatures");
    revalidatePath("/admin");

    return {
      success: true,
      application,
      message: `Votre candidature à ${program.name} a bien été transmise !`,
    };
  } catch (error) {
    return handleActionError(
      "actions.application.submit",
      error,
      "Une erreur est survenue lors de l'envoi de votre candidature."
    );
  }
}

export async function withdrawApplicationAction(applicationId: string) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Session invalide." };
  }

  try {
    const app = await prisma.programApplication.findUnique({
      where: { id: applicationId },
      select: { id: true, userId: true, status: true, programName: true },
    });

    if (!app) {
      return { success: false, message: "Candidature introuvable." };
    }

    if (app.userId !== session.userId) {
      return { success: false, message: "Action non autorisée." };
    }

    if (app.status !== "PENDING") {
      return {
        success: false,
        message: "Seule une candidature encore en attente d'examen peut être retirée.",
      };
    }

    await prisma.programApplication.delete({ where: { id: applicationId } });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/candidatures");
    revalidatePath("/dashboard/programmes");
    revalidatePath("/admin/candidatures");
    revalidatePath("/admin");

    return {
      success: true,
      message: `Votre candidature à ${app.programName} a été retirée.`,
    };
  } catch (error) {
    console.error("[withdrawApplicationAction] Erreur:", error);
    return { success: false, message: "Impossible de retirer cette candidature." };
  }
}

export async function updateApplicationStatusAction(
  applicationId: string,
  data: UpdateApplicationStatusInput
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return { success: false, message: "Accès réservé aux administrateurs." };
  }

  const parsed = updateApplicationStatusSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Données invalides.",
    };
  }

  try {
    const updated = await prisma.programApplication.update({
      where: { id: applicationId },
      data: {
        status: parsed.data.status,
        adminNotes: parsed.data.adminNotes || null,
        reviewedAt: new Date(),
      },
      include: {
        user: { select: { email: true, firstname: true } },
      },
    });

    let emailNote = "";
    if (parsed.data.notifyCandidate && updated.user?.email) {
      const statusLabel =
        APPLICATION_STATUSES[parsed.data.status as ApplicationStatusKey]?.label ||
        parsed.data.status;
      const emailRes = await sendApplicationStatusEmail({
        to: updated.user.email,
        firstname: updated.user.firstname,
        programName: updated.programName,
        statusLabel,
        adminNotes: updated.adminNotes,
      });
      if (emailRes.sent) {
        emailNote = " Un e-mail de notification a été envoyé au candidat.";
      }
    }

    await recordAuditLog({
      session,
      action: "APPLICATION_STATUS_UPDATED",
      entity: "ProgramApplication",
      entityId: updated.id,
      metadata: { programName: updated.programName, status: parsed.data.status },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/candidatures");
    revalidatePath("/dashboard/programmes");
    revalidatePath("/admin/candidatures");
    revalidatePath("/admin");

    return {
      success: true,
      message: `Statut mis à jour pour ${updated.programName}.${emailNote}`,
    };
  } catch (error) {
    return handleActionError(
      "actions.application.updateStatus",
      error,
      "Impossible de mettre à jour la candidature."
    );
  }
}

export async function deleteApplicationAction(applicationId: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return { success: false, message: "Accès réservé aux administrateurs." };
  }

  try {
    await prisma.programApplication.delete({ where: { id: applicationId } });

    await recordAuditLog({
      session,
      action: "APPLICATION_DELETED",
      entity: "ProgramApplication",
      entityId: applicationId,
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/candidatures");
    revalidatePath("/dashboard/programmes");
    revalidatePath("/admin/candidatures");
    revalidatePath("/admin");

    return { success: true, message: "Candidature supprimée définitivement." };
  } catch (error) {
    return handleActionError(
      "actions.application.delete",
      error,
      "Erreur lors de la suppression de la candidature."
    );
  }
}
