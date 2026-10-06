"use client";

import { openCookieSettings } from "@/lib/cookies-consent";

export function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => openCookieSettings()}
      className={className || "transition-colors hover:text-white cursor-pointer text-sm text-slate-500"}
    >
      Gestion des cookies
    </button>
  );
}
