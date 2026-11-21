"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Mail, Menu, Phone, X } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";

// Liens simples de navigation
const NAV_SIMPLE = [{ label: "Accueil", href: "/" }] as const;

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
  { label: "Événements", href: "/evenements" },
] as const;

// Composant dropdown desktop (ouverture au survol et au focus clavier)
function DomainDropdown({
  domaine,
  pathname,
}: {
  domaine: (typeof NAV_DOMAINES)[number];
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive =
    pathname === domaine.href ||
    domaine.programmes.some((p) => pathname === p.href);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openMenu = () => {
    clearCloseTimer();
    setOpen(true);
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
      closeTimerRef.current = null;
    }, 120);
  };

  const closeImmediately = () => {
    clearCloseTimer();
    setOpen(false);
  };

  // Fermeture au clic extérieur et nettoyage du timer au démontage
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        if (closeTimerRef.current) {
          clearTimeout(closeTimerRef.current);
          closeTimerRef.current = null;
        }
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  return (
    <li
      ref={ref}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
      onFocus={openMenu}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          closeImmediately();
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          closeImmediately();
        }
      }}
    >
      <Link
        href={domaine.href}
        onClick={closeImmediately}
        aria-expanded={open}
        aria-haspopup="menu"
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
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50"
          >
            <div className="min-w-[13rem] rounded-xl border border-slate-200 bg-white shadow-lg p-1.5">
              {/* Lien vers la page principale du domaine */}
              <Link
                href={domaine.href}
                onClick={closeImmediately}
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
                  onClick={closeImmediately}
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

// Lien de navigation mobile épuré avec zone tactile >= 48px
function MobileNavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "flex min-h-12 items-center rounded-xl px-4 py-2.5 text-[15px] font-semibold transition-colors touch-manipulation",
          active
            ? "bg-primary text-white shadow-xs"
            : "bg-slate-50 text-slate-800 hover:bg-slate-100 active:bg-slate-200/70",
        )}
      >
        <span>{label}</span>
      </Link>
    </li>
  );
}

// Composant accordéon mobile exclusif pour un domaine
function MobileDomainAccordion({
  domaine,
  pathname,
  isOpen,
  onToggle,
  onClose,
}: {
  domaine: (typeof NAV_DOMAINES)[number];
  pathname: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const isActive =
    pathname === domaine.href ||
    domaine.programmes.some((p) => pathname === p.href);
  const panelId = `mobile-domain-${domaine.href.replace(/\W+/g, "")}`;

  return (
    <li>
      <div
        className={cn(
          "rounded-2xl border transition-colors",
          isActive || isOpen
            ? "border-primary/25 bg-primary/[0.03]"
            : "border-slate-200/80 bg-slate-50/70",
        )}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className={cn(
            "flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl px-4 py-2.5 text-left transition-colors touch-manipulation active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            isActive ? "text-primary" : "text-slate-800",
          )}
        >
          <span className="truncate text-[15px] font-semibold">
            {domaine.label}
          </span>

          <span className="flex items-center gap-2 shrink-0">
            <span className="rounded-full bg-slate-200/70 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
              {domaine.programmes.length}
            </span>
            <ChevronDown
              className={cn(
                "size-4 text-slate-500 transition-transform duration-200",
                isOpen && "rotate-180 text-primary",
              )}
              aria-hidden
            />
          </span>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id={panelId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="ml-4 mr-2 mb-2.5 pl-3.5 border-l-2 border-primary/20 flex flex-col gap-1 pt-1">
                <Link
                  href={domaine.href}
                  onClick={onClose}
                  className={cn(
                    "flex min-h-11 items-center rounded-xl px-3 py-2 text-sm font-semibold transition-colors touch-manipulation",
                    pathname === domaine.href
                      ? "bg-primary text-white shadow-2xs"
                      : "text-slate-800 hover:bg-white active:bg-slate-200/70",
                  )}
                >
                  Tous les programmes
                </Link>

                {domaine.programmes.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    onClick={onClose}
                    className={cn(
                      "flex min-h-11 items-center rounded-xl px-3 py-2 text-sm font-medium transition-colors touch-manipulation",
                      pathname === p.href
                        ? "bg-primary text-white font-semibold shadow-2xs"
                        : "text-slate-700 hover:bg-white active:bg-slate-200/70",
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
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const isMenuOpen = menuPath === pathname;
  const activeDomainHref =
    NAV_DOMAINES.find(
      (d) =>
        pathname === d.href || d.programmes.some((p) => pathname === p.href),
    )?.href ?? null;

  const openMenu = () => {
    setExpandedDomain(activeDomainHref);
    setMenuPath(pathname);
  };

  const closeMenu = () => {
    setMenuPath(null);
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  // Scroll listener for sticky header background shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll and support Escape key when mobile drawer is open
  useEffect(() => {
    if (!isMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuPath(null);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

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
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 flex h-16 sm:h-20 items-center justify-between gap-3 sm:gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="relative flex w-40 sm:w-64 lg:w-80 xl:w-88 h-14 sm:h-20 lg:h-24 shrink-0 items-center transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
            aria-label="ACCEENT — Accueil"
          >
            <Image
              src="/logo/logoACCEENT.png"
              alt="ACCEENT Ziguinchor"
              fill
              className="object-contain object-left scale-115 sm:scale-135 lg:scale-150 origin-left"
              sizes="(max-width: 640px) 160px, (max-width: 1024px) 256px, 320px"
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
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <Button
              asChild
              className="rounded-full bg-primary text-white hover:bg-primary/90 font-medium px-4 xl:px-5 py-2 h-auto text-xs xl:text-sm shadow-xs"
            >
              <Link href="/contact">Nous contacter</Link>
            </Button>
          </div>

          {/* Mobile & Tablet Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <Button
              asChild
              size="sm"
              className="hidden sm:inline-flex rounded-full bg-primary text-white hover:bg-primary/90 font-medium px-4 h-9 text-xs shadow-xs"
            >
              <Link href="/contact">Contact</Link>
            </Button>
            <Button
              ref={menuButtonRef}
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              className="h-11 w-11 touch-manipulation rounded-full border border-slate-200/80 bg-slate-50 hover:bg-slate-100 active:scale-95 text-slate-800 transition-all focus-visible:ring-2 focus-visible:ring-primary"
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
      <div className="h-16 sm:h-20 shrink-0" aria-hidden />

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
              onClick={closeMenu}
              aria-hidden
            />

            {/* Slide-out Panel (swipe-to-close compatible) */}
            <motion.nav
              id="mobile-navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              drag="x"
              dragDirectionLock
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0, right: 0.4 }}
              onDragEnd={(_event, info: PanInfo) => {
                if (info.offset.x > 80 || info.velocity.x > 400) {
                  closeMenu();
                }
              }}
              style={{ touchAction: "pan-y" }}
              className="relative w-[86vw] max-w-sm h-dvh max-h-dvh rounded-l-2xl bg-white shadow-2xl flex flex-col z-10 overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navigation mobile"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100 shrink-0">
                <Link
                  href="/"
                  className="relative w-40 h-12"
                  onClick={closeMenu}
                  aria-label="ACCEENT — Accueil"
                >
                  <Image
                    src="/logo/logoACCEENT.png"
                    alt="ACCEENT Ziguinchor"
                    fill
                    className="object-contain object-left scale-115 origin-left"
                    sizes="160px"
                  />
                </Link>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={closeMenu}
                  aria-label="Fermer le menu"
                  className="rounded-full h-10 w-10 touch-manipulation bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 transition-all"
                >
                  <X className="size-4" />
                </Button>
              </div>

              {/* Navigation Links — scrollable */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-5">
                {/* Accueil */}
                <ul className="flex flex-col gap-1.5">
                  {NAV_SIMPLE.map((lien) => (
                    <MobileNavLink
                      key={lien.href}
                      href={lien.href}
                      label={lien.label}
                      active={pathname === lien.href}
                      onClick={closeMenu}
                    />
                  ))}
                </ul>

                {/* Domaines avec accordéons exclusifs */}
                <div>
                  <p className="px-2 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Nos programmes
                  </p>
                  <ul className="flex flex-col gap-2">
                    {NAV_DOMAINES.map((domaine) => (
                      <MobileDomainAccordion
                        key={domaine.href}
                        domaine={domaine}
                        pathname={pathname}
                        isOpen={expandedDomain === domaine.href}
                        onToggle={() =>
                          setExpandedDomain((prev) =>
                            prev === domaine.href ? null : domaine.href,
                          )
                        }
                        onClose={closeMenu}
                      />
                    ))}
                  </ul>
                </div>

                {/* Vie de l'association */}
                <div>
                  <p className="px-2 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Vie de l&apos;association
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {NAV_END.map((lien) => (
                      <MobileNavLink
                        key={lien.href}
                        href={lien.href}
                        label={lien.label}
                        active={pathname === lien.href}
                        onClick={closeMenu}
                      />
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sticky Bottom Action Bar (safe-area aware) */}
              <div className="px-4 pt-3.5 pb-[max(1rem,env(safe-area-inset-bottom))] bg-slate-50/90 border-t border-slate-200/80 shrink-0 space-y-2.5">
                <Button
                  asChild
                  size="default"
                  className="w-full rounded-full bg-primary text-white font-semibold text-sm h-12 hover:bg-primary/90 shadow-sm"
                >
                  <Link href="/contact" onClick={closeMenu}>
                    Nous contacter
                  </Link>
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="tel:+221761417070"
                    className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition-colors hover:border-primary/40 hover:text-primary active:bg-slate-100 touch-manipulation"
                  >
                    <Phone className="size-3.5 text-primary shrink-0" aria-hidden />
                    <span>Appeler</span>
                  </a>
                  <a
                    href="mailto:info@acceent.org"
                    className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition-colors hover:border-primary/40 hover:text-primary active:bg-slate-100 touch-manipulation"
                  >
                    <Mail className="size-3.5 text-primary shrink-0" aria-hidden />
                    <span>E-mail</span>
                  </a>
                </div>
              </div>
            </motion.nav>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
