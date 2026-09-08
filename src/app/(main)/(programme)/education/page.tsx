import HeaderLayout from "@/components/shared/HeaderLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { programesEducation } from "@/data/education/programes-education";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/seo";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/Animations";

export const metadata = createPageMetadata({
  title: "Programme Éducation",
  description:
    "Programmes d'éducation ACCEENT à Ziguinchor : Tut-Tank, ACCEENT4ELLES et parcours pour développer les compétences, la confiance et l'autonomie des jeunes et des femmes.",
  path: "/education",
  keywords: [
    "éducation Ziguinchor",
    "programme Tut-Tank",
    "ACCEENT4ELLES",
    "formation jeunes filles Casamance",
    "Education feminine Ziguinchor",
    "accompagnment scolaire Ziguinchor",
    "accompagnment scolaire Casamance",
    "Education inclusive Ziguinchor",
    "Education inclusive Casamance",
  ],
});

export default function Education() {
  return (
    <>
      <HeaderLayout
        text="Domaine"
        title="Éducation"
        description="Nos programmes d'éducation développent les compétences, la confiance et l'autonomie des jeunes et des femmes à travers des parcours concrets."
        bgImage="/images/educaton.jpg"
        highlights={[
          {
            label: "Programmes actifs",
            value: `${programesEducation.length}`,
          },
          { label: "Public cible", value: "Jeunes & Femmes" },
          { label: "Approche", value: "Pratique & Inclusive" },
        ]}
      >
        <section className="bg-white py-16 md:py-24">
          <div className="section-container">
            <FadeIn className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 mb-3">
                Nos programmes d&apos;éducation
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Nous accompagnons les jeunes et les femmes vers l&apos;autonomie
                avec des parcours pédagogiques adaptés à leur réalité.
              </p>
            </FadeIn>

            <StaggerContainer className="mt-12 grid gap-6 md:grid-cols-2">
              {programesEducation.map((programme) => (
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
                        Programme éducation
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

        <section className="bg-slate-50 py-16 md:py-20 border-t border-slate-200/60">
          <div className="section-container">
            <FadeIn
              delay={0.2}
              direction="up"
              className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs md:p-12"
            >
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
                  Construisons ensemble un avenir plus équitable
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
                  Nos actions éducatives s&apos;adressent à celles et ceux qui
                  veulent apprendre, entreprendre et contribuer positivement à
                  leur territoire.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                  <Button asChild size="lg" className="rounded-full px-8 bg-primary text-white hover:bg-primary/90 font-semibold shadow-xs">
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
