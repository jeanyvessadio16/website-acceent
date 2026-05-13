import ProgrammeLayout from "@/components/layout/ProgrammeLayout";
import { tuttankProgrammes } from "@/data/education/tut-tank";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TUT-TANK",
  description:
    "Un accompagnement scolaire et social pour les jeunes filles vulnérables",
};

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
      <section className="px-14 py-16 max-md:px-7 bg-accent">
        <ul className="mx-auto max-w-3xl space-y-3">
          <h2 className="text-2xl font-bold text-primary">
            Le programme propose plusieurs types d&apos;activités
          </h2>
          {tuttankProgrammes.map((item) => (
            <li
              key={item.id}
              className="mt-3 px-5 py-2 bg-neutral-100 rounded-lg dark:bg-neutral-800"
            >
              <h3 className="text-base font-semibold">{item.libelle} </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {item.detail}
              </p>
            </li>
          ))}
          <br />
          <p>
            TUT&apos;TANK, place la famille au cœur de l&apos;éducation, en
            créant des espaces d&apos;échange, d&apos;apprentissage et de
            complicité.
          </p>
        </ul>
      </section>
    </>
  );
}
