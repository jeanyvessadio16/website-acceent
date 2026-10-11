import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/Animations";

interface RelatedProgramme {
  nom: string;
  href: string;
  description?: string;
}

interface ProgrammeNavigationCtaProps {
  currentProgrammeTitle: string;
  parentDomaine: {
    nom: string;
    href: string;
  };
  callToActionText: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  relatedProgrammes?: RelatedProgramme[];
}

const ALL_DOMAINES = [
  { nom: "Éducation", href: "/education" },
  { nom: "Entrepreneuriat", href: "/entreprenariat" },
  { nom: "Numérique", href: "/numerique" },
];

export default function ProgrammeNavigationCta({
  currentProgrammeTitle,
  parentDomaine,
  callToActionText,
  primaryButtonText = "Nous contacter",
  primaryButtonHref = "/contact",
  relatedProgrammes = [],
}: ProgrammeNavigationCtaProps) {
  // Filtrer pour obtenir les autres domaines
  const otherDomaines = ALL_DOMAINES.filter(
    (d) => d.href !== parentDomaine.href
  );

  return (
    <FadeIn delay={0.4} direction="up" className="space-y-6 w-full">
      {/* ── Bloc d'action principal (CTA Banner) ── */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-white p-6 sm:p-10 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <span>Passez à l&apos;action</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Intéressé par {currentProgrammeTitle} ?
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {callToActionText}
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <Button
              asChild
              size="lg"
              className="rounded-full px-6 py-3 bg-primary text-white hover:bg-primary/90 font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Link href={primaryButtonHref}>
                <span>{primaryButtonText}</span>
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-6 py-3 border-slate-300 bg-white/80 hover:bg-white text-slate-800 font-semibold shadow-2xs hover:border-primary/50 transition-all"
            >
              <Link href={parentDomaine.href}>
                <span>Pôle {parentDomaine.nom}</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Bandeau d'exploration et de navigation croisée ── */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs space-y-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <Compass className="size-4 text-primary" />
          <span>Continuer votre navigation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Programmes associés du même domaine */}
          {relatedProgrammes.length > 0 && (
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 space-y-2.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Autres programmes du pôle {parentDomaine.nom}
              </span>
              <div className="flex flex-wrap gap-2">
                {relatedProgrammes.map((prog) => (
                  <Button
                    key={prog.href}
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs font-medium border-slate-200 bg-white hover:border-primary hover:text-primary transition-colors"
                  >
                    <Link href={prog.href}>
                      <span>{prog.nom}</span>
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Découvrir les autres grands domaines */}
          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 space-y-2.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Explorer nos autres pôles d&apos;action
            </span>
            <div className="flex flex-wrap gap-2">
              {otherDomaines.map((dom) => (
                <Button
                  key={dom.href}
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs font-medium border-slate-200 bg-white hover:border-primary hover:text-primary transition-colors"
                >
                  <Link href={dom.href}>
                    <span>{dom.nom}</span>
                  </Link>
                </Button>
              ))}
              <Button
                asChild
                variant="outline"
                size="sm"
                className="rounded-full text-xs font-medium border-slate-200 bg-white hover:border-primary hover:text-primary transition-colors"
              >
                <Link href="/actualites">
                  <span>Actualités</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
