"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { partenaires as staticPartenaires } from "@/data/partenaires";
import {
  partnerSchema,
  testimonialSchema,
  type PartnerInput,
  type TestimonialInput,
} from "@/validation/showcase";

function revalidateShowcase() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/partenaires");
}

// ─── Partenaires ──────────────────────────────────────────────────────────────

export async function createPartnerAction(data: PartnerInput) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return { success: false, message: "Accès réservé aux administrateurs." };
  }

  const parsed = partnerSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Données invalides.",
    };
  }

  try {
    const partner = await prisma.partner.create({
      data: {
        name: parsed.data.name,
        logoUrl: parsed.data.logoUrl,
        description: parsed.data.description,
        website: parsed.data.website && parsed.data.website !== "#" ? parsed.data.website : null,
        displayOrder: parsed.data.displayOrder,
        active: parsed.data.active,
      },
    });
    revalidateShowcase();
    return { success: true, partner, message: `Partenaire "${partner.name}" ajouté.` };
  } catch (error) {
    console.error("[createPartnerAction] Erreur:", error);
    return { success: false, message: "Erreur lors de l'ajout du partenaire." };
  }
}

export async function updatePartnerAction(id: string, data: PartnerInput) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return { success: false, message: "Accès réservé aux administrateurs." };
  }

  const parsed = partnerSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Données invalides.",
    };
  }

  try {
    const partner = await prisma.partner.update({
      where: { id },
      data: {
        name: parsed.data.name,
        logoUrl: parsed.data.logoUrl,
        description: parsed.data.description,
        website: parsed.data.website && parsed.data.website !== "#" ? parsed.data.website : null,
        displayOrder: parsed.data.displayOrder,
        active: parsed.data.active,
      },
    });
    revalidateShowcase();
    return { success: true, partner, message: `Partenaire "${partner.name}" mis à jour.` };
  } catch (error) {
    console.error("[updatePartnerAction] Erreur:", error);
    return { success: false, message: "Erreur lors de la mise à jour du partenaire." };
  }
}

export async function togglePartnerActiveAction(id: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return { success: false, message: "Accès réservé aux administrateurs." };
  }

  try {
    const existing = await prisma.partner.findUnique({ where: { id } });
    if (!existing) return { success: false, message: "Partenaire introuvable." };

    const updated = await prisma.partner.update({
      where: { id },
      data: { active: !existing.active },
    });
    revalidateShowcase();
    return {
      success: true,
      message: `Partenaire "${updated.name}" ${updated.active ? "activé" : "masqué"}.`,
    };
  } catch (error) {
    console.error("[togglePartnerActiveAction] Erreur:", error);
    return { success: false, message: "Erreur lors de la modification." };
  }
}

export async function deletePartnerAction(id: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return { success: false, message: "Accès réservé aux administrateurs." };
  }

  try {
    await prisma.partner.delete({ where: { id } });
    revalidateShowcase();
    return { success: true, message: "Partenaire supprimé." };
  } catch (error) {
    console.error("[deletePartnerAction] Erreur:", error);
    return { success: false, message: "Erreur lors de la suppression." };
  }
}

export async function seedDefaultPartnersAction() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return { success: false, message: "Accès réservé aux administrateurs." };
  }

  try {
    const existingNames = new Set(
      (await prisma.partner.findMany({ select: { name: true } })).map((p) =>
        p.name.toLowerCase()
      )
    );

    const toCreate = staticPartenaires
      .filter((p) => !existingNames.has(p.name.toLowerCase()))
      .map((p, index) => ({
        name: p.name,
        logoUrl: p.logo,
        description: p.description,
        website: p.website && p.website !== "#" ? p.website : null,
        displayOrder: index,
        active: true,
      }));

    if (toCreate.length === 0) {
      return {
        success: true,
        message: "Tous les partenaires par défaut sont déjà présents dans la base.",
      };
    }

    await prisma.partner.createMany({ data: toCreate });
    revalidateShowcase();

    return {
      success: true,
      message: `${toCreate.length} partenaire(s) par défaut importé(s) avec succès !`,
    };
  } catch (error) {
    console.error("[seedDefaultPartnersAction] Erreur:", error);
    return { success: false, message: "Erreur lors de l'import des partenaires." };
  }
}

// ─── Témoignages ──────────────────────────────────────────────────────────────

export async function createTestimonialAction(data: TestimonialInput) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return { success: false, message: "Accès réservé aux administrateurs." };
  }

  const parsed = testimonialSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Données invalides.",
    };
  }

  try {
    const t = await prisma.testimonial.create({
      data: {
        authorName: parsed.data.authorName,
        authorRole: parsed.data.authorRole,
        program: parsed.data.program || null,
        quote: parsed.data.quote,
        avatarUrl: parsed.data.avatarUrl || null,
        rating: parsed.data.rating,
        displayOrder: parsed.data.displayOrder,
        active: parsed.data.active,
      },
    });
    revalidateShowcase();
    return { success: true, testimonial: t, message: `Témoignage de "${t.authorName}" ajouté.` };
  } catch (error) {
    console.error("[createTestimonialAction] Erreur:", error);
    return { success: false, message: "Erreur lors de la création du témoignage." };
  }
}

export async function updateTestimonialAction(id: string, data: TestimonialInput) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return { success: false, message: "Accès réservé aux administrateurs." };
  }

  const parsed = testimonialSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Données invalides.",
    };
  }

  try {
    const t = await prisma.testimonial.update({
      where: { id },
      data: {
        authorName: parsed.data.authorName,
        authorRole: parsed.data.authorRole,
        program: parsed.data.program || null,
        quote: parsed.data.quote,
        avatarUrl: parsed.data.avatarUrl || null,
        rating: parsed.data.rating,
        displayOrder: parsed.data.displayOrder,
        active: parsed.data.active,
      },
    });
    revalidateShowcase();
    return { success: true, testimonial: t, message: `Témoignage de "${t.authorName}" mis à jour.` };
  } catch (error) {
    console.error("[updateTestimonialAction] Erreur:", error);
    return { success: false, message: "Erreur lors de la mise à jour du témoignage." };
  }
}

export async function toggleTestimonialActiveAction(id: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return { success: false, message: "Accès réservé aux administrateurs." };
  }

  try {
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) return { success: false, message: "Témoignage introuvable." };

    const updated = await prisma.testimonial.update({
      where: { id },
      data: { active: !existing.active },
    });
    revalidateShowcase();
    return {
      success: true,
      message: `Témoignage de "${updated.authorName}" ${updated.active ? "activé" : "masqué"}.`,
    };
  } catch (error) {
    console.error("[toggleTestimonialActiveAction] Erreur:", error);
    return { success: false, message: "Erreur lors de la modification." };
  }
}

export async function deleteTestimonialAction(id: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return { success: false, message: "Accès réservé aux administrateurs." };
  }

  try {
    await prisma.testimonial.delete({ where: { id } });
    revalidateShowcase();
    return { success: true, message: "Témoignage supprimé." };
  } catch (error) {
    console.error("[deleteTestimonialAction] Erreur:", error);
    return { success: false, message: "Erreur lors de la suppression." };
  }
}
