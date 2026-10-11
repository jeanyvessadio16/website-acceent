import ProgrammeLayout from "@/components/layout/ProgrammeLayout";
import { tuttankProgrammes } from "@/data/education/tut-tank";
import { CheckCircle2 } from "lucide-react";
import ProgrammeNavigationCta from "@/components/shared/ProgrammeNavigationCta";
import { createPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/Animations";

export const metadata = createPageMetadata({
  title: "TUT-TANK — Accompagnement Scolaire & Social des Filles à Ziguinchor",
  description:
    "TUT-TANK par ACCEENT : accompagnement scolaire, soutien social et suivi individuel des jeunes filles en situation de vulnérabilité à Ziguinchor (Casamance).",
  path: "/tut-tank",
  keywords: [
    "TUT-TANK Ziguinchor",
    "Tut-Tank ACCEENT",
    "accompagnement scolaire filles Ziguinchor",
    "soutien social famille Ziguinchor",
    "réussite scolaire Casamance",
    "parrainage scolaire Ziguinchor",
    "lutte contre le décrochage scolaire Sénégal",
    "jeunes filles vulnérables Santhiaba",
  ],
});

export default function TutTankPage() {
  const programme = {
    titre: "TUT-TANK",
    description:
      "Un accompagnement scolaire et social pour les jeunes filles vulnérables",
  };

  const highlights = [
    "Renforcement de la pensée critique des enfants.",
    "Amélioration des relations familiales et du dialogue parents-enfants.",
    "Soutien aux parents dans leur rôle éducatif au quotidien.",
    "Création d'espaces d'échange, d'apprentissage et de complicité.",
    "Accompagnement bienveillant et adapté à chaque situation.",
  ];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", item: "/" },
          { name: "Éducation", item: "/education" },
          { name: "Tut-Tank", item: "/tut-tank" },
        ]}
      />
      <ProgrammeLayout
        image="/images/tuttank.jpeg"
        text="Programme Éducation"
        {...programme}
      >
        {/* 1. Présentation + Points clés côte à côte */}
        <FadeIn delay={0.1} direction="up">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
            {/* Texte */}
            <div className="flex-1">
              <span className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-4">
                Éducation, famille et autonomie
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 leading-tight">
                À propos du programme
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                <strong>TUT-TANK</strong> est un programme mis en place par
                ACCEENT pour accompagner les enfants et leurs familles dans un
                cadre éducatif et bienveillant. Il vise à renforcer la pensée
                critique des enfants, améliorer les relations familiales et
                soutenir les parents dans leur rôle éducatif.
              </p>
            </div>

            {/* Points clés */}
            <ul className="flex-1 space-y-3">
              {highlights.map((point, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed"
                >
                  <CheckCircle2
                    size={18}
                    className="shrink-0 mt-0.5 text-primary"
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>

        {/* 2. Activités du programme — panel stepped */}
        <FadeIn delay={0.3} direction="up">
          <div>
            <div className="mb-6">
              <span className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-3">
                Ce que nous faisons
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Activités du programme
              </h3>
            </div>
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200 rounded-3xl overflow-hidden border border-slate-200">
              {tuttankProgrammes.map((item, idx) => (
                <StaggerItem key={item.id}>
                  <div className="bg-white h-full p-6 sm:p-8 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        0{idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {item.libelle}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </FadeIn>

        {/* 3. Navigation & CTA vers les pages clés */}
        <ProgrammeNavigationCta
          currentProgrammeTitle="le programme TUT-TANK"
          parentDomaine={{ nom: "Éducation", href: "/education" }}
          callToActionText="TUT'TANK place la famille au cœur de l'éducation en créant des espaces d'échange, d'apprentissage et de bienveillance. Vous souhaitez inscrire une participante, parrainer ou soutenir le programme ?"
          primaryButtonText="Nous contacter"
          primaryButtonHref="/contact"
          relatedProgrammes={[
            { nom: "ACCEENT-Elles", href: "/acceent-elles" },
          ]}
        />
      </ProgrammeLayout>
    </>
  );
}
