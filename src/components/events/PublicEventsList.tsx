"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Users,
  Video,
  CheckCircle2,
  Ticket,
  Loader2,
  AlertCircle,
  ExternalLink,
  XCircle,
} from "lucide-react";
import { PROGRAM_POLES, type ProgramPoleKey } from "@/lib/constants/platform";
import {
  registerForEventAction,
  unregisterFromEventAction,
} from "@/actions/event";

export interface PublicEventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  pole: ProgramPoleKey | null;
  location: string;
  isOnline: boolean;
  meetingUrl: string | null;
  imageUrl: string | null;
  startDateIso: string;
  startDateFormatted: string;
  endDateFormatted: string | null;
  capacity: number | null;
  registrationCount: number;
  myTicketCode: string | null;
  myRegistrationId?: string | null;
}

interface PublicEventsListProps {
  events: PublicEventItem[];
  isAuthenticated: boolean;
}

export function PublicEventsList({ events, isAuthenticated }: PublicEventsListProps) {
  const router = useRouter();
  const [timeFilter, setTimeFilter] = useState<"upcoming" | "past">("upcoming");
  const [poleFilter, setPoleFilter] = useState<"ALL" | ProgramPoleKey>("ALL");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const now = Date.now();

  const filtered = events.filter((ev) => {
    const startMs = Date.parse(ev.startDateIso);
    const isUpcoming = startMs >= now - 1000 * 60 * 60 * 12; // inclut les événements du jour
    const matchesTime = timeFilter === "upcoming" ? isUpcoming : !isUpcoming;
    const matchesPole = poleFilter === "ALL" || ev.pole === poleFilter;
    return matchesTime && matchesPole;
  });

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
    <div className="space-y-8">
      {feedback && (
        <div
          className={`max-w-3xl mx-auto flex items-center gap-3 p-4 rounded-2xl border text-sm font-medium ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="size-5 text-red-600 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setTimeFilter("upcoming")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              timeFilter === "upcoming"
                ? "bg-[#836182] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            À venir
          </button>
          <button
            type="button"
            onClick={() => setTimeFilter("past")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              timeFilter === "past"
                ? "bg-[#836182] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Événements passés
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <button
            type="button"
            onClick={() => setPoleFilter("ALL")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
              poleFilter === "ALL"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-200 hover:border-[#836182]"
            }`}
          >
            Tous les pôles
          </button>
          {(Object.keys(PROGRAM_POLES) as ProgramPoleKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setPoleFilter(key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                poleFilter === key
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:border-[#836182]"
              }`}
            >
              {PROGRAM_POLES[key].label}
            </button>
          ))}
        </div>
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs max-w-2xl mx-auto space-y-3">
          <Calendar className="size-10 text-[#836182] mx-auto" />
          <h3 className="text-xl font-bold text-slate-900">
            Aucun événement {timeFilter === "upcoming" ? "prévu" : "passé"} pour ce filtre
          </h3>
          <p className="text-sm text-slate-600">
            Revenez bientôt ou abonnez-vous à notre newsletter pour être informé·e des prochains ateliers et forums.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((ev) => {
            const poleMeta = ev.pole ? PROGRAM_POLES[ev.pole] : null;
            const remaining =
              ev.capacity !== null ? Math.max(0, ev.capacity - ev.registrationCount) : null;
            const isFull = remaining === 0;
            const isPast = timeFilter === "past";
            const isLoading = loadingId === ev.id;
            const defaultImg =
              "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80";
            const imgSrc = ev.imageUrl || defaultImg;

            return (
              <article
                key={ev.id}
                className="flex flex-col bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgSrc}
                    alt={ev.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    {poleMeta ? (
                      <span className="px-3 py-1 rounded-full bg-white/95 text-slate-800 text-[11px] font-bold shadow-sm">
                        {poleMeta.label}
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-white/95 text-slate-800 text-[11px] font-bold shadow-sm">
                        ACCEENT
                      </span>
                    )}

                    {ev.isOnline && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-600 text-white text-[11px] font-bold">
                        <Video className="size-3" /> En ligne
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 text-white text-xs font-bold bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 flex items-center gap-1.5">
                    <Calendar className="size-3 text-pink-300" />
                    {ev.startDateFormatted}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                      {ev.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
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

                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {ev.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-2.5">
                    {ev.myTicketCode ? (
                      <>
                        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                          <span className="flex items-center gap-1.5">
                            <Ticket className="size-4 text-emerald-600" />
                            Inscrit · {ev.myTicketCode}
                          </span>
                          {!isPast && (
                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={() => handleUnregister(ev.id)}
                              className="text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                            >
                              {isLoading ? (
                                <Loader2 className="size-3.5 animate-spin" />
                              ) : (
                                <XCircle className="size-3.5" />
                              )}
                              <span>Annuler</span>
                            </button>
                          )}
                        </div>
                        {ev.isOnline && ev.meetingUrl && (
                          <a
                            href={ev.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-colors"
                          >
                            <span>Rejoindre la session en ligne</span>
                            <ExternalLink className="size-3.5" />
                          </a>
                        )}
                      </>
                    ) : isPast ? (
                      <div className="text-center text-xs font-semibold text-slate-400 py-2 bg-slate-50 rounded-full">
                        Événement terminé
                      </div>
                    ) : isAuthenticated ? (
                      <button
                        type="button"
                        disabled={isFull || isLoading}
                        onClick={() => handleRegister(ev.id)}
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#836182] hover:bg-[#6d4c6c] disabled:bg-slate-300 text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : isFull ? (
                          "Complet"
                        ) : (
                          <>
                            <Ticket className="size-4" />
                            <span>S&apos;inscrire en 1 clic</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <Link
                        href="/auth/login?callbackUrl=/evenements"
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-[#836182] text-white text-xs font-bold transition-all"
                      >
                        Se connecter pour s&apos;inscrire
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
