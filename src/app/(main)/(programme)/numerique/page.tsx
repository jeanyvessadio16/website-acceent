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
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Domaine Numérique",
  description:
    "Programmes numériques ACCEENT à Ziguinchor : robotique (WRO), intelligence artificielle et initiation au numérique pour les jeunes de la Casamance.",
  path: "/numerique",
  keywords: [
    "numérique Ziguinchor",
    "robotique jeunes Sénégal",
    "World Robot Olympiad Casamance",
    "formation IA jeunes",
  ],
});

export default function Numerique() {
  return (
    <>
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

        <section className="bg-slate-50 py-16 md:py-20 border-t border-slate-200/60">
          <div className="section-container">
            <FadeIn
              delay={0.2}
              direction="up"
              className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs md:p-12"
            >
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
                  Le numérique au service de l&apos;inclusion
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
                  Nos actions numériques vous forment aux compétences de demain,
                  et vous ouvrent de nouvelles opportunités professionnelles.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                  <Button asChild size="lg" className="rounded-full px-8 bg-primary text-white">
                    <Link href="/contact">Nous contacter</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full px-8 bg-slate-100 text-slate-800 border border-slate-300 hover:bg-slate-200 hover:text-slate-950 font-semibold shadow-xs transition-colors"
                  >
                    <Link href="/about">Découvrir ACCEENT</Link>
                  </Button>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </HeaderLayout>
    </>
  );
}
