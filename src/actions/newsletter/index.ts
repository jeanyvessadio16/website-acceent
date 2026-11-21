"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import {
  sendNewsletterCampaignEmails,
  type CampaignRecipient,
} from "@/services/emailService";
import { checkRateLimit, getClientIp, handleActionError, recordAuditLog } from "@/lib/core";
import {
  subscribeNewsletterSchema,
  sendCampaignSchema,
  type SubscribeNewsletterInput,
  type SendCampaignInput,
} from "@/validation/newsletter";

export async function subscribeNewsletterAction(data: SubscribeNewsletterInput) {
  const ip = await getClientIp();
  const rate = checkRateLimit(`nl-sub:${ip}`, {
    limit: 10,
    windowMs: 15 * 60 * 1000,
  });
  if (!rate.allowed) {
    return {
      success: false,
      message: "Trop de tentatives récentes. Veuillez réessayer dans quelques minutes.",
    };
  }

  const parsed = subscribeNewsletterSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Adresse e-mail invalide.",
    };
  }

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email: parsed.data.email },
      create: {
        email: parsed.data.email,
        name: parsed.data.name || null,
        active: true,
      },
      update: {
        active: true,
        unsubscribedAt: null,
        ...(parsed.data.name ? { name: parsed.data.name } : {}),
      },
    });

    revalidatePath("/admin/newsletter");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Merci ! Vous êtes bien inscrit·e à la newsletter ACCEENT.",
    };
  } catch (error) {
    console.error("[subscribeNewsletterAction] Erreur:", error);
    return {
      success: false,
      message: "Impossible d'enregistrer votre inscription pour le moment.",
    };
  }
}

export async function updateMemberNewsletterPrefAction(optIn: boolean) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Session invalide." };
  }

  try {
    await prisma.user.update({
      where: { id: session.userId },
      data: { newsletterOptIn: Boolean(optIn) },
    });

    revalidatePath("/dashboard/profil");
    revalidatePath("/admin/newsletter");

    return {
      success: true,
      message: optIn
        ? "Vous recevrez désormais les actualités et campagnes ACCEENT."
        : "Vous êtes désabonné·e des envois communautaires.",
    };
  } catch (error) {
    console.error("[updateMemberNewsletterPrefAction] Erreur:", error);
    return { success: false, message: "Erreur lors de la mise à jour de vos préférences." };
  }
}

export async function toggleSubscriberAction(id: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return { success: false, message: "Accès réservé aux administrateurs." };
  }

  try {
    const sub = await prisma.newsletterSubscriber.findUnique({ where: { id } });
    if (!sub) return { success: false, message: "Abonné introuvable." };

    const updated = await prisma.newsletterSubscriber.update({
      where: { id },
      data: {
        active: !sub.active,
        unsubscribedAt: sub.active ? new Date() : null,
      },
    });

    revalidatePath("/admin/newsletter");
    revalidatePath("/admin");

    return {
      success: true,
      message: `L'abonnement de ${updated.email} est désormais ${updated.active ? "actif" : "suspendu"}.`,
    };
  } catch (error) {
    console.error("[toggleSubscriberAction] Erreur:", error);
    return { success: false, message: "Erreur lors de la modification." };
  }
}

export async function deleteSubscriberAction(id: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return { success: false, message: "Accès réservé aux administrateurs." };
  }

  try {
    await prisma.newsletterSubscriber.delete({ where: { id } });
    revalidatePath("/admin/newsletter");
    revalidatePath("/admin");
    return { success: true, message: "Abonné supprimé." };
  } catch (error) {
    console.error("[deleteSubscriberAction] Erreur:", error);
    return { success: false, message: "Erreur lors de la suppression." };
  }
}

export async function sendNewsletterCampaignAction(data: SendCampaignInput) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return { success: false, message: "Accès réservé aux administrateurs." };
  }

  const parsed = sendCampaignSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Données invalides.",
    };
  }

  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { active: true },
      select: { email: true, name: true, unsubscribeToken: true },
    });

    const recipientMap = new Map<string, CampaignRecipient>();
    for (const s of subscribers) {
      recipientMap.set(s.email.toLowerCase(), {
        email: s.email,
        name: s.name,
        unsubscribeToken: s.unsubscribeToken,
      });
    }

    if (parsed.data.includeMembers) {
      const members = await prisma.user.findMany({
        where: { newsletterOptIn: true },
        select: { email: true, firstname: true, lastname: true },
      });
      for (const m of members) {
        const key = m.email.toLowerCase();
        if (!recipientMap.has(key)) {
          recipientMap.set(key, {
            email: m.email,
            name: `${m.firstname} ${m.lastname}`.trim(),
            unsubscribeToken: null,
          });
        }
      }
    }

    const recipients = Array.from(recipientMap.values());
    if (recipients.length === 0) {
      return {
        success: false,
        message: "Aucun destinataire actif n'est enregistré pour cette diffusion.",
      };
    }

    const dispatch = await sendNewsletterCampaignEmails({
      subject: parsed.data.subject,
      previewText: parsed.data.previewText || null,
      content: parsed.data.content,
      recipients,
    });

    let status: "DRAFT" | "SENT" | "PARTIAL" | "FAILED" = "DRAFT";
    if (dispatch.configured) {
      if (dispatch.sentCount === recipients.length) status = "SENT";
      else if (dispatch.sentCount > 0) status = "PARTIAL";
      else status = "FAILED";
    }

    const campaign = await prisma.newsletterCampaign.create({
      data: {
        subject: parsed.data.subject,
        previewText: parsed.data.previewText || null,
        content: parsed.data.content,
        postId: parsed.data.postId || null,
        recipientCount: recipients.length,
        sentCount: dispatch.sentCount,
        status,
        sentAt: status === "SENT" || status === "PARTIAL" ? new Date() : null,
        createdById: session.userId,
      },
    });

    await recordAuditLog({
      session,
      action: "NEWSLETTER_CAMPAIGN_SENT",
      entity: "NewsletterCampaign",
      entityId: campaign.id,
      metadata: {
        subject: campaign.subject,
        status: campaign.status,
        recipientCount: campaign.recipientCount,
        sentCount: campaign.sentCount,
      },
    });

    revalidatePath("/admin/newsletter");
    revalidatePath("/admin");

    if (!dispatch.configured) {
      return {
        success: true,
        campaign,
        message: `Campagne enregistrée en brouillon pour ${recipients.length} destinataire(s). Ajoutez RESEND_API_KEY dans .env pour activer l'envoi réel.`,
      };
    }

    return {
      success: status !== "FAILED",
      campaign,
      message:
        status === "SENT"
          ? `Campagne diffusée avec succès à ${dispatch.sentCount}/${recipients.length} destinataire(s) !`
          : status === "PARTIAL"
          ? `Envoi partiel : ${dispatch.sentCount} envoyé(s), ${dispatch.failedCount} échec(s).`
          : "Échec de l'envoi auprès du fournisseur d'e-mails.",
    };
  } catch (error) {
    return handleActionError(
      "actions.newsletter.sendCampaign",
      error,
      "Une erreur est survenue lors de la diffusion de la campagne."
    );
  }
}
