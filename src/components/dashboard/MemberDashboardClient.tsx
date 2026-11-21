"use client";

import Link from "next/link";
import {
  UserCheck,
  CalendarDays,
  FileText,
  ArrowUpRight,
  BookOpen,
  ShieldCheck,
  Award,
  Send,
  FolderOpen,
  Ticket,
  Download,
  ExternalLink,
  MapPin,
} from "lucide-react";
import type { MemberDashboardData } from "@/repositories/dashboard.repository";
import {
  APPLICATION_STATUSES,
  PROGRAM_POLES,
} from "@/lib/constants/platform";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface MemberDashboardClientProps {
  firstname: string;
  joinDate: string;
  data: MemberDashboardData;
}

export function MemberDashboardClient({
  firstname,
  joinDate,
  data,
}: MemberDashboardClientProps) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Bannière de bienvenue personnelle */}
      <Card className="border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white via-white to-[#f4e6ea]/50 dark:from-slate-900 dark:via-slate-900 dark:to-[#836182]/15 shadow-sm">
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30 text-xs font-bold inline-flex items-center gap-1">
                <UserCheck className="size-3.5" />
                Espace Personnel Indépendant
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-xs">
                Membre depuis le {joinDate}
              </span>
            </div>

            <h2 className="text-slate-900 dark:text-white text-2xl font-extrabold tracking-tight flex items-center gap-2">
              Bonjour, {firstname}
              <ShieldCheck className="size-5 text-[#836182] dark:text-[#d8b4d7]" />
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              Suivez vos propres candidatures, téléchargez vos billets PDF personnels et accédez aux ressources Tut-Tank &amp; Entrepreneuriat.
            </p>
          </div>

          <Button
            asChild
            className="bg-[#836182] hover:bg-[#6f4f6e] text-white text-xs font-bold px-4 h-10 rounded-xl shrink-0"
          >
            <Link href="/dashboard/candidatures?new=true">
              <Send className="size-3.5 mr-1.5" />
              Postuler à un programme
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Cartes de Synthèse Personnelle */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/dashboard/candidatures" className="block group">
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#836182]/50 transition-colors shadow-xs">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Mes candidatures
                </span>
                <div className="size-9 rounded-xl bg-[#836182]/10 text-[#836182] dark:bg-[#836182]/25 dark:text-[#d8b4d7] flex items-center justify-center">
                  <Send className="size-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {data.appsCount}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {data.acceptedAppsCount} dossier{data.acceptedAppsCount > 1 ? "s" : ""} validé{data.acceptedAppsCount > 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/evenements" className="block group">
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#836182]/50 transition-colors shadow-xs">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Mes billets événements
                </span>
                <div className="size-9 rounded-xl bg-cyan-50 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300 flex items-center justify-center">
                  <Ticket className="size-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {data.ticketsCount}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Inscriptions confirmées &amp; téléchargeables en PDF
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/ressources" className="block group">
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#836182]/50 transition-colors shadow-xs">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Bibliothèque ACCEENT
                </span>
                <div className="size-9 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 flex items-center justify-center">
                  <FolderOpen className="size-4" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {data.resourcesCount}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Guides, supports &amp; cours disponibles
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Onglets Personnels + Raccourcis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs py-0 gap-0">
            <Tabs defaultValue="tickets" className="w-full gap-0">
              <CardHeader className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                    Mon activité personnelle
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                    Vos billets nominatifs, vos dossiers et l&apos;agenda à venir
                  </CardDescription>
                </div>

                <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl h-auto flex-wrap">
                  <TabsTrigger value="tickets" className="rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer">
                    Mes billets ({data.myRegistrations.length})
                  </TabsTrigger>
                  <TabsTrigger value="candidatures" className="rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer">
                    Candidatures ({data.myApplications.length})
                  </TabsTrigger>
                  <TabsTrigger value="ateliers" className="rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer">
                    À venir
                  </TabsTrigger>
                  <TabsTrigger value="actualites" className="rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer">
                    Actualités
                  </TabsTrigger>
                </TabsList>
              </CardHeader>

              {/* Mes Billets PDF */}
              <TabsContent value="tickets" className="mt-0">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.myRegistrations.length === 0 ? (
                    <div className="p-10 text-center space-y-2">
                      <Ticket className="size-8 text-slate-400 mx-auto" />
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Vous n&apos;avez pas encore de billet d&apos;événement.
                      </p>
                      <Button asChild size="sm" className="bg-[#836182] text-white">
                        <Link href="/dashboard/evenements">Découvrir les ateliers</Link>
                      </Button>
                    </div>
                  ) : (
                    data.myRegistrations.map((reg) => (
                      <div
                        key={reg.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30 font-mono text-[11px] font-bold">
                              {reg.ticketCode}
                            </span>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                              {reg.eventTitle}
                            </p>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <CalendarDays className="size-3.5 text-[#836182]" />
                            {reg.eventDate} •
                            <MapPin className="size-3.5 text-slate-400" />
                            {reg.eventLocation}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {reg.isOnline && reg.meetingUrl && (
                            <a
                              href={reg.meetingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-cyan-200 dark:border-cyan-500/30 bg-cyan-50 dark:bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 text-xs font-semibold"
                            >
                              Visio <ExternalLink className="size-3" />
                            </a>
                          )}
                          <a
                            href={`/api/dashboard/tickets/${reg.id}/pdf`}
                            download
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#836182] hover:bg-[#6f4f6e] text-white text-xs font-bold transition-colors"
                          >
                            <Download className="size-3.5" />
                            Billet PDF
                          </a>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex justify-end text-xs">
                  <Link
                    href="/dashboard/evenements"
                    className="font-bold text-[#836182] dark:text-[#d8b4d7] hover:underline inline-flex items-center gap-1"
                  >
                    Tous mes événements <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </TabsContent>

              {/* Mes Candidatures */}
              <TabsContent value="candidatures" className="mt-0">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.myApplications.length === 0 ? (
                    <div className="p-10 text-center space-y-2">
                      <Send className="size-8 text-slate-400 mx-auto" />
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Vous n&apos;avez encore déposé aucune candidature.
                      </p>
                      <Button asChild size="sm" className="bg-[#836182] text-white">
                        <Link href="/dashboard/candidatures?new=true">Déposer une candidature</Link>
                      </Button>
                    </div>
                  ) : (
                    data.myApplications.map((app) => {
                      const statusMeta = APPLICATION_STATUSES[app.status];
                      const poleMeta = PROGRAM_POLES[app.pole];
                      return (
                        <div
                          key={app.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                {app.programName}
                              </p>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${poleMeta.badge}`}
                              >
                                {poleMeta.label}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                              {app.projectTitle ? `Projet : ${app.projectTitle} • ` : ""}
                              Déposé le {app.date}
                            </p>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border shrink-0 w-fit ${statusMeta.badge}`}
                          >
                            {statusMeta.label}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex justify-end text-xs">
                  <Link
                    href="/dashboard/candidatures"
                    className="font-bold text-[#836182] dark:text-[#d8b4d7] hover:underline inline-flex items-center gap-1"
                  >
                    Suivre mes candidatures <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </TabsContent>

              {/* Prochains ateliers */}
              <TabsContent value="ateliers" className="mt-0">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.upcomingEvents.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
                      Aucun atelier programmé dans les prochains jours.
                    </div>
                  ) : (
                    data.upcomingEvents.map((ev) => (
                      <Link
                        key={ev.id}
                        href="/dashboard/evenements"
                        className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {ev.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                            {ev.startDateFormatted} • {ev.location}
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-lg bg-[#836182]/10 text-[#6d4c6c] dark:bg-[#836182]/25 dark:text-[#f4e6ea] text-xs font-bold shrink-0">
                          S&apos;inscrire
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Actualités ACCEENT */}
              <TabsContent value="actualites" className="mt-0">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.recentArticles.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
                      Aucune publication récente.
                    </div>
                  ) : (
                    data.recentArticles.map((article) => (
                      <Link
                        key={article.id}
                        href={`/actualites/${article.id}`}
                        target="_blank"
                        className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="size-8 rounded-lg bg-[#836182]/10 text-[#836182] dark:bg-[#836182]/25 dark:text-[#d8b4d7] flex items-center justify-center shrink-0 mt-0.5">
                          <FileText className="size-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {article.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Par {article.authorName} • {article.date}
                          </p>
                        </div>
                        <ExternalLink className="size-3.5 text-slate-400 shrink-0 mt-1" />
                      </Link>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Colonne Raccourcis */}
        <div className="lg:col-span-4">
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="size-4 text-[#836182] dark:text-[#d8b4d7]" />
                Vos raccourcis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                {
                  href: "/dashboard/programmes",
                  icon: BookOpen,
                  label: "Explorer les 7 programmes ACCEENT",
                  color: "text-[#836182] dark:text-[#d8b4d7]",
                },
                {
                  href: "/dashboard/candidatures",
                  icon: Send,
                  label: "Suivre mes candidatures",
                  color: "text-amber-600 dark:text-amber-400",
                },
                {
                  href: "/dashboard/evenements",
                  icon: CalendarDays,
                  label: "Mes billets & ateliers",
                  color: "text-cyan-600 dark:text-cyan-400",
                },
                {
                  href: "/dashboard/ressources",
                  icon: FolderOpen,
                  label: "Bibliothèque Tut-Tank & Guides",
                  color: "text-emerald-600 dark:text-emerald-400",
                },
                {
                  href: "/dashboard/profil",
                  icon: UserCheck,
                  label: "Profil, mot de passe & newsletter",
                  color: "text-slate-600 dark:text-slate-400",
                },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors"
                >
                  <link.icon className={`size-4 shrink-0 ${link.color}`} />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex-1">
                    {link.label}
                  </span>
                  <ArrowUpRight className="size-3.5 text-slate-400 shrink-0" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
