"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

const PROGRAMMES = [
  { nom: "Éducation", href: "/education" },
  { nom: "Entrepreneuriat", href: "/entreprenariat" },
  { nom: "Numérique", href: "/numerique" },
] as const;

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProgrammesOpen, setIsProgrammesOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Scroll listener for sticky header background shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navLinksBefore = [
    { id: 1, label: "Accueil", href: "/" },
    { id: 2, label: "À propos", href: "/about" },
  ] as const;

  const navLinksAfter = [
    { id: 3, label: "Nos actions", href: "/#actions" },
    { id: 4, label: "Actualités", href: "/actualites" },
  ] as const;

  const isProgramActive = PROGRAMMES.some((p) => pathname === p.href);

  const getNavLinkClass = (href: string) => {
    const isActive = pathname === href;
    return cn(
      "relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 outline-none",
      isActive
        ? "bg-primary text-white font-semibold shadow-xs"
        : "text-slate-700 hover:bg-slate-100 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/50",
    );
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-shadow duration-200",
          scrolled ? "shadow-md" : "shadow-xs",
        )}
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 flex h-20 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="relative flex w-44 sm:w-52 h-16 shrink-0 items-center overflow-hidden transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
            aria-label="ACCEENT — Accueil"
          >
            <Image
              src="/logo/logoACCEENT.png"
              alt="ACCEENT Ziguinchor"
              fill
              className="object-contain object-left scale-110 origin-left"
              sizes="(max-width: 640px) 176px, 208px"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Navigation principale"
          >
            <ul className="flex items-center gap-1 bg-slate-50/80 p-1.5 rounded-full border border-slate-200/60">
              {navLinksBefore.map((lien) => (
                <li key={lien.id}>
                  <Link href={lien.href} className={getNavLinkClass(lien.href)}>
                    {lien.label}
                  </Link>
                </li>
              ))}

              {/* Dropdown Programmes */}
              <li className="relative">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "flex cursor-pointer items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 outline-none select-none",
                        isProgramActive
                          ? "bg-primary text-white font-semibold"
                          : "text-slate-700 hover:bg-slate-100 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/50",
                        "data-[state=open]:bg-slate-100 data-[state=open]:text-primary group",
                      )}
                    >
                      Programmes
                      <ChevronDown
                        className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
                        aria-hidden
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    sideOffset={10}
                    className="min-w-[13rem] rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg"
                  >
                    {PROGRAMMES.map((p) => {
                      const isSubActive = pathname === p.href;
                      return (
                        <DropdownMenuItem
                          asChild
                          key={p.href}
                          className="cursor-pointer p-0 m-0.5"
                        >
                          <Link
                            href={p.href}
                            className={cn(
                              "flex w-full items-center rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                              isSubActive
                                ? "bg-primary/10 text-primary font-semibold"
                                : "text-slate-700 hover:bg-slate-100 hover:text-primary",
                            )}
                          >
                            {p.nom}
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>

              {navLinksAfter.map((lien) => (
                <li key={lien.id}>
                  <Link href={lien.href} className={getNavLinkClass(lien.href)}>
                    {lien.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA Principal Desktop */}
          <div className="hidden lg:flex items-center">
            <Button
              asChild
              size="default"
              className="rounded-full bg-primary text-white hover:bg-primary/90 font-medium px-5 shadow-xs"
            >
              <Link href="/contact">Nous contacter</Link>
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center lg:hidden">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen((o) => !o)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              className="touch-manipulation rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 focus-visible:ring-2 focus-visible:ring-primary"
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

      {/* Spacer matching fixed header height */}
      <div className="h-20 shrink-0" aria-hidden />

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden
            />

            {/* Compact Slide-out Panel fitting 100% viewport without scroll */}
            <motion.nav
              id="mobile-navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="relative w-full max-w-[300px] sm:max-w-xs h-dvh max-h-dvh bg-white shadow-2xl flex flex-col z-10 overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navigation mobile"
            >
              {/* Compact Header Bar */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100 shrink-0">
                <Link
                  href="/"
                  className="relative w-36 h-11 overflow-hidden"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Image
                    src="/logo/logoACCEENT.png"
                    alt="ACCEENT Ziguinchor"
                    fill
                    className="object-contain object-left scale-110 origin-left"
                    sizes="144px"
                  />
                </Link>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Fermer le menu"
                  className="rounded-full h-9 w-9 bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  <X className="size-4" />
                </Button>
              </div>

              {/* Navigation Links centered & sized to fit 100% viewport */}
              <div className="flex-1 flex flex-col justify-center px-4 py-3 gap-1 overflow-hidden">
                <ul className="flex flex-col gap-1">
                  {navLinksBefore.map((lien) => (
                    <li key={lien.id}>
                      <Link
                        href={lien.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          "flex items-center rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
                          pathname === lien.href
                            ? "bg-primary text-white font-semibold"
                            : "text-slate-800 hover:bg-slate-100",
                        )}
                      >
                        {lien.label}
                      </Link>
                    </li>
                  ))}

                  {/* Compact Programmes Group */}
                  <li>
                    <div className="rounded-xl border border-slate-200/70 bg-slate-50/80 p-2.5 my-1">
                      <button
                        type="button"
                        onClick={() => setIsProgrammesOpen((o) => !o)}
                        className="flex w-full items-center justify-between px-1 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5"
                      >
                        <span>Programmes</span>
                        <ChevronDown
                          className={cn(
                            "size-3.5 transition-transform duration-200",
                            isProgrammesOpen && "rotate-180",
                          )}
                        />
                      </button>
                      {isProgrammesOpen && (
                        <div className="flex flex-col gap-1">
                          {PROGRAMMES.map((p) => (
                            <Link
                              key={p.href}
                              href={p.href}
                              onClick={() => setIsMenuOpen(false)}
                              className={cn(
                                "flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                                pathname === p.href
                                  ? "bg-primary text-white font-semibold"
                                  : "text-slate-700 hover:bg-slate-200/60",
                              )}
                            >
                              {p.nom}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>

                  {navLinksAfter.map((lien) => (
                    <li key={lien.id}>
                      <Link
                        href={lien.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          "flex items-center rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
                          pathname === lien.href
                            ? "bg-primary text-white font-semibold"
                            : "text-slate-800 hover:bg-slate-100",
                        )}
                      >
                        {lien.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Action Button */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 shrink-0">
                <Button
                  asChild
                  size="default"
                  className="w-full rounded-full bg-primary text-white font-semibold text-sm h-11 hover:bg-primary/90"
                >
                  <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                    Nous contacter
                  </Link>
                </Button>
              </div>
            </motion.nav>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
