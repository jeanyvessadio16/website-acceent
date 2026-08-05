import { UserShell } from "@/components/dashboard/UserShell";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import {
  UserCheck,
  Shield,
  Calendar,
  FileText,
  ArrowUpRight,
  BookOpen,
  Sparkles,
  Award,
} from "lucide-react";
import Link from "next/link";

export default async function UserDashboardPage() {
  const session = await getSession();

  let dbUser = null;
  if (session?.userId) {
    dbUser = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  const currentUser = dbUser
    ? {
        name: `${dbUser.firstname} ${dbUser.lastname}`,
        email: dbUser.email,
        role: dbUser.role,
      }
    : session
    ? {
        name: `${session.firstname} ${session.lastname}`,
        email: session.email,
        role: session.role,
      }
    : null;

  // Articles récents publiés pour les membres
  const recentArticles = await prisma.post.findMany({
    where: { published: true },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { firstname: true, lastname: true },
      },
    },
  });

  const joinDate = dbUser
    ? dbUser.createdAt.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Récemment";

  return (
    <UserShell
      title="Mon Espace Membre"
      subtitle="Bienvenue sur votre tableau de bord personnel"
      user={currentUser}
    >
      <div className="space-y-6 max-w-5xl">
        {/* ── Bannière de Bienvenue Personnelle ───────────────────── */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-r from-[#836182]/20 via-[#18131d] to-[#090a0f] p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium flex items-center gap-1">
                  <UserCheck className="size-3" />
                  Membre Actif
                </span>
                <span className="text-zinc-500 text-xs font-normal">
                  Inscrit le {joinDate}
                </span>
              </div>

              <h2 className="text-zinc-100 text-xl font-bold tracking-tight flex items-center gap-2">
                Ravi de vous revoir, {session?.firstname || "Membre"} !
                <Sparkles className="size-4 text-[#b9939e]" />
              </h2>
              <p className="text-zinc-400 text-sm mt-1">
                Accédez à vos informations, consultez les dernières publications et découvrez les initiatives d'ACCEENT.
              </p>
            </div>

            <Link
              href="/dashboard/profil"
              className="bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-zinc-100 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shrink-0"
            >
              Modifier mon profil
            </Link>
          </div>
        </div>

        {/* ── Cartes de Synthèse Personnelle ─────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/[0.08] bg-[#12131a] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-400 text-xs font-medium">Statut du compte</span>
              <div className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <UserCheck className="size-4" />
              </div>
            </div>
            <p className="text-zinc-100 text-lg font-bold">Vérifié & Actif</p>
            <p className="text-zinc-500 text-xs mt-1">Accès membre complet</p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#12131a] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-400 text-xs font-medium">Rôle d'accès</span>
              <div className="size-8 rounded-lg bg-[#836182]/20 border border-[#836182]/30 flex items-center justify-center text-[#b9939e]">
                <Shield className="size-4" />
              </div>
            </div>
            <p className="text-zinc-100 text-lg font-bold">
              {dbUser?.role || session?.role || "USER"}
            </p>
            <p className="text-zinc-500 text-xs mt-1">Espace réservé aux membres</p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#12131a] p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-400 text-xs font-medium">Membre depuis</span>
              <div className="size-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Calendar className="size-4" />
              </div>
            </div>
            <p className="text-zinc-100 text-lg font-bold">{joinDate}</p>
            <p className="text-zinc-500 text-xs mt-1">Compte ACCEENT</p>
          </div>
        </div>

        {/* ── Section : Articles & Ressources ─────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-white/[0.08] bg-[#12131a] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-[#b9939e]" />
                <h3 className="text-zinc-100 font-semibold text-sm">Publications récentes pour vous</h3>
              </div>
              <Link
                href="/"
                target="_blank"
                className="text-xs text-[#b9939e] hover:text-zinc-100 transition-colors font-medium flex items-center gap-1"
              >
                Voir sur le site <ArrowUpRight className="size-3" />
              </Link>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {recentArticles.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-sm">
                  Aucune publication disponible pour le moment.
                </div>
              ) : (
                recentArticles.map((article) => (
                  <div
                    key={article.id}
                    className="p-4 hover:bg-white/[0.02] transition-colors group flex items-start gap-3"
                  >
                    <div className="size-8 rounded-lg bg-[#836182]/15 border border-[#836182]/30 flex items-center justify-center text-[#b9939e] shrink-0 mt-0.5">
                      <FileText className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-zinc-200 text-sm font-semibold truncate group-hover:text-white transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-zinc-500 text-xs mt-0.5">
                        Par {article.author.firstname} {article.author.lastname} •{" "}
                        {article.createdAt.toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Raccourcis & Opportunités */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#12131a] p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
              <Award className="size-4 text-[#b9939e]" />
              <h3 className="text-zinc-100 font-semibold text-sm">Vos Raccourcis</h3>
            </div>

            <div className="space-y-2.5">
              <Link
                href="/dashboard/profil"
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all group"
              >
                <UserCheck className="size-4 text-[#b9939e]" />
                <span className="text-zinc-300 text-xs font-medium group-hover:text-white">
                  Gérer mes données personnelles
                </span>
              </Link>
              <Link
                href="/dashboard/programmes"
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all group"
              >
                <BookOpen className="size-4 text-blue-400" />
                <span className="text-zinc-300 text-xs font-medium group-hover:text-white">
                  Découvrir les programmes ACCEENT
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </UserShell>
  );
}
