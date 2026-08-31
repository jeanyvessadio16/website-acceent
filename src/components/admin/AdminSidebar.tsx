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
  Shield,
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

// ─── Éléments de Navigation ───────────────────────────────────────────────────

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
    label: "Utilisateurs",
    href: "/admin/utilisateurs",
    icon: Users,
  },
];

const navSecondary = [
  {
    label: "Site public",
    href: "/",
    icon: Globe,
    external: true,
  },
  {
    label: "Paramètres",
    href: "/admin/parametres",
    icon: Settings,
  },
];

// ─── Composant ────────────────────────────────────────────────────────────────

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
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";

  return (
    <Sidebar
      className="border-r border-white/10 bg-[#0e0f17] text-white"
      style={
        {
          "--sidebar-background": "#0e0f17",
          "--sidebar-foreground": "#ffffff",
          "--sidebar-border": "rgba(255,255,255,0.12)",
          "--sidebar-accent": "rgba(131,97,130,0.25)",
          "--sidebar-accent-foreground": "#ffffff",
          "--sidebar-primary": "#836182",
          "--sidebar-primary-foreground": "#ffffff",
          "--sidebar-ring": "#836182",
        } as React.CSSProperties
      }
    >
      {/* ── En-tête : Logo ACCEENT ──────────────────────────────── */}
      <SidebarHeader className="px-4 py-5">
        <Link
          href="/"
          className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#836182]/50 hover:bg-white/10 transition-all group"
        >
          <div className="size-10 rounded-xl bg-gradient-to-br from-[#836182] to-[#b9939e] flex items-center justify-center shadow-md shrink-0 transition-transform duration-200 group-hover:scale-105">
            <span className="font-black text-base tracking-wider">A</span>
          </div>
          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-primary font-black text-base tracking-wide">
              ACCEENT
            </span>
            <span className="text-[#b9939e] text-xs font-bold mt-0.5">
              Administration
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator className="bg-white/10 mx-4 my-1" />

      {/* ── Navigation Principale ─────────────────────────── */}
      <SidebarContent className="px-4 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#b9939e] text-xs font-black uppercase tracking-wider px-2 mb-3">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navMain.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={cn(
                        "group/item h-11 rounded-xl px-3.5 gap-3.5 transition-all duration-150",
                        "text-primary/70 hover:text-primary hover:bg-white/10",
                        active &&
                        "bg-gradient-to-r from-[#836182] to-[#6d4c6c] text-white font-bold border border-[#b9939e]/40 shadow-lg shadow-[#836182]/25"
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-3.5 w-full">
                        <item.icon
                          className={cn(
                            "size-5 shrink-0 transition-colors",
                            active
                              ? "text-white"
                              : "text-[#b9939e] group-hover/item:text-white"
                          )}
                        />
                        <span className="text-sm font-bold tracking-wide">{item.label}</span>
                        {active && (
                          <ChevronRight className="size-4 ml-auto text-white" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* ── Navigation Secondaire ──────────────────────── */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-[#b9939e] text-xs font-black uppercase tracking-wider px-2 mb-3">
            Général
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navSecondary.map((item) => {
                const active = isActive(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={cn(
                        "group/item h-11 rounded-xl px-3.5 gap-3.5 transition-all duration-150",
                        "text-primary/70 hover:text-primary hover:bg-white/10",
                        active &&
                        "bg-gradient-to-r from-[#836182] to-[#6d4c6c] text-white font-bold border border-[#b9939e]/40 shadow-lg shadow-[#836182]/25"
                      )}
                    >
                      <Link
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        className="flex items-center gap-3.5 w-full"
                      >
                        <item.icon
                          className={cn(
                            "size-5 shrink-0 transition-colors",
                            active
                              ? "text-white"
                              : "text-[#b9939e] group-hover/item:text-white"
                          )}
                        />
                        <span className="text-sm font-bold tracking-wide">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Pied de page : Profil utilisateur + Déconnexion ────── */}
      <SidebarFooter className="px-4 py-5">
        <SidebarSeparator className="bg-white/10 mb-4 mx-0" />

        {/* Carte de Profil Haute Lisibilité */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#171926] border border-white/15 shadow-md group/profile">
          <div className="size-10 rounded-full bg-gradient-to-br from-[#836182] to-[#b9939e] flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 justify-between">
              <p className="text-white text-xs font-extrabold truncate">{displayName}</p>
              <span className="px-2 py-0.5 rounded-full bg-[#836182] text-white border border-white/20 text-[10px] font-black shrink-0">
                {displayRole}
              </span>
            </div>
            <p className="text-slate-300 text-[11px] font-medium truncate mt-0.5">{displayEmail}</p>
          </div>
        </div>

        {/* Bouton de déconnexion */}
        <form action={logoutAction} className="mt-3">
          <button
            type="submit"
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl bg-red-500/80 text-white hover:text-white hover:bg-red-500/70 border border-red-500/30 transition-all text-xs font-bold group/logout cursor-pointer"
          >
            <LogOut className="size-4 shrink-0 transition-colors group-hover/logout:text-white" />
            Se déconnecter
          </button>
        </form>
      </SidebarFooter>
    </Sidebar>
  );
}
