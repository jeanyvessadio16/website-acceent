"use server";

import { redirect } from "next/navigation";
import { loginSchema, type LoginInput } from "@/validation/auth";
import prisma from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkDistributedRateLimit, getClientIp, logger, recordAuditLog } from "@/lib/core";

export interface LoginActionResult {
  success: boolean;
  message: string;
  code?: "EMAIL_NOT_VERIFIED";
  unverifiedEmail?: string;
  fieldErrors?: Partial<Record<keyof LoginInput, string>>;
}

export async function loginAction(
  data: LoginInput,
  callbackUrl?: string
): Promise<LoginActionResult> {
  const parsed = loginSchema.safeParse(data);

  if (!parsed.success) {
    const fieldErrors: LoginActionResult["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof LoginInput;
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

  const { email, password } = parsed.data;
  const ip = await getClientIp();
  const rate = await checkDistributedRateLimit(`login:${ip}:${email}`, {
    limit: 10,
    windowMs: 15 * 60 * 1000,
  });

  if (!rate.allowed) {
    logger.warn("auth.login", "Tentatives de connexion excessives bloquées", { ip, email });
    return {
      success: false,
      message: `Trop de tentatives de connexion. Réessayez dans ${Math.ceil(
        rate.retryAfterSec / 60
      )} minute(s).`,
    };
  }

  const INVALID_CREDENTIALS_MSG =
    "E-mail ou mot de passe incorrect. Vérifiez vos informations.";

  let userRole: string = "USER";

  try {
    const supabase = await createSupabaseServerClient();
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      const isUnconfirmed =
        authError.code === "email_not_confirmed" ||
        /email not confirmed/i.test(authError.message);

      if (isUnconfirmed) {
        logger.warn("auth.login", "Connexion bloquée : e-mail non confirmé", {
          ip,
          email,
        });
        return {
          success: false,
          code: "EMAIL_NOT_VERIFIED",
          unverifiedEmail: email,
          message:
            "Votre adresse e-mail n'est pas encore confirmée. Vérifiez votre boîte de réception ou demandez un nouveau lien ci-dessous.",
        };
      }

      logger.warn("auth.login", "Échec d'authentification Supabase", {
        ip,
        code: authError.code,
      });
      return { success: false, message: INVALID_CREDENTIALS_MSG };
    }

    const authUser = authData.user;
    if (!authUser) {
      return { success: false, message: INVALID_CREDENTIALS_MSG };
    }

    if (!authUser.email_confirmed_at) {
      await supabase.auth.signOut();
      return {
        success: false,
        code: "EMAIL_NOT_VERIFIED",
        unverifiedEmail: email,
        message:
          "Votre adresse e-mail n'est pas encore confirmée. Vérifiez votre boîte de réception ou demandez un nouveau lien ci-dessous.",
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        email: true,
        role: true,
        emailVerifiedAt: true,
      },
    });

    if (!user) {
      await supabase.auth.signOut();
      return { success: false, message: INVALID_CREDENTIALS_MSG };
    }

    const confirmedEmail = authUser.email?.trim().toLowerCase();
    const shouldSyncEmail = Boolean(
      confirmedEmail && confirmedEmail !== user.email.toLowerCase()
    );

    if (!user.emailVerifiedAt || shouldSyncEmail) {
      try {
        const updated = await prisma.user.update({
          where: { id: user.id },
          data: {
            ...(!user.emailVerifiedAt
              ? { emailVerifiedAt: new Date(authUser.email_confirmed_at) }
              : {}),
            ...(shouldSyncEmail && confirmedEmail ? { email: confirmedEmail } : {}),
          },
          select: { email: true },
        });
        user.email = updated.email;
      } catch (syncError) {
        logger.warn("auth.login", "Impossible de synchroniser l'e-mail confirmé", {
          userId: user.id,
          error: syncError instanceof Error ? syncError.message : String(syncError),
        });
      }
    }

    userRole = user.role;

    await recordAuditLog({
      actorId: user.id,
      actorEmail: user.email,
      actorRole: user.role,
      action: "AUTH_LOGIN_SUCCESS",
      entity: "User",
      entityId: user.id,
    });
  } catch (error) {
    logger.error("auth.login", "Erreur inattendue lors de la connexion", error);
    return {
      success: false,
      message: "Une erreur inattendue s'est produite. Veuillez réessayer.",
    };
  }

  const defaultTarget =
    userRole === "ADMIN" || userRole === "AUTHOR" ? "/admin" : "/dashboard";
  const safeRedirect =
    callbackUrl && callbackUrl.startsWith("/") && !/^\/[\\/]/.test(callbackUrl)
      ? callbackUrl
      : defaultTarget;
  redirect(safeRedirect);
}
