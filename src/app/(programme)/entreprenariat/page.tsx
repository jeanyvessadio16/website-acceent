import HeaderLayout from "@/components/shared/HeaderLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpenCheck, Rocket } from "lucide-react";
import { programesEntreprenariat } from "@/data/entreprenariat/programmes-entreprenariat";
import { createPageMetadata } from "@/lib/seo";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/Animations";

export const metadata = createPageMetadata({
  title: "Programme Entrepreneuriat",
  description:
    "Programmes d'entrepreneuriat ACCEENT à Ziguinchor : incubation, ateliers et forum des acteurs locaux pour accompagner les jeunes porteurs de projets.",
  path: "/entreprenariat",
  keywords: [
    "entrepreneuriat Ziguinchor",
    "incubateur jeunes Sénégal",
    "atelier entrepreneuriat Casamance",
    "forum entrepreneur local",
  ],
});

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
            <FadeIn className="mx-auto max-w-3xl text-center">
              <h1 className="section-heading mb-2">
                Nos programmes d&apos;entreprenariat
              </h1>
              <p className="section-subheading">
                Nous accompagnons les jeunes et les femmes vers l&apos;autonomie
                avec des parcours pedagogiques modernes et adaptes a leur
                realite.
              </p>
            </FadeIn>

            <StaggerContainer className="mt-12 grid gap-6 md:grid-cols-2">
              {programesEntreprenariat.map((programme) => (
                <StaggerItem key={programme.id}>
                  <Card
                    className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white pt-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full flex flex-col"
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
                    <CardContent className="p-6 flex flex-col flex-grow">
                      <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        <BookOpenCheck className="h-3.5 w-3.5" />
                        Programme entreprenariat
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
            <FadeIn delay={0.2} direction="up" className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm md:p-12">
              <div className="mx-auto max-w-3xl text-center">
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Rocket className="h-7 w-7" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                  Transformez vos idées en projets à succès
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
                  Nos programmes d&apos;entrepreneuriat s&apos;adressent à
                  celles et ceux qui veulent innover, créer de la valeur et
                  contribuer positivement au développement économique de leur
                  territoire.
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
            </FadeIn>
          </div>
        </section>
      </HeaderLayout>

      {/* section cultule */}
      <section className="relative">
          <FadeIn delay={0.1} direction="down" className="relative">
            <h2 className="text-fluid-h3 text-center">
              Notre engagement culturel
            </h2>
            <div className="w-52 h-2 mx-auto mt-2.5 bg-primary rounded-full"></div>
          </FadeIn>
        <div className="px-12 py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <FadeIn delay={0.2} direction="right" className="space-y-5">
            <h2 className="text-fluid-h3">Carnaval de Santhiaba</h2>
            <p>
              ACCEENT joue un rôle clé dans la promotion de la culture comme
              levier de développement durable. Elle est notamment partenaire
              central du Carnaval de Santhiaba, un événement qui célèbre la
              diversité culturelle et l&apos;identité locale. À travers ce
              carnaval, l&apos;organisation réunit divers acteurs culturels et
              institutionnels pour discuter du rôle de la culture dans le
              développement des territoires.
            </p>
          </FadeIn>
          <FadeIn delay={0.3} direction="left" className="flex justify-center">
            <Image
              src="/images/canavalSanthiaba.jpeg"
              alt="Carnaval Santhiaba"
              width={500}
              height={300}
              className="w-full max-w-md bg-cover bg-center rounded-2xl shadow-2xl"
            />
          </FadeIn>
        </div>
      </section>
    </>
  );
}
