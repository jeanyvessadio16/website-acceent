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
  Plus,
  Globe,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import Link from "next/link";

const programmes = [
  { label: "Éducation", icon: BookOpen, color: "bg-[#836182]/20 text-[#b9939e] border border-[#836182]/30", count: 2, href: "/education" },
  { label: "Entrepreneuriat", icon: Lightbulb, color: "bg-amber-500/15 text-amber-300 border border-amber-500/20", count: 3, href: "/entreprenariat" },
  { label: "Numérique", icon: Monitor, color: "bg-cyan-500/15 text-cyan-300 border border-cyan-500/20", count: 2, href: "/numerique" },
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

  // ── Requêtes Prisma sécurisées en parallèle ───────────────────────────────
  let usersCount = 0;
  let publishedArticlesCount = 0;
  let totalArticlesCount = 0;
  let recentArticlesRaw: Array<{
    id: string;
    title: string;
    published: boolean;
    createdAt: Date;
    author: { firstname: string; lastname: string; email: string } | null;
  }> = [];
  let dbError = false;

  try {
    const [uCount, pubCount, totCount, recRaw] = await Promise.all([
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
    usersCount = uCount;
    publishedArticlesCount = pubCount;
    totalArticlesCount = totCount;
    recentArticlesRaw = recRaw;
  } catch (err) {
    console.error("Admin Dashboard DB error:", err);
    dbError = true;
  }

  const publicationRate =
    totalArticlesCount > 0
      ? Math.round((publishedArticlesCount / totalArticlesCount) * 100)
      : 0;

  const stats = [
    {
      label: "Utilisateurs inscrits",
      value: usersCount.toString(),
      sub: "Membres enregistrés",
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
      sub: "Articles actifs en ligne",
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
      : "ACCEENT",
  }));

  return (
    <AdminShell
      title="Vue d'ensemble"
      subtitle="Tableau de bord principal et gestion des activités ACCEENT"
      user={currentUser}
      action={
        <Link
          href="/admin/articles"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#836182] to-[#6d4c6c] hover:from-[#926d91] hover:to-[#7b577a] text-white text-xs font-bold transition-all shadow-md shadow-[#836182]/20"
        >
          <Plus className="size-4" />
          <span>Gérer les articles</span>
        </Link>
      }
    >
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* ── Notification si DB hors-ligne ──────────────────── */}
        {dbError && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200 flex items-center gap-3">
            <AlertTriangle className="size-5 shrink-0 text-amber-400" />
            <div className="text-xs sm:text-sm">
              <p className="font-bold text-amber-100">Base de données momentanément indisponible</p>
              <p className="text-amber-300/90 mt-0.5">
                Vérifiez que votre base de données PostgreSQL / Supabase est active.
              </p>
            </div>
          </div>
        )}

        {/* ── Bannière de bienvenue dynamique ──────────────────── */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#291a28] via-[#1a121c] to-[#0d0e14] p-6 md:p-8 shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#836182]/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#836182]/30 border border-[#836182]/40 text-[#f1e3e7] text-xs font-semibold">
                <Sparkles className="size-3.5 text-[#b9939e]" />
                <span>Espace Administrateur</span>
              </div>
              <h2 className="text-white text-2xl sm:text-3xl font-extrabold tracking-tight">
                Bienvenue, {currentUser ? currentUser.name : "Administrateur"} 👋
              </h2>
              <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
                Suivez en temps réel l'activité, gérez vos publications et supervisez les membres de la plateforme ACCEENT.
              </p>
            </div>

            {/* Raccourcis d'action rapide */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/admin/articles"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-100 text-xs font-bold transition-all"
              >
                <Plus className="size-4 text-[#b9939e]" />
                <span>Nouveau contenu</span>
              </Link>
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all"
              >
                <Globe className="size-4 text-slate-400" />
                <span>Aperçu du site</span>
              </Link>
              <div className="hidden xl:flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-slate-300 text-xs font-medium">
                <Calendar className="size-3.5 text-[#b9939e]" />
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
        </div>

        {/* ── Cartes métriques KPI (Accessibilité & Contraste Haute Définition) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group relative rounded-2xl border border-white/10 bg-[#12141d] p-6 shadow-md hover:border-[#836182]/50 hover:bg-[#161824] transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#836182]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-300 text-xs font-bold uppercase tracking-wider">{stat.label}</span>
                <div className="size-9 rounded-xl bg-[#836182]/20 border border-[#836182]/30 flex items-center justify-center text-[#b9939e] group-hover:scale-110 transition-transform">
                  <stat.icon className="size-4" />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f4e6ea] to-[#b9939e]">
                  {stat.value}
                </p>
                <span className="text-slate-400 text-xs font-medium">
                  {stat.sub}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Section principale : Articles Récents + Pôles d'activité ───── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles récents */}
          <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-[#12141d] overflow-hidden shadow-lg">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <FileText className="size-4 text-[#b9939e]" />
                <h3 className="text-slate-100 font-bold text-base">Dernières publications</h3>
              </div>
              <Link
                href="/admin/articles"
                className="text-xs text-[#b9939e] hover:text-white transition-colors font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
              >
                <span>Toutes les publications</span>
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-white/5">
              {recentArticles.length === 0 ? (
                <div className="p-10 text-center text-slate-400 text-sm leading-relaxed">
                  Aucun article publié pour le moment ou base de données inactive.
                </div>
              ) : (
                recentArticles.map((article) => (
                  <div
                    key={article.id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.03] transition-colors group"
                  >
                    <span
                      className={`shrink-0 size-2.5 rounded-full ${
                        article.status === "published"
                          ? "bg-emerald-400 shadow-sm shadow-emerald-400/50"
                          : "bg-amber-400 shadow-sm shadow-amber-400/50"
                      }`}
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-slate-100 text-sm font-semibold truncate group-hover:text-[#b9939e] transition-colors">
                        {article.title}
                      </p>
                      <p className="text-slate-400 text-xs mt-1 truncate">
                        Auteur : <span className="text-slate-300 font-medium">{article.author}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          article.status === "published"
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                            : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                        }`}
                      >
                        {article.status === "published" ? "Publié" : "Brouillon"}
                      </span>
                      <span className="hidden sm:inline text-slate-400 text-xs font-medium">{article.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Programmes et Pôles d'activité */}
          <div className="rounded-3xl border border-white/10 bg-[#12141d] overflow-hidden shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 px-6 py-5 border-b border-white/10 bg-white/[0.02]">
                <Activity className="size-4 text-[#b9939e]" />
                <h3 className="text-slate-100 font-bold text-base">Pôles d'action ACCEENT</h3>
              </div>

              <div className="p-5 space-y-3.5">
                {programmes.map((prog) => (
                  <Link
                    key={prog.label}
                    href={prog.href}
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#836182]/40 hover:bg-white/[0.06] transition-all group"
                  >
                    <div className={`size-10 rounded-xl ${prog.color} flex items-center justify-center shrink-0`}>
                      <prog.icon className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-100 text-sm font-bold group-hover:text-[#b9939e] transition-colors">
                        {prog.label}
                      </p>
                      <p className="text-slate-400 text-xs font-medium">{prog.count} volets stratégiques</p>
                    </div>
                    <ArrowUpRight className="size-4 text-slate-400 group-hover:text-white transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Information d'impact */}
            <div className="p-5 m-5 rounded-2xl border border-[#836182]/30 bg-[#836182]/10 text-xs text-slate-300 leading-relaxed">
              <p className="font-bold text-[#f4e6ea] mb-1">Impact territorial</p>
              Programmes conçus et déployés pour les jeunes et les femmes de Ziguinchor.
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

