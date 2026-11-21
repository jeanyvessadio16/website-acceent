"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, Send } from "lucide-react";
import { loginSchema, type LoginInput } from "@/validation/auth";
import { loginAction, resendVerificationEmailAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  AUTH_FIELD_ERROR_CLASS,
  AUTH_INPUT_CLASS,
  AuthAlert,
  AuthFieldError,
  AuthTabs,
} from "./AuthShared";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? undefined;
  const registered = searchParams.get("registered");
  const registeredEmail = searchParams.get("email");
  const verified = searchParams.get("verified");
  const verifyError = searchParams.get("verifyError");
  const isPasswordReset = searchParams.get("reset") === "success";

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [resendTargetEmail, setResendTargetEmail] = useState<string | null>(
    registered === "verify" && registeredEmail ? registeredEmail : null
  );
  const [resending, setResending] = useState(false);
  const [resendFeedback, setResendFeedback] = useState<{
    variant: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: registered === "verify" && registeredEmail ? registeredEmail : "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    setResendFeedback(null);
    const result = await loginAction(data, callbackUrl);
    if (!result.success) {
      setServerError(result.message);
      if (result.code === "EMAIL_NOT_VERIFIED") {
        setResendTargetEmail(result.unverifiedEmail || data.email);
      }
    }
  };

  const handleResendVerification = async () => {
    const targetEmail = (resendTargetEmail || getValues("email") || "").trim();
    if (!targetEmail) {
      setResendFeedback({
        variant: "error",
        message: "Saisissez votre adresse e-mail ci-dessous pour renvoyer le lien.",
      });
      return;
    }

    setResending(true);
    setResendFeedback(null);
    const res = await resendVerificationEmailAction(targetEmail);
    setResending(false);
    setResendFeedback({
      variant: res.success ? "success" : "error",
      message: res.message,
    });
  };

  const showResendAction = Boolean(resendTargetEmail) || verifyError === "expired";

  return (
    <div className="w-full space-y-3.5">
      <AuthTabs />

      {/* En-tête du formulaire */}
      <div className="space-y-0.5 text-center">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Connexion à votre espace
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm">
          Accédez à vos programmes, candidatures et billets ACCEENT
        </p>
      </div>

      {/* Bannières d'état */}
      {verified === "true" && !serverError && (
        <AuthAlert
          variant="success"
          message="Adresse e-mail confirmée avec succès ! Vous pouvez maintenant vous connecter."
        />
      )}

      {verified === "already" && !serverError && (
        <AuthAlert
          variant="success"
          message="Votre adresse e-mail est déjà confirmée. Connectez-vous ci-dessous."
        />
      )}

      {registered === "verify" && !serverError && !verified && (
        <AuthAlert
          variant="success"
          message={`Compte créé ! Un lien de confirmation a été envoyé à ${
            registeredEmail || "votre adresse e-mail"
          }. Confirmez votre e-mail pour vous connecter.`}
        />
      )}

      {isPasswordReset && !serverError && (
        <AuthAlert
          variant="success"
          message="Mot de passe modifié avec succès ! Vous pouvez maintenant vous connecter."
        />
      )}

      {verifyError === "expired" && !serverError && (
        <AuthAlert
          variant="error"
          message="Ce lien de confirmation a expiré. Demandez un nouvel e-mail de confirmation ci-dessous."
        />
      )}

      {verifyError === "invalid" && !serverError && (
        <AuthAlert
          variant="error"
          message="Ce lien de confirmation est invalide ou introuvable."
        />
      )}

      {serverError && <AuthAlert variant="error" message={serverError} />}

      {resendFeedback && (
        <AuthAlert
          variant={resendFeedback.variant}
          message={resendFeedback.message}
        />
      )}

      {showResendAction && (
        <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
          <span className="text-slate-600 truncate">
            E-mail non reçu{resendTargetEmail ? ` (${resendTargetEmail})` : ""} ?
          </span>
          <button
            type="button"
            disabled={resending}
            onClick={handleResendVerification}
            className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-[#836182] hover:text-[#684b67] disabled:opacity-60 cursor-pointer"
          >
            {resending ? (
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
            ) : (
              <Send className="size-3.5" aria-hidden />
            )}
            <span>Renvoyer le lien</span>
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3"
        noValidate
        aria-label="Formulaire de connexion"
      >
        {/* Champ Email */}
        <div className="space-y-1">
          <Label
            htmlFor="login-email"
            className="text-slate-700 text-xs font-semibold"
          >
            Adresse e-mail
          </Label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none"
              aria-hidden
            />
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="vous@exemple.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              {...register("email")}
              className={cn(
                AUTH_INPUT_CLASS,
                "pl-9.5",
                errors.email && AUTH_FIELD_ERROR_CLASS
              )}
            />
          </div>
          <AuthFieldError id="login-email-error" message={errors.email?.message} />
        </div>

        {/* Champ Mot de passe */}
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <Label
              htmlFor="login-password"
              className="text-slate-700 text-xs font-semibold"
            >
              Mot de passe
            </Label>
            <Link
              href="/auth/forgot-password"
              className="text-xs font-semibold text-[#836182] hover:text-[#684b67] transition-colors underline-offset-4 hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none"
              aria-hidden
            />
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Votre mot de passe"
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "login-password-error" : undefined
              }
              {...register("password")}
              className={cn(
                AUTH_INPUT_CLASS,
                "pl-9.5 pr-10",
                errors.password && AUTH_FIELD_ERROR_CLASS
              )}
            />
            <button
              type="button"
              aria-label={
                showPassword
                  ? "Masquer le mot de passe"
                  : "Afficher le mot de passe"
              }
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#836182]/40 cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden />
              ) : (
                <Eye className="size-4" aria-hidden />
              )}
            </button>
          </div>
          <AuthFieldError
            id="login-password-error"
            message={errors.password?.message}
          />
        </div>

        {/* Bouton de soumission */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 mt-1 rounded-xl bg-[#836182] hover:bg-[#6f4f6e] text-white font-semibold shadow-md shadow-[#836182]/20 transition-all cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Connexion en cours…
            </>
          ) : (
            <>
              <span>Se connecter</span>
              <ArrowRight className="size-4" aria-hidden />
            </>
          )}
        </Button>
      </form>

      {/* Lien vers l'inscription */}
      <p className="text-center text-xs text-slate-500">
        Pas encore de compte ?{" "}
        <Link
          href="/auth/register"
          className="text-[#836182] hover:text-[#684b67] font-semibold transition-colors underline-offset-4 hover:underline"
        >
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
