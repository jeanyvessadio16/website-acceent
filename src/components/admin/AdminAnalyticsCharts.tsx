"use client";

import { useState, useSyncExternalStore } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  BarChart3,
  ClipboardCheck,
  PieChart as PieChartIcon,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { AdminDashboardData } from "@/repositories/dashboard.repository";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AdminAnalyticsChartsProps {
  data: AdminDashboardData;
}

type TrendFilter = "all" | "membres" | "candidatures" | "contenus";

interface TooltipEntry {
  name?: string;
  value?: number;
  color?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: ReadonlyArray<TooltipEntry>;
}

const TREND_FILTERS: Array<{ key: TrendFilter; label: string }> = [
  { key: "all", label: "Tout" },
  { key: "membres", label: "Membres" },
  { key: "candidatures", label: "Candidatures" },
  { key: "contenus", label: "Contenus & Billets" },
];

const POLE_LABELS: Record<string, string> = {
  EDUCATION: "Éducation",
  ENTREPRENEURIAT: "Entrepreneuriat",
  NUMERIQUE: "Numérique",
};

function ChartTooltip({ active, label, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-3 py-2 shadow-lg text-xs">
      {label !== undefined && label !== "" && (
        <p className="font-bold text-slate-900 dark:text-white mb-1.5 border-b border-slate-100 dark:border-slate-800 pb-1">
          {label}
        </p>
      )}
      <div className="space-y-1">
        {payload.map((entry, idx) => (
          <div
            key={`${entry.name ?? idx}`}
            className="flex items-center justify-between gap-4"
          >
            <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span
                className="size-2 rounded-full shrink-0"
                style={{ backgroundColor: entry.color || "#836182" }}
              />
              <span>{entry.name}</span>
            </span>
            <span className="font-bold text-slate-900 dark:text-white tabular-nums">
              {entry.value ?? 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartSkeleton({ height = 250 }: { height?: number }) {
  return (
    <div
      style={{ height }}
      className="w-full rounded-xl bg-slate-100/80 dark:bg-slate-800/50 animate-pulse flex items-center justify-center text-xs text-slate-400"
    >
      Chargement du graphique…
    </div>
  );
}

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function AdminAnalyticsCharts({ data }: AdminAnalyticsChartsProps) {
  const mounted = useIsMounted();
  const [trendFilter, setTrendFilter] = useState<TrendFilter>("all");

  const totalApps = data.applicationStatusBreakdown.reduce(
    (sum, item) => sum + item.count,
    0
  );
  const acceptedApps =
    data.applicationStatusBreakdown.find((i) => i.status === "ACCEPTED")?.count ?? 0;
  const acceptanceRate =
    totalApps > 0 ? Math.round((acceptedApps / totalApps) * 100) : 0;
  const nonZeroStatuses = data.applicationStatusBreakdown.filter((i) => i.count > 0);

  const poleChartData = data.poleBreakdown.map((item) => ({
    name: POLE_LABELS[item.pole] || item.pole,
    Articles: item.articlesCount,
    Candidatures: item.applicationsCount,
    Ressources: item.resourcesCount,
  }));

  const totalSexe = data.demographics.bySexe.reduce((s, i) => s + i.value, 0);
  const hommesCount =
    data.demographics.bySexe.find((i) => i.name === "Hommes")?.value ?? 0;
  const femmesCount =
    data.demographics.bySexe.find((i) => i.name === "Femmes")?.value ?? 0;
  const hommesPct = totalSexe > 0 ? Math.round((hommesCount / totalSexe) * 100) : 0;

  const totalMilieu = data.demographics.byMilieu.reduce((s, i) => s + i.value, 0);
  const urbainCount =
    data.demographics.byMilieu.find((i) => i.name === "Urbain")?.value ?? 0;
  const ruralCount =
    data.demographics.byMilieu.find((i) => i.name === "Rural")?.value ?? 0;
  const urbainPct = totalMilieu > 0 ? Math.round((urbainCount / totalMilieu) * 100) : 0;

  const verifiedPct =
    data.usersCount > 0
      ? Math.round((data.demographics.verifiedUsersCount / data.usersCount) * 100)
      : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* 1. Évolution mensuelle de la plateforme (6 derniers mois) */}
      <Card className="lg:col-span-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <CardHeader className="pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="size-4 text-[#836182] dark:text-[#d8b4d7]" />
              Évolution de la plateforme (6 derniers mois)
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              Croissance mensuelle des comptes, candidatures, articles et inscriptions
            </CardDescription>
          </div>

          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start sm:self-auto flex-wrap">
            {TREND_FILTERS.map((f) => {
              const isSelected = trendFilter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setTrendFilter(f.key)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#0d111a] text-white dark:bg-[#836182] shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          {!mounted ? (
            <ChartSkeleton height={250} />
          ) : (
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data.monthlyTrend}
                  margin={{ top: 10, right: 12, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="gradMembres" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#836182" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#836182" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="gradCandidatures" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e08637" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#e08637" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="gradPublications" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="gradInscriptions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#94a3b8"
                    strokeOpacity={0.2}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    width={32}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />

                  {(trendFilter === "all" || trendFilter === "membres") && (
                    <Area
                      type="monotone"
                      dataKey="membres"
                      name="Nouveaux comptes"
                      stroke="#836182"
                      strokeWidth={2.2}
                      fill="url(#gradMembres)"
                    />
                  )}
                  {(trendFilter === "all" || trendFilter === "candidatures") && (
                    <Area
                      type="monotone"
                      dataKey="candidatures"
                      name="Candidatures"
                      stroke="#e08637"
                      strokeWidth={2.2}
                      fill="url(#gradCandidatures)"
                    />
                  )}
                  {(trendFilter === "all" || trendFilter === "contenus") && (
                    <Area
                      type="monotone"
                      dataKey="publications"
                      name="Articles publiés"
                      stroke="#10b981"
                      strokeWidth={2}
                      fill="url(#gradPublications)"
                    />
                  )}
                  {(trendFilter === "all" || trendFilter === "contenus") && (
                    <Area
                      type="monotone"
                      dataKey="inscriptions"
                      name="Billets événements"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                      fill="url(#gradInscriptions)"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Pipeline des candidatures (Donut) */}
      <Card className="lg:col-span-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChartIcon className="size-4 text-[#e08637]" />
              Pipeline des candidatures
            </CardTitle>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30">
              {acceptanceRate}% validées
            </span>
          </div>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            Répartition par étape de traitement
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-1 space-y-3">
          {!mounted ? (
            <ChartSkeleton height={180} />
          ) : totalApps === 0 ? (
            <div className="h-[180px] rounded-xl border border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center px-4">
              <ClipboardCheck className="size-7 text-slate-400 mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Aucune candidature déposée
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                La répartition par statut apparaîtra dès le premier dossier.
              </p>
            </div>
          ) : (
            <div className="relative h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={nonZeroStatuses}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={54}
                    outerRadius={78}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {nonZeroStatuses.map((entry) => (
                      <Cell key={entry.status} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums leading-none">
                  {totalApps}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                  Dossiers
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-1.5 pt-1">
            {data.applicationStatusBreakdown.map((item) => (
              <div
                key={item.status}
                className="flex items-center justify-between text-xs px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/50"
              >
                <span className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <span
                    className="size-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.label}
                </span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3. Activité par pôle stratégique (BarChart groupé) */}
      <Card className="lg:col-span-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="size-4 text-cyan-600 dark:text-cyan-400" />
            Activité par pôle stratégique
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            Comparatif Articles, Candidatures et Ressources pédagogiques
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          {!mounted ? (
            <ChartSkeleton height={240} />
          ) : (
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={poleChartData}
                  margin={{ top: 10, right: 12, left: -12, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#94a3b8"
                    strokeOpacity={0.2}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    width={32}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                  <Bar
                    dataKey="Articles"
                    fill="#836182"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={32}
                  />
                  <Bar
                    dataKey="Candidatures"
                    fill="#e08637"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={32}
                  />
                  <Bar
                    dataKey="Ressources"
                    fill="#0ea5e9"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. Profil socio-démographique & inclusion */}
      <Card className="lg:col-span-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="size-4 text-emerald-600 dark:text-emerald-400" />
              Profil socio-démographique &amp; inclusion
            </CardTitle>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#836182]/10 text-[#6d4c6c] dark:bg-[#836182]/25 dark:text-[#f4e6ea]">
              <ShieldCheck className="size-3" />
              {verifiedPct}% vérifiés
            </span>
          </div>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            Répartition par tranche d&apos;âge, genre, milieu et inclusion SDH
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-1 space-y-4">
          {!mounted ? (
            <ChartSkeleton height={155} />
          ) : (
            <div className="h-[155px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.demographics.byAgeGroup}
                  margin={{ top: 8, right: 12, left: -12, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#94a3b8"
                    strokeOpacity={0.2}
                  />
                  <XAxis
                    dataKey="group"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    width={32}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar
                    dataKey="count"
                    name="Comptes"
                    fill="#836182"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={42}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Barres synthétiques Genre / Milieu + Indicateurs SDH / Vérifiés */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 p-3 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold">
                <span className="text-slate-600 dark:text-slate-300">
                  Genre (H / F)
                </span>
                <span className="text-slate-900 dark:text-white tabular-nums">
                  {hommesCount} H • {femmesCount} F
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#836182]/30 overflow-hidden flex">
                <div
                  className="h-full bg-[#0ea5e9]"
                  style={{ width: `${hommesPct}%` }}
                />
                <div
                  className="h-full bg-[#836182]"
                  style={{ width: `${totalSexe > 0 ? 100 - hommesPct : 0}%` }}
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 p-3 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold">
                <span className="text-slate-600 dark:text-slate-300">
                  Milieu (Urbain / Rural)
                </span>
                <span className="text-slate-900 dark:text-white tabular-nums">
                  {urbainCount} U • {ruralCount} R
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-amber-500/25 overflow-hidden flex">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${urbainPct}%` }}
                />
                <div
                  className="h-full bg-amber-500"
                  style={{ width: `${totalMilieu > 0 ? 100 - urbainPct : 0}%` }}
                />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 px-3 py-2 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                Inclusion SDH
              </span>
              <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                {data.demographics.sdhCount} / {data.usersCount}
              </span>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 px-3 py-2 flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                E-mails confirmés
              </span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                {data.demographics.verifiedUsersCount} / {data.usersCount}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
