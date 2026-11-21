"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 font-sans antialiased">
        <div className="max-w-md w-full rounded-3xl border border-white/10 bg-slate-900 p-8 text-center space-y-5 shadow-2xl">
          <div className="size-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="size-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold">Une erreur inattendue est survenue</h1>
            <p className="text-sm text-slate-400">
              L&apos;application a rencontré un incident temporaire. Vous pouvez réessayer sans perdre votre navigation.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#836182] hover:bg-[#9a7399] text-white text-sm font-semibold cursor-pointer"
            >
              <RotateCcw className="size-4" />
              <span>Réessayer</span>
            </button>
            <a
              href="/"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 text-sm font-semibold"
            >
              Retour à l&apos;accueil
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
