"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { registerSchema, type RegisterInput } from "@/validation/auth";
import prisma from "@/lib/prisma";
import type { MilieuResidence, Sexe } from "@/generated/prisma/client";
import { checkRateLimit, getClientIp, logger, recordAuditLog } from "@/lib/core";

export interface RegisterActionResult {
  success: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof RegisterInput, string>>;
}

export async function registerAction(
  data: RegisterInput
): Promise<RegisterActionResult> {
  const parsed = registerSchema.safeParse(data);

  if (!parsed.success) {
    const fieldErrors: RegisterActionResult["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof RegisterInput;
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }
    return {
      success: false,
      message: "Veuillez corriger les erreurs dans le formulaire.",
      fieldErrors,
    };
  }

  const ip = await getClientIp();
  const rate = checkRateLimit(`register:${ip}`, {
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });

  if (!rate.allowed) {
    logger.warn("auth.register", "Limite d'inscriptions atteinte", { ip });
    return {
      success: false,
      message:
        "Trop de créations de comptes depuis cette adresse. Veuillez patienter avant de réessayer.",
    };
  }

  const {
    firstname,
    lastname,
    email,
    password,
    age,
    sexe,
    milieuResidence,
    telephone,
    sdh,
  } = parsed.data;

  try {
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existing) {
      return {
        success: false,
        message: "Un compte existe déjà avec cette adresse e-mail.",
        fieldErrors: {
          email: "Cette adresse e-mail est déjà utilisée.",
        },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const created = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashedPassword,
        role: "USER",
        age,
        sexe: sexe as Sexe,
        milieuResidence: milieuResidence as MilieuResidence,
        telephone,
        sdh,
      },
      select: { id: true, email: true, role: true },
    });

    await recordAuditLog({
      actorId: created.id,
      actorEmail: created.email,
      actorRole: created.role,
      action: "AUTH_REGISTER",
      entity: "User",
      entityId: created.id,
      metadata: { sexe, milieuResidence, sdh },
    });
  } catch (error) {
    logger.error("auth.register", "Erreur lors de l'inscription", error);
    return {
      success: false,
      message: "Une erreur inattendue s'est produite. Veuillez réessayer.",
    };
  }

  redirect("/auth/login?registered=true");
}
