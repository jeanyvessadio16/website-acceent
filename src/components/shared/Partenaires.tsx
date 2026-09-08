"use client";

import { type Partenaire } from "@/types/partenaires";
import { Card } from "../ui/card";
import { partenaires } from "@/data/partenaires";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Partenaire() {
  // Dupliquer le tableau de partenaires pour assurer une boucle infinie continue et fluide sans trou
  const doublePartenaires = [...partenaires, ...partenaires, ...partenaires];

  return (
    <section className="space-y-8 rounded-4xl border border-slate-200/60 bg-white/90 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl md:p-10">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-fluid-h2 text-slate-950 mb-4">Nos partenaires</h2>
        <p className="mx-auto max-w-2xl text-fluid-p text-slate-600">
          Nos partenaires sont des acteurs clés dans notre mission.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-slate-950/5 py-6">
        {/* Ombres dégradées latérales pour effet fondu */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-24 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-24 bg-gradient-to-l from-white to-transparent" />

        <motion.div
          className="flex w-max gap-4 px-4"
          animate={{ x: ["0%", "-33.333%"] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 65,
            ease: "linear",
          }}
        >
          {doublePartenaires.map((partenaire: Partenaire, idx: number) => (
            <Card
              key={`${partenaire.id}-${idx}`}
              className="w-44 flex-none border border-slate-200/80 bg-white/95 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.3)] transition duration-300 hover:-translate-y-0.5 hover:shadow-lg md:w-52"
            >
              <div className="flex h-full flex-col p-3.5">
                <div className="mb-3 flex items-center gap-2.5">
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
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800"
                  >
                    Visiter
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
