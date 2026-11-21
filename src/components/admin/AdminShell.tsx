"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Globe,
  Download,
  FileSpreadsheet,
  FileText,
  Users,
  ClipboardCheck,
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  Mail,
  Handshake,
  ShieldAlert,
  Settings,
  UserCheck,
  LogOut,
  ChevronDown,
  Plus,
} from "lucide-react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  title: string;
  subtitle?: string;
  user?: {
    name: string;
    email: string;
    role?: string;
  } | null;
  action?: React.ReactNode;
}

interface CommandItem {
  label: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
  external?: boolean;
}

const COMMAND_ITEMS: CommandItem[] = [
  {
    label: "Vue d'ensemble",
    description: "Tableau de bord principal et indicateurs",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Articles & Actualités",
    description: "Rédiger, modifier ou publier un article",
    href: "/admin/articles",
    icon: FileText,
  },
  {
    label: "Rédiger un nouvel article",
    description: "Ouvrir l'éditeur de création d'article",
    href: "/admin/articles?new=true",
    icon: Plus,
  },
  {
    label: "Événements & Ateliers",
    description: "Gérer les ateliers, billets et feuilles de présence",
    href: "/admin/evenements",
    icon: CalendarDays,
  },
  {
    label: "Ressources pédagogiques",
    description: "Guides Tut-Tank, AI4Good et modèles",
    href: "/admin/ressources",
    icon: BookOpen,
  },
  {
    label: "Candidatures aux programmes",
    description: "Examiner et statuer sur les dossiers déposés",
    href: "/admin/candidatures",
    icon: ClipboardCheck,
    adminOnly: true,
  },
  {
    label: "Utilisateurs & Rôles",
    description: "Gérer les membres, auteurs et administrateurs",
    href: "/admin/utilisateurs",
    icon: Users,
    adminOnly: true,
  },
  {
    label: "Newsletter & Campagnes",
    description: "Abonnés et envois d'informations",
    href: "/admin/newsletter",
    icon: Mail,
    adminOnly: true,
  },
  {
    label: "Partenaires & Témoignages",
    description: "Gérer la vitrine de l'accueil public",
    href: "/admin/partenaires",
    icon: Handshake,
    adminOnly: true,
  },
  {
    label: "Journal d'audit & Sécurité",
    description: "Traçabilité des actions sensibles",
    href: "/admin/audit",
    icon: ShieldAlert,
    adminOnly: true,
  },
  {
    label: "Mon espace membre",
    description: "Accéder à mon tableau de bord personnel (/dashboard)",
    href: "/dashboard",
    icon: UserCheck,
  },
  {
    label: "Paramètres du compte",
    description: "Modifier mon profil et mon mot de passe",
    href: "/admin/parametres",
    icon: Settings,
  },
];

export function AdminShell({ children, title, subtitle, user, action }: AdminShellProps) {
  const router = useRouter();
  const [commandOpen, setCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");

  const isAdmin = user?.role === "ADMIN";
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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const visibleCommands = COMMAND_ITEMS.filter((item) => {
    if (item.adminOnly && !isAdmin) return false;
    const q = commandQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.label.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  });

  const navigateTo = (href: string) => {
    setCommandOpen(false);
    setCommandQuery("");
    router.push(href);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased">
        <AdminSidebar user={user} />

        <SidebarInset className="flex flex-col flex-1 bg-slate-50 dark:bg-slate-950 overflow-hidden">
          {/* Topbar Haute Lisibilité */}
          <header className="sticky top-0 z-30 flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
            <SidebarTrigger className="text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl size-9 flex items-center justify-center transition-colors border border-slate-200 dark:border-slate-700 shrink-0 cursor-pointer" />

            {/* Titre & Sous-titre */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5">
                <h1 className="text-slate-900 dark:text-white font-bold text-base sm:text-lg tracking-tight truncate">
                  {title}
                </h1>
                <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-500/15 dark:border-emerald-500/30 dark:text-emerald-300 text-[11px] font-semibold shrink-0">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Opérationnel
                </span>
              </div>
              {subtitle && (
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 truncate hidden sm:block">
                  {subtitle}
                </p>
              )}
            </div>

            {action && <div className="shrink-0">{action}</div>}

            {/* Bouton Navigation Rapide (Ctrl+K) */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setCommandOpen(true)}
              className="hidden md:inline-flex items-center gap-2 h-9 px-3 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-medium cursor-pointer"
            >
              <Search className="size-3.5 text-slate-400" />
              <span>Accès rapide…</span>
              <kbd className="ml-1 px-1.5 py-0.5 text-[10px] font-mono rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500">
                Ctrl K
              </kbd>
            </Button>

            {/* Menu Exports (ADMIN uniquement) */}
            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer"
                  >
                    <Download className="size-3.5 text-[#836182] dark:text-[#d8b4d7]" />
                    <span>Exporter</span>
                    <ChevronDown className="size-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60">
                  <DropdownMenuLabel className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Rapports &amp; Extractions
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <a
                      href="/api/admin/export/excel?type=overview"
                      download
                      className="flex items-center gap-2.5"
                    >
                      <FileSpreadsheet className="size-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Rapport global Excel (.xlsx)</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <a
                      href="/api/admin/export/pdf?type=overview"
                      download
                      className="flex items-center gap-2.5"
                    >
                      <FileText className="size-4 text-rose-600 dark:text-rose-400" />
                      <span>Rapport exécutif PDF</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <a
                      href="/api/admin/export/excel?type=applications"
                      download
                      className="flex items-center gap-2.5"
                    >
                      <ClipboardCheck className="size-4 text-amber-600 dark:text-amber-400" />
                      <span>Candidatures (.xlsx)</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <a
                      href="/api/admin/export/excel?type=users"
                      download
                      className="flex items-center gap-2.5"
                    >
                      <Users className="size-4 text-cyan-600 dark:text-cyan-400" />
                      <span>Annuaire membres (.xlsx)</span>
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Sélecteur de Thème Clair / Sombre */}
            <ThemeToggle />

            {/* Menu Compte Utilisateur */}
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
                    <span>Profil &amp; Paramètres</span>
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
                    <span>Voir le site public ↗</span>
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

          {/* Contenu Principal */}
          <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">{children}</main>
        </SidebarInset>
      </div>

      {/* Palette de navigation rapide (Dialog Ctrl+K) */}
      <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <DialogHeader className="px-4 pt-4 pb-2 border-b border-slate-200 dark:border-slate-800">
            <DialogTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Search className="size-4 text-[#836182]" />
              Navigation rapide
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Accédez instantanément aux modules autorisés pour votre compte ({displayRole}).
            </DialogDescription>
            <input
              type="search"
              autoFocus
              value={commandQuery}
              onChange={(e) => setCommandQuery(e.target.value)}
              placeholder="Tapez un module ou une action…"
              className="mt-2 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-[#836182]"
            />
          </DialogHeader>

          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {visibleCommands.length === 0 ? (
              <p className="text-center text-xs text-slate-500 py-6">
                Aucun résultat pour « {commandQuery} ».
              </p>
            ) : (
              visibleCommands.map((item) => (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => navigateTo(item.href)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer group"
                >
                  <div className="size-8 rounded-lg bg-[#836182]/10 text-[#836182] dark:bg-[#836182]/25 dark:text-[#d8b4d7] flex items-center justify-center shrink-0">
                    <item.icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {item.label}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {item.description}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
