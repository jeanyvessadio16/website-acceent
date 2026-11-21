"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Mail, ArrowLeft, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/validation/auth";
import { requestPasswordResetAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setServerError(null);
    setSuccessMsg(null);
    const res = await requestPasswordResetAction(data);
    if (res.success) {
      setSuccessMsg(res.message);
    } else {
      setServerError(res.message);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Mot de passe oublié
        </h1>
        <p className="text-white/60 text-sm">
          Entrez votre adresse e-mail pour recevoir un lien de réinitialisation sécurisé.
        </p>
      </div>

      {successMsg && (
        <div
          role="status"
          className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
        >
          <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="forgot-email" className="text-white/80 text-sm font-medium">
            Adresse e-mail
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40 pointer-events-none" />
            <Input
              id="forgot-email"
              type="email"
              autoComplete="email"
              placeholder="vous@exemple.com"
              {...register("email")}
              className={cn(
                "h-11 pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/30",
                "focus-visible:border-[#b9939e] focus-visible:ring-[#b9939e]/20",
                errors.email && "border-red-400/60 ring-2 ring-red-400/20"
              )}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-400">{errors.email.message}</p>
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
              Envoi en cours…
            </>
          ) : (
            <>
              Envoyer le lien de réinitialisation
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      <div className="text-center">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1.5 text-sm text-[#b9939e] hover:text-white font-medium transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
