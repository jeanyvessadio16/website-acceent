"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { resetPasswordSchema, type ResetPasswordInput } from "@/validation/auth";
import { resetPasswordAction, validateResetTokenAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  AUTH_FIELD_ERROR_CLASS,
  AUTH_INPUT_CLASS,
  AuthAlert,
  AuthFieldError,
  PasswordStrength,
} from "./AuthShared";

export default function ResetPasswordForm() {
  const router = useRouter();

  const [checkingToken, setCheckingToken] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordPreview, setPasswordPreview] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    let cancelled = false;
    async function check() {
      const res = await validateResetTokenAction();
      if (!cancelled) {
        if (!res.valid) {
          setTokenError(res.message || "Lien invalide ou expiré.");
        }
        setCheckingToken(false);
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = async (data: ResetPasswordInput) => {
    setServerError(null);
    const res = await resetPasswordAction(data);
    if (res.success) {
      router.push("/auth/login?reset=success");
    } else {
      setServerError(res.message);
    }
  };

  if (checkingToken) {
    return (
      <div className="py-10 flex flex-col items-center justify-center gap-3 text-slate-600">
        <Loader2 className="size-7 animate-spin text-[#836182]" aria-hidden />
        <p className="text-sm font-medium">Vérification du lien de sécurité…</p>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="space-y-4 text-center py-2">
        <div className="size-10 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="size-5" aria-hidden />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-slate-900">Lien invalide ou expiré</h1>
          <p className="text-xs sm:text-sm text-slate-500">{tokenError}</p>
        </div>
        <div className="space-y-2 pt-1">
          <Button
            asChild
            className="w-full h-10 rounded-xl bg-[#836182] hover:bg-[#6f4f6e] text-white font-semibold shadow-sm"
          >
            <Link href="/auth/forgot-password">Demander un nouveau lien</Link>
          </Button>
          <Link
            href="/auth/login"
            className="inline-block text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="space-y-2.5 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#836182]/10 text-[#836182] ring-1 ring-[#836182]/20">
          <ShieldCheck className="size-4.5" aria-hidden />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Nouveau mot de passe
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Choisissez un mot de passe fort pour sécuriser votre compte.
          </p>
        </div>
      </div>

      {serverError && <AuthAlert variant="error" message={serverError} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
        <div className="space-y-1">
          <Label htmlFor="reset-password" className="text-slate-700 text-xs font-semibold">
            Nouveau mot de passe
          </Label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none"
              aria-hidden
            />
            <Input
              id="reset-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Minimum 8 caractères (A-z, 0-9, @$!%*?&)"
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

        <div className="space-y-1">
          <Label htmlFor="reset-confirm" className="text-slate-700 text-xs font-semibold">
            Confirmer le mot de passe
          </Label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none"
              aria-hidden
            />
            <Input
              id="reset-confirm"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Retapez votre mot de passe"
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
              className={cn(
                AUTH_INPUT_CLASS,
                "pl-9.5",
                errors.confirmPassword && AUTH_FIELD_ERROR_CLASS
              )}
            />
          </div>
          <AuthFieldError message={errors.confirmPassword?.message} />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 mt-1 rounded-xl bg-[#836182] hover:bg-[#6f4f6e] text-white font-semibold shadow-md shadow-[#836182]/20 transition-all cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Enregistrement…
            </>
          ) : (
            <>
              <span>Mettre à jour le mot de passe</span>
              <ArrowRight className="size-4" aria-hidden />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
