import ProgrammeLayout from "@/components/layout/ProgrammeLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { wroAction } from "@/data/numerique/wroAction";
import { createPageMetadata } from "@/lib/seo";
import { ArrowBigRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = createPageMetadata({
  title: "World Robot Olympiad (WRO)",
  description:
    "Programme WRO d'ACCEENT à Ziguinchor : compétition internationale de robotique, ateliers d'initiation et défis locaux pour apprendre à programmer, construire et collaborer.",
  path: "/wro",
  keywords: [
    "World Robot Olympiad Sénégal",
    "robotique jeunes Ziguinchor",
    "programmation visuelle collège lycée",
    "compétition robotique Casamance",
  ],
});

export default function WROPage() {
  const programme = {
    titre: "World Robot Olympiad (WRO)",
    description:
      "Compétition internationale WRO, ateliers d'initiation et challenges locaux à Ziguinchor. Apprendre à programmer, construire, collaborer… et s'amuser.",
  };
  return (
    <>
      <ProgrammeLayout
        image="/images/WRO.webp"
        {...programme}
      >
        <section className="mx-auto max-w-5xl">
          <div className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-md md:p-10 dark:border-neutral-800 dark:bg-neutral-900">
            <p className="mx-auto inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary">
              Inclusion, education et autonomie
            </p>
            <h2 className="text-3xl font-bold md:text-5xl">
              World Robot Olympiad (WRO)
            </h2>
            <p className="mx-auto max-w-3xl text-neutral-700 dark:text-neutral-300">
              Une compétition de robotique véritablement mondiale dédiée à la
              science, à la technologie et à l&apos;éducation. Notre mission est
              d&apos;aider les jeunes à développer leur créativité et leur
              capacité à résoudre des problèmes de manière ludique et
              stimulante.
            </p>
            <p className="mx-auto max-w-3xl text-neutral-700 dark:text-neutral-300">
              Pour ce faire, nous organisons des concours de robotique dans
              quatre catégories différentes pour les élèves de 8 à 19 ans.Dans
              notre catégorie Futurs Ingénieurs, les étudiants peuvent avoir
              jusqu&apos;à 22 ans. L&apos;Association World Robot Olympiad™ est
              une organisation indépendante à but non lucratif. Tous les revenus
              des parrainages et des cotisations sont investis dans notre
              mission : promouvoir la robotique dans l&apos;enseignement des
              STEM (sciences, technologie, ingénierie et mathématiques) à
              travers le monde.
            </p>
          </div>
        </section>
      </ProgrammeLayout>

      {/* action */}
      <section className="px-14">
        <div>
          <h2 className="text-3xl font-bold md:text-4xl text-center mt-10">
            Nos actions à ACCEENT
          </h2>
          <p className="mx-auto max-w-3xl text-neutral-700 dark:text-neutral-300">
            Découvrez les actions menées par ACCEENT dans le domaine de la
            robotique.
          </p>
        </div>
        <br />
        <div className="py-5 grid lg:grid-cols-3 place-content-between place-items-center gap-10">
          {wroAction.map((item) => (
            <Card key={item.id} className="p-0">
              <CardHeader className="px-0">
                <Image
                  alt={item.nom}
                  width={300}
                  height={200}
                  src={item.image}
                  className="w-full bg-cover bg-center"
                />
              </CardHeader>
              <CardContent className="pb-3">
                <CardTitle className="text-primary text-lg font-bold mb-1.5">
                  {" "}
                  {item.nom}{" "}
                </CardTitle>
                <CardDescription> {item.description} </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-6 md:flex-row md:items-center">
          <p className="max-w-2xl text-sm text-neutral-700 dark:text-neutral-200">
            Vous souhaitez soutenir le programme ou orienter une bénéficiaire ?
            Notre équipe peut vous accompagner.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
          >
            Nous contacter
            <ArrowBigRight size={16} className="ml-2" />
          </Link>
        </div>
        <br />
      </section>
    </>
  );
}
