import Link from "next/link";
import { ArrowRight, Calendar, FileText, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface LegalSection {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

interface LegalPageLayoutProps {
  badgeLabel: string;
  icon: "cgu" | "privacy";
  title: string;
  subtitle: string;
  updatedAt: string;
  crossLink: {
    href: string;
    label: string;
  };
  sections: LegalSection[];
}

export function LegalPageLayout({
  badgeLabel,
  icon,
  title,
  subtitle,
  updatedAt,
  crossLink,
  sections,
}: LegalPageLayoutProps) {
  const HeaderIcon = icon === "cgu" ? FileText : ShieldCheck;

  return (
    <div className="bg-slate-50/70">
      {/* En-tête documentaire */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-slate-950 py-14 sm:py-20 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-[#836182]/25 blur-3xl"
        />
        <div className="section-container relative z-10 max-w-4xl space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-[#e6cfe5]">
            <HeaderIcon className="size-3.5" aria-hidden />
            <span>{badgeLabel}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            {title}
          </h1>

          <p className="max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed">
            {subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1">
              <Calendar className="size-3.5 text-[#d8b4d7]" aria-hidden />
              Dernière mise à jour : {updatedAt}
            </span>
            <Link
              href={crossLink.href}
              className="inline-flex items-center gap-1.5 font-semibold text-[#d8b4d7] hover:text-white transition-colors"
            >
              <span>{crossLink.label}</span>
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* Sommaire + Articles */}
      <section className="py-12 sm:py-16">
        <div className="section-container max-w-4xl space-y-8">
          {/* Sommaire rapide */}
          <nav
            aria-label="Sommaire"
            className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs"
          >
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Sommaire
            </h2>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="inline-flex items-baseline gap-2 text-slate-700 hover:text-primary transition-colors font-medium"
                  >
                    <span className="text-xs font-bold text-primary shrink-0">
                      {String(index + 1).padStart(2, "0")}.
                    </span>
                    <span>{section.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Corps des articles */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs divide-y divide-slate-100">
            {sections.map((section, index) => (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-24 py-7 first:pt-0 last:pb-0 space-y-3"
              >
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-baseline gap-2.5">
                  <span className="text-sm font-extrabold text-primary">
                    {index + 1}.
                  </span>
                  <span>{section.title}</span>
                </h2>

                {section.paragraphs.map((paragraph, pIdx) => (
                  <p
                    key={pIdx}
                    className="text-sm sm:text-[15px] text-slate-600 leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}

                {section.bullets && section.bullets.length > 0 && (
                  <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-[15px] text-slate-600 leading-relaxed pt-1">
                    {section.bullets.map((item, bIdx) => (
                      <li key={bIdx}>{item}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>

          {/* Bloc contact juridique & inscription */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Questions ou exercice de vos droits
              </h2>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <MapPin className="size-4 text-primary shrink-0" aria-hidden />
                  <span>Association ACCEENT — Quartier Santhiaba, Ziguinchor, Sénégal</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="size-4 text-primary shrink-0" aria-hidden />
                  <a
                    href="mailto:info@acceent.org"
                    className="font-medium text-primary hover:underline"
                  >
                    info@acceent.org
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="size-4 text-primary shrink-0" aria-hidden />
                  <a
                    href="tel:+221761417070"
                    className="font-medium text-slate-700 hover:text-primary"
                  >
                    +221 76 141 70 70
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-2.5 shrink-0">
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/contact">Nous contacter</Link>
              </Button>
              <Button asChild className="rounded-full bg-primary text-white hover:bg-primary/90">
                <Link href="/auth/register">Créer un compte</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
