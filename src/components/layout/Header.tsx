"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { X, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const links = [
    {
      href: "/",
      label: "Accueil",
    },
    {
      href: "/about",
      label: "À propos",
    },
    {
      href: "/#contact",
      label: "Contact",
    },
  ];

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);

  return (
    <>
      <header
        className={`flex justify-center items-center fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "border-b border-slate-200/70 bg-white/95 shadow-sm backdrop-blur-md"
            : "border-b border-transparent bg-white/70 backdrop-blur-sm"
        }`}
      >
        <div className="section-container flex py-2 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo/favicon.ico"
              alt="Logo ACCEENT"
              width={42}
              height={42}
              className="rounded-md"
            />
          </Link>

          <nav className="hidden md:block" aria-label="Navigation principale">
            <ul className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 p-1.5 shadow-sm backdrop-blur">
              {links.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href.replace("/#contact", ""));

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`relative rounded-full px-4 py-2 text-sm font-medium transition ${
                        isActive && link.href !== "/#contact"
                          ? "bg-primary text-white shadow-sm"
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                      }`}
                    >
                      {link.label}
                      {isActive && link.href !== "/#contact" && (
                        <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-white/80" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="md:hidden">
            <Button
              variant={"outline"}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-full border-slate-300 bg-white"
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 top-20 z-30 bg-slate-950/25 md:hidden"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Fermer le menu mobile"
        />
      )}
      {isMenuOpen && (
        <nav
          className="fixed inset-x-0 top-20 z-40 border-b border-slate-200 bg-white/98 px-6 py-6 shadow-xl backdrop-blur-md md:hidden"
          aria-label="Navigation mobile"
        >
          <ul className="flex flex-col gap-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-xl px-4 py-3 text-base font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
