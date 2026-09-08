import ProgrammeLayout from "@/components/layout/ProgrammeLayout";
import { AtelierEntreprenariatProgrammes } from "@/data/entreprenariat/acceentIncub";
import { createPageMetadata } from "@/lib/seo";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/Animations";

export const metadata = createPageMetadata({
  title: "ACCEENT'INCUB",
  description:
    "ACCEENT'INCUB est l'incubateur de jeunes porteurs de projets à Ziguinchor : idéation, structuration, mentorat et accompagnement pour transformer une idée en initiative viable.",
  path: "/acceent-incub",
  keywords: [
    "incubateur Ziguinchor",
    "ACCEENT INCUB",
    "jeunes entrepreneurs Ziguinchor",
    "accompagnement startup Ziguinchor",
    "accompagnement startup Casamance",
    "entrepreneuriat Ziguinchor",
  ],
});

export default function AcceentIncub() {
  const programme = {
    titre: "ACCEENT'INCUB",
    description:
      "Incubateur pour jeunes porteurs et porteuses de projets à Ziguinchor",
  };

  return (
    <ProgrammeLayout
      image="/images/acceent-incub.jpeg"
      text="Programme Entrepreneuriat"
      {...programme}
    >
      {/* 1. Présentation du programme */}
      <FadeIn delay={0.1} direction="up">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 md:p-12 text-center shadow-xs">
          <span className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            Incubation et Accompagnement
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-4">
            À propos du programme
          </h2>
          <p className="mx-auto max-w-3xl text-slate-600 text-base sm:text-lg leading-relaxed">
            <strong>ACCEENT&apos;INCUB</strong> est un programme d&apos;incubation dédié aux jeunes porteurs et porteuses de projets de la région de Ziguinchor. Il a pour ambition de transformer des idées en initiatives concrètes, viables et porteuses de sens, en accompagnant les jeunes tout au long de leur parcours entrepreneurial. Le programme s&apos;adresse en priorité à des jeunes qui ont du potentiel mais manquent souvent de cadre, de conseils ou de ressources pour lancer et faire évoluer leur projet.
          </p>
        </div>
      </FadeIn>

      {/* 2. Avantages */}
      <div className="space-y-8">
        <FadeIn delay={0.2} direction="down" className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Avantages du programme
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Avec ACCEENT&apos;INCUB, les incubé·e·s bénéficient d&apos;un accompagnement complet.
          </p>
        </FadeIn>

        <StaggerContainer delay={0.3} className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {AtelierEntreprenariatProgrammes.map((item, idx) => (
            <StaggerItem key={item.id}>
              <div className="group relative flex items-center gap-4 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                  0{idx + 1}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {item.libelle}
                  </h3>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* 3. Banner CTA */}
      <FadeIn delay={0.4} direction="up">
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm sm:text-base font-medium text-slate-800 text-center sm:text-left max-w-xl">
            ACCEENT&apos;INCUB, c&apos;est un tremplin pour une jeunesse créative, engagée et ambitieuse, prête à construire des solutions durables et à impact.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-xs transition-all hover:bg-primary/90 shrink-0"
          >
            Nous contacter
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </FadeIn>
    </ProgrammeLayout>
  );
}
