import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logger, recordAuditLog } from "@/lib/core";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function syncVerifiedUserProfile(user: { id: string; email?: string | null }) {
  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, role: true, emailVerifiedAt: true },
    });

    if (!dbUser) return;

    const normalizedEmail = user.email?.trim().toLowerCase();
    const needsEmailSync = Boolean(
      normalizedEmail && normalizedEmail !== dbUser.email.toLowerCase()
    );
    const wasUnverified = !dbUser.emailVerifiedAt;

    if (wasUnverified || needsEmailSync) {
      const updated = await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          ...(wasUnverified ? { emailVerifiedAt: new Date() } : {}),
          ...(needsEmailSync && normalizedEmail ? { email: normalizedEmail } : {}),
        },
        select: { email: true },
      });

      if (wasUnverified) {
        await recordAuditLog({
          actorId: dbUser.id,
          actorEmail: updated.email,
          actorRole: dbUser.role,
          action: "AUTH_EMAIL_VERIFIED",
          entity: "User",
          entityId: dbUser.id,
        });
      }
    }
  } catch (error) {
    logger.error("auth.confirm", "Impossible de synchroniser emailVerifiedAt", error);
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const errorParam = searchParams.get("error");
  const errorCode = searchParams.get("error_code");
  const errorDescription = searchParams.get("error_description") || "";

  const loginUrl = new URL("/auth/login", request.url);

  if (errorParam || errorCode) {
    const isExpired =
      errorCode === "otp_expired" || /expired/i.test(errorDescription);
    loginUrl.searchParams.set("verifyError", isExpired ? "expired" : "invalid");
    return NextResponse.redirect(loginUrl);
  }

  try {
    const supabase = await createSupabaseServerClient();

    if (tokenHash && type) {
      const { data, error } = await supabase.auth.verifyOtp({
        type,
        token_hash: tokenHash,
      });

      if (error) {
        logger.warn("auth.confirm", "Échec verifyOtp Supabase", {
          code: error.code,
          message: error.message,
        });
        const isExpired =
          error.code === "otp_expired" || /expired/i.test(error.message);
        loginUrl.searchParams.set("verifyError", isExpired ? "expired" : "invalid");
        return NextResponse.redirect(loginUrl);
      }

      const isRecovery =
        type === "recovery" || next === "/auth/reset-password";

      if (isRecovery) {
        return NextResponse.redirect(
          new URL("/auth/reset-password", request.url)
        );
      }

      if (data.user) {
        await syncVerifiedUserProfile(data.user);
      }

      await supabase.auth.signOut();
      loginUrl.searchParams.set("verified", "true");
      return NextResponse.redirect(loginUrl);
    }

    if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      const isRecovery = next === "/auth/reset-password";

      if (error) {
        logger.warn("auth.confirm", "Échec exchangeCodeForSession Supabase", {
          code: error.code,
          message: error.message,
        });

        // Si le lien est ouvert sur un autre appareil sans code_verifier PKCE local,
        // Supabase Auth a déjà confirmé l'e-mail sur le serveur avant la redirection avec ?code=.
        if (!isRecovery && /code verifier/i.test(error.message)) {
          loginUrl.searchParams.set("verified", "true");
          return NextResponse.redirect(loginUrl);
        }

        const isExpired =
          error.code === "otp_expired" || /expired/i.test(error.message);
        loginUrl.searchParams.set("verifyError", isExpired ? "expired" : "invalid");
        return NextResponse.redirect(loginUrl);
      }

      if (isRecovery) {
        return NextResponse.redirect(
          new URL("/auth/reset-password", request.url)
        );
      }

      if (data.user) {
        await syncVerifiedUserProfile(data.user);
      }

      await supabase.auth.signOut();
      loginUrl.searchParams.set("verified", "true");
      return NextResponse.redirect(loginUrl);
    }
  } catch (error) {
    logger.error("auth.confirm", "Erreur inattendue lors de la confirmation Supabase", error);
  }

  loginUrl.searchParams.set("verifyError", "invalid");
  return NextResponse.redirect(loginUrl);
}
