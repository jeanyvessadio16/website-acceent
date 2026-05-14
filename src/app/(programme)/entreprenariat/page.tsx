import HeaderLayout from "@/components/shared/HeaderLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpenCheck, Rocket } from "lucide-react";
import { Metadata } from "next";
import { programesEntreprenariat } from "@/data/entreprenariat/programmes-entreprenariat";

export const metadata: Metadata = {
  title: "Entreprenariat",
  description: "ACCEENT page entreprenariat",
};

export default function Entreprenariat() {
  return (
    <>
      <HeaderLayout
        text="Programme Entreprenariat"
        title="Créatvité et innovtion pour un avenir meilleur"
        description="ACCEENT accompagne les porteurs de projets, les jeunes et les femmes dans la construction de leurs initiatives entrepreneuriales, de l'idée à la réalisation."
      >
        <section className="bg-white py-20">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="section-heading mb-2">
                Nos programmes d&apos;entreprenariat
              </h1>
              <p className="section-subheading">
                Nous accompagnons les jeunes et les femmes vers l&apos;autonomie
                avec des parcours pedagogiques modernes et adaptes a leur
                realite.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {programesEntreprenariat.map((programme) => (
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
                      Programme entreprenariat
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
                  <Rocket className="h-7 w-7" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                  Transformez vos idées en projets à succès
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
                  Nos programmes d'entrepreneuriat s'adressent à celles et ceux qui
                  veulent innover, créer de la valeur et contribuer positivement au
                  développement économique de leur territoire.
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
