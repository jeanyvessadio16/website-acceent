"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, ShieldAlert } from "lucide-react";
import { resetPasswordSchema, type ResetPasswordInput } from "@/validation/auth";
import { resetPasswordAction, validateResetTokenAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [checkingToken, setCheckingToken] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  useEffect(() => {
    setValue("token", token);
    let cancelled = false;

    async function check() {
      if (!token) {
        setTokenError("Aucun jeton de réinitialisation fourni dans l'URL.");
        setCheckingToken(false);
        return;
      }
      const res = await validateResetTokenAction(token);
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
  }, [token, setValue]);

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
      <div className="py-10 flex flex-col items-center justify-center gap-3 text-white/70">
        <Loader2 className="size-7 animate-spin text-[#b9939e]" />
        <p className="text-sm">Vérification du lien de sécurité…</p>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="space-y-5 text-center py-4">
        <div className="size-12 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 flex items-center justify-center mx-auto">
          <ShieldAlert className="size-6" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-xl font-bold text-white">Lien invalide ou expiré</h1>
          <p className="text-sm text-white/60">{tokenError}</p>
        </div>
        <Button asChild className="w-full bg-[#836182] hover:bg-[#9a7396] text-white">
          <Link href="/auth/forgot-password">Demander un nouveau lien</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Nouveau mot de passe
        </h1>
        <p className="text-white/60 text-sm">
          Choisissez un mot de passe fort pour sécuriser votre compte.
        </p>
      </div>

      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <input type="hidden" {...register("token")} />

        <div className="space-y-1.5">
          <Label htmlFor="reset-password" className="text-white/80 text-sm font-medium">
            Nouveau mot de passe
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
            <Input
              id="reset-password"
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 8 caractères (A-z, 0-9, @$!%*?&)"
              {...register("password")}
              className={cn(
                "h-11 pl-10 pr-11 bg-white/10 border-white/20 text-white placeholder:text-white/30",
                "focus-visible:border-[#b9939e] focus-visible:ring-[#b9939e]/20",
                errors.password && "border-red-400/60 ring-2 ring-red-400/20"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="reset-confirm" className="text-white/80 text-sm font-medium">
            Confirmer le mot de passe
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
            <Input
              id="reset-confirm"
              type={showPassword ? "text" : "password"}
              placeholder="Retapez votre mot de passe"
              {...register("confirmPassword")}
              className={cn(
                "h-11 pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/30",
                "focus-visible:border-[#b9939e] focus-visible:ring-[#b9939e]/20",
                errors.confirmPassword && "border-red-400/60 ring-2 ring-red-400/20"
              )}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          size="xl"
          className="w-full bg-gradient-to-r from-[#836182] to-[#b9939e] hover:from-[#9a7396] hover:to-[#c9a3ae] text-white font-semibold shadow-lg shadow-[#836182]/30"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Enregistrement…
            </>
          ) : (
            <>
              Mettre à jour le mot de passe
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
