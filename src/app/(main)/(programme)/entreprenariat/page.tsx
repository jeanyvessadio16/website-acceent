import HeaderLayout from "@/components/shared/HeaderLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { programesEntreprenariat } from "@/data/entreprenariat/programmes-entreprenariat";
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
  title: "Domaine Entrepreneuriat",
  description:
    "Programmes d'entrepreneuriat ACCEENT à Ziguinchor : ACCEENT'INCUB, ateliers entrepreneuriat et accompagnement des jeunes porteurs de projets en Casamance.",
  path: "/entreprenariat",
  keywords: [
    "entrepreneuriat Ziguinchor",
    "incubateur Casamance",
    "ACCEENT INCUB",
    "accompagnement startup Ziguinchor",
    "GIE Ziguinchor",
  ],
});

export default function Entreprenariat() {
  return (
    <>
      <HeaderLayout
        text="Domaine"
        title="Entrepreneuriat"
        description="Accompagnement, incubation et développement d'initiatives économiques durablement ancrées dans les territoires."
        bgImage="/images/entreprenariat-eco.jpeg"
        highlights={[
          {
            label: "Programmes d'action",
            value: `${programesEntreprenariat.length}`,
          },
          { label: "Public cible", value: "Jeunes & GIE" },
          { label: "Ancrage", value: "Économie Locale & Solidaire" },
        ]}
      >
        <section className="bg-white py-16 md:py-24">
          <div className="section-container">
            <FadeIn className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 mb-3">
                Nos programmes d&apos;entrepreneuriat
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Nous accompagnons les porteurs de projets et les acteurs locaux pour créer des initiatives viables et durables.
              </p>
            </FadeIn>

            <StaggerContainer className="mt-12 grid gap-6 md:grid-cols-2">
              {programesEntreprenariat.map((programme) => (
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
                        Programme entrepreneuriat
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
                  Transformez vos idées en projets à succès
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
                  Nos programmes d&apos;entrepreneuriat s&apos;adressent à
                  celles et ceux qui veulent innover, créer de la valeur et
                  contribuer positivement au développement économique de leur
                  territoire.
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

      <section className="py-16 md:py-20 bg-white border-t border-slate-200/60">
        <div className="section-container">
          <FadeIn delay={0.1} direction="down" className="mb-10 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Ancrage local
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mt-1">
              Notre engagement culturel
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <FadeIn delay={0.2} direction="right" className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900">
                Carnaval de Santhiaba
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
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
              <div className="relative h-[300px] w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 shadow-md">
                <Image
                  src="/images/canavalSanthiaba.jpeg"
                  alt="Carnaval Santhiaba"
                  fill
                  className="object-cover"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
