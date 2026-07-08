import ProgrammeLayout from "@/components/layout/ProgrammeLayout";
import { createPageMetadata } from "@/lib/seo";
import { Lightbulb, Target, Users } from "lucide-react";

export const metadata = createPageMetadata({
  title: "Atelier Entrepreneuriat",
  description:
    "Les ateliers entrepreneuriat ACCEENT à Ziguinchor encouragent l'esprit d'entreprise chez les jeunes : idéation, structuration de projet et travail en équipe.",
  path: "/atelier-entreprenariat",
  keywords: [
    "entrepreneuriat",
    "ACCEENT'Atelier Entrepreneuriat",
    "atelier entrepreneuriat",
    "atelier entrepreneuriat jeunes",
    "entrepreneuriat jeunes Ziguinchor",
    "formation business plan Ziguinchor",
    "ACCEENT",
    "entrepreneuriat Ziguinchor",
    "ACCEENT entrepreneuriat",
    "ACCEENT entrepreneuriat jeunes",
    "ACCEENT entrepreneuriat jeunes Ziguinchor",
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
      icon: Lightbulb,
      title: "Idéation et Créativité",
      description:
        "Aider les jeunes à transformer leurs idées brutes en concepts d'entreprise viables.",
    },
    {
      icon: Target,
      title: "Structuration de Projet",
      description:
        "Apprendre à définir des objectifs clairs, un business model et une stratégie d'action.",
    },

    {
      icon: Users,
      title: "Réseautage",
      description:
        "Créer des synergies entre les différents acteurs locaux et les jeunes entrepreneurs.",
    },
  ];

  return (
    <>
      <ProgrammeLayout
        image="/images/entreprenariat.jpeg"
        {...programme}
      >
        <div className="space-y-6 text-center mb-16">
          <p className="mx-auto inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary">
            Inspiration et Action
          </p>
          <h2 className="text-fluid-h2 text-slate-900">
            A propos de l&apos;atelier
          </h2>
          <p className="text-fluid-p-large text-slate-600 max-w-3xl mx-auto text-balance">
            Cet atelier intensif est conçu pour stimuler la créativité et
            l&apos;innovation. Nous mettons à disposition des jeunes les outils
            et méthodes nécessaires pour passer de l&apos;idée à l&apos;action
            concrète.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {objectifs.map((obj, idx) => (
            <div
              key={idx}
              className="group flex flex-col items-center text-center rounded-3xl border border-slate-200/60 bg-slate-50/50 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:bg-white"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                <obj.icon size={32} />
              </div>
              <h3 className="mb-3 text-lg font-bold text-slate-800">
                {obj.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {obj.description}
              </p>
            </div>
          ))}
        </div>
      </ProgrammeLayout>
    </>
  );
}
