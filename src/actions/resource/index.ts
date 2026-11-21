"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import {
  createResourceSchema,
  updateResourceSchema,
  type CreateResourceInput,
  type UpdateResourceInput,
} from "@/validation/resource";

export async function createResourceAction(data: CreateResourceInput) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "AUTHOR")) {
    return { success: false, message: "Accès refusé." };
  }

  const parsed = createResourceSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Données invalides.",
    };
  }

  const v = parsed.data;
  try {
    const resource = await prisma.resource.create({
      data: {
        title: v.title,
        description: v.description,
        pole: v.pole,
        programTag: v.programTag || null,
        type: v.type,
        fileUrl: v.fileUrl,
        fileSize: v.fileSize || null,
        published: v.published,
        createdById: session.userId,
      },
    });

    revalidatePath("/dashboard/ressources");
    revalidatePath("/dashboard");
    revalidatePath("/admin/ressources");
    revalidatePath("/admin");

    return {
      success: true,
      resource,
      message: `La ressource "${resource.title}" a été ajoutée.`,
    };
  } catch (error) {
    console.error("[createResourceAction] Erreur:", error);
    return { success: false, message: "Erreur lors de la création de la ressource." };
  }
}

export async function updateResourceAction(resourceId: string, data: UpdateResourceInput) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "AUTHOR")) {
    return { success: false, message: "Accès refusé." };
  }

  const parsed = updateResourceSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Données invalides.",
    };
  }

  try {
    const existing = await prisma.resource.findUnique({
      where: { id: resourceId },
      select: { id: true, createdById: true },
    });

    if (!existing) return { success: false, message: "Ressource introuvable." };
    if (session.role !== "ADMIN" && existing.createdById !== session.userId) {
      return { success: false, message: "Vous ne pouvez modifier que vos propres ressources." };
    }

    const v = parsed.data;
    const payload: Record<string, unknown> = {};
    if (v.title !== undefined) payload.title = v.title;
    if (v.description !== undefined) payload.description = v.description;
    if (v.pole !== undefined) payload.pole = v.pole;
    if (v.programTag !== undefined) payload.programTag = v.programTag || null;
    if (v.type !== undefined) payload.type = v.type;
    if (v.fileUrl !== undefined) payload.fileUrl = v.fileUrl;
    if (v.fileSize !== undefined) payload.fileSize = v.fileSize || null;
    if (v.published !== undefined) payload.published = v.published;

    const updated = await prisma.resource.update({
      where: { id: resourceId },
      data: payload,
    });

    revalidatePath("/dashboard/ressources");
    revalidatePath("/dashboard");
    revalidatePath("/admin/ressources");
    revalidatePath("/admin");

    return {
      success: true,
      resource: updated,
      message: `La ressource "${updated.title}" a été mise à jour.`,
    };
  } catch (error) {
    console.error("[updateResourceAction] Erreur:", error);
    return { success: false, message: "Erreur lors de la mise à jour de la ressource." };
  }
}

export async function togglePublishResourceAction(resourceId: string) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "AUTHOR")) {
    return { success: false, message: "Accès refusé." };
  }

  try {
    const existing = await prisma.resource.findUnique({
      where: { id: resourceId },
      select: { id: true, title: true, published: true, createdById: true },
    });
    if (!existing) return { success: false, message: "Ressource introuvable." };
    if (session.role !== "ADMIN" && existing.createdById !== session.userId) {
      return { success: false, message: "Action non autorisée." };
    }

    const updated = await prisma.resource.update({
      where: { id: resourceId },
      data: { published: !existing.published },
    });

    revalidatePath("/dashboard/ressources");
    revalidatePath("/dashboard");
    revalidatePath("/admin/ressources");
    revalidatePath("/admin");

    return {
      success: true,
      message: `La ressource "${updated.title}" est désormais ${updated.published ? "visible" : "masquée"}.`,
    };
  } catch (error) {
    console.error("[togglePublishResourceAction] Erreur:", error);
    return { success: false, message: "Impossible de changer la visibilité." };
  }
}

export async function deleteResourceAction(resourceId: string) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "AUTHOR")) {
    return { success: false, message: "Accès refusé." };
  }

  try {
    const existing = await prisma.resource.findUnique({
      where: { id: resourceId },
      select: { id: true, title: true, createdById: true },
    });
    if (!existing) return { success: false, message: "Ressource introuvable." };
    if (session.role !== "ADMIN" && existing.createdById !== session.userId) {
      return { success: false, message: "Action non autorisée." };
    }

    await prisma.resource.delete({ where: { id: resourceId } });

    revalidatePath("/dashboard/ressources");
    revalidatePath("/dashboard");
    revalidatePath("/admin/ressources");
    revalidatePath("/admin");

    return { success: true, message: `La ressource "${existing.title}" a été supprimée.` };
  } catch (error) {
    console.error("[deleteResourceAction] Erreur:", error);
    return { success: false, message: "Erreur lors de la suppression." };
  }
}

export async function trackResourceDownloadAction(resourceId: string) {
  const session = await getSession();
  if (!session) {
    return { success: false };
  }

  try {
    await prisma.resource.updateMany({
      where: { id: resourceId, published: true },
      data: { downloadCount: { increment: 1 } },
    });
    return { success: true };
  } catch {
    return { success: false };
  }
}
