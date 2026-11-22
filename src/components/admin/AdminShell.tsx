"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, UserCheck, LogOut, ChevronDown, Plus } from "lucide-react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/actions/auth";

interface AdminShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  user?: {
    name: string;
    email: string;
    role?: string;
  } | null;
  action?: React.ReactNode;
}

function resolveAdminTitle(pathname: string, isAdmin: boolean): string {
  if (pathname === "/admin") {
    return isAdmin ? "Console de Direction" : "Mon Espace Rédacteur";
  }
  if (pathname.startsWith("/admin/candidatures")) return "Candidatures Programmes";
  if (pathname.startsWith("/admin/utilisateurs")) return "Utilisateurs";
  if (pathname.startsWith("/admin/articles")) {
    return isAdmin ? "Articles & Actualités" : "Mes Articles";
  }
  if (pathname.startsWith("/admin/evenements")) return "Événements & Ateliers";
  if (pathname.startsWith("/admin/ressources")) return "Ressources Pédagogiques";
  if (pathname.startsWith("/admin/newsletter")) return "Newsletter & Diffusion";
  if (pathname.startsWith("/admin/partenaires")) return "Partenaires & Témoignages";
  if (pathname.startsWith("/admin/audit")) return "Journal d'audit & Sécurité";
  if (pathname.startsWith("/admin/parametres")) return "Paramètres & Profil";
  return isAdmin ? "Console de Direction" : "Espace Rédacteur";
}

export function AdminShell({ children, title, user, action }: AdminShellProps) {
  const pathname = usePathname();
  const contentRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === "ADMIN";
  const resolvedTitle = title ?? resolveAdminTitle(pathname, isAdmin);
  const resolvedAction =
    action ??
    (!isAdmin && pathname === "/admin" ? (
      <Link
        href="/admin/articles?new=true"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#836182] hover:bg-[#6f4f6e] text-white text-xs font-bold transition-colors shadow-xs"
      >
        <Plus className="size-3.5" />
        <span className="hidden sm:inline">Nouvel article</span>
      </Link>
    ) : null);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  const displayName = user?.name || "Administrateur";
  const displayRole = user?.role || "ADMIN";
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";

  return (
    <SidebarProvider className="h-dvh min-h-0 overflow-hidden">
      <div className="flex h-full w-full overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased">
        <AdminSidebar user={user} />

        <SidebarInset
          className={
            isAdmin
              ? "flex flex-col flex-1 min-w-0 h-full bg-slate-100/80 dark:bg-[#090d16] overflow-hidden"
              : "flex flex-col flex-1 min-w-0 h-full bg-slate-50 dark:bg-slate-950 overflow-hidden"
          }
        >
          {isAdmin && (
            <div className="h-0.5 w-full bg-gradient-to-r from-[#836182] via-[#a57da4] to-[#e08637] shrink-0" />
          )}

          {/* Topbar compacte et fixe */}
          <header className="shrink-0 z-30 flex h-14 items-center gap-3 px-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
            <SidebarTrigger className="text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl size-9 flex items-center justify-center transition-colors border border-slate-200 dark:border-slate-700 shrink-0 cursor-pointer" />

            <h1 className="flex-1 min-w-0 text-slate-900 dark:text-white font-bold text-base sm:text-lg tracking-tight truncate">
              {resolvedTitle}
            </h1>

            {resolvedAction && <div className="shrink-0">{resolvedAction}</div>}

            <ThemeToggle />

            {/* Menu Compte Utilisateur */}
            {isAdmin ? (
              <div className="inline-flex items-center gap-2 h-9 pl-1.5 pr-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 shrink-0">
                <span className="size-6 rounded-full bg-gradient-to-br from-[#836182] to-[#a57da4] flex items-center justify-center text-white font-bold text-[10px]">
                  {initials}
                </span>
                <span className="hidden lg:inline text-xs font-semibold text-slate-800 dark:text-slate-100 max-w-28 truncate">
                  {displayName}
                </span>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 h-9 pl-1.5 pr-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                    aria-label="Menu utilisateur"
                  >
                    <span className="size-6 rounded-full bg-gradient-to-br from-[#836182] to-[#a57da4] flex items-center justify-center text-white font-bold text-[10px]">
                      {initials}
                    </span>
                    <span className="hidden lg:inline text-xs font-semibold text-slate-800 dark:text-slate-100 max-w-28 truncate">
                      {displayName}
                    </span>
                    <ChevronDown className="size-3 text-slate-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {displayName}
                        </p>
                        <span className="px-1.5 py-0.5 rounded bg-[#836182]/15 text-[#6d4c6c] dark:bg-[#836182]/30 dark:text-[#f4e6ea] text-[10px] font-bold">
                          {displayRole}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user?.email || ""}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <UserCheck className="size-4 text-[#836182]" />
                      <span>Mon espace membre</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/admin/parametres" className="flex items-center gap-2">
                      <Settings className="size-4 text-slate-500" />
                      <span>Paramètres</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer text-left"
                    >
                      <LogOut className="size-4" />
                      <span>Se déconnecter</span>
                    </button>
                  </form>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </header>

          {/* Contenu Principal (scroll indépendant sous le header fixe) */}
          <div
            ref={contentRef}
            className={
              isAdmin
                ? "flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8 bg-slate-100/70 dark:bg-[#090d16]"
                : "flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8"
            }
          >
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
