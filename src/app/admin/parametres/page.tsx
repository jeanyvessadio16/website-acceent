import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/admin/ProfileForm";
import { ProgramSettingsManager } from "@/components/admin/ProgramSettingsManager";
import {
  Shield,
  Database,
  Globe,
  UserCheck,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { getProgramsWithStatus } from "@/repositories/program.repository";

export const metadata: Metadata = {
  title: "Paramètres",
};

export default async function ParametresPage() {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "AUTHOR")) {
    redirect("/auth/login");
  }

  const isAdmin = session.role === "ADMIN";

  const [dbUser, programsWithStatus] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        firstname: true,
        lastname: true,
        email: true,
        role: true,
        age: true,
        sexe: true,
        milieuResidence: true,
        telephone: true,
        sdh: true,
      },
    }),
    isAdmin ? getProgramsWithStatus() : Promise.resolve(null),
  ]);

  const initialProfile = dbUser || {
    firstname: session.firstname || "Utilisateur",
    lastname: session.lastname || "",
    email: session.email || "",
    role: session.role || "USER",
    age: 25,
    sexe: "HOMME" as const,
    milieuResidence: "URBAIN" as const,
    telephone: "",
    sdh: false,
  };

  const shortcuts = [
    ...(isAdmin
      ? [
          {
            href: "/admin/audit",
            icon: Shield,
            label: "Sécurité & Journal d'audit",
            desc: "Sessions, exports et traçabilité complète",
          },
          {
            href: "/admin/utilisateurs",
            icon: Users,
            label: "Utilisateurs & Rôles",
            desc: "Gérer les comptes, accès et rôles",
          },
          {
            href: "/api/health",
            icon: Database,
            label: "Santé Base de données",
            desc: "Vérifier le statut PostgreSQL / Supabase",
            external: true,
          },
        ]
      : [
          {
            href: "/dashboard",
            icon: UserCheck,
            label: "Mon espace membre",
            desc: "Mes candidatures, billets PDF et newsletter",
          },
        ]),
    {
      href: "/",
      icon: Globe,
      label: "Site public ACCEENT",
      desc: "Consulter le portail visiteur en direct",
      external: true,
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {isAdmin && programsWithStatus && (
        <ProgramSettingsManager initialPrograms={programsWithStatus} />
      )}

      <ProfileForm initialUser={initialProfile} />

      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider px-1">
          Espaces &amp; Supervision
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {shortcuts.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              target={s.external ? "_blank" : undefined}
              rel={s.external ? "noopener noreferrer" : undefined}
              className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#836182]/50 transition-colors group shadow-xs"
            >
              <div className="size-9 rounded-lg bg-[#836182]/10 border border-[#836182]/25 flex items-center justify-center shrink-0 text-[#836182] dark:text-[#d8b4d7]">
                <s.icon className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-900 dark:text-white font-semibold text-sm truncate">
                  {s.label}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 truncate">
                  {s.desc}
                </p>
              </div>
              <ArrowUpRight className="size-4 text-slate-400 group-hover:text-[#836182] shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
