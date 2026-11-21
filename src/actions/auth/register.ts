"use server";

import { redirect } from "next/navigation";
import { registerSchema, type RegisterInput } from "@/validation/auth";
import prisma from "@/lib/prisma";
import type { MilieuResidence, Sexe } from "@/generated/prisma/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  checkDistributedRateLimit,
  getClientIp,
  getRequestOrigin,
  logger,
  recordAuditLog,
} from "@/lib/core";

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
  const rate = await checkDistributedRateLimit(`register:${ip}`, {
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
    acceptCgu,
  } = parsed.data;

  let registeredEmail = email;

  try {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { telephone }] },
      select: { id: true, email: true, telephone: true },
    });

    if (existing) {
      if (existing.email === email) {
        return {
          success: false,
          message: "Un compte existe déjà avec cette adresse e-mail.",
          fieldErrors: {
            email: "Cette adresse e-mail est déjà utilisée.",
          },
        };
      }
      return {
        success: false,
        message: "Un compte existe déjà avec ce numéro de téléphone.",
        fieldErrors: {
          telephone: "Ce numéro de téléphone est déjà utilisé.",
        },
      };
    }

    const origin = await getRequestOrigin();
    const supabase = await createSupabaseServerClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/confirm`,
        data: { firstname, lastname },
      },
    });

    if (authError) {
      logger.warn("auth.register", "Erreur Supabase Auth lors de l'inscription", {
        name: authError.name,
        status: authError.status,
        code: authError.code,
        message: authError.message,
      });

      if (
        authError.code === "user_already_exists" ||
        /already registered|already been registered/i.test(authError.message)
      ) {
        return {
          success: false,
          message: "Un compte existe déjà avec cette adresse e-mail.",
          fieldErrors: {
            email: "Cette adresse e-mail est déjà utilisée.",
          },
        };
      }

      if (authError.code === "weak_password") {
        return {
          success: false,
          message: "Le mot de passe ne respecte pas les exigences de sécurité.",
          fieldErrors: {
            password:
              "Choisissez un mot de passe plus robuste (8+ caractères, majuscule, minuscule, chiffre et caractère spécial).",
          },
        };
      }

      if (authError.code === "over_email_send_rate_limit") {
        return {
          success: false,
          message:
            "Trop d'e-mails envoyés récemment. Veuillez patienter quelques instants avant de réessayer.",
        };
      }

      return {
        success: false,
        message: "Impossible de finaliser l'inscription pour le moment. Veuillez réessayer.",
      };
    }

    // Quand "Confirm email" est actif, Supabase renvoie un user sans identité si l'e-mail existe déjà dans auth.users
    if (
      !authData.user ||
      (authData.user.identities && authData.user.identities.length === 0)
    ) {
      return {
        success: false,
        message: "Un compte existe déjà avec cette adresse e-mail.",
        fieldErrors: {
          email: "Cette adresse e-mail est déjà utilisée.",
        },
      };
    }

    const created = await prisma.user.create({
      data: {
        id: authData.user.id,
        firstname,
        lastname,
        email,
        password: null,
        role: "USER",
        age,
        sexe: sexe as Sexe,
        milieuResidence: milieuResidence as MilieuResidence,
        telephone,
        sdh,
        emailVerifiedAt: authData.user.email_confirmed_at
          ? new Date(authData.user.email_confirmed_at)
          : null,
      },
      select: { id: true, email: true, role: true },
    });

    registeredEmail = created.email;

    if (authData.session) {
      await supabase.auth.signOut();
    }

    await recordAuditLog({
      actorId: created.id,
      actorEmail: created.email,
      actorRole: created.role,
      action: "AUTH_REGISTER",
      entity: "User",
      entityId: created.id,
      metadata: {
        sexe,
        milieuResidence,
        sdh,
        acceptedCgu: acceptCgu,
        provider: "supabase_auth",
      },
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: unknown }).code === "P2002"
    ) {
      const targetStr = JSON.stringify((error as { meta?: unknown }).meta ?? "");
      if (targetStr.includes("telephone")) {
        return {
          success: false,
          message: "Un compte existe déjà avec ce numéro de téléphone.",
          fieldErrors: {
            telephone: "Ce numéro de téléphone est déjà utilisé.",
          },
        };
      }
      return {
        success: false,
        message: "Un compte existe déjà avec cette adresse e-mail.",
        fieldErrors: {
          email: "Cette adresse e-mail est déjà utilisée.",
        },
      };
    }

    logger.error("auth.register", "Erreur lors de l'inscription", error);
    return {
      success: false,
      message: "Une erreur inattendue s'est produite. Veuillez réessayer.",
    };
  }

  redirect(`/auth/login?registered=verify&email=${encodeURIComponent(registeredEmail)}`);
}
