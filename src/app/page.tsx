"use client";

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
            <h1 className="max-w-4xl text-5xl font-black  md:text-6xl lg:text-8xl">
              ACCEENT
            </h1>
            <p className="max-w-2xl text-slate-200 text-lg lg:text-xl">
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
        <section className="bg-gradient-to-b from-slate-50 to-white py-20">
          <div className="section-container">
            <div className="mb-12 text-center">
              <h1 className="section-heading mb-3">
                Nos domaines d&apos;intervention
              </h1>
              <p className="section-subheading">
                Nous agissons sur trois axes essentiels pour accompagner les
                jeunes et les femmes vers l&apos;autonomie.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                    <div className="p-6">
                      <CardTitle className="mb-3 text-2xl font-bold text-primary">
                        <h3>{domaine.nom}</h3>
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed text-slate-600">
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
        <section className="py-16">
          <Partenaire />
        </section>
      </div>

      {/* SECTION CONTACT */}
      <section className="py-16" id="contact">
        <Contact />
      </section>
    </>
  );
}
