"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { registerSchema, type RegisterInput } from "@/zodSchema/auth";
import { registerAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ── Indicateur de force du mot de passe ───────────────────────────── */
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8 caractères minimum", ok: password.length >= 8 },
    { label: "Une majuscule (A-Z)", ok: /[A-Z]/.test(password) },
    { label: "Une minuscule (a-z)", ok: /[a-z]/.test(password) },
    { label: "Un chiffre (0-9)", ok: /\d/.test(password) },
    {
      label: "Caractère spécial (@$!%*?&)",
      ok: /[@$!%*?&]/.test(password),
    },
  ];

  const score = checks.filter((c) => c.ok).length;
  const strengthLabel =
    score <= 1
      ? "Très faible"
      : score === 2
        ? "Faible"
        : score === 3
          ? "Moyen"
          : score === 4
            ? "Fort"
            : "Très fort";
  const strengthColor =
    score <= 1
      ? "bg-red-500"
      : score === 2
        ? "bg-orange-500"
        : score === 3
          ? "bg-yellow-500"
          : score === 4
            ? "bg-emerald-500"
            : "bg-green-400";

  if (!password) return null;

  return (
    <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
      {/* Barre de force */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              strengthColor
            )}
            style={{ width: `${(score / 5) * 100}%` }}
          />
        </div>
        <span className="text-xs text-white/50 shrink-0">{strengthLabel}</span>
      </div>

      {/* Critères */}
      <ul className="grid grid-cols-1 gap-0.5">
        {checks.map((c) => (
          <li
            key={c.label}
            className={cn(
              "flex items-center gap-1.5 text-xs transition-colors duration-200",
              c.ok ? "text-emerald-400" : "text-white/40"
            )}
          >
            {c.ok ? (
              <CheckCircle2 className="size-3 shrink-0" />
            ) : (
              <XCircle className="size-3 shrink-0" />
            )}
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Composant principal ──────────────────────────────────────── */
export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch("password") ?? "";

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);
    const result = await registerAction(data);
    if (!result.success) {
      setServerError(result.message);
    }
    // En cas de succès, registerAction redirige automatiquement
  };

  const isPending = isSubmitting;

  return (
    <div className="w-full space-y-6">
      {/* En-tête */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Rejoindre ACCEENT&nbsp;🌱
        </h1>
        <p className="text-white/60 text-sm">
          Créez votre espace et faites partie du changement
        </p>
      </div>

      {/* Bannière d'erreur serveur */}
      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
        aria-label="Formulaire d'inscription"
      >
        {/* Prénom & Nom */}
        <div className="grid grid-cols-2 gap-3">
          {/* Prénom */}
          <div className="space-y-1.5">
            <Label
              htmlFor="register-firstname"
              className="text-white/80 text-sm font-medium"
            >
              Prénom
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
              <Input
                id="register-firstname"
                type="text"
                autoComplete="given-name"
                placeholder="Marie"
                aria-invalid={!!errors.firstname}
                aria-describedby={
                  errors.firstname ? "register-firstname-error" : undefined
                }
                {...register("firstname")}
                className={cn(
                  "h-11 pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/30",
                  "focus-visible:border-[#b9939e] focus-visible:ring-[#b9939e]/20",
                  "transition-all duration-200",
                  errors.firstname && "border-red-400/60 ring-2 ring-red-400/20"
                )}
              />
            </div>
            {errors.firstname && (
              <p
                id="register-firstname-error"
                role="alert"
                className="flex items-center gap-1 text-xs text-red-400 animate-in fade-in slide-in-from-top-1 duration-200"
              >
                <span className="size-1 rounded-full bg-red-400 inline-block" />
                {errors.firstname.message}
              </p>
            )}
          </div>

          {/* Nom */}
          <div className="space-y-1.5">
            <Label
              htmlFor="register-lastname"
              className="text-white/80 text-sm font-medium"
            >
              Nom
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
              <Input
                id="register-lastname"
                type="text"
                autoComplete="family-name"
                placeholder="Dupont"
                aria-invalid={!!errors.lastname}
                aria-describedby={
                  errors.lastname ? "register-lastname-error" : undefined
                }
                {...register("lastname")}
                className={cn(
                  "h-11 pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/30",
                  "focus-visible:border-[#b9939e] focus-visible:ring-[#b9939e]/20",
                  "transition-all duration-200",
                  errors.lastname && "border-red-400/60 ring-2 ring-red-400/20"
                )}
              />
            </div>
            {errors.lastname && (
              <p
                id="register-lastname-error"
                role="alert"
                className="flex items-center gap-1 text-xs text-red-400 animate-in fade-in slide-in-from-top-1 duration-200"
              >
                <span className="size-1 rounded-full bg-red-400 inline-block" />
                {errors.lastname.message}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label
            htmlFor="register-email"
            className="text-white/80 text-sm font-medium"
          >
            Adresse e-mail
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
            <Input
              id="register-email"
              type="email"
              autoComplete="email"
              placeholder="vous@exemple.com"
              aria-invalid={!!errors.email}
              aria-describedby={
                errors.email ? "register-email-error" : undefined
              }
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
              id="register-email-error"
              role="alert"
              className="flex items-center gap-1.5 text-xs text-red-400 animate-in fade-in slide-in-from-top-1 duration-200"
            >
              <span className="size-1 rounded-full bg-red-400 inline-block" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Mot de passe */}
        <div className="space-y-1.5">
          <Label
            htmlFor="register-password"
            className="text-white/80 text-sm font-medium"
          >
            Mot de passe
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
            <Input
              id="register-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Créez un mot de passe fort"
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "register-password-error" : undefined
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

          {/* Indicateur de force */}
          <PasswordStrength password={passwordValue} />

          {errors.password && (
            <p
              id="register-password-error"
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
            "w-full mt-2 group relative overflow-hidden",
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
              Création du compte…
            </>
          ) : (
            <>
              Créer mon compte
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </form>

      {/* Lien vers la connexion */}
      <p className="text-center text-sm text-white/50">
        Déjà un compte ?{" "}
        <Link
          href="/auth/login"
          className="text-[#b9939e] hover:text-white font-medium transition-colors duration-200 underline-offset-4 hover:underline"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}
