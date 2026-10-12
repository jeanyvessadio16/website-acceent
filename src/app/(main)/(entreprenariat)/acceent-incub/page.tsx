import ProgrammeLayout from "@/components/layout/ProgrammeLayout";
import { AtelierEntreprenariatProgrammes } from "@/data/entreprenariat/acceentIncub";
import { createPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import ProgrammeNavigationCta from "@/components/shared/ProgrammeNavigationCta";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/Animations";
import Image from "next/image";
import { acceentIncubGalerie } from "@/data/entreprenariat/acceent-incub-galerie";

export const metadata = createPageMetadata({
  title: "ACCEENT'INCUB — Incubateur de Startups & Projets à Ziguinchor",
  description:
    "ACCEENT'INCUB est l'incubateur de projets pour jeunes et femmes à Ziguinchor : mentorat, idéation, structuration financière et accompagnement vers la réussite en Casamance.",
  path: "/acceent-incub",
  keywords: [
    "ACCEENT INCUB",
    "incubateur Ziguinchor",
    "accompagnement startup Ziguinchor",
    "incubateur entreprise Casamance",
    "jeunes entrepreneurs Ziguinchor",
    "coaching projet entrepreneurial Sénégal",
    "structuration d'entreprise Ziguinchor",
    "mentorat entrepreneuriat Casamance",
  ],
});

export default function AcceentIncub() {
  const programme = {
    titre: "ACCEENT'INCUB",
    description:
      "Incubateur pour jeunes porteurs et porteuses de projets à Ziguinchor",
  };

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", item: "/" },
          { name: "Entrepreneuriat", item: "/entreprenariat" },
          { name: "ACCEENT Incub", item: "/acceent-incub" },
        ]}
      />
    <ProgrammeLayout
      image="/images/acceent-incub.jpeg"
      text="Programme Entrepreneuriat"
      {...programme}
    >
      {/* 1. Présentation du programme */}
      <FadeIn delay={0.1} direction="up">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 md:p-12 text-center shadow-xs">
          <span className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            Incubation et Accompagnement
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-4">
            À propos du programme
          </h2>
          <p className="mx-auto max-w-3xl text-slate-600 text-base sm:text-lg leading-relaxed">
            <strong>ACCEENT&apos;INCUB</strong> est un programme d&apos;incubation dédié aux jeunes porteurs et porteuses de projets de la région de Ziguinchor. Il a pour ambition de transformer des idées en initiatives concrètes, viables et porteuses de sens, en accompagnant les jeunes tout au long de leur parcours entrepreneurial. Le programme s&apos;adresse en priorité à des jeunes qui ont du potentiel mais manquent souvent de cadre, de conseils ou de ressources pour lancer et faire évoluer leur projet.
          </p>
        </div>
      </FadeIn>

      {/* 2. Avantages */}
      <div className="space-y-8">
        <FadeIn delay={0.2} direction="down" className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Avantages du programme
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Avec ACCEENT&apos;INCUB, les incubé·e·s bénéficient d&apos;un accompagnement complet.
          </p>
        </FadeIn>

        <StaggerContainer delay={0.3} className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {AtelierEntreprenariatProgrammes.map((item, idx) => (
            <StaggerItem key={item.id}>
              <div className="group relative flex items-center gap-4 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                  0{idx + 1}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {item.libelle}
                  </h3>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* 3. Galerie photos ACCEENT'INCUB */}
      <FadeIn delay={0.35} direction="up">
        <div className="space-y-6">
          <div className="text-center sm:text-left">
            <span className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-2">
              En images
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Galerie de l&apos;incubateur
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl mt-1">
              Immersion au cœur des ateliers d&apos;incubation, des sessions de mentorat et des moments d&apos;échange de nos jeunes entrepreneurs.
            </p>
          </div>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {acceentIncubGalerie.map((photo) => (
              <StaggerItem key={photo.id}>
                <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-xs transition-all duration-300 hover:shadow-md">
                  <div className="relative w-full aspect-[4/3]">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  {photo.caption && (
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                      <span className="text-xs sm:text-sm font-semibold text-white leading-tight">
                        {photo.caption}
                      </span>
                    </div>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </FadeIn>

      {/* 4. Navigation & CTA vers les pages clés */}
      <ProgrammeNavigationCta
        currentProgrammeTitle="l'incubateur ACCEENT'INCUB"
        parentDomaine={{ nom: "Entrepreneuriat", href: "/entreprenariat" }}
        callToActionText="ACCEENT'INCUB est un tremplin pour une jeunesse créative et ambitieuse. Vous avez un projet à structurer, besoin de mentorat ou souhaitez soutenir nos porteurs de projet ?"
        primaryButtonText="Candidater / Nous contacter"
        primaryButtonHref="/contact"
        relatedProgrammes={[
          { nom: "Atelier Entrepreneuriat", href: "/atelier-entreprenariat" },
          { nom: "Forum Entrepreneur", href: "/forum-entrepreneur" },
        ]}
      />
    </ProgrammeLayout>
    </>
  );
}
