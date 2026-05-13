import ProgrammeLayout from "@/components/layout/ProgrammeLayout";
import { AtelierEntreprenariatProgrammes } from "@/data/entreprenariat/acceentIncub";

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

      <section className="px-14 py-16 max-md:px-7 bg-accent">
        <ul className="mx-auto max-w-3xl space-y-3">
          <h2 className="text-2xl font-bold text-primary">
            Avec ACCEENT&apos;INCUB, les incubé·e·s bénéficient de :
          </h2>
          {AtelierEntreprenariatProgrammes.map((item) => (
            <li
              key={item.id}
              className="mt-3 px-5 py-2 bg-neutral-100 rounded-lg dark:bg-neutral-800"
            >
              <h3 className="text-base font-semibold">{item.libelle} </h3>
            </li>
          ))}
          <br />
          <p>
            ACCEENT&apos;INCUB, c&apos;est un tremplin pour une jeunesse
            créative, engagée et ambitieuse, prête à construire des solutions
            durables et à impact pour leur communauté.
          </p>
        </ul>
      </section>
    </>
  );
}
