"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  SlidersHorizontal,
} from "lucide-react";
import { toggleProgramActiveAction } from "@/actions/program";
import { PROGRAM_POLES } from "@/lib/constants/platform";
import type { ProgramWithStatus } from "@/lib/core/program-settings";

interface ProgramSettingsManagerProps {
  initialPrograms: ProgramWithStatus[];
}

export function ProgramSettingsManager({
  initialPrograms,
}: ProgramSettingsManagerProps) {
  const router = useRouter();
  const [programs, setPrograms] = useState<ProgramWithStatus[]>(initialPrograms);
  const [pendingSlug, setPendingSlug] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const activeCount = programs.filter((program) => program.active).length;

  const handleToggle = async (slug: string, nextActive: boolean) => {
    if (pendingSlug !== null) return;
    setFeedback(null);
    setPendingSlug(slug);

    try {
      const res = await toggleProgramActiveAction({ slug, active: nextActive });
      if (res.success) {
        setPrograms((prev) =>
          prev.map((program) =>
            program.slug === slug ? { ...program, active: nextActive } : program
          )
        );
        setFeedback({ type: "success", text: res.message });
        router.refresh();
      } else {
        setFeedback({ type: "error", text: res.message });
      }
    } catch {
      setFeedback({
        type: "error",
        text: "Une erreur inattendue est survenue lors de la mise à jour.",
      });
    } finally {
      setPendingSlug(null);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-xl bg-[#836182]/10 border border-[#836182]/25 flex items-center justify-center text-[#836182] dark:text-[#d8b4d7] shrink-0">
            <SlidersHorizontal className="size-5" />
          </div>
          <div>
            <h2 className="text-slate-900 dark:text-white font-bold text-base">
              Activation des programmes pour les candidatures
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed">
              Activez ou désactivez les programmes disponibles. Un programme désactivé n&apos;est plus visible dans les espaces membre et rédacteur.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#836182]/10 border border-[#836182]/25 text-[#6d4c6c] dark:bg-[#836182]/25 dark:text-[#f4e6ea] text-xs font-bold shrink-0 w-fit tabular-nums">
          {activeCount} / {programs.length} ouvert{activeCount > 1 ? "s" : ""}
        </span>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2.5 p-3.5 rounded-xl border text-xs font-medium ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/25 dark:text-emerald-300"
              : "bg-red-50 border-red-200 text-red-800 dark:bg-red-500/10 dark:border-red-500/25 dark:text-red-300"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="size-4 shrink-0" />
          ) : (
            <AlertCircle className="size-4 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {programs.map((program) => {
          const poleMeta = PROGRAM_POLES[program.pole];
          const isUpdating = pendingSlug === program.slug;

          return (
            <div
              key={program.slug}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 transition-colors ${
                program.active
                  ? "bg-white dark:bg-slate-900"
                  : "bg-slate-50/80 dark:bg-slate-950/60"
              }`}
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {program.name}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${poleMeta.badge}`}
                  >
                    {poleMeta.label}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      program.active
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30"
                        : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30"
                    }`}
                  >
                    {program.active ? "Ouvert" : "Fermé"}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {program.description}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  role="switch"
                  aria-checked={program.active}
                  aria-label={`${program.active ? "Désactiver" : "Activer"} ${program.name}`}
                  disabled={pendingSlug !== null}
                  onClick={() => handleToggle(program.slug, !program.active)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                    program.active
                      ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30"
                      : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30"
                  }`}
                >
                  {isUpdating && <Loader2 className="size-3.5 animate-spin" />}
                  <span>{program.active ? "Désactiver" : "Activer"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
