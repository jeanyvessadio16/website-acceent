"use client";

import Image from "next/image";
import Link from "next/link";
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { id: 1, label: "Accueil", href: "/" },
    { id: 2, label: "À propos", href: "/about" },
    { id: 3, label: "Contact", href: "/contact" },
  ] as const;

  const navLinkClass = cn(
    "relative rounded-full px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-300 outline-none",
    "hover:bg-primary/5 hover:text-primary",
    "focus-visible:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:text-primary",
  );

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 z-50 transition-all duration-500 ease-in-out",
          scrolled
            ? "top-0 w-full sm:top-4 sm:w-[calc(100%-2rem)] sm:max-w-6xl sm:left-1/2 sm:-translate-x-1/2 sm:rounded-full bg-white/80 backdrop-blur-xl border-b sm:border border-slate-200/50 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            : "top-0 w-full bg-white/50 backdrop-blur-md border-b border-transparent shadow-none"
        )}
      >
        <div className="px-6 sm:px-8 flex h-20 sm:h-20 items-center justify-between gap-4">
          <Link
            href="/"
            className="relative flex w-36 h-36 mt-2 shrink-0 items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-105"
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
            className="hidden items-center gap-2 md:flex"
            aria-label="Principal"
          >
            <ul className="flex items-center gap-1 bg-white/40 p-1.5 rounded-full border border-slate-200/50 shadow-sm backdrop-blur-md">
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
                        "flex cursor-pointer items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-300 outline-none select-none",
                        "hover:bg-primary/5 hover:text-primary",
                        "focus-visible:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:text-primary",
                        "data-[state=open]:bg-primary/5 data-[state=open]:text-primary data-[state=open]:shadow-sm group",
                      )}
                    >
                      Nos programmes
                      <ChevronDown
                        className="size-4 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180"
                        aria-hidden
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="center"
                    sideOffset={12}
                    className="min-w-[14rem] rounded-2xl border border-white/40 bg-white/95 backdrop-blur-2xl p-2 shadow-2xl shadow-slate-200/50"
                  >
                    {PROGRAMMES.map((p) => (
                      <DropdownMenuItem
                        asChild
                        key={p.href}
                        className="cursor-pointer p-0 m-1"
                      >
                        <Link
                          href={p.href}
                          className="flex w-full items-center rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition-all hover:bg-primary/10 hover:text-primary hover:pl-5 focus:bg-primary/10 focus:text-primary data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary"
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
              className="touch-manipulation rounded-full relative z-[60] bg-white/50 backdrop-blur-md shadow-sm border border-slate-200/50 hover:bg-white/80"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="size-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="size-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20 shrink-0" aria-hidden />

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden bg-slate-900/40 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation"
          >
            <button
              type="button"
              className="absolute inset-0 w-full h-full cursor-default"
              aria-label="Fermer le menu"
              onClick={() => setIsMenuOpen(false)}
            />
            
            <motion.nav
              id="mobile-navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-white/95 backdrop-blur-2xl shadow-2xl border-l border-white/20 pt-24 px-6 overflow-y-auto"
            >
              <ul className="flex flex-col gap-3">
                {links.slice(0, 2).map((lien, index) => (
                  <motion.li 
                    key={lien.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.1 }}
                  >
                    <Link
                      href={lien.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center rounded-2xl px-5 py-4 text-lg font-bold text-slate-800 transition-colors hover:bg-primary/10 hover:text-primary active:scale-95"
                    >
                      {lien.label}
                    </Link>
                  </motion.li>
                ))}
                
                <motion.li
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="rounded-2xl border border-slate-200/60 bg-slate-50/50 p-2">
                    <div className="px-4 py-2 text-sm font-semibold text-slate-500 uppercase tracking-wider">
                      Nos programmes
                    </div>
                    <div className="mt-2 flex flex-col gap-1">
                      {PROGRAMMES.map((p) => (
                        <Link
                          key={p.href}
                          href={p.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center rounded-xl px-4 py-3 text-base font-semibold text-slate-700 transition-all hover:bg-primary/10 hover:text-primary hover:pl-6 active:scale-95"
                        >
                          <ChevronDown className="mr-2 size-4 -rotate-90 opacity-50" />
                          {p.nom}
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.li>

                {links.slice(2).map((lien, index) => (
                  <motion.li 
                    key={lien.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                  >
                    <Link
                      href={lien.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center rounded-2xl px-5 py-4 text-lg font-bold text-slate-800 transition-colors hover:bg-primary/10 hover:text-primary active:scale-95"
                    >
                      {lien.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
