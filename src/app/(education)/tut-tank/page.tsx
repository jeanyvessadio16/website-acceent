import ProgrammeLayout from "@/components/layout/ProgrammeLayout";
import { tuttankProgrammes } from "@/data/education/tut-tank";

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
        <section>
          <div className="space-y-6 text-center">
            <h2 className="text-4xl font-bold md:text-5xl">
              A propos du programme
            </h2>
            <p className="mx-auto max-w-3xl text-neutral-700 dark:text-neutral-300">
              TUT TANK est un programme mis en place par ACCEENT pour
              accompagner les enfants et leurs familles dans un cadre éducatif
              et bienveillant. Il vise à renforcer la pensée critique des
              enfants, améliorer les relations familiales et soutenir les
              parents dans leur rôle éducatif.
            </p>
          </div>
        </section>
      </ProgrammeLayout>
      <section className="px-14 py-16 bg-accent">
        <ul className="list-disc mx-auto max-w-3xl space-y-3">
          <h2 className="text-2xl font-bold">
            Le programme propose plusieurs types d&apos;activités
          </h2>
          {tuttankProgrammes.map((item) => (
            <li key={item.id} className="mt-3">
              <h3 className="text-base">{item.libelle} </h3>
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
