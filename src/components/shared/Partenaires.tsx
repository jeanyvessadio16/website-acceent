// Composant partenaire

import { type Partenaire } from "@/types/partenaires";
import { Card } from "../ui/card";
import { partenaires } from "@/data/partenaires";
import Image from "next/image";

export default function Partenaire() {
  return (
    <section className="space-y-8 rounded-4xl border border-slate-200/60 bg-white/90 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl md:p-10">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.35em] text-slate-500">
          Nos partenaires
        </p>
        <h2 className="text-fluid-h2 text-slate-950 mb-4">
          Ils accompagnent nos projets.
        </h2>
        <p className="mx-auto max-w-2xl text-fluid-p text-slate-600">
          Une sélection de partenaires engagés et complémentaires qui
          participent à l&apos;impact de nos programmes.
        </p>
      </div>

      <div className="partner-marquee group relative overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-slate-950/5 py-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-white to-white/0" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-white to-white/0" />

        <div className="partner-track">
          {[0, 1].map((groupIndex) => (
            <div className="partner-group" key={groupIndex} aria-hidden={groupIndex === 1}>
              {partenaires.map((partenaire: Partenaire) => (
                <Card
                  key={`${groupIndex}-${partenaire.id}`}
                  className="w-40 flex-none border border-slate-200/80 bg-white/95 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.3)] transition duration-300 hover:-translate-y-0.5 hover:shadow-lg md:w-48"
                >
                  <div className="flex h-full flex-col p-3">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-950/5 ring-1 ring-slate-900/5">
                        <Image
                          src={partenaire.logo}
                          alt={partenaire.name}
                          width={32}
                          height={32}
                          className="h-8 w-8 object-contain"
                        />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h3 className="truncate text-sm font-semibold text-slate-950">
                          {partenaire.name}
                        </h3>
                        <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                          {partenaire.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto space-y-3">
                      <div className="h-px bg-slate-200/80" />

                      <a
                        href={partenaire.website}
                        className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800"
                      >
                        Visiter
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
