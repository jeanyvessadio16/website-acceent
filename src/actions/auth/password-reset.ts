"use server";

import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/services/emailService";
import { checkRateLimit, getClientIp, logger, recordAuditLog } from "@/lib/core";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from "@/validation/auth";

function hashToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://acceent.org").replace(/\/$/, "");
}

export async function requestPasswordResetAction(data: ForgotPasswordInput) {
  const parsed = forgotPasswordSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Adresse e-mail invalide.",
    };
  }

  const ip = await getClientIp();
  const rate = checkRateLimit(`pwd-reset:${ip}:${parsed.data.email}`, {
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
    "Si un compte est associé à cette adresse e-mail, un lien de réinitialisation vient d'être envoyé (valable 60 minutes).";

  try {
    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true, email: true, firstname: true, role: true },
    });

    if (!user) {
      return { success: true, message: genericMessage };
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.$transaction([
      prisma.passwordResetToken.deleteMany({
        where: { userId: user.id, usedAt: null },
      }),
      prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
        },
      }),
    ]);

    const resetUrl = `${getSiteUrl()}/auth/reset-password?token=${rawToken}`;
    await sendPasswordResetEmail(user.email, user.firstname, resetUrl);

    await recordAuditLog({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action: "PASSWORD_RESET_REQUESTED",
      entity: "User",
      entityId: user.id,
    });

    return { success: true, message: genericMessage };
  } catch (error) {
    logger.error("auth.passwordReset", "Erreur lors de la demande de réinitialisation", error);
    return {
      success: false,
      message: "Une erreur est survenue. Veuillez réessayer dans quelques instants.",
    };
  }
}

export async function validateResetTokenAction(token: string) {
  if (!token || token.trim().length < 10) {
    return { valid: false, message: "Lien de réinitialisation invalide." };
  }

  try {
    const tokenHash = hashToken(token.trim());
    const record = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      select: { id: true, expiresAt: true, usedAt: true },
    });

    if (!record) {
      return { valid: false, message: "Ce lien de réinitialisation est introuvable." };
    }
    if (record.usedAt) {
      return { valid: false, message: "Ce lien de réinitialisation a déjà été utilisé." };
    }
    if (record.expiresAt < new Date()) {
      return { valid: false, message: "Ce lien de réinitialisation a expiré." };
    }

    return { valid: true };
  } catch (error) {
    logger.error("auth.validateResetToken", "Impossible de vérifier le jeton", error);
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

  const { token, password } = parsed.data;
  const tokenHash = hashToken(token.trim());

  try {
    const record = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        userId: true,
        expiresAt: true,
        usedAt: true,
        user: { select: { email: true, role: true } },
      },
    });

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      return {
        success: false,
        message: "Ce lien de réinitialisation est invalide ou expiré. Veuillez en demander un nouveau.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
    ]);

    await recordAuditLog({
      actorId: record.userId,
      actorEmail: record.user.email,
      actorRole: record.user.role,
      action: "PASSWORD_RESET_COMPLETED",
      entity: "User",
      entityId: record.userId,
    });

    return {
      success: true,
      message: "Votre mot de passe a été mis à jour avec succès ! Vous pouvez maintenant vous connecter.",
    };
  } catch (error) {
    logger.error("auth.resetPassword", "Erreur lors de la mise à jour du mot de passe", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la mise à jour du mot de passe.",
    };
  }
}
