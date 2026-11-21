"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Ticket,
  Video,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  XCircle,
  Download,
} from "lucide-react";
import { PROGRAM_POLES, type ProgramPoleKey } from "@/lib/constants/platform";
import {
  registerForEventAction,
  unregisterFromEventAction,
} from "@/actions/event";
import type { PublicEventItem } from "@/components/events/PublicEventsList";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MemberEventsListProps {
  events: PublicEventItem[];
}

export function MemberEventsList({ events }: MemberEventsListProps) {
  const router = useRouter();
  const [tab, setTab] = useState<"upcoming" | "tickets">("upcoming");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const [now] = useState(() => Date.now());
  const upcomingEvents = events.filter((e) => Date.parse(e.startDateIso) >= now - 1000 * 60 * 60 * 12);
  const myTickets = events.filter((e) => e.myTicketCode !== null);

  const displayed = tab === "upcoming" ? upcomingEvents : myTickets;

  const handleRegister = async (eventId: string) => {
    setLoadingId(eventId);
    setFeedback(null);
    const res = await registerForEventAction(eventId);
    setLoadingId(null);
    if (res.success) {
      setFeedback({ type: "success", text: res.message });
      router.refresh();
    } else {
      setFeedback({ type: "error", text: res.message });
    }
  };

  const handleUnregister = async (eventId: string) => {
    setLoadingId(eventId);
    setFeedback(null);
    const res = await unregisterFromEventAction(eventId);
    setLoadingId(null);
    if (res.success) {
      setFeedback({ type: "success", text: res.message });
      router.refresh();
    } else {
      setFeedback({ type: "error", text: res.message });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {feedback && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-medium ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-300"
              : "bg-red-50 border-red-200 text-red-800 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-300"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="size-5 shrink-0" />
          ) : (
            <AlertCircle className="size-5 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Onglets shadcn */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as "upcoming" | "tickets")}>
        <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl h-auto">
          <TabsTrigger value="upcoming" className="rounded-lg px-4 py-2 text-xs font-bold cursor-pointer">
            Prochains événements ({upcomingEvents.length})
          </TabsTrigger>
          <TabsTrigger value="tickets" className="rounded-lg px-4 py-2 text-xs font-bold cursor-pointer flex items-center gap-1.5">
            <Ticket className="size-3.5" />
            <span>Mes billets ({myTickets.length})</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {displayed.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-2 shadow-xs">
          <Calendar className="size-8 text-[#836182] mx-auto" />
          <p className="text-slate-900 dark:text-white font-bold text-sm">
            {tab === "tickets"
              ? "Vous n'avez aucun billet pour le moment."
              : "Aucun événement à venir programmé actuellement."}
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            Inscrivez-vous en 1 clic à nos ateliers pour recevoir et télécharger votre billet PDF officiel.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayed.map((ev) => {
            const poleMeta = ev.pole ? PROGRAM_POLES[ev.pole as ProgramPoleKey] : null;
            const remaining =
              ev.capacity !== null ? Math.max(0, ev.capacity - ev.registrationCount) : null;
            const isFull = remaining === 0;
            const isLoading = loadingId === ev.id;

            return (
              <div
                key={ev.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between gap-4 shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {poleMeta && (
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${poleMeta.badge}`}
                        >
                          {poleMeta.label}
                        </span>
                      )}
                      {ev.isOnline && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30">
                          <Video className="size-3" /> En ligne
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="size-3.5 text-[#836182]" />
                      {ev.startDateFormatted}
                    </span>
                  </div>

                  <h3 className="text-slate-900 dark:text-white font-bold text-base">
                    {ev.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed line-clamp-3">
                    {ev.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5 text-[#836182]" />
                      {ev.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="size-3.5 text-[#836182]" />
                      {remaining !== null
                        ? `${remaining} place${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""}`
                        : `${ev.registrationCount} inscrit${ev.registrationCount > 1 ? "s" : ""}`}
                    </span>
                  </div>
                </div>

                {ev.myTicketCode ? (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/25 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-300 font-bold block">
                          Billet confirmé
                        </span>
                        <span className="text-base font-black font-mono text-slate-900 dark:text-white">
                          {ev.myTicketCode}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {ev.myRegistrationId && (
                          <a
                            href={`/api/dashboard/tickets/${ev.myRegistrationId}/pdf`}
                            download
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#836182] hover:bg-[#6f4f6e] text-white text-xs font-bold transition-colors"
                          >
                            <Download className="size-3.5" />
                            <span>Billet PDF</span>
                          </a>
                        )}
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => handleUnregister(ev.id)}
                          className="text-xs text-red-700 hover:text-red-800 bg-red-50 border border-red-200 dark:text-red-300 dark:hover:text-red-200 dark:bg-red-500/10 dark:border-red-500/20 flex items-center gap-1 px-2.5 py-1.5 rounded-lg cursor-pointer"
                        >
                          {isLoading ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <XCircle className="size-3.5" />
                          )}
                          <span className="hidden sm:inline">Annuler</span>
                        </button>
                      </div>
                    </div>
                    {ev.isOnline && ev.meetingUrl && (
                      <a
                        href={ev.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 dark:bg-cyan-500/20 dark:hover:bg-cyan-500/30 dark:text-cyan-200 dark:border-cyan-500/30 text-xs font-bold"
                      >
                        <span>Accéder à la visioconférence</span>
                        <ExternalLink className="size-3.5" />
                      </a>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={isFull || isLoading}
                    onClick={() => handleRegister(ev.id)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#836182] hover:bg-[#6f4f6e] disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : isFull ? (
                      "Événement complet"
                    ) : (
                      <>
                        <Ticket className="size-4" />
                        <span>S&apos;inscrire en 1 clic</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
