import ProgrammeLayout from "@/components/layout/ProgrammeLayout";
import { tuttankProgrammes } from "@/data/education/tut-tank";
import { Sparkles } from "lucide-react";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "TUT-TANK",
  description:
    "TUT-TANK : accompagnement scolaire et social pour les jeunes filles vulnérables à Ziguinchor, avec un suivi personnalisé pour favoriser la réussite et l'autonomie.",
  path: "/tut-tank",
  keywords: [
    "accompagnement scolaire filles Ziguinchor",
    "TUT-TANK ACCEENT",
    "jeunes filles vulnérables Casamance",
    "réussite scolaire Sénégal",
  ],
});

export default function TutTankPage() {
  const programme = {
    titre: "TUT-TANK",
    description:
      "Un accompagnement scolaire et social pour les jeunes filles vulnérables",
  };
  return (
    <>
      <ProgrammeLayout
        {...programme}
        className="bg-[url('/images/tuttank.jpeg')] bg-cover bg-fixed bg-center lg:bg-top"
      >
        <section className="mx-auto max-w-5xl">
          <div className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-xl md:p-10 dark:border-neutral-800 dark:bg-neutral-900">
            <p className="mx-auto inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary">
              Inclusion, education et autonomie
            </p>
            <h2 className="text-3xl font-bold md:text-5xl">
              A propos du programme
            </h2>
            <p className="mx-auto max-w-3xl text-neutral-700 dark:text-neutral-300">
              <strong>TUT-TANK</strong> est un programme mis en place par
              ACCEENT pour accompagner les enfants et leurs familles dans un
              cadre éducatif et bienveillant. Il vise à renforcer la pensée
              critique des enfants, améliorer les relations familiales et
              soutenir les parents dans leur rôle éducatif.
            </p>
          </div>
        </section>
      </ProgrammeLayout>
      <section className="section-padding bg-slate-50/50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-12 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -right-16 bottom-8 h-64 w-64 rounded-full bg-secondary/5 blur-3xl" />
        </div>

        <div className="section-container relative z-10">
          <div className="mb-12 text-center">
            <h2 className="text-fluid-h2 text-primary mb-4">
              Activités du programme
            </h2>
            <p className="text-fluid-p text-slate-600 max-w-2xl mx-auto">
              Découvrez les différentes actions que nous menons pour accompagner
              les jeunes filles et leurs familles.
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {tuttankProgrammes.map((item) => (
              <li
                key={item.id}
                className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:p-8"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-fluid-h3 text-slate-900 mb-2">
                    {item.libelle}
                  </h3>
                  <p className="text-fluid-p text-slate-600">
                    {item.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-16 rounded-3xl bg-primary/5 p-8 text-center ring-1 ring-primary/10 md:p-12">
            <p className="text-fluid-p-large text-slate-800 font-medium max-w-3xl mx-auto text-balance">
              TUT&apos;TANK place la famille au cœur de l&apos;éducation, en
              créant des espaces d&apos;échange, d&apos;apprentissage et de
              complicité.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
