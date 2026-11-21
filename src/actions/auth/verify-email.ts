"use server";

import prisma from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  checkDistributedRateLimit,
  getClientIp,
  getRequestOrigin,
  logger,
  recordAuditLog,
} from "@/lib/core";
import { forgotPasswordSchema } from "@/validation/auth";

export async function resendVerificationEmailAction(email: string): Promise<{
  success: boolean;
  message: string;
}> {
  const parsed = forgotPasswordSchema.safeParse({ email });
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Adresse e-mail invalide.",
    };
  }

  const normalizedEmail = parsed.data.email;
  const ip = await getClientIp();
  const rate = await checkDistributedRateLimit(`verify-resend:${ip}:${normalizedEmail}`, {
    limit: 3,
    windowMs: 15 * 60 * 1000,
  });

  if (!rate.allowed) {
    logger.warn("auth.verifyEmail", "Trop de renvois de confirmation demandés", {
      ip,
      email: normalizedEmail,
    });
    return {
      success: false,
      message: `Trop de demandes récentes. Réessayez dans ${Math.ceil(
        rate.retryAfterSec / 60
      )} minute(s).`,
    };
  }

  const genericMessage =
    "Si un compte non confirmé correspond à cette adresse e-mail, un nouveau lien de confirmation vient d'être envoyé via Supabase Auth.";

  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        role: true,
        emailVerifiedAt: true,
      },
    });

    if (!user || user.emailVerifiedAt) {
      return { success: true, message: genericMessage };
    }

    const origin = await getRequestOrigin();
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: normalizedEmail,
      options: {
        emailRedirectTo: `${origin}/auth/confirm`,
      },
    });

    if (error) {
      logger.warn("auth.verifyEmail", "Erreur resend Supabase Auth", {
        code: error.code,
        message: error.message,
      });
      if (error.code === "over_email_send_rate_limit") {
        return {
          success: false,
          message: "Veuillez patienter quelques instants avant de redemander un e-mail.",
        };
      }
      return {
        success: false,
        message: "Impossible de renvoyer l'e-mail de confirmation pour le moment.",
      };
    }

    await recordAuditLog({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action: "AUTH_VERIFICATION_RESENT",
      entity: "User",
      entityId: user.id,
    });

    return { success: true, message: genericMessage };
  } catch (error) {
    logger.error("auth.verifyEmail", "Erreur lors du renvoi d'e-mail de confirmation", error);
    return {
      success: false,
      message: "Impossible d'envoyer l'e-mail de confirmation pour le moment.",
    };
  }
}
