"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { loginSchema, type LoginInput } from "@/zodSchema/auth";
import { loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? undefined;
  const isJustRegistered = searchParams.get("registered") === "true";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    const result = await loginAction(data, callbackUrl);
    if (!result.success) {
      setServerError(result.message);
    }
  };

  const isPending = isSubmitting;

  return (
    <div className="w-full space-y-6">
      {/* En-tête du formulaire */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Bon retour&nbsp;👋
        </h1>
        <p className="text-white/60 text-sm">
          Connectez-vous à votre espace ACCEENT
        </p>
      </div>

      {/* Bannière de confirmation d'inscription réussie */}
      {isJustRegistered && !serverError && (
        <div
          role="status"
          className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
          <span>Votre compte a été créé avec succès ! Connectez-vous ci-dessous.</span>
        </div>
      )}

      {/* Bannière d'erreur serveur */}
      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        noValidate
        aria-label="Formulaire de connexion"
      >
        {/* Champ Email */}
        <div className="space-y-1.5">
          <Label
            htmlFor="login-email"
            className="text-white/80 text-sm font-medium"
          >
            Adresse e-mail
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="vous@exemple.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              {...register("email")}
              className={cn(
                "h-11 pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/30",
                "focus-visible:border-[#b9939e] focus-visible:ring-[#b9939e]/20",
                "transition-all duration-200",
                errors.email && "border-red-400/60 ring-2 ring-red-400/20"
              )}
            />
          </div>
          {errors.email && (
            <p
              id="login-email-error"
              role="alert"
              className="flex items-center gap-1.5 text-xs text-red-400 animate-in fade-in slide-in-from-top-1 duration-200"
            >
              <span className="size-1 rounded-full bg-red-400 inline-block" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Champ Mot de passe */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="login-password"
              className="text-white/80 text-sm font-medium"
            >
              Mot de passe
            </Label>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-[#b9939e] hover:text-white transition-colors duration-200 underline-offset-4 hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
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
                "h-11 pl-10 pr-11 bg-white/10 border-white/20 text-white placeholder:text-white/30",
                "focus-visible:border-[#b9939e] focus-visible:ring-[#b9939e]/20",
                "transition-all duration-200",
                errors.password && "border-red-400/60 ring-2 ring-red-400/20"
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
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b9939e]/50 rounded"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p
              id="login-password-error"
              role="alert"
              className="flex items-center gap-1.5 text-xs text-red-400 animate-in fade-in slide-in-from-top-1 duration-200"
            >
              <span className="size-1 rounded-full bg-red-400 inline-block" />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Bouton de soumission */}
        <Button
          type="submit"
          disabled={isPending}
          size="xl"
          className={cn(
            "w-full group relative overflow-hidden",
            "bg-gradient-to-r from-[#836182] to-[#b9939e]",
            "hover:from-[#9a7396] hover:to-[#c9a3ae]",
            "text-white font-semibold tracking-wide",
            "shadow-lg shadow-[#836182]/30",
            "transition-all duration-300",
            "focus-visible:ring-[#b9939e]/50"
          )}
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Connexion en cours…
            </>
          ) : (
            <>
              Se connecter
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </form>

      {/* Lien vers l'inscription */}
      <p className="text-center text-sm text-white/50">
        Pas encore de compte ?{" "}
        <Link
          href="/auth/register"
          className="text-[#b9939e] hover:text-white font-medium transition-colors duration-200 underline-offset-4 hover:underline"
        >
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
