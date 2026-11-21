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
  Phone,
  ArrowRight,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Accessibility,
} from "lucide-react";
import { registerSchema, type RegisterInput } from "@/validation/auth";
import { registerAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8 caractères minimum", ok: password.length >= 8 },
    { label: "Une majuscule (A-Z)", ok: /[A-Z]/.test(password) },
    { label: "Une minuscule (a-z)", ok: /[a-z]/.test(password) },
    { label: "Un chiffre (0-9)", ok: /\d/.test(password) },
    { label: "Caractère spécial (@$!%*?&)", ok: /[@$!%*?&]/.test(password) },
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
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-500", strengthColor)}
            style={{ width: `${(score / 5) * 100}%` }}
          />
        </div>
        <span className="text-xs text-white/50 shrink-0">{strengthLabel}</span>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-0.5">
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

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordPreview, setPasswordPreview] = useState("");
  const [sdhChoice, setSdhChoice] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      sexe: "HOMME",
      milieuResidence: "URBAIN",
      sdh: false,
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);
    const result = await registerAction(data);
    if (!result.success) {
      setServerError(result.message);
      if (result.fieldErrors) {
        for (const [key, msg] of Object.entries(result.fieldErrors)) {
          if (msg) {
            setError(key as keyof RegisterInput, { message: msg });
          }
        }
      }
    }
  };

  return (
    <div className="w-full space-y-5">
      <div className="space-y-1.5 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Rejoindre ACCEENT
        </h1>
        <p className="text-white/60 text-sm">
          Créez votre profil membre pour accéder aux programmes et événements
        </p>
      </div>

      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="register-firstname" className="text-white/80 text-xs font-semibold">
              Prénom *
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
              <Input
                id="register-firstname"
                type="text"
                autoComplete="given-name"
                placeholder="Awa"
                aria-invalid={!!errors.firstname}
                {...register("firstname")}
                className={cn(
                  "h-10 pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/30",
                  "focus-visible:border-[#b9939e] focus-visible:ring-[#b9939e]/20",
                  errors.firstname && "border-red-400/60 ring-2 ring-red-400/20"
                )}
              />
            </div>
            {errors.firstname && (
              <p role="alert" className="text-xs text-red-400">
                {errors.firstname.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="register-lastname" className="text-white/80 text-xs font-semibold">
              Nom *
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
              <Input
                id="register-lastname"
                type="text"
                autoComplete="family-name"
                placeholder="Diatta"
                aria-invalid={!!errors.lastname}
                {...register("lastname")}
                className={cn(
                  "h-10 pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/30",
                  "focus-visible:border-[#b9939e] focus-visible:ring-[#b9939e]/20",
                  errors.lastname && "border-red-400/60 ring-2 ring-red-400/20"
                )}
              />
            </div>
            {errors.lastname && (
              <p role="alert" className="text-xs text-red-400">
                {errors.lastname.message}
              </p>
            )}
          </div>
        </div>

        {/* Âge & Sexe */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="register-age" className="text-white/80 text-xs font-semibold">
              Âge *
            </Label>
            <Input
              id="register-age"
              type="number"
              min={10}
              max={120}
              step={1}
              placeholder="22"
              aria-invalid={!!errors.age}
              {...register("age", { valueAsNumber: true })}
              className={cn(
                "h-10 bg-white/10 border-white/20 text-white placeholder:text-white/30",
                "focus-visible:border-[#b9939e] focus-visible:ring-[#b9939e]/20",
                errors.age && "border-red-400/60 ring-2 ring-red-400/20"
              )}
            />
            {errors.age && (
              <p role="alert" className="text-xs text-red-400">
                {errors.age.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="register-sexe" className="text-white/80 text-xs font-semibold">
              Sexe *
            </Label>
            <select
              id="register-sexe"
              aria-invalid={!!errors.sexe}
              {...register("sexe")}
              className={cn(
                "w-full h-10 rounded-md px-3 bg-[#1d111b] border border-white/20 text-white text-sm outline-none focus:border-[#b9939e]",
                errors.sexe && "border-red-400/60 ring-2 ring-red-400/20"
              )}
            >
              <option value="HOMME">Homme</option>
              <option value="FEMME">Femme</option>
            </select>
            {errors.sexe && (
              <p role="alert" className="text-xs text-red-400">
                {errors.sexe.message}
              </p>
            )}
          </div>
        </div>

        {/* Milieu de résidence & Téléphone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="register-milieu" className="text-white/80 text-xs font-semibold">
              Milieu de résidence *
            </Label>
            <select
              id="register-milieu"
              aria-invalid={!!errors.milieuResidence}
              {...register("milieuResidence")}
              className={cn(
                "w-full h-10 rounded-md px-3 bg-[#1d111b] border border-white/20 text-white text-sm outline-none focus:border-[#b9939e]",
                errors.milieuResidence && "border-red-400/60 ring-2 ring-red-400/20"
              )}
            >
              <option value="URBAIN">Urbain</option>
              <option value="RURAL">Rural</option>
            </select>
            {errors.milieuResidence && (
              <p role="alert" className="text-xs text-red-400">
                {errors.milieuResidence.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="register-telephone" className="text-white/80 text-xs font-semibold">
              Téléphone (WhatsApp) *
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
              <Input
                id="register-telephone"
                type="tel"
                autoComplete="tel"
                placeholder="+221 77 123 45 67"
                aria-invalid={!!errors.telephone}
                {...register("telephone")}
                className={cn(
                  "h-10 pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/30",
                  "focus-visible:border-[#b9939e] focus-visible:ring-[#b9939e]/20",
                  errors.telephone && "border-red-400/60 ring-2 ring-red-400/20"
                )}
              />
            </div>
            {errors.telephone && (
              <p role="alert" className="text-xs text-red-400">
                {errors.telephone.message}
              </p>
            )}
          </div>
        </div>

        {/* SDH : Situation De Handicap */}
        <div className="space-y-1.5">
          <Label className="text-white/80 text-xs font-semibold flex items-center gap-1.5">
            <Accessibility className="size-3.5 text-[#b9939e]" />
            <span>Situation de Handicap (SDH) *</span>
          </Label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              aria-pressed={!sdhChoice}
              onClick={() => {
                setSdhChoice(false);
                setValue("sdh", false, { shouldValidate: true });
              }}
              className={cn(
                "h-10 rounded-lg border text-xs font-semibold transition-all cursor-pointer",
                !sdhChoice
                  ? "bg-[#836182] border-[#b9939e] text-white shadow-xs"
                  : "bg-white/5 border-white/15 text-white/70 hover:bg-white/10"
              )}
            >
              Non
            </button>
            <button
              type="button"
              aria-pressed={sdhChoice}
              onClick={() => {
                setSdhChoice(true);
                setValue("sdh", true, { shouldValidate: true });
              }}
              className={cn(
                "h-10 rounded-lg border text-xs font-semibold transition-all cursor-pointer",
                sdhChoice
                  ? "bg-[#836182] border-[#b9939e] text-white shadow-xs"
                  : "bg-white/5 border-white/15 text-white/70 hover:bg-white/10"
              )}
            >
              Oui
            </button>
          </div>
          {errors.sdh && (
            <p role="alert" className="text-xs text-red-400">
              {errors.sdh.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="register-email" className="text-white/80 text-xs font-semibold">
            Adresse e-mail *
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
            <Input
              id="register-email"
              type="email"
              autoComplete="email"
              placeholder="vous@exemple.com"
              aria-invalid={!!errors.email}
              {...register("email")}
              className={cn(
                "h-10 pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/30",
                "focus-visible:border-[#b9939e] focus-visible:ring-[#b9939e]/20",
                errors.email && "border-red-400/60 ring-2 ring-red-400/20"
              )}
            />
          </div>
          {errors.email && (
            <p role="alert" className="text-xs text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Mot de passe */}
        <div className="space-y-1.5">
          <Label htmlFor="register-password" className="text-white/80 text-xs font-semibold">
            Mot de passe *
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
            <Input
              id="register-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Créez un mot de passe fort"
              aria-invalid={!!errors.password}
              {...register("password", {
                onChange: (e) => setPasswordPreview(e.target.value),
              })}
              className={cn(
                "h-10 pl-10 pr-11 bg-white/10 border-white/20 text-white placeholder:text-white/30",
                "focus-visible:border-[#b9939e] focus-visible:ring-[#b9939e]/20",
                errors.password && "border-red-400/60 ring-2 ring-red-400/20"
              )}
            />
            <button
              type="button"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>

          <PasswordStrength password={passwordPreview} />

          {errors.password && (
            <p role="alert" className="text-xs text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          size="xl"
          className={cn(
            "w-full mt-2 group relative overflow-hidden",
            "bg-gradient-to-r from-[#836182] to-[#b9939e]",
            "hover:from-[#9a7396] hover:to-[#c9a3ae]",
            "text-white font-semibold tracking-wide shadow-lg shadow-[#836182]/30"
          )}
        >
          {isSubmitting ? (
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

      <p className="text-center text-sm text-white/50">
        Déjà un compte ?{" "}
        <Link
          href="/auth/login"
          className="text-[#b9939e] hover:text-white font-medium underline-offset-4 hover:underline"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}
