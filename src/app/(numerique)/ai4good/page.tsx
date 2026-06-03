import ProgrammeLayout from "@/components/layout/ProgrammeLayout";
import { Button } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = createPageMetadata({
  title: "AI4GOOD Festival",
  description:
    "Inspirer la nouvelle génération à utiliser l'intelligence artificielle pour résoudre les défis mondiaux et créer un avenir meilleur.",
  path: "/ia4good",
  keywords: [
    "intelligence artificielle jeunes Sénégal",
    "formation IA Ziguinchor",
    "numérique Casamance",
  ],
  noIndex: true,
});

export default function AI4GoodPage() {
  return (
    <>
      <ProgrammeLayout
        titre="AI4GOOD Festival"
        description="Ensemble, créons un futur numérique où la technologie élève, protège et émancipe."
      >
        <div>
          <h2 className="text-3xl text-center font-bold md:text-4xl text-primary">
            À propos de AI4GOOD
          </h2>
          <br />
        </div>
        <section className="grid gap-12 md:grid-cols-2">
          <div className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-md md:p-10 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="text-3xl font-bold md:text-4xl">Notre engagement</h2>
            <p className="mx-auto max-w-3xl text-neutral-700 dark:text-neutral-300">
              Le AI4GOOD Festival est une initiative mondiale à but non lucratif
              qui mobilise et accompagne les jeunes dans la maîtrise de
              l’intelligence artificielle, de la créativité et de l’innovation
              numérique. En réunissant art, design et technologie, nous
              éveillons leur curiosité, stimulons leur potentiel et les
              encourageons à imaginer un futur où l’IA est mise au service d’une
              société plus inclusive et durable stimulante.
            </p>
          </div>

          {/* mission */}
          <div>
            <h3 className="text-2xl font-bold">Notre mission</h3>
            <p className="mx-auto max-w-3xl text-neutral-700 dark:text-neutral-300">
              Nous nous engageons à rendre l’éducation à l’IA accessible à
              toutes et à tous, en particulier dans les régions où les
              opportunités restent limitées. Nous donnons aux jeunes les moyens
              d’apprendre, d’expérimenter et de collaborer grâce à des outils
              numériques pour résoudre des enjeux concrets. Nous croyons
              fermement qu’une technologie guidée par l’éthique, l’empathie et
              un sens aigu des responsabilités peut devenir un véritable moteur
              de progrès pour le bien commun.
            </p>
          </div>
        </section>
        <div className="mt-12 text-center">
          <Button
            asChild
            size={"xl"}
            className="inline-flex items-center gap-2 text-white"
          >
            <Link
              href="https://ai4goodfestival.org/"
              target="_blank"
              className="text-lg"
            >
              En savoir plus
            </Link>
          </Button>
        </div>
      </ProgrammeLayout>
    </>
  );
}
