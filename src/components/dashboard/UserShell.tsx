"use client";

import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { UserSidebar } from "@/components/dashboard/UserSidebar";
import { Bell, Search } from "lucide-react";

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
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#090a0f] text-zinc-100 font-sans antialiased">
        <UserSidebar user={user} />

        <SidebarInset className="flex flex-col flex-1 bg-[#090a0f] overflow-hidden">
          {/* ── Topbar Espace Membre ───────────────────────────── */}
          <header className="sticky top-0 z-30 flex items-center gap-4 px-6 py-3.5 border-b border-white/[0.08] bg-[#090a0f]/80 backdrop-blur-md">
            <SidebarTrigger className="text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06] rounded-lg size-8 flex items-center justify-center transition-colors" />

            <div className="flex-1 min-w-0">
              <h1 className="text-zinc-100 font-bold text-base tracking-tight truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-zinc-400 text-xs font-normal mt-0.5 truncate">
                  {subtitle}
                </p>
              )}
            </div>

            {action && <div className="shrink-0">{action}</div>}

            <div className="hidden md:flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-1.5 w-56 focus-within:border-white/[0.2] transition-all">
              <Search className="size-3.5 text-zinc-500 shrink-0" />
              <input
                type="search"
                placeholder="Rechercher…"
                className="bg-transparent text-zinc-100 text-xs placeholder:text-zinc-500 outline-none flex-1 min-w-0 font-normal"
                aria-label="Recherche dans l'espace membre"
              />
            </div>

            <button
              type="button"
              aria-label="Notifications"
              className="relative size-8 rounded-lg border border-white/[0.08] bg-white/[0.04] flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.08] transition-colors"
            >
              <Bell className="size-3.5" />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[#b9939e]" />
            </button>
          </header>

          {/* ── Zone de contenu principal ───────────────────────── */}
          <main className="flex-1 overflow-auto p-6 md:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
