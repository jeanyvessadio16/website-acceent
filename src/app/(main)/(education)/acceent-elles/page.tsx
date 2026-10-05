import ProgrammeLayout from "@/components/layout/ProgrammeLayout";
import {
  acceentEllesApproche,
  acceentEllesData,
  acceent4ellesComposants,
  temoignages,
} from "@/data/education/acceentElles";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Handshake,
  Quote,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/Animations";
import { FaqSection } from "./FaqSection";
import { galerieAcceent4Elles } from "@/data/education/galerie";

export const metadata = createPageMetadata({
  title: "ACCEENT4ELLES — Autonomisation & Leadership des Filles à Ziguinchor",
  description:
    "ACCEENT4ELLES accompagne et valorise les jeunes filles et femmes de Ziguinchor : mentorat, ateliers d'émancipation, leadership et égalité des chances en Casamance.",
  path: "/acceent-elles",
  keywords: [
    "ACCEENT4ELLES Ziguinchor",
    "autonomisation des jeunes filles Ziguinchor",
    "mentorat filles Casamance",
    "éducation des filles Ziguinchor",
    "leadership féminin Sénégal",
    "inclusion des filles Ziguinchor",
    "égalités des chances femmes Casamance",
    "femmes et numérique Ziguinchor",
  ],
});

export default function AcceentEllesPage() {
  const programme = {
    titre: "ACCEENT4ELLES",
    description:
      "Autonomiser les jeunes filles pour un avenir meilleur à Ziguinchor",
  };

  const iconMap = {
    userRound: UserRound,
    graduationCap: GraduationCap,
    handshake: Handshake,
    clipboardList: ClipboardList,
  } as const;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", item: "/" },
          { name: "Éducation", item: "/education" },
          { name: "ACCEENT4ELLES", item: "/acceent-elles" },
        ]}
      />
      <ProgrammeLayout
        image="/images/acceentImage.jpg"
        text="Programme Éducation"
        {...programme}
      >
        {/* 1. Présentation + Checklist côte à côte */}
        <FadeIn delay={0.1} direction="up">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
            <div className="flex-1">
              <span className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-4">
                Inclusion, éducation et autonomie
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 leading-tight">
                À propos du programme
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                ACCEENT4ELLES est un programme initié par ACCEENT pour
                accompagner des jeunes filles en situation de vulnérabilité,
                souvent confrontées à des difficultés scolaires, économiques ou
                sociales. Notre objectif est de leur offrir un cadre bienveillant
                pour les aider à reprendre confiance, poursuivre leur scolarité
                et construire un avenir meilleur.
              </p>
            </div>

            <ul className="flex-1 space-y-3">
              {acceentEllesData.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed"
                >
                  <CheckCircle2
                    size={18}
                    className="shrink-0 mt-0.5 text-primary"
                  />
                  <span>{item.libelle}</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>

        {/* 2. Approches */}
        <FadeIn delay={0.2} direction="up">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-xs">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
              Nos approches
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {acceentEllesApproche.map((item) => {
                const Icon = iconMap[item.icon as keyof typeof iconMap];
                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100"
                  >
                    {Icon && (
                      <div className="shrink-0 rounded-xl bg-primary/10 p-2.5 text-primary">
                        <Icon size={20} />
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm mb-1">
                        {item.libelle}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>

        {/* 3. Composantes du programme */}
        <FadeIn delay={0.3} direction="up">
          <div>
            <div className="mb-6">
              <span className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-3">
                Structure du programme
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Composantes du programme
              </h3>
            </div>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-px bg-slate-200 rounded-3xl overflow-hidden border border-slate-200">
              {acceent4ellesComposants.map((composant, idx) => (
                <StaggerItem key={composant.id}>
                  <div className="bg-white h-full p-6 sm:p-8 flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        0{idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {composant.libelle}
                      </h4>
                    </div>
                    <ul className="space-y-2.5">
                      {composant.taches.map((tache) => (
                        <li
                          key={tache}
                          className="flex items-center gap-2 text-xs text-slate-600"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" />
                          {tache}
                        </li>
                      ))}
                    </ul>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </FadeIn>

        {/* 4. Témoignages */}
        <FadeIn delay={0.35} direction="up">
          <div>
            <div className="mb-6">
              <span className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-3">
                Paroles de bénéficiaires
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Témoignages
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {temoignages.map((t) => (
                <div
                  key={t.id}
                  className="relative flex flex-col gap-5 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs overflow-hidden"
                >
                  <Quote
                    size={48}
                    className="absolute top-5 right-6 text-primary/8"
                    aria-hidden
                  />
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed italic relative z-10">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="flex h-10 w-10 rounded-full items-center justify-center bg-primary/10 border-2 border-primary/20 shrink-0">
                      <span className="text-sm font-bold text-primary">
                        {t.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">
                      {t.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* 5. Galerie photos */}
        <FadeIn delay={0.38} direction="up">
          <div>
            <div className="mb-6">
              <span className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-3">
                En images
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Galerie du programme
              </h3>
            </div>
            <StaggerContainer className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
              {galerieAcceent4Elles.map((photo) => (
                <StaggerItem key={photo.id}>
                  <div className="group relative break-inside-avoid overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-xs">
                    <div className="relative w-full aspect-[4/3]">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    </div>
                    {photo.caption && (
                      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3">
                        <span className="text-xs font-medium text-white leading-tight">
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

        {/* 6. FAQ — Client Component */}
        <FadeIn delay={0.4} direction="up">
          <FaqSection />
        </FadeIn>

        {/* 6. Banner CTA */}
        <FadeIn delay={0.45} direction="up">
          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-sm sm:text-base font-medium text-slate-800 text-center sm:text-left max-w-xl">
              Vous souhaitez soutenir le programme ou orienter une bénéficiaire ?
              Notre équipe peut vous accompagner.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-xs transition-all hover:bg-primary/90 shrink-0"
            >
              Nous contacter
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </FadeIn>
      </ProgrammeLayout>
    </>
  );
}
