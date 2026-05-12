"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const PROGRAMMES = [
  { nom: "Éducation", href: "/education" },
  { nom: "Entreprenariat", href: "/entreprenariat" },
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
    "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors outline-none",
    "hover:bg-muted/80 hover:text-foreground",
    "focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50",
  );

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 w-full border-b border-border/60 bg-background backdrop-blur-md">
        <div className="section-container flex h-16 items-center justify-between gap-4 sm:h-[4.25rem]">
          <Link
            href="/"
            className="relative flex h-10 w-[7.25rem] shrink-0 items-center justify-center overflow-hidden rounded-lg bg-blue-950 px-2 outline-none ring-1 ring-white/15 ring-offset-2 ring-offset-background transition-[opacity,box-shadow] hover:opacity-95 focus-visible:ring-2 focus-visible:ring-ring sm:h-11 sm:w-[8.25rem]"
            aria-label="ACCEENT — Accueil"
          >
            <Image
              src="/logo/logo-acceent.png"
              alt="ACCEENT"
              fill
              className="object-contain object-center p-1"
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
                <details className="relative">
                  <summary
                    className={cn(
                      "flex cursor-pointer list-none items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors outline-none select-none",
                      "hover:bg-muted/80 hover:text-foreground",
                      "focus-visible:bg-muted focus-visible:ring-2 focus-visible:ring-ring/50",
                      "[&::-webkit-details-marker]:hidden",
                    )}
                  >
                    Nos programmes
                    <ChevronDown
                      className="size-4 shrink-0 opacity-70"
                      aria-hidden
                    />
                  </summary>
                  <ul
                    className="absolute top-full left-0 z-50 mt-1.5 min-w-[11rem] rounded-lg border border-border bg-popover py-1 shadow-md"
                    role="list"
                  >
                    {PROGRAMMES.map((p) => (
                      <li key={p.href} className="px-2 py-0.5">
                        <Link
                          href={p.href}
                          className="block px-3 py-2 text-sm font-medium capitalize text-popover-foreground hover:bg-primary hover:text-primary-foreground rounded-sm"
                        >
                          {p.nom}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
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
            className="animate-in fade-in-0 slide-in-from-top-2 absolute top-16 right-0 left-0 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-border bg-background shadow-lg duration-200 sm:top-[4.25rem] sm:max-h-[calc(100dvh-4.25rem)]"
          >
            <ul className="section-container flex flex-col gap-1 py-4 pb-8">
              {links.slice(0, 2).map((lien) => (
                <li key={lien.id}>
                  <Link
                    href={lien.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex rounded-lg px-3 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-muted/80 active:bg-muted"
                  >
                    {lien.label}
                  </Link>
                </li>
              ))}
              <li>
                <details className="rounded-xl border border-border/80 bg-muted/30 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="cursor-pointer list-none px-4 py-3.5 text-base font-medium text-foreground">
                    Nos programmes
                  </summary>
                  <ul className="border-t border-border/60 px-2 pb-2">
                    {PROGRAMMES.map((p) => (
                      <li key={p.href}>
                        <Link
                          href={p.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-background/80"
                        >
                          {p.nom}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
              {links.slice(2).map((lien) => (
                <li key={lien.id}>
                  <Link
                    href={lien.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex rounded-lg px-3 py-3.5 text-base font-medium text-foreground transition-colors hover:bg-muted/80 active:bg-muted"
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
