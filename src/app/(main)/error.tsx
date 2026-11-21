"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function MainError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="min-h-[70vh] bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm space-y-5">
        <div className="size-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="size-7" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Contenu momentanément indisponible</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Impossible de charger cette section pour le moment. Merci de réessayer dans quelques secondes.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-white text-sm font-semibold cursor-pointer"
          >
            <RotateCcw className="size-4" />
            <span>Réessayer</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold"
          >
            <Home className="size-4" />
            <span>Accueil</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
