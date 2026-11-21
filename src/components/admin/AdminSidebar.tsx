"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  Globe,
  CalendarDays,
  BookOpen,
  ClipboardCheck,
  Handshake,
  Mail,
  ShieldAlert,
  UserCheck,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { logoutAction } from "@/actions/auth";
import { cn } from "@/lib/utils";

const navMain = [
  {
    label: "Vue d'ensemble",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Articles",
    href: "/admin/articles",
    icon: FileText,
  },
  {
    label: "Événements",
    href: "/admin/evenements",
    icon: CalendarDays,
  },
  {
    label: "Ressources",
    href: "/admin/ressources",
    icon: BookOpen,
  },
];

const navPilotage = [
  {
    label: "Candidatures",
    href: "/admin/candidatures",
    icon: ClipboardCheck,
  },
  {
    label: "Utilisateurs",
    href: "/admin/utilisateurs",
    icon: Users,
  },
  {
    label: "Newsletter",
    href: "/admin/newsletter",
    icon: Mail,
  },
  {
    label: "Partenaires & Avis",
    href: "/admin/partenaires",
    icon: Handshake,
  },
  {
    label: "Journal d'audit",
    href: "/admin/audit",
    icon: ShieldAlert,
  },
];

const navSecondary = [
  {
    label: "Mon espace membre",
    href: "/dashboard",
    icon: UserCheck,
    external: false,
  },
  {
    label: "Paramètres",
    href: "/admin/parametres",
    icon: Settings,
    external: false,
  },
  {
    label: "Site public",
    href: "/",
    icon: Globe,
    external: true,
  },
];

export interface AdminSidebarProps {
  user?: {
    name: string;
    email: string;
    role?: string;
  } | null;
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  const displayName = user?.name || "Administrateur";
  const displayEmail = user?.email || "admin@acceent.org";
  const displayRole = user?.role || "ADMIN";
  const isAdmin = displayRole === "ADMIN";

  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* En-tête : Logo ACCEENT */}
      <SidebarHeader className="px-4 py-4">
        <Link
          href="/admin"
          className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 hover:border-[#836182]/50 transition-all group"
          title="Retour à l'accueil de l'espace"
        >
          <div className="size-9 rounded-lg bg-gradient-to-br from-[#836182] to-[#a57da4] flex items-center justify-center shadow-sm shrink-0 transition-transform duration-200 group-hover:scale-105">
            <span className="font-black text-white text-sm tracking-wider">A</span>
          </div>
          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-slate-900 dark:text-white font-extrabold text-sm tracking-wide">
              ACCEENT
            </span>
            <span className="text-[#836182] dark:text-[#d8b4d7] text-[11px] font-bold mt-0.5 uppercase tracking-wider">
              {isAdmin ? "Espace Admin" : "Espace Rédacteur"}
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator className="mx-3 my-0.5 bg-slate-200 dark:bg-slate-800" />

      <SidebarContent className="px-3 py-3">
        {/* Navigation Contenus */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider px-2.5 mb-1.5">
            {isAdmin ? "Navigation" : "Mon espace éditorial"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navMain.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={cn(
                        "group/item h-10 rounded-xl px-3 gap-3 transition-all duration-150",
                        active
                          ? "bg-[#836182] text-white font-semibold shadow-sm hover:bg-[#735272] hover:text-white data-[active=true]:bg-[#836182] data-[active=true]:text-white"
                          : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-3 w-full">
                        <item.icon
                          className={cn(
                            "size-4 shrink-0 transition-colors",
                            active
                              ? "text-white"
                              : "text-slate-500 dark:text-slate-400 group-hover/item:text-[#836182] dark:group-hover/item:text-[#d8b4d7]"
                          )}
                        />
                        <span className="text-sm font-medium">{item.label}</span>
                        {active && <ChevronRight className="size-3.5 ml-auto text-white/85" />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Pilotage Associatif (ADMIN uniquement) */}
        {isAdmin && (
          <SidebarGroup className="mt-3">
            <SidebarGroupLabel className="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider px-2.5 mb-1.5">
              Pilotage &amp; Gestion
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {navPilotage.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        className={cn(
                          "group/item h-10 rounded-xl px-3 gap-3 transition-all duration-150",
                          active
                            ? "bg-[#836182] text-white font-semibold shadow-sm hover:bg-[#735272] hover:text-white data-[active=true]:bg-[#836182] data-[active=true]:text-white"
                            : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                        )}
                      >
                        <Link href={item.href} className="flex items-center gap-3 w-full">
                          <item.icon
                            className={cn(
                              "size-4 shrink-0 transition-colors",
                              active
                                ? "text-white"
                                : "text-slate-500 dark:text-slate-400 group-hover/item:text-[#836182] dark:group-hover/item:text-[#d8b4d7]"
                            )}
                          />
                          <span className="text-sm font-medium">{item.label}</span>
                          {active && <ChevronRight className="size-3.5 ml-auto text-white/85" />}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Navigation Secondaire */}
        <SidebarGroup className="mt-3">
          <SidebarGroupLabel className="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider px-2.5 mb-1.5">
            Général
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navSecondary.map((item) => {
                const active = !item.external && isActive(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={cn(
                        "group/item h-10 rounded-xl px-3 gap-3 transition-all duration-150",
                        active
                          ? "bg-[#836182] text-white font-semibold shadow-sm hover:bg-[#735272] hover:text-white data-[active=true]:bg-[#836182] data-[active=true]:text-white"
                          : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                      )}
                    >
                      <Link
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        className="flex items-center gap-3 w-full"
                      >
                        <item.icon
                          className={cn(
                            "size-4 shrink-0 transition-colors",
                            active
                              ? "text-white"
                              : "text-slate-500 dark:text-slate-400 group-hover/item:text-[#836182] dark:group-hover/item:text-[#d8b4d7]"
                          )}
                        />
                        <span className="text-sm font-medium">{item.label}</span>
                        {item.external && (
                          <span className="ml-auto text-xs text-slate-400">↗</span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Pied de page : Utilisateur connecté + Déconnexion */}
      <SidebarFooter className="px-3 py-3 border-t border-slate-200 dark:border-slate-800">
        <Link
          href="/admin/parametres"
          className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 hover:border-[#836182]/50 transition-all group/profile"
          title="Gérer mon profil et mes paramètres"
        >
          <div className="size-9 rounded-full bg-gradient-to-br from-[#836182] to-[#a57da4] flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 justify-between">
              <p className="text-slate-900 dark:text-white text-xs font-bold truncate">
                {displayName}
              </p>
              <span className="px-1.5 py-0.5 rounded-md bg-[#836182]/15 text-[#6d4c6c] dark:bg-[#836182]/30 dark:text-[#f4e6ea] border border-[#836182]/25 text-[9px] font-extrabold shrink-0 tracking-wider">
                {displayRole}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate mt-0.5">
              {displayEmail}
            </p>
          </div>
        </Link>

        <form action={logoutAction} className="mt-2">
          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20 dark:border-rose-500/25 transition-colors text-xs font-semibold cursor-pointer"
          >
            <LogOut className="size-3.5 shrink-0" />
            <span>Déconnexion</span>
          </button>
        </form>
      </SidebarFooter>
    </Sidebar>
  );
}
