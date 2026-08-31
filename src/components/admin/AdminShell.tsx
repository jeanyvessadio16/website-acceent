"use client";

import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Bell, Search } from "lucide-react";

interface AdminShellProps {
  children: React.ReactNode;
  /** Titre de la page affiché dans la topbar */
  title: string;
  /** Sous-titre ou breadcrumb optionnel */
  subtitle?: string;
  /** Utilisateur actuellement connecté */
  user?: {
    name: string;
    email: string;
    role?: string;
  } | null;
  /** Élément d'action optionnel affiché dans l'en-tête (ex: bouton Ajouter) */
  action?: React.ReactNode;
}

export function AdminShell({ children, title, subtitle, user, action }: AdminShellProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#0b0c12] text-slate-100 font-sans antialiased">
        <AdminSidebar user={user} />

        <SidebarInset className="flex flex-col flex-1 bg-[#0b0c12] overflow-hidden">
          {/* ── Topbar Moderne & Haute Lisibilité ────────────────────────── */}
          <header className="sticky top-0 z-30 flex items-center gap-4 px-6 py-4 border-b border-white/10 bg-[#0b0c12]/90 backdrop-blur-md">
            {/* Bouton Toggle Sidebar */}
            <SidebarTrigger className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl size-9 flex items-center justify-center transition-colors border border-white/5" />

            {/* Titre & Sous-titre de la page */}
            <div className="flex-1 min-w-0">
              <h1 className="text-white font-bold text-base md:text-lg tracking-tight truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-slate-300 text-xs font-medium mt-0.5 truncate">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Action optionnelle dans l'en-tête */}
            {action && <div className="shrink-0">{action}</div>}

            {/* Barre de recherche (Haute visibilité) */}
            <div className="hidden md:flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 w-64 focus-within:border-[#836182]/60 focus-within:bg-white/10 transition-all">
              <Search className="size-4 text-slate-400 shrink-0" />
              <input
                type="search"
                placeholder="Rechercher..."
                className="bg-transparent text-slate-100 text-xs placeholder:text-slate-400 outline-none flex-1 min-w-0 font-medium"
                aria-label="Recherche dans l'administration"
              />
            </div>

            {/* Notifications */}
            <button
              type="button"
              aria-label="Notifications"
              className="relative size-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Bell className="size-4" />
              <span className="absolute top-2 right-2 size-2 rounded-full bg-[#b9939e] ring-2 ring-[#0b0c12]" />
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
