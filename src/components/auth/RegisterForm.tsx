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
  ChevronDown,
} from "lucide-react";
import { registerSchema, type RegisterInput } from "@/validation/auth";
import { registerAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  AUTH_FIELD_ERROR_CLASS,
  AUTH_INPUT_CLASS,
  AUTH_SELECT_CLASS,
  AuthAlert,
  AuthFieldError,
  AuthTabs,
  PasswordStrength,
} from "./AuthShared";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordPreview, setPasswordPreview] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      sexe: "HOMME",
      milieuResidence: "URBAIN",
      sdh: false,
      acceptCgu: false,
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
    <div className="w-full space-y-3">
      <AuthTabs />

      <div className="space-y-0.5 text-center">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Créer votre compte membre
        </h1>
        <p className="text-slate-500 text-xs">
          Rejoignez les programmes et événements ACCEENT
        </p>
      </div>

      {serverError && <AuthAlert variant="error" message={serverError} />}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-2.5"
        noValidate
        aria-label="Formulaire d'inscription"
      >
        {/* Ligne 1 : Prénom & Nom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="space-y-1">
            <Label htmlFor="register-firstname" className="text-slate-700 text-xs font-semibold">
              Prénom *
            </Label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none"
                aria-hidden
              />
              <Input
                id="register-firstname"
                type="text"
                autoComplete="given-name"
                placeholder="Awa"
                aria-invalid={!!errors.firstname}
                {...register("firstname")}
                className={cn(
                  AUTH_INPUT_CLASS,
                  "pl-9.5",
                  errors.firstname && AUTH_FIELD_ERROR_CLASS
                )}
              />
            </div>
            <AuthFieldError message={errors.firstname?.message} />
          </div>

          <div className="space-y-1">
            <Label htmlFor="register-lastname" className="text-slate-700 text-xs font-semibold">
              Nom *
            </Label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none"
                aria-hidden
              />
              <Input
                id="register-lastname"
                type="text"
                autoComplete="family-name"
                placeholder="Diatta"
                aria-invalid={!!errors.lastname}
                {...register("lastname")}
                className={cn(
                  AUTH_INPUT_CLASS,
                  "pl-9.5",
                  errors.lastname && AUTH_FIELD_ERROR_CLASS
                )}
              />
            </div>
            <AuthFieldError message={errors.lastname?.message} />
          </div>
        </div>

        {/* Ligne 2 : Âge, Sexe, Milieu, SDH */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="space-y-1">
            <Label htmlFor="register-age" className="text-slate-700 text-xs font-semibold">
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
                AUTH_INPUT_CLASS,
                errors.age && AUTH_FIELD_ERROR_CLASS
              )}
            />
            <AuthFieldError message={errors.age?.message} />
          </div>

          <div className="space-y-1">
            <Label htmlFor="register-sexe" className="text-slate-700 text-xs font-semibold">
              Sexe *
            </Label>
            <div className="relative">
              <select
                id="register-sexe"
                aria-invalid={!!errors.sexe}
                {...register("sexe")}
                className={cn(
                  AUTH_SELECT_CLASS,
                  errors.sexe && AUTH_FIELD_ERROR_CLASS
                )}
              >
                <option value="HOMME">Homme</option>
                <option value="FEMME">Femme</option>
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400"
                aria-hidden
              />
            </div>
            <AuthFieldError message={errors.sexe?.message} />
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="register-milieu"
              title="Milieu de résidence"
              className="text-slate-700 text-xs font-semibold"
            >
              Milieu *
            </Label>
            <div className="relative">
              <select
                id="register-milieu"
                title="Milieu de résidence"
                aria-invalid={!!errors.milieuResidence}
                {...register("milieuResidence")}
                className={cn(
                  AUTH_SELECT_CLASS,
                  errors.milieuResidence && AUTH_FIELD_ERROR_CLASS
                )}
              >
                <option value="URBAIN">Urbain</option>
                <option value="RURAL">Rural</option>
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400"
                aria-hidden
              />
            </div>
            <AuthFieldError message={errors.milieuResidence?.message} />
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="register-sdh"
              title="Situation de Handicap (SDH)"
              className="text-slate-700 text-xs font-semibold"
            >
              SDH *
            </Label>
            <div className="relative">
              <select
                id="register-sdh"
                title="Situation de Handicap (SDH)"
                aria-invalid={!!errors.sdh}
                {...register("sdh", {
                  setValueAs: (value) => value === true || value === "true",
                })}
                className={cn(
                  AUTH_SELECT_CLASS,
                  errors.sdh && AUTH_FIELD_ERROR_CLASS
                )}
              >
                <option value="false">Non</option>
                <option value="true">Oui</option>
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-slate-400"
                aria-hidden
              />
            </div>
            <AuthFieldError message={errors.sdh?.message} />
          </div>
        </div>

        {/* Ligne 3 : Téléphone & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="space-y-1">
            <Label htmlFor="register-telephone" className="text-slate-700 text-xs font-semibold">
              Téléphone *
            </Label>
            <div className="relative">
              <Phone
                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none"
                aria-hidden
              />
              <Input
                id="register-telephone"
                type="tel"
                autoComplete="tel"
                placeholder="+221 77 123 45 67"
                aria-invalid={!!errors.telephone}
                {...register("telephone")}
                className={cn(
                  AUTH_INPUT_CLASS,
                  "pl-9.5",
                  errors.telephone && AUTH_FIELD_ERROR_CLASS
                )}
              />
            </div>
            <AuthFieldError message={errors.telephone?.message} />
          </div>

          <div className="space-y-1">
            <Label htmlFor="register-email" className="text-slate-700 text-xs font-semibold">
              Adresse e-mail *
            </Label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none"
                aria-hidden
              />
              <Input
                id="register-email"
                type="email"
                autoComplete="email"
                placeholder="vous@exemple.com"
                aria-invalid={!!errors.email}
                {...register("email")}
                className={cn(
                  AUTH_INPUT_CLASS,
                  "pl-9.5",
                  errors.email && AUTH_FIELD_ERROR_CLASS
                )}
              />
            </div>
            <AuthFieldError message={errors.email?.message} />
          </div>
        </div>

        {/* Ligne 4 : Mot de passe */}
        <div className="space-y-1">
          <Label htmlFor="register-password" className="text-slate-700 text-xs font-semibold">
            Mot de passe *
          </Label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none"
              aria-hidden
            />
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
                AUTH_INPUT_CLASS,
                "pl-9.5 pr-10",
                errors.password && AUTH_FIELD_ERROR_CLASS
              )}
            />
            <button
              type="button"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1 rounded cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden />
              ) : (
                <Eye className="size-4" aria-hidden />
              )}
            </button>
          </div>

          <PasswordStrength password={passwordPreview} />
          <AuthFieldError message={errors.password?.message} />
        </div>

        {/* Acceptation obligatoire des CGU */}
        <div className="space-y-1">
          <label
            htmlFor="register-accept-cgu"
            className={cn(
              "flex items-start gap-2 rounded-xl border px-3 py-2 text-[11px] text-slate-600 cursor-pointer transition-colors",
              errors.acceptCgu
                ? "border-red-300 bg-red-50/70"
                : "border-slate-200 bg-slate-50/70 hover:bg-slate-100/70"
            )}
          >
            <input
              id="register-accept-cgu"
              type="checkbox"
              aria-invalid={!!errors.acceptCgu}
              {...register("acceptCgu")}
              className="mt-0.5 size-3.5 shrink-0 rounded border-slate-300 accent-[#836182] cursor-pointer"
            />
            <span className="leading-snug">
              J&apos;accepte les{" "}
              <Link
                href="/cgu"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#836182] underline underline-offset-2 hover:text-[#684b67]"
              >
                CGU
              </Link>{" "}
              et la{" "}
              <Link
                href="/politique-de-confidentialite"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#836182] underline underline-offset-2 hover:text-[#684b67]"
              >
                Politique de confidentialité
              </Link>
              . *
            </span>
          </label>
          <AuthFieldError message={errors.acceptCgu?.message} />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 rounded-xl bg-[#836182] hover:bg-[#6f4f6e] text-white font-semibold shadow-md shadow-[#836182]/20 transition-all cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Création du compte…
            </>
          ) : (
            <>
              <span>Créer mon compte</span>
              <ArrowRight className="size-4" aria-hidden />
            </>
          )}
        </Button>
      </form>

      <p className="text-center text-xs text-slate-500">
        Déjà un compte ?{" "}
        <Link
          href="/auth/login"
          className="text-[#836182] hover:text-[#684b67] font-semibold underline-offset-4 hover:underline"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}
