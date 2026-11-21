"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  CalendarDays,
  BookOpen,
  Plus,
  ExternalLink,
  PencilLine,
  ArrowUpRight,
  Clock,
  FileSpreadsheet,
  AlertTriangle,
  PenTool,
  UserCheck,
  Download,
} from "lucide-react";
import type { AuthorDashboardData } from "@/repositories/dashboard.repository";
import {
  POST_CATEGORIES,
  PROGRAM_POLES,
  RESOURCE_TYPES,
  type PostCategoryKey,
  type ResourceTypeKey,
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

interface AuthorDashboardClientProps {
  authorName: string;
  data: AuthorDashboardData;
}

export function AuthorDashboardClient({ authorName, data }: AuthorDashboardClientProps) {
  const publicationRate =
    data.myTotalArticles > 0
      ? Math.round((data.myPublishedArticles / data.myTotalArticles) * 100)
      : 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {data.dbError && (
        <div className="rounded-2xl border border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/10 p-4 text-amber-900 dark:text-amber-200 flex items-center gap-3">
          <AlertTriangle className="size-5 shrink-0" />
          <p className="text-xs sm:text-sm font-medium">
            Impossible de charger toutes vos statistiques personnelles pour le moment.
          </p>
        </div>
      )}

      {/* Bannière Espace Rédacteur Indépendant */}
      <Card className="border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white via-white to-[#f4e6ea]/50 dark:from-slate-900 dark:via-slate-900 dark:to-[#836182]/15 shadow-sm">
        <CardContent className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#836182]/10 border border-[#836182]/25 text-[#6d4c6c] dark:bg-[#836182]/25 dark:border-[#836182]/40 dark:text-[#f4e6ea] text-xs font-bold">
              <PenTool className="size-3.5" />
              Espace Rédacteur Indépendant
            </span>
            <h2 className="text-slate-900 dark:text-white text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bonjour, {authorName}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              Cet espace regroupe exclusivement vos propres articles, vos ateliers et vos ressources pédagogiques.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              asChild
              className="bg-[#836182] hover:bg-[#6f4f6e] text-white font-semibold rounded-xl h-10 px-4"
            >
              <Link href="/admin/articles?new=true">
                <Plus className="size-4 mr-1.5" />
                Nouvel article
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-slate-200 dark:border-slate-700 rounded-xl h-10 px-3.5 font-semibold"
            >
              <Link href="/admin/evenements?new=true">
                <CalendarDays className="size-4 mr-1.5 text-cyan-600 dark:text-cyan-400" />
                Atelier
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-slate-200 dark:border-slate-700 rounded-xl h-10 px-3.5 font-semibold"
            >
              <Link href="/dashboard">
                <UserCheck className="size-4 mr-1.5 text-[#836182]" />
                Mon espace membre
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 4 KPIs Personnels de l'auteur */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardContent className="p-5 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Mes articles publiés
            </span>
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {data.myPublishedArticles}
              </p>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                {publicationRate}%
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sur {data.myTotalArticles} article{data.myTotalArticles > 1 ? "s" : ""} créé{data.myTotalArticles > 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardContent className="p-5 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Mes brouillons
            </span>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {data.myDraftArticles}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              En attente de relecture ou publication
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardContent className="p-5 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Mes événements
            </span>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {data.myEventsCount}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {data.myEventsRegistrationsCount} inscrit{data.myEventsRegistrationsCount > 1 ? "s" : ""} • {data.myUpcomingEventsCount} à venir
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <CardContent className="p-5 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Mes ressources
            </span>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {data.myResourcesCount}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {data.myResourcesDownloads} consultation{data.myResourcesDownloads > 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Onglets de gestion personnelle */}
      <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs py-0 gap-0">
        <Tabs defaultValue="articles" className="w-full gap-0">
          <CardHeader className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Vos contenus personnels
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                Vue isolée de vos publications, événements et guides
              </CardDescription>
            </div>
            <TabsList className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl h-auto">
              <TabsTrigger value="articles" className="rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer">
                Articles ({data.myTotalArticles})
              </TabsTrigger>
              <TabsTrigger value="evenements" className="rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer">
                Événements ({data.myEventsCount})
              </TabsTrigger>
              <TabsTrigger value="ressources" className="rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer">
                Ressources ({data.myResourcesCount})
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <TabsContent value="articles" className="mt-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.myRecentArticles.length === 0 ? (
                <div className="p-10 text-center space-y-2">
                  <FileText className="size-8 text-slate-400 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Vous n&apos;avez encore rédigé aucun article.
                  </p>
                  <Button asChild size="sm" className="bg-[#836182] text-white">
                    <Link href="/admin/articles?new=true">Rédiger mon premier article</Link>
                  </Button>
                </div>
              ) : (
                data.myRecentArticles.map((article) => {
                  const catMeta =
                    POST_CATEGORIES[article.category as PostCategoryKey] ||
                    POST_CATEGORIES.GENERAL;
                  return (
                    <div
                      key={article.id}
                      className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden relative shrink-0 flex items-center justify-center">
                        {article.imageUrl ? (
                          <Image
                            src={article.imageUrl}
                            alt={article.title}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : (
                          <FileText className="size-4 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {article.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${catMeta.badge}`}>
                            {catMeta.label}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="size-3" /> {article.date}
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
                          className="size-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <PencilLine className="size-3.5" />
                        </Link>
                        {article.status === "published" && (
                          <Link
                            href={`/actualites/${article.id}`}
                            target="_blank"
                            className="size-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
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
            <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex justify-end text-xs">
              <Link
                href="/admin/articles"
                className="font-bold text-[#836182] dark:text-[#d8b4d7] hover:underline inline-flex items-center gap-1"
              >
                Gérer mes articles <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="evenements" className="mt-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.myUpcomingEvents.length === 0 ? (
                <div className="p-10 text-center space-y-2">
                  <CalendarDays className="size-8 text-slate-400 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Vous n&apos;avez créé aucun événement.
                  </p>
                  <Button asChild size="sm" className="bg-[#836182] text-white">
                    <Link href="/admin/evenements?new=true">Créer un événement</Link>
                  </Button>
                </div>
              ) : (
                data.myUpcomingEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {ev.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {ev.date} • {ev.location} • {ev.registrationsCount}
                        {ev.capacity ? ` / ${ev.capacity}` : ""} inscrit{ev.registrationsCount > 1 ? "s" : ""}
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
                        <Download className="size-3.5" />
                        PDF
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex justify-end text-xs">
              <Link
                href="/admin/evenements"
                className="font-bold text-[#836182] dark:text-[#d8b4d7] hover:underline inline-flex items-center gap-1"
              >
                Gérer mes événements <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="ressources" className="mt-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.myRecentResources.length === 0 ? (
                <div className="p-10 text-center space-y-2">
                  <BookOpen className="size-8 text-slate-400 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Vous n&apos;avez publié aucune ressource pédagogique.
                  </p>
                  <Button asChild size="sm" className="bg-[#836182] text-white">
                    <Link href="/admin/ressources?new=true">Partager une ressource</Link>
                  </Button>
                </div>
              ) : (
                data.myRecentResources.map((res) => {
                  const poleMeta = PROGRAM_POLES[res.pole];
                  const typeMeta = RESOURCE_TYPES[res.type as ResourceTypeKey] || RESOURCE_TYPES.PDF;
                  return (
                    <div
                      key={res.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="min-w-0 space-y-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {res.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${poleMeta.badge}`}>
                            {poleMeta.label}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${typeMeta.badge}`}>
                            {typeMeta.label}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">
                            {res.downloadCount} consultation{res.downloadCount > 1 ? "s" : ""} • {res.date}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border shrink-0 w-fit ${
                          res.published
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30"
                            : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                        }`}
                      >
                        {res.published ? "En ligne" : "Masquée"}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
            <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex justify-end text-xs">
              <Link
                href="/admin/ressources"
                className="font-bold text-[#836182] dark:text-[#d8b4d7] hover:underline inline-flex items-center gap-1"
              >
                Gérer mes ressources <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
