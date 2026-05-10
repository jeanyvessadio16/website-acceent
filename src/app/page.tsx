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
      <main>
        {/* HERO SECTION */}
        <section className="w-full relative bg-[url('/images/acceentImage.jpg')] bg-cover bg-center lg:bg-top">
          <div className="bg-black/70">
            <div className="lg:max-w-3xl px-12 mx-auto text-center text-white min-h-screen z-30 flex flex-col items-center justify-center gap-5">
              <span className="inline-block px-5 py-2 text-lg text-primary font-black rounded-2xl">
                Bienvue à
              </span>{" "}
              <h1 className="text-4xl sm:text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight">
                <strong className="lg:text-8xl">ACCEENT</strong>
              </h1>
              <p className="text-lg font-semibold animate-in fade-in slide-in-from-bottom-4 duration-1000">
                Nous accompagnons les jeunes et les femmes vers l&apos;autonomie
                en leur offrants des programmes concrets
              </p>
              <Button
                size={"xl"}
                className="rounded-full animate-in fade-in zoom-in-50 duration-1000"
              >
                <Link href={"/about"}> Découvrez nos programmes </Link>
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-12">
            <div className="text-center py-12 lg:max-w-3xl mx-auto">
              <h1 className="text-3xl mb-5 md:text-5xl font-bold">
                Qui sommes-nous ?
              </h1>
              <p className="max-sm:text-justify text-lg font-semibold">
                <strong>ACCEEN</strong>T - Action pour la Contribution
                Collective pour l&apos;Education, l&apos;Entreprenariat et le
                Numérique des Territoires, est une association basée à
                Ziguinchor dans le quartier de Santhiaba. ACCEENT oeuvre dans
                les domaines de l&apos;éducation, l&apos;entreprenariat et du
                numérique.
              </p>

              <Button asChild size={"xl"} className="rounded-full mt-5">
                <Link href={"/about"}> En savoir plus </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* DOMAINES SECTION */}
        <section className="px-12  py-16 bg-gray-200/20">
          <div className="text-center mb-10">
            <h1 className="text-3xl mb-3 md:text-5xl font-bold">
              Nos domaines d&apos;intervention
            </h1>
            <p className="text-lg text-gray-600 font-semibold">
              Nous agissons sur trois axes essentiels pour accompagner les
              jeunes et les femmes vers l&apos;autonomie
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 place-items-center place-content-center gap-5">
            {list_domaines.map((domaine) => (
              <Card
                key={domaine.id}
                className="p-0 max-w-sm transition-transform duration-500 ease-in-out hover:scale-105"
              >
                <CardContent className="p-0 m-0">
                  <div className="relative w-full h-48">
                    <Image
                      src={domaine.image}
                      alt={domaine.nom}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-5">
                    <CardTitle className="mb-2 text-2xl font-bold">
                      {domaine.nom}
                    </CardTitle>
                    <CardDescription>{domaine.description}</CardDescription>

                    <Button asChild className="rounded-full mt-5 bg-secondary">
                      <Link href={domaine.page}> En savoir plus </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* PARTENAIRES SECTION */}
        <section>
          <Partenaire />
        </section>

        {/* CONTACT SECTION */}
        <section className="bg-white">
          <Contact />
        </section>
      </main>
    </>
  );
}
