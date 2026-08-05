import {
  Users,
  FileText,
  TrendingUp,
  Eye,
  ArrowUpRight,
  Activity,
  Calendar,
  BookOpen,
  Lightbulb,
  Monitor,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

const programmes = [
  { label: "Éducation", icon: BookOpen, color: "bg-[#836182]/15 text-[#b9939e]", count: 2 },
  { label: "Entrepreneuriat", icon: Lightbulb, color: "bg-amber-500/15 text-amber-400", count: 3 },
  { label: "Numérique", icon: Monitor, color: "bg-blue-500/15 text-blue-400", count: 2 },
];

export default async function AdminDashboard() {
  // ── Session utilisateur connecté ──────────────────────────────────────────
  const session = await getSession();
  const currentUser = session
    ? {
        name: `${session.firstname} ${session.lastname}`,
        email: session.email,
        role: session.role,
      }
    : null;

  // ── Requêtes Prisma en parallèle ───────────────────────────────────────────
  const [usersCount, publishedArticlesCount, totalArticlesCount, recentArticlesRaw] =
    await Promise.all([
      prisma.user.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.post.count(),
      prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: { firstname: true, lastname: true, email: true },
          },
        },
      }),
    ]);

  const publicationRate =
    totalArticlesCount > 0
      ? Math.round((publishedArticlesCount / totalArticlesCount) * 100)
      : 0;

  const stats = [
    {
      label: "Utilisateurs inscrits",
      value: usersCount.toString(),
      sub: "Base de données",
      icon: Users,
    },
    {
      label: "Articles publiés",
      value: publishedArticlesCount.toString(),
      sub: `sur ${totalArticlesCount} au total`,
      icon: FileText,
    },
    {
      label: "Total des contenus",
      value: totalArticlesCount.toString(),
      sub: `${totalArticlesCount - publishedArticlesCount} en brouillon`,
      icon: Eye,
    },
    {
      label: "Taux de publication",
      value: `${publicationRate}%`,
      sub: "Articles actifs",
      icon: TrendingUp,
    },
  ];

  const recentArticles = recentArticlesRaw.map((article) => ({
    id: article.id,
    title: article.title,
    status: article.published ? "published" : "draft",
    date: article.createdAt.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    author: article.author
      ? `${article.author.firstname} ${article.author.lastname}`
      : "Auteur inconnu",
  }));

  return (
    <AdminShell
      title="Vue d'ensemble"
      subtitle="Tableau de bord et métriques d'activité ACCEENT"
      user={currentUser}
    >
      <div className="space-y-6 max-w-6xl">
        {/* ── Bannière de bienvenue moderne ──────────────────── */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-r from-[#836182]/20 via-[#18131d] to-[#090a0f] p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-zinc-400 text-xs font-medium mb-1.5 flex items-center gap-1.5">
                <Activity className="size-3.5 text-[#b9939e]" />
                {currentUser ? currentUser.name : "Administrateur"}
              </p>
              <h2 className="text-zinc-100 text-xl font-bold tracking-tight">
                Bienvenue sur l'espace d'administration ACCEENT
              </h2>
              <p className="text-zinc-400 text-sm mt-1">
                Aperçu en temps réel des utilisateurs et des contenus de la plateforme.
              </p>
            </div>

            <div className="hidden md:flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2 shrink-0 text-zinc-300 text-xs font-medium">
              <Calendar className="size-3.5 text-zinc-400" />
              <span>
                {new Date().toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* ── Cartes métriques KPI ───────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/[0.08] bg-[#12131a] p-5 shadow-xs hover:border-white/[0.15] transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-zinc-400 text-xs font-medium">{stat.label}</span>
                <div className="size-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#b9939e]">
                  <stat.icon className="size-4" />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <p className="text-zinc-100 text-2xl font-bold tracking-tight">
                  {stat.value}
                </p>
                <span className="text-zinc-500 text-xs font-normal">
                  {stat.sub}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Section principale : Articles + Programmes ───── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Articles récents */}
          <div className="lg:col-span-2 rounded-2xl border border-white/[0.08] bg-[#12131a] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-[#b9939e]" />
                <h3 className="text-zinc-100 font-semibold text-sm">Dernières publications</h3>
              </div>
              <a
                href="/admin/articles"
                className="text-xs text-[#b9939e] hover:text-zinc-100 transition-colors font-medium flex items-center gap-1"
              >
                Voir tout <ArrowUpRight className="size-3" />
              </a>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {recentArticles.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-sm">
                  Aucun article trouvé dans la base de données.
                </div>
              ) : (
                recentArticles.map((article) => (
                  <div
                    key={article.id}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors group"
                  >
                    <span
                      className={`shrink-0 size-2 rounded-full ${
                        article.status === "published"
                          ? "bg-emerald-400"
                          : "bg-amber-400"
                      }`}
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-zinc-200 text-sm font-medium truncate group-hover:text-white transition-colors">
                        {article.title}
                      </p>
                      <p className="text-zinc-500 text-xs mt-0.5 truncate">
                        Par {article.author}
                      </p>
                    </div>

                    <div className="hidden sm:flex items-center gap-3 shrink-0">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                          article.status === "published"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {article.status === "published" ? "Publié" : "Brouillon"}
                      </span>
                      <span className="text-zinc-500 text-xs">{article.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Programmes et Pôles */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#12131a] overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.06]">
              <Activity className="size-4 text-[#b9939e]" />
              <h3 className="text-zinc-100 font-semibold text-sm">Pôles d'activité</h3>
            </div>

            <div className="p-4 space-y-2.5">
              {programmes.map((prog) => (
                <div
                  key={prog.label}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors group cursor-pointer"
                >
                  <div className={`size-9 rounded-lg ${prog.color} flex items-center justify-center shrink-0`}>
                    <prog.icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-zinc-200 text-sm font-medium group-hover:text-white transition-colors">
                      {prog.label}
                    </p>
                    <p className="text-zinc-500 text-xs">{prog.count} programmes actifs</p>
                  </div>
                  <ArrowUpRight className="size-3.5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
