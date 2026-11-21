"use client";

import Link from "next/link";
import { Globe, LayoutGrid, LogOut, User, ChevronDown } from "lucide-react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { UserSidebar } from "@/components/dashboard/UserSidebar";
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

interface UserShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  user?: {
    name: string;
    email: string;
    role?: string;
  } | null;
  action?: React.ReactNode;
}

export function UserShell({ children, title, subtitle, user, action }: UserShellProps) {
  const displayName = user?.name || "Membre ACCEENT";
  const displayRole = user?.role || "USER";
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "MB";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased">
        <UserSidebar user={user} />

        <SidebarInset className="flex flex-col flex-1 bg-slate-50 dark:bg-slate-950 overflow-hidden">
          {/* Topbar Espace Membre Haute Lisibilité */}
          <header className="sticky top-0 z-30 flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
            <SidebarTrigger className="text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl size-9 flex items-center justify-center transition-colors border border-slate-200 dark:border-slate-700 shrink-0 cursor-pointer" />

            <div className="flex-1 min-w-0">
              <h1 className="text-slate-900 dark:text-white font-bold text-base sm:text-lg tracking-tight truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 truncate hidden sm:block">
                  {subtitle}
                </p>
              )}
            </div>

            {action && <div className="shrink-0">{action}</div>}

            <ThemeToggle />

            {/* Menu Compte Personnel */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 h-9 pl-1.5 pr-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                  aria-label="Mon compte"
                >
                  <span className="size-6 rounded-full bg-gradient-to-br from-[#836182] to-[#a57da4] flex items-center justify-center text-white font-bold text-[10px]">
                    {initials}
                  </span>
                  <span className="hidden md:inline text-xs font-semibold text-slate-800 dark:text-slate-100 max-w-28 truncate">
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
                      <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 text-[10px] font-bold">
                        {displayRole}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {user?.email || ""}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(displayRole === "ADMIN" || displayRole === "AUTHOR") && (
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/admin" className="flex items-center gap-2">
                      <LayoutGrid className="size-4 text-[#836182]" />
                      <span>
                        {displayRole === "ADMIN" ? "Espace Admin" : "Espace Rédacteur"}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/dashboard/profil" className="flex items-center gap-2">
                    <User className="size-4 text-slate-500" />
                    <span>Mon profil &amp; sécurité</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Globe className="size-4 text-cyan-600" />
                    <span>Site public ACCEENT ↗</span>
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
          </header>

          {/* Zone de contenu principal */}
          <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
