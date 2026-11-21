"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center space-y-5 shadow-lg">
        <div className="size-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 dark:bg-amber-500/15 dark:border-amber-500/30 dark:text-amber-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="size-6" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Erreur de chargement Administration
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Une erreur serveur s&apos;est produite lors du chargement de cette vue d&apos;administration.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#836182] hover:bg-[#6f4f6e] text-white text-xs font-bold cursor-pointer"
          >
            <RotateCcw className="size-4" />
            <span>Recharger la vue</span>
          </button>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold"
          >
            Tableau de bord
          </Link>
        </div>
      </div>
    </div>
  );
}
