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
      className="border-r border-white/[0.08] bg-[#0c0d12]"
      style={
        {
          "--sidebar-background": "#0c0d12",
          "--sidebar-foreground": "#f4f4f5",
          "--sidebar-border": "rgba(255,255,255,0.08)",
          "--sidebar-accent": "rgba(255,255,255,0.04)",
          "--sidebar-accent-foreground": "#ffffff",
          "--sidebar-primary": "#836182",
          "--sidebar-primary-foreground": "#ffffff",
          "--sidebar-ring": "#836182",
        } as React.CSSProperties
      }
    >
      {/* ── En-tête : Logo ACCEENT ──────────────────────────────── */}
      <SidebarHeader className="px-4 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.06] transition-all group"
        >
          <div className="size-9 rounded-lg bg-gradient-to-br from-[#836182] to-[#b9939e] flex items-center justify-center shadow-sm shrink-0 transition-transform duration-200 group-hover:scale-105">
            <span className="text-white font-black text-sm tracking-wider">A</span>
          </div>
          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-zinc-100 font-bold text-sm tracking-wide">
              ACCEENT
            </span>
            <span className="text-zinc-400 text-xs font-medium mt-0.5">
              Administration
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator className="bg-white/[0.06] mx-3 my-1" />

      {/* ── Navigation Principale ─────────────────────────── */}
      <SidebarContent className="px-3 py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-500 text-[11px] font-semibold uppercase tracking-wider px-2 mb-2">
            Menu
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
                        "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]",
                        active &&
                          "bg-[#836182]/20 text-white font-semibold border border-[#836182]/40 shadow-xs"
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-3 w-full">
                        <item.icon
                          className={cn(
                            "size-4 shrink-0 transition-colors",
                            active
                              ? "text-[#b9939e]"
                              : "text-zinc-500 group-hover/item:text-zinc-300"
                          )}
                        />
                        <span className="text-sm font-medium">{item.label}</span>
                        {active && (
                          <ChevronRight className="size-3.5 ml-auto text-[#b9939e]" />
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
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-zinc-500 text-[11px] font-semibold uppercase tracking-wider px-2 mb-2">
            Général
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navSecondary.map((item) => {
                const active = isActive(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={cn(
                        "group/item h-10 rounded-xl px-3 gap-3 transition-all duration-150",
                        "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]",
                        active &&
                          "bg-[#836182]/20 text-white font-semibold border border-[#836182]/40 shadow-xs"
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
                              ? "text-[#b9939e]"
                              : "text-zinc-500 group-hover/item:text-zinc-300"
                          )}
                        />
                        <span className="text-sm font-medium">{item.label}</span>
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
      <SidebarFooter className="px-3 py-4">
        <SidebarSeparator className="bg-white/[0.06] mb-3 mx-0" />

        {/* Carte de Profil Minimaliste */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors group/profile">
          <div className="size-8 rounded-full bg-gradient-to-br from-[#836182] to-[#b9939e] flex items-center justify-center text-white font-semibold text-xs shrink-0 shadow-xs">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 justify-between">
              <p className="text-zinc-200 text-xs font-semibold truncate">{displayName}</p>
              <span className="px-1.5 py-0.5 rounded-full bg-[#836182]/30 text-[#b9939e] border border-[#836182]/40 text-[9px] font-semibold shrink-0">
                {displayRole}
              </span>
            </div>
            <p className="text-zinc-400 text-[11px] truncate mt-0.5">{displayEmail}</p>
          </div>
        </div>

        {/* Bouton de déconnexion minimaliste */}
        <form action={logoutAction} className="mt-1.5">
          <button
            type="submit"
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors text-xs font-medium group/logout cursor-pointer"
          >
            <LogOut className="size-3.5 shrink-0 transition-colors group-hover/logout:text-red-400" />
            Se déconnecter
          </button>
        </form>
      </SidebarFooter>
    </Sidebar>
  );
}
