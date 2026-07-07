import ProgrammeLayout from "@/components/layout/ProgrammeLayout";
import {
  acceentEllesApproche,
  acceentEllesData,
} from "@/data/education/acceentElles";
import {
  ArrowRight,
  ClipboardList,
  GraduationCap,
  Handshake,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "ACCEENT4ELLES",
  description:
    "ACCEENT4ELLES met en lumière des parcours de femmes dans la tech à Ziguinchor pour promouvoir la diversité, l'inclusion et inspirer les jeunes filles du numérique.",
  path: "/acceent-elles",
  keywords: [
    "filles éduquées",
    "inclusion des filles",
    "ACCEENT4ELLES Ziguinchor",
    "jeunes filles vulnérables",
    "autonomie des jeunes filles",
    "mentorat jeunes filles",
    "égalité filles-garçons",
  ],
});

export default function AcceentEllesPage() {
  const programme = {
    titre: "ACCEENT4ELLES",
    description:
      "ACCEENT4ELLES est un programme d'éducation pour filles à Ziguinchor, axé sur l'autonomisation, le mentorat et la promotion de l'égalité filles-garçons. Découvrez nos actions pour soutenir les jeunes filles vulnérables et leur offrir un avenir meilleur.",
  };

  const iconMap = {
    userRound: UserRound,
    graduationCap: GraduationCap,
    handshake: Handshake,
    clipboardList: ClipboardList,
  } as const;

  return (
    <>
      <ProgrammeLayout
        image="/images/acceentImage.jpg"
        {...programme}
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
              ACCEENT4ELLES est un programme initié par ACCEENT pour accompagner
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

      <section className="bg-gradient-to-b from-neutral-50 via-white to-neutral-100/70 px-4 py-16 sm:px-8 lg:px-14 dark:border-neutral-800 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">
        <div className="mx-auto max-w-6xl space-y-10 lg:px-14 max-md:px-7">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
            <article className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
              <h3 className="text-2xl font-bold text-primary">
                Le programme propose un accompagnement global
              </h3>
              <ul className="mt-5 space-y-3">
                {acceentEllesData.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                  >
                    {item.libelle}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                Avec ACCEENT4ELLES, nous croyons qu&apos;aucune situation
                n&apos;est définitive. Chaque fille mérite une seconde chance,
                un accompagnement digne et des opportunités pour se révéler et
                s&apos;épanouir.
              </p>
            </article>

            <article className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
              <h3 className="text-2xl font-bold text-primary">Nos approches</h3>
              <div className="mt-5 space-y-3">
                {acceentEllesApproche.map((item) => {
                  const Icon = iconMap[item.icon as keyof typeof iconMap];
                  return (
                    <div
                      key={item.id}
                      className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800"
                    >
                      <div className="flex items-start gap-3">
                        {Icon ? (
                          <div className="mt-0.5 rounded-md bg-primary/10 p-2 text-primary">
                            <Icon size={16} />
                          </div>
                        ) : null}
                        <div>
                          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                            {item.libelle}
                          </h4>
                          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
                            {item.detail}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-5 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                Notre approche repose sur un accompagnement global et durable,
                combinant formation continue, mentorat personnalisé et suivi
                post-formation pour garantir l&apos;autonomie et la réussite des
                bénéficiaires.
              </p>
            </article>
          </div>

          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-6 md:flex-row md:items-center">
            <p className="max-w-2xl text-sm text-neutral-700 dark:text-neutral-200">
              Vous souhaitez soutenir le programme ou orienter une bénéficiaire
              ? Notre équipe peut vous accompagner.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
            >
              Nous contacter
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
