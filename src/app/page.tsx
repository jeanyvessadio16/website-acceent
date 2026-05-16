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
import { Metadata } from "next";

// referencement
export const metadata: Metadata = {
  title: {
    default: "ACCEENT - Education, Entreprenariat et numérique ",
    template: "%s | ACCEENT",
  },
  description:
    "ACCEENT est une association sénégalaise basée à Ziguinchor dans le quartier de Santhiaba. ACCEENT oeuvre dans les domaines de l'éducation, l'entreprenariat et le numérique",
  keywords: [
    "association Ziguinchor",
    "association acceent",
    "education Ziguinchor",
    "entreprenariat Ziguinchor",
    "numerique Ziguinchor",
    "ACCEENT Ziguinchor",
    "ACCEENT",
  ],
  authors: [{ name: "ACCEENT", url: "acceent.vercel.app" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: "ACCEENT",
    description: "ACCEENT",
    url: "https://acceent.vercel.app",
    siteName: "ACCEENT",
    images: [
      {
        url: "https://acceent.vercel.app/images/logo-acceent.png",
        width: 1200,
        height: 630,
        alt: "Logo ACCEENT",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <div>
        {/* HERO SECTION */}
        <section className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden bg-[url('/images/acceentImage.jpg')] bg-cover bg-fixed bg-center lg:bg-top">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/75" />
          <div className="relative max-md:px-10 z-10 flex flex-col items-center justify-center gap-4 text-center text-white">
            <span className="inline-block rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-primary-foreground backdrop-blur">
              Bienvenue à
            </span>
            <h1 className="text-fluid-h1 text-white">ACCEENT</h1>
            <p className="max-w-2xl text-slate-200 text-fluid-p-large">
              Action pour la Contribution Collective pour l&apos;Education,
              l&apos;Entreprenariat et le Numérique des Territoires
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size={"xl"}
                className="rounded-full px-8 shadow-lg shadow-black/30"
              >
                <Link href={"/about"}>
                  En sovoir plus
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* DOMAINES SECTION */}
        <section className="bg-gradient-to-b from-slate-50 to-white section-padding">
          <div className="section-container">
            <div className="mb-12 text-center">
              <h2 className="section-heading mb-3">
                Nos domaines d&apos;intervention
              </h2>
              <p className="section-subheading">
                Nous agissons sur trois axes essentiels pour accompagner les
                jeunes et les femmes vers l&apos;autonomie.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {list_domaines.map((domaine) => (
                <Card
                  key={domaine.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <CardContent className="m-0 p-0">
                    <div className="relative h-52 w-full overflow-hidden">
                      <Image
                        src={domaine.image}
                        alt={domaine.nom}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 md:p-8">
                      <CardTitle className="mb-3 text-fluid-h3 text-primary">
                        <h3>{domaine.nom}</h3>
                      </CardTitle>
                      <CardDescription className="text-fluid-p text-slate-600">
                        <p>{domaine.description}</p>
                      </CardDescription>

                      <Button
                        asChild
                        className="mt-6 rounded-full bg-secondary"
                      >
                        <Link href={domaine.page}>En savoir plus</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* PARTENAIRES SECTION */}
        <section className="section-padding">
          <Partenaire />
        </section>
      </div>

      {/* SECTION CONTACT */}
      <section className="section-padding bg-slate-50/50" id="contact">
        <Contact />
      </section>
    </>
  );
}
