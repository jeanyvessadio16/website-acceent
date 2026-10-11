import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/Animations";

interface DomaineBottomCtaProps {
  currentDomaine: "Éducation" | "Entrepreneuriat" | "Numérique";
  title: string;
  description: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
}

const DOMAINES_DATA = [
  {
    nom: "Éducation",
    href: "/education",
    desc: "Tut-Tank, ACCEENT-Elles & soutien scolaire",
  },
  {
    nom: "Entrepreneuriat",
    href: "/entreprenariat",
    desc: "ACCEENT Incub & ateliers de création d'entreprise",
  },
  {
    nom: "Numérique",
    href: "/numerique",
    desc: "Robotique WRO, coding & IA AI4GOOD",
  },
];

export default function DomaineBottomCta({
  currentDomaine,
  title,
  description,
  primaryButtonText = "Nous contacter",
  primaryButtonHref = "/contact",
}: DomaineBottomCtaProps) {
  const otherDomaines = DOMAINES_DATA.filter(
    (d) => d.nom !== currentDomaine
  );

  return (
    <section className="bg-slate-50 py-16 md:py-20 border-t border-slate-200/60">
      <div className="section-container space-y-8">
        {/* Carte principale de conversion */}
        <FadeIn
          delay={0.2}
          direction="up"
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs md:p-12 text-center"
        >
          <div className="mx-auto max-w-3xl space-y-4">
            <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
              <span>Agir avec ACCEENT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-950">
              {title}
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600">
              {description}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4 pt-2">
              <Button
                asChild
                size="lg"
                className="rounded-full px-7 sm:px-8 bg-primary text-white hover:bg-primary/90 font-semibold shadow-xs transition-all hover:scale-[1.02]"
              >
                <Link href={primaryButtonHref}>
                  <span>{primaryButtonText}</span>
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-7 sm:px-8 border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold shadow-2xs hover:border-primary/50 transition-all"
              >
                <Link href="/about">
                  <span>Découvrir l&apos;équipe ACCEENT</span>
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-6 border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium shadow-2xs transition-all"
              >
                <Link href="/actualites">
                  <span>Voir nos actualités</span>
                </Link>
              </Button>
            </div>
          </div>
        </FadeIn>

        {/* Passerelle vers les autres piliers d'ACCEENT */}
        <FadeIn delay={0.3} direction="up">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Compass className="size-4 text-primary" />
              <span>Explorer nos autres pôles d&apos;intervention</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {otherDomaines.map((domaine) => (
                <div
                  key={domaine.href}
                  className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-primary/40 hover:bg-white transition-all group"
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors text-base">
                      Pôle {domaine.nom}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {domaine.desc}
                    </p>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    className="rounded-full shrink-0 bg-white text-slate-800 border border-slate-200 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-2xs"
                  >
                    <Link href={domaine.href}>
                      <span>Découvrir</span>
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
