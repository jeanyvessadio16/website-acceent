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
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from "@/validation/auth";

export async function requestPasswordResetAction(data: ForgotPasswordInput) {
  const parsed = forgotPasswordSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Adresse e-mail invalide.",
    };
  }

  const ip = await getClientIp();
  const rate = await checkDistributedRateLimit(`pwd-reset:${ip}:${parsed.data.email}`, {
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });

  if (!rate.allowed) {
    logger.warn("auth.passwordReset", "Trop de demandes de réinitialisation", {
      ip,
      email: parsed.data.email,
    });
    return {
      success: false,
      message: `Trop de demandes récentes. Veuillez patienter ${Math.ceil(
        rate.retryAfterSec / 60
      )} minute(s).`,
    };
  }

  const genericMessage =
    "Si un compte est associé à cette adresse e-mail, un lien de réinitialisation vient d'être envoyé.";

  try {
    const origin = await getRequestOrigin();
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.auth.resetPasswordForEmail(
      parsed.data.email,
      {
        redirectTo: `${origin}/auth/confirm?next=/auth/reset-password`,
      }
    );

    if (error) {
      logger.warn("auth.passwordReset", "Erreur resetPasswordForEmail Supabase", {
        code: error.code,
        message: error.message,
      });
    } else {
      const dbUser = await prisma.user.findUnique({
        where: { email: parsed.data.email },
        select: { id: true, email: true, role: true },
      });
      if (dbUser) {
        await recordAuditLog({
          actorId: dbUser.id,
          actorEmail: dbUser.email,
          actorRole: dbUser.role,
          action: "PASSWORD_RESET_REQUESTED",
          entity: "User",
          entityId: dbUser.id,
        });
      }
    }

    return { success: true, message: genericMessage };
  } catch (error) {
    logger.error(
      "auth.passwordReset",
      "Erreur lors de la demande de réinitialisation",
      error
    );
    return {
      success: false,
      message: "Une erreur est survenue. Veuillez réessayer dans quelques instants.",
    };
  }
}

export async function validateResetTokenAction() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        valid: false,
        message: "Ce lien de réinitialisation est invalide ou expiré.",
      };
    }

    return { valid: true };
  } catch (error) {
    logger.error("auth.validateResetToken", "Impossible de vérifier la session de réinitialisation", error);
    return { valid: false, message: "Impossible de vérifier ce lien." };
  }
}

export async function resetPasswordAction(data: ResetPasswordInput) {
  const parsed = resetPasswordSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Données invalides.",
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: sessionError,
    } = await supabase.auth.getUser();

    if (sessionError || !user) {
      return {
        success: false,
        message:
          "Votre lien de réinitialisation est invalide ou a expiré. Veuillez en demander un nouveau.",
      };
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: parsed.data.password,
    });

    if (updateError) {
      logger.warn("auth.resetPassword", "Échec updateUser Supabase", {
        code: updateError.code,
        message: updateError.message,
      });
      return {
        success: false,
        message: "Impossible de mettre à jour le mot de passe. Veuillez réessayer.",
      };
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, role: true },
    });

    if (dbUser) {
      await recordAuditLog({
        actorId: dbUser.id,
        actorEmail: dbUser.email,
        actorRole: dbUser.role,
        action: "PASSWORD_RESET_COMPLETED",
        entity: "User",
        entityId: dbUser.id,
      });
    }

    await supabase.auth.signOut();

    return {
      success: true,
      message:
        "Votre mot de passe a été mis à jour avec succès ! Vous pouvez maintenant vous connecter.",
    };
  } catch (error) {
    logger.error(
      "auth.resetPassword",
      "Erreur lors de la mise à jour du mot de passe",
      error
    );
    return {
      success: false,
      message: "Une erreur est survenue lors de la mise à jour du mot de passe.",
    };
  }
}
