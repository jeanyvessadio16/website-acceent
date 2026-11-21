"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  BookOpen,
  Globe,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Send,
  CalendarDays,
  FolderOpen,
  LayoutGrid,
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
    label: "Mon tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Programmes",
    href: "/dashboard/programmes",
    icon: BookOpen,
  },
  {
    label: "Mes candidatures",
    href: "/dashboard/candidatures",
    icon: Send,
  },
  {
    label: "Événements & Billets",
    href: "/dashboard/evenements",
    icon: CalendarDays,
  },
  {
    label: "Ressources",
    href: "/dashboard/ressources",
    icon: FolderOpen,
  },
  {
    label: "Mon profil",
    href: "/dashboard/profil",
    icon: User,
  },
];

export interface UserSidebarProps {
  user?: {
    name: string;
    email: string;
    role?: string;
  } | null;
}

export function UserSidebar({ user }: UserSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact = false) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  const displayName = user?.name || "Membre ACCEENT";
  const displayEmail = user?.email || "membre@acceent.org";
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
    <Sidebar className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* En-tête : Espace Membre */}
      <SidebarHeader className="px-4 py-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 hover:border-[#836182]/50 transition-all group"
        >
          <div className="size-9 rounded-lg bg-gradient-to-br from-[#836182] to-[#a57da4] flex items-center justify-center shadow-sm shrink-0 transition-transform duration-200 group-hover:scale-105">
            <span className="text-white font-black text-sm tracking-wider">A</span>
          </div>
          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-slate-900 dark:text-white font-extrabold text-sm tracking-wide flex items-center gap-1">
              ACCEENT
              <ShieldCheck className="size-3.5 text-[#836182] dark:text-[#d8b4d7]" />
            </span>
            <span className="text-[#836182] dark:text-[#d8b4d7] text-[11px] font-bold mt-0.5 uppercase tracking-wider">
              Espace Personnel
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator className="mx-3 my-0.5 bg-slate-200 dark:bg-slate-800" />

      {/* Navigation Principale */}
      <SidebarContent className="px-3 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider px-2.5 mb-1.5">
            Mon Espace
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

        {/* Liens Général */}
        <SidebarGroup className="mt-3">
          <SidebarGroupLabel className="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider px-2.5 mb-1.5">
            Général
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {(displayRole === "ADMIN" || displayRole === "AUTHOR") && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    className="group/item h-10 rounded-xl px-3 gap-3 transition-all duration-150 bg-[#836182]/10 text-[#6d4c6c] dark:bg-[#836182]/25 dark:text-[#f4e6ea] border border-[#836182]/25 hover:bg-[#836182]/20 font-semibold"
                  >
                    <Link href="/admin" className="flex items-center gap-3 w-full">
                      <LayoutGrid className="size-4 shrink-0" />
                      <span className="text-sm">
                        {displayRole === "ADMIN" ? "Espace Admin" : "Espace Rédacteur"}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="group/item h-10 rounded-xl px-3 gap-3 transition-all duration-150 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Link
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full"
                  >
                    <Globe className="size-4 shrink-0 text-slate-500 dark:text-slate-400" />
                    <span className="text-sm font-medium">Site public</span>
                    <span className="ml-auto text-xs text-slate-400">↗</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Pied de page : Profil Membre + Déconnexion */}
      <SidebarFooter className="px-3 py-3 border-t border-slate-200 dark:border-slate-800">
        <Link
          href="/dashboard/profil"
          className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 hover:border-[#836182]/50 transition-all"
        >
          <div className="size-9 rounded-full bg-gradient-to-br from-[#836182] to-[#a57da4] flex items-center justify-center text-white font-bold text-xs shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 justify-between">
              <p className="text-slate-900 dark:text-white text-xs font-bold truncate">
                {displayName}
              </p>
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30 text-[9px] font-bold shrink-0">
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
            <span>Se déconnecter</span>
          </button>
        </form>
      </SidebarFooter>
    </Sidebar>
  );
}
