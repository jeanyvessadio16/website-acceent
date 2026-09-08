import ProgrammeLayout from "@/components/layout/ProgrammeLayout";
import { createPageMetadata } from "@/lib/seo";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/Animations";

export const metadata = createPageMetadata({
  title: "Atelier Entrepreneuriat",
  description:
    "Les ateliers entrepreneuriat ACCEENT à Ziguinchor encouragent l'esprit d'entreprise chez les jeunes : idéation, structuration de projet et travail en équipe.",
  path: "/atelier-entreprenariat",
  keywords: [
    "entrepreneuriat",
    "atelier entrepreneuriat",
    "atelier entrepreneuriat jeunes",
    "entrepreneuriat jeunes Ziguinchor",
    "formation business plan Ziguinchor",
  ],
});

export default function AtelierEntreprenariat() {
  const programme = {
    titre: "Atelier Entrepreneuriat",
    description:
      "Encourager l'esprit d'entreprise chez les jeunes de Ziguinchor, moments forts à revivre.",
  };

  const objectifs = [
    {
      title: "Idéation et Créativité",
      description:
        "Aider les jeunes à transformer leurs idées brutes en concepts d'entreprise viables.",
    },
    {
      title: "Structuration de Projet",
      description:
        "Apprendre à définir des objectifs clairs, un business model et une stratégie d'action.",
    },
    {
      title: "Réseautage",
      description:
        "Créer des synergies entre les différents acteurs locaux et les jeunes entrepreneurs.",
    },
  ];

  return (
    <ProgrammeLayout
      image="/images/entreprenariat.jpeg"
      text="Programme Entrepreneuriat"
      {...programme}
    >
      {/* 1. Présentation de l'atelier */}
      <FadeIn delay={0.1} direction="up">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 md:p-12 text-center shadow-xs">
          <span className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            Inspiration et Action
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-4">
            À propos de l&apos;atelier
          </h2>
          <p className="mx-auto max-w-3xl text-slate-600 text-base sm:text-lg leading-relaxed">
            Cet atelier intensif est conçu pour stimuler la créativité et l&apos;innovation. Nous mettons à disposition des jeunes les outils et méthodes nécessaires pour passer de l&apos;idée à l&apos;action concrète.
          </p>
        </div>
      </FadeIn>

      {/* 2. Objectifs / Piliers */}
      <div className="space-y-8">
        <FadeIn delay={0.2} direction="down" className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Objectifs de la formation
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Trois piliers pour passer de l&apos;idée à la réalisation sur le terrain.
          </p>
        </FadeIn>

        <StaggerContainer delay={0.3} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {objectifs.map((obj, idx) => (
            <StaggerItem key={idx}>
              <div className="group flex flex-col items-center text-center rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md h-full">
                <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
                  0{idx + 1}
                </div>
                <h3 className="mb-2 text-lg sm:text-xl font-bold text-slate-900">
                  {obj.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {obj.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* 3. Banner CTA */}
      <FadeIn delay={0.4} direction="up">
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm sm:text-base font-medium text-slate-800 text-center sm:text-left max-w-xl">
            Vous souhaitez participer aux prochains ateliers ou devenir mentor ? N&apos;hésitez pas à contacter notre équipe.
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
