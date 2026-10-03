"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

// Liens simples de navigation
const NAV_SIMPLE = [
  { label: "Accueil", href: "/" },
  { label: "À propos", href: "/about" },
] as const;

// Liens de domaine avec sous-programmes
const NAV_DOMAINES = [
  {
    label: "Éducation",
    href: "/education",
    programmes: [
      { label: "ACCEENT-Elles", href: "/acceent-elles" },
      { label: "Tut-Tank", href: "/tut-tank" },
    ],
  },
  {
    label: "Entrepreneuriat",
    href: "/entreprenariat",
    programmes: [
      { label: "ACCEENT Incub", href: "/acceent-incub" },
      { label: "Atelier Entrepreneuriat", href: "/atelier-entreprenariat" },
      { label: "Forum Entrepreneur", href: "/forum-entrepreneur" },
    ],
  },
  {
    label: "Numérique",
    href: "/numerique",
    programmes: [
      { label: "AI4Good", href: "/ai4good" },
      { label: "WRO", href: "/wro" },
    ],
  },
] as const;

const NAV_END = [
  { label: "Actualités", href: "/actualites" },
] as const;

// Composant dropdown desktop
function DomainDropdown({
  domaine,
  pathname,
}: {
  domaine: (typeof NAV_DOMAINES)[number];
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  const isActive =
    pathname === domaine.href ||
    domaine.programmes.some((p) => pathname === p.href);

  // Fermeture au clic extérieur
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <li ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={cn(
          "group flex cursor-pointer items-center gap-1 px-2.5 py-2 text-sm font-medium transition-colors outline-none select-none relative",
          isActive
            ? "text-primary font-semibold after:absolute after:bottom-0 after:left-2.5 after:right-2.5 after:h-0.5 after:bg-primary after:rounded-full"
            : "text-slate-600 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/50 rounded-md",
        )}
      >
        {domaine.label}
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 min-w-[13rem] rounded-xl border border-slate-200 bg-white shadow-lg p-1.5 z-50"
          >
            {/* Lien vers la page principale du domaine */}
            <Link
              href={domaine.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex w-full items-center rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors border-b border-slate-100 mb-1 pb-2",
                pathname === domaine.href
                  ? "bg-primary/10 text-primary"
                  : "text-slate-800 hover:bg-slate-100 hover:text-primary",
              )}
            >
              Tous les programmes
            </Link>
            {/* Sous-programmes */}
            {domaine.programmes.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex w-full items-center rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                  pathname === p.href
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-slate-700 hover:bg-slate-100 hover:text-primary",
                )}
              >
                {p.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

// Composant accordéon mobile pour un domaine
function MobileDomainAccordion({
  domaine,
  pathname,
  onClose,
}: {
  domaine: (typeof NAV_DOMAINES)[number];
  pathname: string;
  onClose: () => void;
}) {
  const isActive =
    pathname === domaine.href ||
    domaine.programmes.some((p) => pathname === p.href);

  const [open, setOpen] = useState(isActive);

  return (
    <li>
      <div className="rounded-xl border border-slate-200/70 bg-slate-50/80 p-2.5 my-0.5">
        {/* Bouton toggle */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "flex w-full items-center justify-between px-1 mb-1 text-sm font-semibold transition-colors",
            isActive ? "text-primary" : "text-slate-700",
          )}
        >
          <span>{domaine.label}</span>
          <ChevronDown
            className={cn(
              "size-4 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-0.5 pt-1">
                {/* Lien principal du domaine */}
                <Link
                  href={domaine.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center rounded-md px-3 py-1.5 text-xs font-semibold transition-colors border-b border-slate-200/60 pb-2 mb-0.5",
                    pathname === domaine.href
                      ? "bg-primary text-white"
                      : "text-slate-600 hover:bg-slate-200/60",
                  )}
                >
                  Tous les programmes
                </Link>
                {/* Sous-programmes */}
                {domaine.programmes.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                      pathname === p.href
                        ? "bg-primary text-white font-semibold"
                        : "text-slate-700 hover:bg-slate-200/60",
                    )}
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </li>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const getNavLinkClass = (href: string) => {
    const isActive = pathname === href;
    return cn(
      "relative px-2.5 py-2 text-sm font-medium transition-colors outline-none",
      isActive
        ? "text-primary font-semibold after:absolute after:bottom-0 after:left-2.5 after:right-2.5 after:h-0.5 after:bg-primary after:rounded-full"
        : "text-slate-600 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/50 rounded-md",
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
            className="relative flex w-48 sm:w-60 h-16 sm:h-18 shrink-0 items-center transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
            aria-label="ACCEENT — Accueil"
          >
            <Image
              src="/logo/logoACCEENT.png"
              alt="ACCEENT Ziguinchor"
              fill
              className="object-contain object-left scale-125 sm:scale-130 origin-left"
              sizes="(max-width: 640px) 200px, 240px"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Navigation principale"
          >
            <ul className="flex items-center gap-0.5 sm:gap-1 xl:gap-2">
              {/* Liens simples avant */}
              {NAV_SIMPLE.map((lien) => (
                <li key={lien.href}>
                  <Link href={lien.href} className={getNavLinkClass(lien.href)}>
                    {lien.label}
                  </Link>
                </li>
              ))}

              {/* Domaines avec dropdowns */}
              {NAV_DOMAINES.map((domaine) => (
                <DomainDropdown
                  key={domaine.href}
                  domaine={domaine}
                  pathname={pathname}
                />
              ))}

              {/* Liens après */}
              {NAV_END.map((lien) => (
                <li key={lien.href}>
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
              className="rounded-full bg-primary text-white hover:bg-primary/90 font-medium px-5 py-2 h-auto text-sm shadow-xs"
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

            {/* Slide-out Panel */}
            <motion.nav
              id="mobile-navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="relative w-full max-w-[300px] sm:max-w-xs h-dvh max-h-dvh bg-white shadow-2xl flex flex-col z-10"
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navigation mobile"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100 shrink-0">
                <Link
                  href="/"
                  className="relative w-44 h-13"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Image
                    src="/logo/logoACCEENT.png"
                    alt="ACCEENT Ziguinchor"
                    fill
                    className="object-contain object-left scale-125 origin-left"
                    sizes="176px"
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

              {/* Navigation Links — scrollable */}
              <div className="flex-1 overflow-y-auto px-4 py-4 gap-1">
                <ul className="flex flex-col gap-1">
                  {/* Liens simples avant */}
                  {NAV_SIMPLE.map((lien) => (
                    <li key={lien.href}>
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

                  {/* Domaines avec accordéons */}
                  {NAV_DOMAINES.map((domaine) => (
                    <MobileDomainAccordion
                      key={domaine.href}
                      domaine={domaine}
                      pathname={pathname}
                      onClose={() => setIsMenuOpen(false)}
                    />
                  ))}

                  {/* Liens après */}
                  {NAV_END.map((lien) => (
                    <li key={lien.href}>
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
