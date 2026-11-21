"use server";

import crypto from "node:crypto";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { sendEventRegistrationEmail } from "@/services/emailService";
import {
  requireAuthorOrAdmin,
  canManageOwnedResource,
  slugify,
  fromZodError,
  handleActionError,
  recordAuditLog,
} from "@/lib/core";
import {
  createEventSchema,
  updateEventSchema,
  type CreateEventInput,
  type UpdateEventInput,
} from "@/validation/event";
import { optionalPhoneFieldSchema } from "@/validation/patterns";

function generateTicketCode(): string {
  const random = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `ACC-${random}`;
}

export async function createEventAction(data: CreateEventInput) {
  const guard = await requireAuthorOrAdmin();
  if (!guard.authorized) return guard.response;

  const parsed = createEventSchema.safeParse(data);
  if (!parsed.success) return fromZodError(parsed.error);

  const v = parsed.data;
  try {
    let slug = slugify(v.title) || "evenement";
    const existing = await prisma.event.findUnique({ where: { slug }, select: { id: true } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const event = await prisma.event.create({
      data: {
        title: v.title,
        slug,
        description: v.description,
        pole: v.pole ?? null,
        location: v.location,
        isOnline: v.isOnline,
        meetingUrl: v.meetingUrl || null,
        imageUrl: v.imageUrl || null,
        startDate: new Date(v.startDate),
        endDate: v.endDate ? new Date(v.endDate) : null,
        capacity: v.capacity ?? null,
        published: v.published,
        createdById: guard.session.userId,
      },
    });

    await recordAuditLog({
      session: guard.session,
      action: "EVENT_CREATED",
      entity: "Event",
      entityId: event.id,
      metadata: { title: event.title, startDate: event.startDate.toISOString() },
    });

    revalidatePath("/evenements");
    revalidatePath("/dashboard/evenements");
    revalidatePath("/dashboard");
    revalidatePath("/admin/evenements");
    revalidatePath("/admin");

    return {
      success: true,
      event,
      message: `L'événement "${event.title}" a été créé avec succès.`,
    };
  } catch (error) {
    return handleActionError(
      "actions.event.create",
      error,
      "Erreur lors de la création de l'événement."
    );
  }
}

export async function updateEventAction(eventId: string, data: UpdateEventInput) {
  const guard = await requireAuthorOrAdmin();
  if (!guard.authorized) return guard.response;

  const parsed = updateEventSchema.safeParse(data);
  if (!parsed.success) return fromZodError(parsed.error);

  try {
    const existing = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, createdById: true },
    });

    if (!existing) {
      return { success: false, message: "Événement introuvable." };
    }

    if (!canManageOwnedResource(guard.session, existing.createdById)) {
      return { success: false, message: "Vous ne pouvez modifier que vos propres événements." };
    }

    const v = parsed.data;
    const payload: Record<string, unknown> = {};
    if (v.title !== undefined) payload.title = v.title;
    if (v.description !== undefined) payload.description = v.description;
    if (v.pole !== undefined) payload.pole = v.pole;
    if (v.location !== undefined) payload.location = v.location;
    if (v.isOnline !== undefined) payload.isOnline = v.isOnline;
    if (v.meetingUrl !== undefined) payload.meetingUrl = v.meetingUrl || null;
    if (v.imageUrl !== undefined) payload.imageUrl = v.imageUrl || null;
    if (v.startDate !== undefined) payload.startDate = new Date(v.startDate);
    if (v.endDate !== undefined) payload.endDate = v.endDate ? new Date(v.endDate) : null;
    if (v.capacity !== undefined) payload.capacity = v.capacity;
    if (v.published !== undefined) payload.published = v.published;

    const updated = await prisma.event.update({
      where: { id: eventId },
      data: payload,
    });

    revalidatePath("/evenements");
    revalidatePath("/dashboard/evenements");
    revalidatePath("/dashboard");
    revalidatePath("/admin/evenements");
    revalidatePath("/admin");

    return {
      success: true,
      event: updated,
      message: `L'événement "${updated.title}" a été mis à jour.`,
    };
  } catch (error) {
    return handleActionError(
      "actions.event.update",
      error,
      "Erreur lors de la mise à jour de l'événement."
    );
  }
}

export async function togglePublishEventAction(eventId: string) {
  const guard = await requireAuthorOrAdmin();
  if (!guard.authorized) return guard.response;

  try {
    const ev = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, title: true, published: true, createdById: true },
    });
    if (!ev) return { success: false, message: "Événement introuvable." };
    if (!canManageOwnedResource(guard.session, ev.createdById)) {
      return { success: false, message: "Action non autorisée." };
    }

    const updated = await prisma.event.update({
      where: { id: eventId },
      data: { published: !ev.published },
    });

    revalidatePath("/evenements");
    revalidatePath("/dashboard/evenements");
    revalidatePath("/dashboard");
    revalidatePath("/admin/evenements");
    revalidatePath("/admin");

    return {
      success: true,
      message: `L'événement "${updated.title}" est désormais ${updated.published ? "publié" : "masqué"}.`,
    };
  } catch (error) {
    return handleActionError(
      "actions.event.togglePublish",
      error,
      "Erreur lors du changement de statut."
    );
  }
}

export async function deleteEventAction(eventId: string) {
  const guard = await requireAuthorOrAdmin();
  if (!guard.authorized) return guard.response;

  try {
    const ev = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, title: true, createdById: true },
    });
    if (!ev) return { success: false, message: "Événement introuvable." };
    if (!canManageOwnedResource(guard.session, ev.createdById)) {
      return { success: false, message: "Action non autorisée." };
    }

    await prisma.event.delete({ where: { id: eventId } });

    await recordAuditLog({
      session: guard.session,
      action: "EVENT_DELETED",
      entity: "Event",
      entityId: ev.id,
      metadata: { title: ev.title },
    });

    revalidatePath("/evenements");
    revalidatePath("/dashboard/evenements");
    revalidatePath("/dashboard");
    revalidatePath("/admin/evenements");
    revalidatePath("/admin");

    return { success: true, message: `L'événement "${ev.title}" a été supprimé.` };
  } catch (error) {
    return handleActionError(
      "actions.event.delete",
      error,
      "Erreur lors de la suppression de l'événement."
    );
  }
}

export async function registerForEventAction(eventId: string, phone?: string) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Connectez-vous pour vous inscrire à cet événement." };
  }

  let sanitizedPhone: string | null = null;
  if (phone !== undefined && phone.trim().length > 0) {
    const phoneParsed = optionalPhoneFieldSchema.safeParse(phone);
    if (!phoneParsed.success) {
      return {
        success: false,
        message:
          phoneParsed.error.issues[0]?.message || "Numéro de téléphone invalide.",
      };
    }
    sanitizedPhone = phoneParsed.data?.trim() || null;
  }

  try {
    const txResult = await prisma.$transaction(async (tx) => {
      const ev = await tx.event.findUnique({
        where: { id: eventId },
        include: { _count: { select: { registrations: true } } },
      });

      if (!ev || !ev.published) {
        return { ok: false as const, message: "Événement introuvable ou fermé." };
      }

      const existing = await tx.eventRegistration.findUnique({
        where: { eventId_userId: { eventId, userId: session.userId } },
      });

      if (existing) {
        return {
          ok: false as const,
          message: `Vous êtes déjà inscrit·e à cet événement (billet ${existing.ticketCode}).`,
        };
      }

      if (ev.capacity !== null && ev._count.registrations >= ev.capacity) {
        return { ok: false as const, message: "Désolé, cet événement est complet." };
      }

      const ticketCode = generateTicketCode();
      const reg = await tx.eventRegistration.create({
        data: {
          eventId,
          userId: session.userId,
          ticketCode,
          phone: sanitizedPhone,
        },
      });

      return { ok: true as const, event: ev, registration: reg };
    });

    if (!txResult.ok) {
      return { success: false, message: txResult.message };
    }

    try {
      await sendEventRegistrationEmail({
        to: session.email,
        firstname: session.firstname,
        eventTitle: txResult.event.title,
        startDateFormatted: txResult.event.startDate.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        location: txResult.event.location,
        ticketCode: txResult.registration.ticketCode,
      });
    } catch {
      // Ne pas annuler l'inscription si l'envoi d'e-mail échoue
    }

    revalidatePath("/evenements");
    revalidatePath("/dashboard/evenements");
    revalidatePath("/dashboard");
    revalidatePath("/admin/evenements");

    return {
      success: true,
      ticketCode: txResult.registration.ticketCode,
      message: `Inscription confirmée ! Code billet : ${txResult.registration.ticketCode}`,
    };
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return { success: false, message: "Vous êtes déjà inscrit·e à cet événement." };
    }
    console.error("[registerForEventAction] Erreur:", error);
    return { success: false, message: "Erreur lors de l'inscription à l'événement." };
  }
}

export async function unregisterFromEventAction(eventId: string) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Session requise." };
  }

  try {
    const res = await prisma.eventRegistration.deleteMany({
      where: { eventId, userId: session.userId },
    });

    if (res.count === 0) {
      return { success: false, message: "Aucune inscription trouvée." };
    }

    revalidatePath("/evenements");
    revalidatePath("/dashboard/evenements");
    revalidatePath("/dashboard");
    revalidatePath("/admin/evenements");

    return { success: true, message: "Votre inscription a bien été annulée." };
  } catch (error) {
    console.error("[unregisterFromEventAction] Erreur:", error);
    return { success: false, message: "Erreur lors de la désinscription." };
  }
}

export async function toggleAttendanceAction(registrationId: string) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "AUTHOR")) {
    return { success: false, message: "Accès refusé." };
  }

  try {
    const reg = await prisma.eventRegistration.findUnique({
      where: { id: registrationId },
      include: { event: { select: { createdById: true } } },
    });

    if (!reg) return { success: false, message: "Inscription introuvable." };
    if (session.role !== "ADMIN" && reg.event.createdById !== session.userId) {
      return { success: false, message: "Action non autorisée." };
    }

    const updated = await prisma.eventRegistration.update({
      where: { id: registrationId },
      data: { attended: !reg.attended },
    });

    revalidatePath("/admin/evenements");
    return { success: true, attended: updated.attended };
  } catch (error) {
    console.error("[toggleAttendanceAction] Erreur:", error);
    return { success: false, message: "Impossible de modifier la présence." };
  }
}
