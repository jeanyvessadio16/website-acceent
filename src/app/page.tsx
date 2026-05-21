import { Button } from "@/components/ui/button";
import Link from "next/link";
import { list_domaines } from "@/data/list-domaines";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Partenaire from "@/components/shared/Partenaires";
import { ArrowRight } from "lucide-react";
import Contact from "@/components/shared/Contact";
import {
  OrganizationJsonLd,
  WebSiteJsonLd,
} from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/seo";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  ScaleIn,
} from "@/components/shared/Animations";

export const metadata = createPageMetadata({
  title: "Accueil",
  description:
    "ACCEENT accompagne les jeunes et les femmes de Ziguinchor à travers des programmes d'éducation, d'entrepreneuriat et de numérique pour favoriser l'autonomie et l'impact local.",
  path: "/",
  keywords: [
    "ACCEENT Ziguinchor",
    "association éducation Casamance",
    "formation entrepreneuriat jeunes",
    "programmes numériques Sénégal",
  ],
});

export default function Home() {
  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <div>
        <section
          className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden bg-[url('/images/acceentImage.jpg')] bg-cover bg-fixed bg-center lg:bg-top"
          aria-labelledby="hero-heading"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/75" />
          <div className="relative max-md:px-10 z-10 flex flex-col items-center justify-center gap-4 text-center text-white">
            <FadeIn delay={0.1} direction="down">
              <span className="inline-block rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-primary-foreground backdrop-blur">
                Bienvenue à
              </span>
            </FadeIn>
            <FadeIn delay={0.2} direction="up">
              <h1 id="hero-heading" className="text-fluid-h1 text-white">
                ACCEENT
              </h1>
            </FadeIn>
            <FadeIn delay={0.3} direction="up">
              <p className="max-w-2xl text-slate-200 text-fluid-p-large">
                Action pour la Contribution Collective pour l&apos;Education,
                l&apos;Entreprenariat et le Numérique des Territoires
              </p>
            </FadeIn>
            <FadeIn delay={0.4} direction="up">
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  size={"xl"}
                  className="rounded-full px-8 shadow-lg shadow-black/30"
                >
                  <Link href={"/about"}>
                    En savoir plus
                    <ArrowRight className="ml-2" aria-hidden="true" size={20} />
                  </Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </section>

        <section
          className="bg-gradient-to-b from-slate-50 to-white section-padding"
          aria-labelledby="domaines-heading"
        >
          <div className="section-container">
            <FadeIn delay={0.1} direction="up" className="mb-12 text-center">
              <h2 id="domaines-heading" className="section-heading mb-3">
                Nos domaines d&apos;intervention
              </h2>
              <p className="section-subheading">
                Nous agissons sur trois axes essentiels pour accompagner les
                jeunes et les femmes vers l&apos;autonomie.
              </p>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0" delay={0.2}>
              {list_domaines.map((domaine) => (
                <StaggerItem key={domaine.id}>
                  <div role="listitem" className="h-full">
                    <Card className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full flex flex-col">
                      <CardContent className="m-0 p-0 flex flex-col flex-grow">
                        <div className="relative h-52 w-full overflow-hidden">
                          <Image
                            src={domaine.image}
                            alt={`Programme ${domaine.nom} — ACCEENT Ziguinchor`}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-6 md:p-8 flex flex-col flex-grow">
                          <CardTitle className="mb-3 text-fluid-h3 text-primary">
                            <h3>{domaine.nom}</h3>
                          </CardTitle>
                          <CardDescription className="text-fluid-p text-slate-600 flex-grow">
                            <p>{domaine.description}</p>
                          </CardDescription>

                          <Button
                            asChild
                            className="mt-6 rounded-full bg-secondary w-fit"
                          >
                            <Link href={domaine.page}>
                              En savoir plus
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        <section
          className="section-padding"
          aria-labelledby="partenaires-heading"
        >
          <FadeIn delay={0.2} direction="up">
            <h2 id="partenaires-heading" className="sr-only">
              Nos partenaires
            </h2>
            <Partenaire />
          </FadeIn>
        </section>
      </div>

      <section
        className="section-padding bg-slate-50/50"
        id="contact"
        aria-labelledby="contact-heading"
      >
        <FadeIn delay={0.1} direction="up">
          <h2 id="contact-heading" className="sr-only">
            Nous contacter
          </h2>
          <Contact />
        </FadeIn>
      </section>
    </>
  );
}
