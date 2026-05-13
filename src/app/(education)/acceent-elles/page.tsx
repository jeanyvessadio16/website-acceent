import ProgrammeLayout from "@/components/layout/ProgrammeLayout";
import {
  acceentEllesApproche,
  acceentEllesData,
} from "@/data/education/acceentElles";
import { LayoutList } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ACCEENT4ELLES",
  description:
    "Programme de education visant à promouvoir la diversité et l'inclusion dans le secteur de la tech en mettant en avant les parcours inspirants de femmes qui ont réussi dans ce domaine.",
};

export default function AcceentEllesPage() {
  const programme = {
    titre: "Acceent4ELLES ?",
    description:
      "Découvrez les parcours inspirants de femmes qui ont réussi dans le domaine de la tech, et comment elles ont surmonté les obstacles pour atteindre leurs objectifs.",
  };
  return (
    <>
      <ProgrammeLayout
        className="bg-[url('/images/acceentImage.jpg')] bg-cover bg-fixed bg-center lg:bg-top"
        {...programme}
      >
        <section>
          <div className="space-y-6 text-center">
            <h2 className="text-4xl font-bold md:text-5xl">
              A propos du programme
            </h2>
            <p className="mx-auto max-w-3xl text-neutral-700 dark:text-neutral-300">
              ACCENT4ELLES est un programme initié par ACCEENT pour accompagner
              des jeunes filles en situation de vulnérabilité, souvent
              confrontées à des difficultés scolaires, économiques ou à des
              grossesses précoces. Notre objectif est de leur offrir un cadre
              bienveillant et structurant pour les aider à reprendre confiance
              en elles, poursuivre leur scolarité et construire un avenir
              meilleur.
            </p>
          </div>
        </section>
      </ProgrammeLayout>

      <section className="bg-gradient-to-b from-neutral-50 via-white to-neutral-50/80 px-4 py-14 sm:px-8 lg:px-14 dark:border-neutral-800 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">
        <div className="lg:px-14 max-md:px-7 mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 place-content-between lg:gap-10">
            <details>
              <summary className="text-2xl font-bold text-primary">
                Le programme propose un accompagnement global
              </summary>
              <ul className="">
                {acceentEllesData.map((item) => (
                  <li
                    key={item.id}
                    className="mt-3 px-5 py-2 bg-neutral-100 rounded-lg dark:bg-neutral-800"
                  >
                    <h3 className="text-base">{item.libelle}</h3>
                  </li>
                ))}
                <br />
                <p>
                  Avec ACCENT4ELLES, nous croyons qu&apos;aucune situation
                  n&apos;est définitive. Chaque fille mérite une seconde chance,
                  un accompagnement digne et des opportunités pour se révéler et
                  s&apos;épanouir.
                </p>
              </ul>
            </details>

            <details>
              <summary className="text-2xl font-bold text-primary">
                Nos approches
              </summary>

              <ul className="">
                {acceentEllesApproche.map((item) => (
                  <li
                    key={item.id}
                    className="mt-3 px-5 py-2 bg-neutral-100 rounded-lg dark:bg-neutral-800"
                  >
                    <h3 className="text-base">{item.libelle}</h3>
                  </li>
                ))}
                <br />
                <p>
                  Notre approche repose sur un accompagnement global et durable,
                  combinant formation continue, mentorat personnalisé et suivi
                  post-formation pour garantir lautonomie et la réussite des
                  bénéficiaires.
                </p>
              </ul>
            </details>
          </div>
        </div>
      </section>
    </>
  );
}
