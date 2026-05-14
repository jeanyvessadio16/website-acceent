import ProgrammeLayout from "@/components/layout/ProgrammeLayout";
import { AtelierEntreprenariatProgrammes } from "@/data/entreprenariat/acceentIncub";
import { Rocket } from "lucide-react";

export default function AcceentIncub() {
  const programme = {
    titre: "Acceent Incub",
    description:
      "Incubateur pour jeunes porteurs et porteuses de projets à Ziguinchor",
  };

  return (
    <>
      <ProgrammeLayout
        className="bg-[url('/images/acceent-incub.jpeg')] bg-cover bg-fixed bg-center lg:bg-top"
        {...programme}
      >
        <section>
          <div className="space-y-6 text-center">
            <h2 className="text-4xl font-bold md:text-5xl">
              A propos du programme
            </h2>
            <p className="mx-auto max-w-3xl text-neutral-700 dark:text-neutral-300">
              <strong>ACCEENT&apos;INCUB </strong>est un programme
              d&apos;incubation dédié aux jeunes porteurs et porteuses de
              projets de la région de Ziguinchor. Il a pour ambition de
              transformer des idées en initiatives concrètes, viables et
              porteuses de sens, en accompagnant les jeunes tout au long de leur
              parcours entrepreneurial. Le programme s&apos;adresse en priorité
              à des jeunes qui ont du potentiel mais manquent souvent de cadre,
              de conseils ou de ressources pour lancer et faire évoluer leur
              projet.
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
              Avantages du programme
            </h2>
            <p className="text-fluid-p text-slate-600 max-w-2xl mx-auto">
              Avec ACCEENT&apos;INCUB, les incubé·e·s bénéficient de :
            </p>
          </div>

          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {AtelierEntreprenariatProgrammes.map((item) => (
              <li
                key={item.id}
                className="group relative flex items-center gap-5 overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:p-8"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                  <Rocket className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-fluid-p-large font-semibold text-slate-800 leading-snug">
                    {item.libelle}
                  </h3>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-16 rounded-3xl bg-primary/5 p-8 text-center ring-1 ring-primary/10 md:p-12">
            <p className="text-fluid-p-large text-slate-800 font-medium max-w-3xl mx-auto text-balance">
              ACCEENT&apos;INCUB, c&apos;est un tremplin pour une jeunesse
              créative, engagée et ambitieuse, prête à construire des solutions
              durables et à impact pour leur communauté.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
