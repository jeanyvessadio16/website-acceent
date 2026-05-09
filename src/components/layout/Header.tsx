"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { X, Menu } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      href: "/contact",
      label: "Contact",
    },
  ];

  return (
    <>
      <header className="w-full px-12 py-2 bg-cover bg-center fixed bg-white z-50 top-0 flex justify-between items-center shadow-sm">
        <div>
          <Link href="/">
            <Image
              src="/logo/favicon.ico"
              alt="Logo"
              width={50}
              height={50}
              className="bg-cover"
            />
          </Link>
        </div>
        <nav className="max-md:hidden">
          <ul className="flex items-center gap-5">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-semibold transition-colors duration-300 ease-in-out hover:text-blue-950/90"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="lg:hidden">
          <Button
            variant={"outline"}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="cursor-pointer"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <nav className="fixed top-16 left-0 w-full h-screen flex flex-col justify-center items-center bg-white shadow-md z-40">
          <ul className="flex flex-col items-center gap-5 py-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-semibold transition-colors duration-300 ease-in-out hover:text-blue-950/90"
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
