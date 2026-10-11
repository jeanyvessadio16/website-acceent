import HeaderLayout from "@/components/shared/HeaderLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { programesNumerique } from "@/data/numerique/programmes-numerique";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/Animations";
import DomaineBottomCta from "@/components/shared/DomaineBottomCta";
import { createPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd, ProgrammeJsonLd } from "@/components/seo/JsonLd";

export const metadata = createPageMetadata({
  title: "Programme Numérique, Coding & Robotique à Ziguinchor",
  description:
    "Découvrez le pôle Numérique d'ACCEENT à Ziguinchor : initiation à la programmation, robotique WRO Sénégal, intelligence artificielle AI4GOOD et inclusion digitale des jeunes et des femmes en Casamance.",
  path: "/numerique",
  keywords: [
    "numérique Ziguinchor",
    "formation digitale Casamance",
    "robotique jeunes Sénégal",
    "World Robot Olympiad Casamance",
    "WRO Sénégal Ziguinchor",
    "AI4GOOD Ziguinchor",
    "initiation au code Ziguinchor",
    "formation IA jeunes Sénégal",
    "STEM Sénégal",
    "inclusion numérique femmes Ziguinchor",
  ],
});

export default function Numerique() {
  return (
    <>
      <ProgrammeJsonLd
        name="Programme Numérique ACCEENT"
        description="Formations au numérique, robotique WRO, intelligence artificielle AI4Good et inclusion digitale à Ziguinchor, Casamance."
        url="/numerique"
        domaine="Numérique"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", item: "/" },
          { name: "Numérique", item: "/numerique" },
        ]}
      />
      <HeaderLayout
        text="Domaine"
        title="Numérique"
        description="Nos programmes numériques développent les compétences, renforcent la confiance et favorisent l'inclusion digitale des jeunes et des femmes en Casamance."
        bgImage="/images/WRO.webp"
        highlights={[
          {
            label: "Programmes actifs",
            value: `${programesNumerique.length}`,
          },
          { label: "Public cible", value: "Jeunes & Femmes" },
          { label: "Spécialités", value: "Robotique, IA & Digital" },
        ]}
      >
        <section className="bg-white py-16 md:py-24">
          <div className="section-container">
            <FadeIn className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 mb-3">
                Nos programmes du numérique
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Nous accompagnons les jeunes et les femmes vers l&apos;autonomie avec des parcours pédagogiques modernes et adaptés à leur réalité.
              </p>
            </FadeIn>

            <StaggerContainer className="mt-12 grid gap-6 md:grid-cols-2">
              {programesNumerique.map((programme) => (
                <StaggerItem key={programme.id}>
                  <Card className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-0 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md h-full flex flex-col">
                    <CardHeader className="p-0">
                      <div className="relative h-56 w-full overflow-hidden">
                        <Image
                          src={programme.image}
                          alt={programme.nom}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 flex flex-col flex-grow">
                      <div className="mb-3 inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-primary">
                        Programme numérique
                      </div>
                      <CardTitle className="text-2xl font-bold text-slate-950">
                        {programme.nom}
                      </CardTitle>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600 flex-grow">
                        {programme.description}
                      </p>
                      <Button asChild className="mt-6 rounded-full w-fit bg-primary text-white hover:bg-primary/90">
                        <Link href={programme.page}>
                          En savoir plus &rarr;
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        <section className="py-12 bg-white border-t border-slate-200/60">
          <div className="section-container">
            <p className="text-base sm:text-lg leading-relaxed text-slate-600 max-w-3xl mx-auto text-center">
              ACCEENT organise des formations au numérique destinées aux jeunes
              et aux Groupements d’Intérêt Économique (GIE) de la région de
              Ziguinchor. Ces sessions permettent d&apos;initier les jeunes aux
              outils numériques tout en renforçant les compétences en gestion
              financière des GIE.
            </p>
          </div>
        </section>

        <DomaineBottomCta
          currentDomaine="Numérique"
          title="Le numérique au service de l'inclusion et de l'innovation"
          description="Nos actions numériques vous forment aux compétences d'avenir (coding, robotique, IA responsable) et vous ouvrent de nouvelles opportunités professionnelles et créatives."
          primaryButtonText="Nous contacter"
          primaryButtonHref="/contact"
        />
      </HeaderLayout>
    </>
  );
}
