// Pieds de page ou footer

import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { programmes } from "@/data/footer/programmes";
import { mediaLinks } from "@/data/footer/link-media";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-950 text-slate-300">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Logo et description */}
          <div className="space-y-6">
            <Link
              href="/"
              className="inline-block rounded-md bg-white/5 p-2 hover:cursor-pointer ring-1 ring-white/10 transition-colors hover:bg-white/10"
            >
              <Image
                src="/logo/logo-acceent.png"
                alt="Logo Acceent"
                width={140}
                height={45}
                className="h-8 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Programmes */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Programmes
            </h3>
            <ul className="mt-6 space-y-4">
              {programmes.map((programme) => (
                <li key={programme.name}>
                  <Link
                    href={programme.href}
                    className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                  >
                    {programme.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h3>
            <ul className="mt-6 space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-white" />
                <span className="text-sm text-slate-400">
                  Quartier Santhiaba, <br /> Ziguinchor, Sénégal
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-white" />
                <span className="text-sm text-slate-400">
                  +221 76 141 70 70
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-white" />
                <a
                  href="mailto:info@acceent.org"
                  className="text-sm text-slate-400 transition-colors hover:text-blue-400"
                >
                  info@acceent.org
                </a>
              </li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Suivez-nous
            </h3>
            <div className="mt-6 flex flex-wrap gap-3">
              {mediaLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 transition-all hover:bg-white hover:ring-blue-600"
                  aria-label={link.name}
                >
                  <Image
                    src={link.icon}
                    alt={link.name}
                    width={20}
                    height={20}
                    className="h-5 w-5 object-contain brightness-0 invert"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Ligne de séparation et Copyright */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            © {currentYear} ACCEENT. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="#" className="transition-colors hover:text-white">
              Mentions légales
            </Link>
            <Link href="#" className="transition-colors hover:text-white">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
