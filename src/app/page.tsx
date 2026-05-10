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
        <section className="relative w-full overflow-hidden bg-[url('/images/acceentImage.jpg')] bg-cover bg-fixed bg-center lg:bg-top">
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/75" />
          <div className="section-container relative z-10 flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center py-12 text-center text-white md:py-16">
            <span className="inline-block rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold uppercase tracking-wider text-primary-foreground backdrop-blur">
              Bienvenue a ACCEENT
            </span>
            <h1 className="max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl lg:text-7xl">
              ACCEENT — au coeur de la transformation sociale à Ziguinchor
            </h1>
            <p className="mt-6 max-w-2xl text-base text-slate-200 md:text-lg">
              Nous accompagnons les jeunes et les femmes vers l&apos;autonomie
              avec des programmes concrets, accessibles et ancrés dans la
              realite locale.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size={"xl"}
                className="rounded-full px-8 shadow-lg shadow-black/30"
              >
                <Link href={"/about"}>
                  Decouvrir nos programmes
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </Button>
              <Button
                asChild
                size={"xl"}
                variant="outline"
                className="rounded-full border-white/30 bg-white/10 px-8 text-white hover:bg-white/20"
              >
                <Link href={"/#contact"}>Nous contacter</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="bg-white py-20">
          <div className="section-container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="section-heading mb-5">Qui sommes-nous ?</h1>
              <p className="text-base leading-relaxed text-slate-700 md:text-lg">
                <strong>ACCEENT</strong> - Action pour la Contribution
                Collective pour l&apos;Education, l&apos;Entreprenariat et le
                Numérique des Territoires, est une association basée à
                Ziguinchor dans le quartier de Santhiaba. ACCEENT oeuvre dans
                les domaines de l&apos;éducation, l&apos;entreprenariat et du
                numérique.
              </p>

              <Button asChild size={"xl"} className="mt-8 rounded-full px-8">
                <Link href={"/about"}>En savoir plus</Link>
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
                      <CardTitle className="mb-3 text-2xl font-bold text-slate-950">
                        {domaine.nom}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed text-slate-600">
                        {domaine.description}
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

        {/* CONTACT SECTION */}
        <section className="bg-white">
          <Contact />
        </section>
      </div>
    </>
  );
}
