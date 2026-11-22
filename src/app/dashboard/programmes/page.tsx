import Link from "next/link";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import {
  ACCEENT_PROGRAMS,
  APPLICATION_STATUSES,
  PROGRAM_POLES,
  type ApplicationStatusKey,
} from "@/lib/constants/platform";
import { BookOpen, Briefcase, Monitor, ArrowRight, ExternalLink, Send } from "lucide-react";

const poleIcons = {
  EDUCATION: BookOpen,
  ENTREPRENEURIAT: Briefcase,
  NUMERIQUE: Monitor,
} as const;

export default async function UserProgrammesPage() {
  const session = await getSession();

  const myApps = session
    ? await prisma.programApplication.findMany({
        where: { userId: session.userId },
        orderBy: { createdAt: "desc" },
        select: { programSlug: true, status: true },
      })
    : [];

  const statusBySlug = new Map<string, ApplicationStatusKey>();
  for (const app of myApps) {
    if (!statusBySlug.has(app.programSlug)) {
      statusBySlug.set(app.programSlug, app.status as ApplicationStatusKey);
    }
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ACCEENT_PROGRAMS.map((prog) => {
          const Icon = poleIcons[prog.pole];
          const poleMeta = PROGRAM_POLES[prog.pole];
          const existingStatus = statusBySlug.get(prog.slug);
          const statusMeta = existingStatus ? APPLICATION_STATUSES[existingStatus] : null;

          return (
            <div
              key={prog.slug}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between gap-4 shadow-xs hover:border-[#836182]/50 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="size-10 rounded-xl bg-[#836182]/10 border border-[#836182]/25 flex items-center justify-center text-[#836182] dark:text-[#d8b4d7]">
                    <Icon className="size-5" />
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${poleMeta.badge}`}
                  >
                    {poleMeta.label}
                  </span>
                </div>

                <div>
                  <h3 className="text-slate-900 dark:text-white font-bold text-base">
                    {prog.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-xs mt-1.5 leading-relaxed">
                    {prog.description}
                  </p>
                </div>

                {statusMeta && (
                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${statusMeta.badge}`}
                  >
                    Statut actuel : {statusMeta.label}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href={prog.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <span>Détails</span>
                  <ExternalLink className="size-3" />
                </Link>

                <Link
                  href={`/dashboard/candidatures?program=${prog.slug}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#836182] hover:bg-[#6f4f6e] text-white text-xs font-bold transition-colors"
                >
                  <Send className="size-3" />
                  <span>{existingStatus ? "Voir / Recandidater" : "Postuler"}</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
