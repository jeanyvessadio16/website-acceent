"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";

const PROGRAMMES = [
  { nom: "Éducation", href: "/education" },
  { nom: "Entrepreneuriat", href: "/entreprenariat" },
  { nom: "Numérique", href: "/numerique" },
] as const;

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { id: 1, label: "Accueil", href: "/" },
    { id: 2, label: "À propos", href: "/about" },
    { id: 3, label: "Contact", href: "/contact" },
  ] as const;

  const navLinkClass = cn(
    "relative rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-all duration-300 outline-none",
    "hover:bg-primary/10 hover:text-primary",
    "focus-visible:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:text-primary",
  );

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 w-full border-b border-slate-200/50 bg-white backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-300">
        <div className="px-10 max-sm:px-3 flex h-16 items-center justify-between gap-4 sm:h-[4.25rem]">
          <Link
            href="/"
            className="relative flex w-48 h-48 mt-4  shrink-0 items-center justify-center overflow-hidden"
            aria-label="ACCEENT — Accueil"
          >
            <Image
              src="/logo/logoACCEENT.png"
              alt="ACCEENT"
              fill
              className="w-full object-cover object-center p-1"
              sizes="(max-width: 768px) 116px, 132px"
              priority
            />
          </Link>

          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Principal"
          >
            <ul className="flex items-center gap-1">
              {links.slice(0, 2).map((lien) => (
                <li key={lien.id}>
                  <Link href={lien.href} className={navLinkClass}>
                    {lien.label}
                  </Link>
                </li>
              ))}
              <li className="relative">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-all duration-300 outline-none select-none",
                        "hover:bg-primary/10 hover:text-primary",
                        "focus-visible:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:text-primary",
                        "data-[state=open]:bg-primary/10 data-[state=open]:text-primary",
                      )}
                    >
                      Nos programmes
                      <ChevronDown
                        className="size-4 shrink-0 opacity-70"
                        aria-hidden
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="mt-2 min-w-[12rem] rounded-xl border border-slate-200/80 bg-white/95 backdrop-blur-xl p-2 shadow-xl shadow-slate-200/50">
                    {PROGRAMMES.map((p) => (
                      <DropdownMenuItem
                        asChild
                        key={p.href}
                        className="cursor-pointer p-0 m-1"
                      >
                        <Link
                          href={p.href}
                          className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-700 outline-none transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary"
                        >
                          {p.nom}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
              {links.slice(2).map((lien) => (
                <li key={lien.id}>
                  <Link href={lien.href} className={navLinkClass}>
                    {lien.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen((o) => !o)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              className="touch-manipulation"
            >
              {isMenuOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="h-16 shrink-0 sm:h-[4.25rem]" aria-hidden />

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px]"
            aria-label="Fermer le menu"
            onClick={() => setIsMenuOpen(false)}
          />
          <nav
            id="mobile-navigation"
            className="animate-in fade-in-0 slide-in-from-top-2 absolute top-16 right-0 left-0 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-slate-200/50 bg-white/95 backdrop-blur-xl shadow-xl duration-300 sm:top-[4.25rem] sm:max-h-[calc(100dvh-4.25rem)]"
          >
            <ul className="section-container flex flex-col gap-1 py-4 pb-8">
              {links.slice(0, 2).map((lien) => (
                <li key={lien.id}>
                  <Link
                    href={lien.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex rounded-xl px-4 py-3.5 text-base font-medium text-slate-700 transition-colors hover:bg-primary/10 hover:text-primary active:bg-primary/20"
                  >
                    {lien.label}
                  </Link>
                </li>
              ))}
              <li>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-xl border border-slate-200/60 bg-slate-50 px-5 py-4 text-base font-medium text-slate-800 transition-colors hover:bg-primary/5 hover:border-primary/20 hover:text-primary"
                    >
                      Nos programmes
                      <ChevronDown
                        className="size-4 shrink-0 opacity-70"
                        aria-hidden
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="border-t border-border/60 px-2 pb-2 pt-1">
                    {PROGRAMMES.map((p) => (
                      <DropdownMenuItem asChild key={p.href}>
                        <Link
                          href={p.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex rounded-xl px-4 py-3.5 text-base font-medium text-slate-600 transition-colors hover:bg-primary/10 hover:text-primary"
                        >
                          {p.nom}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
              {links.slice(2).map((lien) => (
                <li key={lien.id}>
                  <Link
                    href={lien.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex rounded-xl px-4 py-3.5 text-base font-medium text-slate-700 transition-colors hover:bg-primary/10 hover:text-primary active:bg-primary/20"
                  >
                    {lien.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
