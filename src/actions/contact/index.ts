"use server";

import { checkDistributedRateLimit, getClientIp, logger } from "@/lib/core";
import { ContactService, type ContactServiceResult } from "@/services/contactService";
import { contactSchema, type ContactFormData } from "@/validation/contact";

export async function submitContactAction(
  data: ContactFormData,
  meta?: { formLoadedAt?: number }
): Promise<ContactServiceResult> {
  if (data?.botcheck === true) {
    const ip = await getClientIp();
    logger.warn("contact.submit", "Soumission bloquée par honeypot botcheck", { ip });
    return {
      success: false,
      message: "Envoi refusé.",
    };
  }

  if (
    typeof meta?.formLoadedAt === "number" &&
    Number.isFinite(meta.formLoadedAt) &&
    Date.now() - meta.formLoadedAt < 1500
  ) {
    const ip = await getClientIp();
    logger.warn("contact.submit", "Soumission trop rapide suspecte bloquée", { ip });
    return {
      success: false,
      message: "Envoi trop rapide détecté. Veuillez patienter un instant et réessayer.",
    };
  }

  const ip = await getClientIp();
  const rate = await checkDistributedRateLimit(`contact:${ip}`, {
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });

  if (!rate.allowed) {
    logger.warn("contact.submit", "Limite de messages de contact dépassée", { ip });
    return {
      success: false,
      message: `Trop de messages envoyés récemment. Réessayez dans ${Math.ceil(
        rate.retryAfterSec / 60
      )} minute(s).`,
    };
  }

  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Veuillez vérifier les champs du formulaire.",
    };
  }

  return ContactService.submitContactForm(parsed.data);
}
