"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const AUTH_INPUT_CLASS =
  "h-9.5 sm:h-10 rounded-xl bg-white border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 shadow-2xs transition-colors focus-visible:border-[#836182] focus-visible:ring-[#836182]/20";

export const AUTH_SELECT_CLASS =
  "w-full h-9.5 sm:h-10 appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-8 text-xs sm:text-sm font-medium text-slate-900 shadow-2xs outline-none transition-colors focus:border-[#836182] focus:ring-2 focus:ring-[#836182]/20";

export const AUTH_FIELD_ERROR_CLASS =
  "border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500/20 focus:border-red-500 focus:ring-red-500/20";

export function AuthTabs() {
  const pathname = usePathname();
  const isLogin = pathname === "/auth/login";
  const isRegister = pathname === "/auth/register";

  return (
    <div
      role="navigation"
      aria-label="Choix connexion ou inscription"
      className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200/80"
    >
      <Link
        href="/auth/login"
        aria-current={isLogin ? "page" : undefined}
        className={cn(
          "flex h-8.5 items-center justify-center rounded-lg text-xs font-semibold transition-all",
          isLogin
            ? "bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/70"
            : "text-slate-600 hover:text-slate-900"
        )}
      >
        Connexion
      </Link>
      <Link
        href="/auth/register"
        aria-current={isRegister ? "page" : undefined}
        className={cn(
          "flex h-8.5 items-center justify-center rounded-lg text-xs font-semibold transition-all",
          isRegister
            ? "bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/70"
            : "text-slate-600 hover:text-slate-900"
        )}
      >
        Inscription
      </Link>
    </div>
  );
}

export function AuthAlert({
  variant,
  message,
}: {
  variant: "error" | "success";
  message: string;
}) {
  const isSuccess = variant === "success";
  return (
    <div
      role={isSuccess ? "status" : "alert"}
      className={cn(
        "flex items-start gap-2 rounded-xl border px-3.5 py-2 text-xs animate-in fade-in slide-in-from-top-1 duration-200",
        isSuccess
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-800"
      )}
    >
      {isSuccess ? (
        <CheckCircle2 className="size-3.5 shrink-0 mt-0.5 text-emerald-600" aria-hidden />
      ) : (
        <AlertCircle className="size-3.5 shrink-0 mt-0.5 text-red-600" aria-hidden />
      )}
      <span className="leading-snug">{message}</span>
    </div>
  );
}

export function AuthFieldError({
  id,
  message,
}: {
  id?: string;
  message?: string;
}) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className="flex items-center gap-1 text-[11px] leading-tight font-medium text-red-600 animate-in fade-in slide-in-from-top-1 duration-150"
    >
      <span className="size-1 rounded-full bg-red-500 shrink-0" aria-hidden />
      <span>{message}</span>
    </p>
  );
}

export function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ caractères", ok: password.length >= 8 },
    { label: "Majuscule", ok: /[A-Z]/.test(password) },
    { label: "Minuscule", ok: /[a-z]/.test(password) },
    { label: "Chiffre", ok: /\d/.test(password) },
    { label: "@$!%*?&", ok: /[@$!%*?&]/.test(password) },
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
      ? "bg-amber-500"
      : score === 4
      ? "bg-emerald-500"
      : "bg-emerald-600";

  if (!password) return null;

  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-50/90 p-2 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-300", strengthColor)}
            style={{ width: `${(score / 5) * 100}%` }}
          />
        </div>
        <span className="text-[10.5px] font-semibold text-slate-600 shrink-0">
          {strengthLabel}
        </span>
      </div>

      <ul className="flex flex-wrap gap-x-2.5 gap-y-0.5">
        {checks.map((c) => (
          <li
            key={c.label}
            className={cn(
              "inline-flex items-center gap-1 text-[10.5px] font-medium transition-colors",
              c.ok ? "text-emerald-700" : "text-slate-500"
            )}
          >
            {c.ok ? (
              <CheckCircle2 className="size-3 shrink-0 text-emerald-600" aria-hidden />
            ) : (
              <XCircle className="size-3 shrink-0 text-slate-400" aria-hidden />
            )}
            <span>{c.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
