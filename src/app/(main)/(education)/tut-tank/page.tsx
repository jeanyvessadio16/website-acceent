import ProgrammeLayout from "@/components/layout/ProgrammeLayout";
import { tuttankProgrammes } from "@/data/education/tut-tank";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/Animations";

export const metadata = createPageMetadata({
  title: "TUT-TANK",
  description:
    "TUT-TANK : accompagnement scolaire et social pour les jeunes filles vulnérables à Ziguinchor, avec un suivi personnalisé pour favoriser la réussite et l'autonomie.",
  path: "/tut-tank",
  keywords: [
    "TUT-TANK Ziguinchor",
    "accompagnement scolaire filles Ziguinchor",
    "soutien familial Ziguinchor",
    "TUT-TANK ACCEENT",
    "jeunes filles vulnérables Ziguinchor",
    "réussite scolaire Ziguinchor",
  ],
});

export default function TutTankPage() {
  const programme = {
    titre: "TUT-TANK",
    description:
      "Un accompagnement scolaire et social pour les jeunes filles vulnérables",
  };

  return (
    <ProgrammeLayout
      image="/images/tuttank.jpeg"
      text="Programme Éducation"
      {...programme}
    >
      {/* 1. Présentation du programme */}
      <FadeIn delay={0.1} direction="up">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 md:p-12 text-center shadow-xs">
          <span className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            Inclusion, éducation et autonomie
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-4">
            À propos du programme
          </h2>
          <p className="mx-auto max-w-3xl text-slate-600 text-base sm:text-lg leading-relaxed">
            <strong>TUT-TANK</strong> est un programme mis en place par ACCEENT pour accompagner les enfants et leurs familles dans un cadre éducatif et bienveillant. Il vise à renforcer la pensée critique des enfants, améliorer les relations familiales et soutenir les parents dans leur rôle éducatif.
          </p>
        </div>
      </FadeIn>

      {/* 2. Activités du programme */}
      <div className="space-y-8">
        <FadeIn delay={0.2} direction="down" className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Activités du programme
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Découvrez les différentes actions que nous menons pour accompagner les jeunes filles et leurs familles.
          </p>
        </FadeIn>

        <StaggerContainer delay={0.3} className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {tuttankProgrammes.map((item, idx) => (
            <StaggerItem key={item.id}>
              <div className="group relative flex flex-col justify-between h-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div>
                  <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    0{idx + 1}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                    {item.libelle}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.detail}
                  </p>
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
            TUT&apos;TANK place la famille au cœur de l&apos;éducation, en créant des espaces d&apos;échange, d&apos;apprentissage et de complicité.
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
