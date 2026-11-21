"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Users,
  FileText,
  ArrowUpRight,
  CalendarDays,
  BookOpen,
  Briefcase,
  Monitor,
  Plus,
  Globe,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  UserPlus,
  ExternalLink,
  PencilLine,
  ClipboardCheck,
  Mail,
  Download,
  FileSpreadsheet,
  Handshake,
  ShieldAlert,
  Sparkles,
  UserCheck,
} from "lucide-react";
import type { AdminDashboardData } from "@/repositories/dashboard.repository";
import {
  APPLICATION_STATUSES,
  POST_CATEGORIES,
  PROGRAM_POLES,
  type PostCategoryKey,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminDashboardClientProps {
  adminName: string;
  data: AdminDashboardData;
}

const POLE_CARDS = [
  {
    key: "EDUCATION" as const,
    label: "Éducation",
    desc: "ACCEENT-Elles & Tut-Tank",
    href: "/education",
    icon: BookOpen,
    barColor: "bg-[#836182]",
    iconClass:
      "bg-[#836182]/10 text-[#6d4c6c] border-[#836182]/25 dark:bg-[#836182]/25 dark:text-[#f4e6ea]",
  },
  {
    key: "ENTREPRENEURIAT" as const,
    label: "Entrepreneuriat",
    desc: "ACCEENT Incub, Ateliers & Forum",
    href: "/entreprenariat",
    icon: Briefcase,
    barColor: "bg-amber-500",
    iconClass:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
  },
  {
    key: "NUMERIQUE" as const,
    label: "Numérique",
    desc: "AI4Good & WRO Robotique",
    href: "/numerique",
    icon: Monitor,
    barColor: "bg-cyan-500",
    iconClass:
      "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30",
  },
];

export function AdminDashboardClient({ adminName, data }: AdminDashboardClientProps) {
  const publicationRate =
    data.totalArticlesCount > 0
      ? Math.round((data.publishedArticlesCount / data.totalArticlesCount) * 100)
      : 0;
  const draftCount = Math.max(0, data.totalArticlesCount - data.publishedArticlesCount);

  const maxPoleItems = Math.max(
    1,
    ...data.poleBreakdown.map(
      (p) => p.articlesCount + p.applicationsCount + p.resourcesCount
    )
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {data.dbError && (
        <div className="rounded-2xl border border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/10 p-4 text-amber-900 dark:text-amber-200 flex items-center gap-3">
          <AlertTriangle className="size-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="text-xs sm:text-sm">
            <p className="font-bold">Connexion base de données momentanément instable</p>
            <p className="text-amber-700 dark:text-amber-300 mt-0.5">
              Vérifiez que votre instance Supabase / PostgreSQL est active et accepte les requêtes.
            </p>
          </div>
        </div>
      )}

      {/* Bannière d'accueil claire & contrastée */}
      <Card className="border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white via-white to-[#f4e6ea]/50 dark:from-slate-900 dark:via-slate-900 dark:to-[#836182]/15 shadow-sm">
        <CardContent className="p-6 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#836182]/10 border border-[#836182]/25 text-[#6d4c6c] dark:bg-[#836182]/25 dark:border-[#836182]/40 dark:text-[#f4e6ea] text-xs font-bold">
              <ShieldCheck className="size-3.5" />
              <span>Administration Plateforme ACCEENT</span>
              <span className="size-1 rounded-full bg-current opacity-50" />
              <span className="text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-1">
                <CheckCircle2 className="size-3" /> Système opérationnel
              </span>
            </div>

            <h2 className="text-slate-900 dark:text-white text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bonjour, {adminName}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Pilotez les publications, examinez les candidatures aux 7 programmes, suivez les ateliers et exportez vos rapports Excel et PDF en un clic.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              asChild
              className="bg-[#836182] hover:bg-[#6f4f6e] text-white font-semibold rounded-xl h-10 px-4 shadow-xs"
            >
              <Link href="/admin/articles?new=true">
                <Plus className="size-4 mr-1.5" />
                Nouvel article
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl h-10 px-3.5 font-semibold"
            >
              <Link href="/admin/utilisateurs?new=true">
                <UserPlus className="size-4 mr-1.5 text-cyan-600 dark:text-cyan-400" />
                Membres
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl h-10 px-3.5 font-semibold cursor-pointer"
                >
                  <Download className="size-4 mr-1.5 text-[#836182] dark:text-[#d8b4d7]" />
                  Rapports
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel className="text-xs text-slate-500">
                  Télécharger un rapport
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <a href="/api/admin/export/excel?type=overview" download className="flex items-center gap-2">
                    <FileSpreadsheet className="size-4 text-emerald-600" />
                    <span>Synthèse complète (.xlsx)</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <a href="/api/admin/export/pdf?type=overview" download className="flex items-center gap-2">
                    <FileText className="size-4 text-rose-600" />
                    <span>Rapport exécutif (PDF)</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <a href="/api/admin/export/excel?type=applications" download className="flex items-center gap-2">
                    <ClipboardCheck className="size-4 text-amber-600" />
                    <span>Candidatures (.xlsx)</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <a href="/api/admin/export/excel?type=users" download className="flex items-center gap-2">
                    <Users className="size-4 text-cyan-600" />
                    <span>Annuaire membres (.xlsx)</span>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              asChild
              variant="ghost"
              className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl h-10 px-3 font-medium"
            >
              <Link href="/" target="_blank" rel="noopener noreferrer">
                <Globe className="size-4 mr-1.5" />
                Site live
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 4 KPI Cards Haute Visibilité */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Articles publiés
              </span>
              <div className="size-9 rounded-xl bg-[#836182]/10 text-[#836182] dark:bg-[#836182]/25 dark:text-[#d8b4d7] flex items-center justify-center">
                <FileText className="size-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {data.publishedArticlesCount}
              </p>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30">
                {publicationRate}% en ligne
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#836182] transition-all"
                  style={{ width: `${publicationRate}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {draftCount} brouillon{draftCount > 1 ? "s" : ""} sur {data.totalArticlesCount} articles
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Candidatures
              </span>
              <div className="size-9 rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 flex items-center justify-center">
                <ClipboardCheck className="size-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {data.pendingAppsCount}
              </p>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30">
                À traiter
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
              {data.totalApplicationsCount} dossier{data.totalApplicationsCount > 1 ? "s" : ""} déposé{data.totalApplicationsCount > 1 ? "s" : ""} au total
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Événements &amp; Billets
              </span>
              <div className="size-9 rounded-xl bg-cyan-50 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300 flex items-center justify-center">
                <CalendarDays className="size-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {data.upcomingEventsCount}
              </p>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30">
                À venir
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
              {data.totalRegistrationsCount} billet{data.totalRegistrationsCount > 1 ? "s" : ""} émis • {data.resourcesCount} ressources
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Communauté ACCEENT
              </span>
              <div className="size-9 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 flex items-center justify-center">
                <Users className="size-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {data.usersCount}
              </p>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                {data.subscribersCount} abonnés
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
              {data.adminCount} admin{data.adminCount > 1 ? "s" : ""} • {data.authorCount} auteur{data.authorCount > 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Corps Principal : Onglets Multi-Vues + Pôles & Raccourcis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs py-0 gap-0">
            <Tabs defaultValue="publications" className="w-full gap-0">
              <CardHeader className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                    Activité récente de la plateforme
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                    Basculez entre vos pôles opérationnels sans quitter le tableau de bord
                  </CardDescription>
                </div>

                <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl h-auto flex-wrap">
                  <TabsTrigger value="publications" className="rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer">
                    Publications ({data.totalArticlesCount})
                  </TabsTrigger>
                  <TabsTrigger value="candidatures" className="rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer">
                    Candidatures ({data.totalApplicationsCount})
                  </TabsTrigger>
                  <TabsTrigger value="evenements" className="rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer">
                    Événements
                  </TabsTrigger>
                  <TabsTrigger value="membres" className="rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer">
                    Membres ({data.usersCount})
                  </TabsTrigger>
                </TabsList>
              </CardHeader>

              {/* Onglet 1 : Publications */}
              <TabsContent value="publications" className="mt-0">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.recentArticles.length === 0 ? (
                    <div className="p-10 text-center space-y-2">
                      <FileText className="size-8 text-slate-400 mx-auto" />
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Aucun article enregistré pour le moment.
                      </p>
                      <Button asChild size="sm" className="bg-[#836182] text-white">
                        <Link href="/admin/articles?new=true">Créer le premier article</Link>
                      </Button>
                    </div>
                  ) : (
                    data.recentArticles.map((article) => {
                      const catMeta =
                        POST_CATEGORIES[article.category as PostCategoryKey] ||
                        POST_CATEGORIES.GENERAL;
                      return (
                        <div
                          key={article.id}
                          className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <div className="size-11 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 relative flex items-center justify-center">
                            {article.imageUrl ? (
                              <Image
                                src={article.imageUrl}
                                alt={article.title}
                                fill
                                sizes="44px"
                                className="object-cover"
                              />
                            ) : (
                              <FileText className="size-5 text-slate-400" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Link
                                href="/admin/articles"
                                className="text-sm font-semibold text-slate-900 dark:text-white truncate hover:text-[#836182] dark:hover:text-[#d8b4d7]"
                              >
                                {article.title}
                              </Link>
                              <span
                                className={`hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${catMeta.badge}`}
                              >
                                {catMeta.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                              <span>{article.author}</span>
                              <span>•</span>
                              <span className="inline-flex items-center gap-1">
                                <Clock className="size-3" />
                                {article.date}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                                article.status === "published"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30"
                                  : "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30"
                              }`}
                            >
                              {article.status === "published" ? "Publié" : "Brouillon"}
                            </span>

                            <Link
                              href="/admin/articles"
                              className="size-8 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300"
                              title="Gérer les articles"
                            >
                              <PencilLine className="size-3.5" />
                            </Link>
                            {article.status === "published" && (
                              <Link
                                href={`/actualites/${article.id}`}
                                target="_blank"
                                className="size-8 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300"
                                title="Voir en ligne"
                              >
                                <ExternalLink className="size-3.5" />
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    {data.publishedArticlesCount} publiés sur {data.totalArticlesCount}
                  </span>
                  <Link
                    href="/admin/articles"
                    className="font-bold text-[#836182] dark:text-[#d8b4d7] hover:underline inline-flex items-center gap-1"
                  >
                    Tous les articles <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </TabsContent>

              {/* Onglet 2 : Candidatures */}
              <TabsContent value="candidatures" className="mt-0">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.recentApplications.length === 0 ? (
                    <div className="p-10 text-center space-y-2">
                      <ClipboardCheck className="size-8 text-slate-400 mx-auto" />
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Aucune candidature déposée pour le moment.
                      </p>
                    </div>
                  ) : (
                    data.recentApplications.map((app) => {
                      const statusMeta = APPLICATION_STATUSES[app.status];
                      const poleMeta = PROGRAM_POLES[app.pole];
                      return (
                        <div
                          key={app.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <div className="min-w-0 space-y-0.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                {app.applicantName}
                              </p>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${poleMeta.badge}`}
                              >
                                {poleMeta.label}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {app.programName} • {app.city} • {app.date}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusMeta.badge}`}
                            >
                              {statusMeta.label}
                            </span>
                            <Link
                              href="/admin/candidatures"
                              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                              Examiner
                            </Link>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs gap-2 flex-wrap">
                  <a
                    href="/api/admin/export/excel?type=applications"
                    download
                    className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                  >
                    <FileSpreadsheet className="size-3.5" />
                    Exporter toutes les candidatures (.xlsx)
                  </a>
                  <Link
                    href="/admin/candidatures"
                    className="font-bold text-[#836182] dark:text-[#d8b4d7] hover:underline inline-flex items-center gap-1"
                  >
                    Gérer les candidatures <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </TabsContent>

              {/* Onglet 3 : Événements */}
              <TabsContent value="evenements" className="mt-0">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.upcomingEvents.length === 0 ? (
                    <div className="p-10 text-center space-y-2">
                      <CalendarDays className="size-8 text-slate-400 mx-auto" />
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Aucun événement à venir programmé.
                      </p>
                      <Button asChild size="sm" className="bg-[#836182] text-white">
                        <Link href="/admin/evenements?new=true">Planifier un événement</Link>
                      </Button>
                    </div>
                  ) : (
                    data.upcomingEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="min-w-0 space-y-0.5">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {ev.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {ev.date} • {ev.location} •{" "}
                            <strong className="text-slate-700 dark:text-slate-200">
                              {ev.registrationsCount}
                              {ev.capacity ? ` / ${ev.capacity}` : ""} inscrit{ev.registrationsCount > 1 ? "s" : ""}
                            </strong>
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={`/api/admin/export/excel?type=event&eventId=${ev.id}`}
                            download
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                          >
                            <FileSpreadsheet className="size-3.5" />
                            Excel
                          </a>
                          <a
                            href={`/api/admin/export/pdf?type=event&eventId=${ev.id}`}
                            download
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                          >
                            <FileText className="size-3.5" />
                            PDF
                          </a>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    {data.upcomingEventsCount} événement{data.upcomingEventsCount > 1 ? "s" : ""} à venir
                  </span>
                  <Link
                    href="/admin/evenements"
                    className="font-bold text-[#836182] dark:text-[#d8b4d7] hover:underline inline-flex items-center gap-1"
                  >
                    Tous les événements <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </TabsContent>

              {/* Onglet 4 : Membres */}
              <TabsContent value="membres" className="mt-0">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.recentUsers.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="size-9 rounded-full bg-gradient-to-br from-[#836182] to-[#a57da4] flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {u.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {u.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {u.email}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            u.role === "ADMIN"
                              ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30"
                              : u.role === "AUTHOR"
                              ? "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30"
                              : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                          }`}
                        >
                          {u.role}
                        </span>
                        <p className="text-[11px] text-slate-400 mt-0.5">{u.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs gap-2 flex-wrap">
                  <a
                    href="/api/admin/export/excel?type=users"
                    download
                    className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                  >
                    <FileSpreadsheet className="size-3.5" />
                    Exporter l&apos;annuaire (.xlsx)
                  </a>
                  <Link
                    href="/admin/utilisateurs"
                    className="font-bold text-[#836182] dark:text-[#d8b4d7] hover:underline inline-flex items-center gap-1"
                  >
                    Gérer les membres <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Colonne Latérale : Pôles ACCEENT + Raccourcis */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="size-4 text-[#836182] dark:text-[#d8b4d7]" />
                Activité par pôle d&apos;intervention
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                Articles, candidatures et guides Tut-Tank
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {POLE_CARDS.map((card) => {
                const stats = data.poleBreakdown.find((p) => p.pole === card.key);
                const total =
                  (stats?.articlesCount ?? 0) +
                  (stats?.applicationsCount ?? 0) +
                  (stats?.resourcesCount ?? 0);
                const pct = Math.min(100, Math.round((total / maxPoleItems) * 100));

                return (
                  <Link
                    key={card.key}
                    href={card.href}
                    target="_blank"
                    className="block p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#836182]/50 bg-slate-50/70 dark:bg-slate-800/40 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-9 rounded-lg border flex items-center justify-center shrink-0 ${card.iconClass}`}
                      >
                        <card.icon className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#836182] dark:group-hover:text-[#d8b4d7] truncate">
                            {card.label}
                          </p>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                            {total}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {stats?.articlesCount ?? 0} art. • {stats?.applicationsCount ?? 0} cand. • {stats?.resourcesCount ?? 0} ress.
                        </p>
                      </div>
                    </div>
                    <div className="mt-2.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${card.barColor}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </Link>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                Outils de pilotage
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2">
              {[
                {
                  href: "/admin/newsletter",
                  label: "Newsletter & Campagnes",
                  sub: `${data.subscribersCount} abonné${data.subscribersCount > 1 ? "s" : ""} actif${data.subscribersCount > 1 ? "s" : ""}`,
                  icon: Mail,
                },
                {
                  href: "/admin/partenaires",
                  label: "Partenaires & Témoignages",
                  sub: "Gérer l'affichage sur l'accueil",
                  icon: Handshake,
                },
                {
                  href: "/admin/audit",
                  label: "Journal d'audit & Sécurité",
                  sub: "Traçabilité des actions critiques",
                  icon: ShieldAlert,
                },
                {
                  href: "/dashboard",
                  label: "Mon espace membre personnel",
                  sub: "Mes billets & candidatures propres",
                  icon: UserCheck,
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors"
                >
                  <div className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                    <item.icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.label}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {item.sub}
                    </p>
                  </div>
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
