"use client";

import { useState } from "react";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { updateMemberNewsletterPrefAction } from "@/actions/newsletter";

export function MemberNewsletterToggle({ initialOptIn }: { initialOptIn: boolean }) {
  const [optIn, setOptIn] = useState(initialOptIn);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleToggle = async () => {
    const nextVal = !optIn;
    setLoading(true);
    setMessage(null);
    const res = await updateMemberNewsletterPrefAction(nextVal);
    setLoading(false);
    if (res.success) {
      setOptIn(nextVal);
      setMessage(res.message);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-3 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="size-9 rounded-xl bg-[#836182]/10 border border-[#836182]/25 flex items-center justify-center text-[#836182] dark:text-[#d8b4d7] shrink-0">
            <Mail className="size-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Newsletter &amp; Actualités communautaires
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Recevez par e-mail nos nouveaux articles, appels à candidatures et invitations aux ateliers.
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={handleToggle}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors shrink-0 cursor-pointer flex items-center gap-2 ${
            optIn
              ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30"
              : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
          }`}
        >
          {loading && <Loader2 className="size-3.5 animate-spin" />}
          <span>{optIn ? "Abonné aux envois" : "Désabonné (Activer)"}</span>
        </button>
      </div>

      {message && (
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="size-3.5" />
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
