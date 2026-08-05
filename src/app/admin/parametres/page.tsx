import { AdminShell } from "@/components/admin/AdminShell";
import { ProfileForm } from "@/components/admin/ProfileForm";
import { Settings, Bell, Shield, Database } from "lucide-react";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export default async function ParametresPage() {
  const session = await getSession();

  let dbUser = null;
  if (session?.userId) {
    dbUser = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        firstname: true,
        lastname: true,
        email: true,
        role: true,
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

  const initialProfile = dbUser || {
    firstname: session?.firstname || "Paul",
    lastname: session?.lastname || "Coitou",
    email: session?.email || "paulcoitou@gmail.com",
    role: session?.role || "ADMIN",
  };

  return (
    <AdminShell
      title="Paramètres & Profil"
      subtitle="Gestion de votre compte et des paramètres de l'application"
      user={currentUser}
    >
      <div className="space-y-6 max-w-3xl">
        {/* Formulaire de modification du profil */}
        <ProfileForm initialUser={initialProfile} />

        {/* Options de configuration système */}
        <div className="space-y-3 pt-4 border-t border-white/[0.06]">
          <h3 className="text-zinc-500 text-[11px] font-semibold uppercase tracking-wider px-1">
            Préférences système
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: Bell, label: "Notifications", desc: "Alertes e-mail et notifications push" },
              { icon: Shield, label: "Sécurité & Audit", desc: "Sessions actives et journaux d'accès" },
              { icon: Database, label: "Base de données", desc: "Sauvegardes automatiques Supabase" },
              { icon: Settings, label: "Général", desc: "Nom du site, langue et fuseau horaire" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-3.5 p-4 rounded-2xl border border-white/[0.08] bg-[#12131a] hover:border-white/[0.15] transition-colors cursor-pointer group"
              >
                <div className="size-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0 text-[#b9939e]">
                  <s.icon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-zinc-200 font-medium text-sm truncate group-hover:text-white transition-colors">
                    {s.label}
                  </p>
                  <p className="text-zinc-500 text-xs mt-0.5 truncate">{s.desc}</p>
                </div>
                <span className="text-zinc-600 text-base group-hover:text-zinc-400 transition-colors">›</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
