import HeaderLayout from "@/components/shared/HeaderLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { programesEducation } from "@/data/education/programes-education";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd, ProgrammeJsonLd } from "@/components/seo/JsonLd";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/Animations";
import DomaineBottomCta from "@/components/shared/DomaineBottomCta";

export const metadata = createPageMetadata({
  title: "Programme Éducation & Soutien Scolaire à Ziguinchor",
  description:
    "Découvrez le pôle Éducation d'ACCEENT à Ziguinchor : Tut-Tank, ACCEENT4ELLES et accompagnement personnalisé pour la réussite et l'autonomie des jeunes et des femmes en Casamance.",
  path: "/education",
  keywords: [
    "éducation Ziguinchor",
    "soutien scolaire Casamance",
    "programme Tut-Tank Ziguinchor",
    "ACCEENT4ELLES",
    "formation jeunes filles Casamance",
    "éducation féminine Ziguinchor",
    "accompagnement scolaire Ziguinchor",
    "éducation inclusive Casamance",
    "réussite scolaire Santhiaba",
    "mentorat filles Sénégal",
  ],
});

export default function Education() {
  return (
    <>
      <ProgrammeJsonLd
        name="Programme Éducation ACCEENT"
        description="Accompagnement scolaire, mentorat et renforcement de capacités des jeunes et des femmes à Ziguinchor, Casamance."
        url="/education"
        domaine="Éducation"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", item: "/" },
          { name: "Éducation", item: "/education" },
        ]}
      />
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

        <DomaineBottomCta
          currentDomaine="Éducation"
          title="Construisons ensemble un avenir plus équitable"
          description="Nos actions éducatives s'adressent à celles et ceux qui veulent apprendre, réussir et contribuer positivement à leur territoire. Rejoignez-nous en tant qu'élève, mentor ou partenaire."
          primaryButtonText="Nous contacter"
          primaryButtonHref="/contact"
        />
      </HeaderLayout>
    </>
  );
}
