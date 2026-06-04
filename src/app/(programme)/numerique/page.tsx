import HeaderLayout from "@/components/shared/HeaderLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { programesNumerique } from "@/data/numerique/programmes-numerique";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpenCheck, Laptop } from "lucide-react";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/Animations";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Programme Numérique",
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
        text="Programme Numérique"
        title="Le numérique pour un avenir innovant"
        description="Nos programmes numériques développent les compétences techniques, la confiance et favorisent l'inclusion digitale pour tous les jeunes et les femmes."
      >
        <section className="bg-white py-20">
          <div className="section-container">
            <FadeIn className="mx-auto max-w-3xl text-center">
              <h1 className="section-heading mb-2">
                Nos programmes du numérique
              </h1>
              <p className="section-subheading">
                Nous accompagnons les jeunes et les femmes vers l&apos;autonomie
                avec des parcours pédagogiques modernes et adaptes à leur
                réalité.
              </p>
            </FadeIn>

            <StaggerContainer className="mt-12 grid gap-6 md:grid-cols-2">
              {programesNumerique.map((programme) => (
                <StaggerItem key={programme.id}>
                  <Card className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white pt-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full">
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
                      <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        <BookOpenCheck className="h-3.5 w-3.5" />
                        Programme numérique
                      </div>
                      <CardTitle className="text-2xl font-bold text-slate-950">
                        {programme.nom}
                      </CardTitle>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600 flex-grow">
                        {programme.description}
                      </p>
                      <Button asChild className="mt-6 rounded-full w-fit">
                        <Link href={programme.page}>
                          En savoir plus
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        <section className="bg-gradient-to-b from-slate-50 to-white py-20">
          <div className="section-container">
            <FadeIn
              delay={0.2}
              direction="up"
              className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm md:p-12"
            >
              <div className="mx-auto max-w-3xl text-center">
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Laptop className="h-7 w-7" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                  Le numérique au service de l&apos;inclusion
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
                  Nos actions numériques vous forment aux compétences de demain,
                  réduisent la fracture numérique et vous ouvrent de nouvelles
                  opportunités professionnelles.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                  <Button asChild size="lg" className="rounded-full px-8">
                    <Link href="/#contact">Nous contacter</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8"
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
