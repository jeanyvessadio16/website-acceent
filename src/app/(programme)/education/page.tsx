import HeaderLayout from "@/components/shared/HeaderLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { programesEducation } from "@/data/education/programes-education";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpenCheck, GraduationCap } from "lucide-react";
import { createPageMetadata } from "@/lib/seo";

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
  ],
});

export default function Eduction() {
  return (
    <>
      <HeaderLayout
        text="Programme Education"
        title="Former, inspirer et ouvrir de nouvelles opportunites"
        description="Nos programmes d'education developpent les competences, la confiance et l'autonomie des jeunes et des femmes a travers des parcours concrets."
        highlights={[
          {
            label: "Programmes actifs",
            value: `${programesEducation.length}+`,
          },
          { label: "Public cible", value: "Jeunes & Femmes" },
          { label: "Approche", value: "Pratique & Inclusive" },
        ]}
      >
        <section className="bg-white py-20">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="section-heading mb-2">
                Nos programmes d&apos;éducation
              </h1>
              <p className="section-subheading">
                Nous accompagnons les jeunes et les femmes vers l&apos;autonomie
                avec des parcours pedagogiques modernes et adaptes a leur
                realite.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {programesEducation.map((programme) => (
                <Card
                  key={programme.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white pt-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
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
                  <CardContent className="p-6">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      <BookOpenCheck className="h-3.5 w-3.5" />
                      Programme education
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-950">
                      {programme.nom}
                    </CardTitle>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {programme.description}
                    </p>
                    <Button asChild className="mt-6 rounded-full">
                      <Link href={programme.page}>
                        En savoir plus
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-slate-50 to-white py-20">
          <div className="section-container">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm md:p-12">
              <div className="mx-auto max-w-3xl text-center">
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <GraduationCap className="h-7 w-7" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                  Construisons ensemble un avenir plus equitable
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
                  Nos actions educatives s&apos;adressent a celles et ceux qui
                  veulent apprendre, entreprendre et contribuer positivement a
                  leur territoire.
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
                    <Link href="/about">Decouvrir ACCEENT</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </HeaderLayout>
    </>
  );
}
