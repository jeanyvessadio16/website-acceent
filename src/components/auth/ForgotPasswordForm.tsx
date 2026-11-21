"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Mail, ArrowLeft, ArrowRight, Loader2, KeyRound } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/validation/auth";
import { requestPasswordResetAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  AUTH_FIELD_ERROR_CLASS,
  AUTH_INPUT_CLASS,
  AuthAlert,
  AuthFieldError,
} from "./AuthShared";

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
    <div className="w-full space-y-4">
      <div className="space-y-2.5 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#836182]/10 text-[#836182] ring-1 ring-[#836182]/20">
          <KeyRound className="size-4.5" aria-hidden />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Mot de passe oublié
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Entrez votre adresse e-mail pour recevoir un lien de réinitialisation sécurisé.
          </p>
        </div>
      </div>

      {successMsg && <AuthAlert variant="success" message={successMsg} />}
      {serverError && <AuthAlert variant="error" message={serverError} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
        <div className="space-y-1">
          <Label htmlFor="forgot-email" className="text-slate-700 text-xs font-semibold">
            Adresse e-mail
          </Label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none"
              aria-hidden
            />
            <Input
              id="forgot-email"
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

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 rounded-xl bg-[#836182] hover:bg-[#6f4f6e] text-white font-semibold shadow-md shadow-[#836182]/20 transition-all cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Envoi en cours…
            </>
          ) : (
            <>
              <span>Envoyer le lien de réinitialisation</span>
              <ArrowRight className="size-4" aria-hidden />
            </>
          )}
        </Button>
      </form>

      <div className="text-center">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#836182] hover:text-[#684b67] transition-colors"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          <span>Retour à la connexion</span>
        </Link>
      </div>
    </div>
  );
}
