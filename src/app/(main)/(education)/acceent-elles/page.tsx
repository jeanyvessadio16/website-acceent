import ProgrammeLayout from "@/components/layout/ProgrammeLayout";
import {
  acceentEllesApproche,
  acceentEllesData,
} from "@/data/education/acceentElles";
import {
  ArrowRight,
  ClipboardList,
  GraduationCap,
  Handshake,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { FadeIn } from "@/components/shared/Animations";

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
      {/* 1. Présentation du programme */}
      <FadeIn delay={0.1} direction="up">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 md:p-12 text-center shadow-xs">
          <span className="mb-4 inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            Inclusion, éducation et autonomie
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-4">
            À propos du programme
          </h2>
          <p className="mx-auto max-w-3xl text-slate-600 text-base sm:text-lg leading-relaxed">
            ACCEENT4ELLES est un programme initié par ACCEENT pour accompagner
            des jeunes filles en situation de vulnérabilité, souvent
            confrontées à des difficultés scolaires, économiques ou sociales.
            Notre objectif est de leur offrir un cadre bienveillant et structurant pour les aider à reprendre confiance en elles, poursuivre leur scolarité et construire un avenir meilleur.
          </p>
        </div>
      </FadeIn>

      {/* 2. Détails & Approches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <FadeIn delay={0.2} direction="right">
          <article className="h-full rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-primary mb-5">
                Accompagnement global
              </h3>
              <ul className="space-y-3">
                {acceentEllesData.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-xl border border-slate-200/60 bg-slate-50 p-4 text-sm font-medium text-slate-700"
                  >
                    {item.libelle}
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-6 text-sm text-slate-600 leading-relaxed">
              Avec ACCEENT4ELLES, nous croyons que chaque fille mérite une seconde chance et des opportunités d&apos;épanouissement durable.
            </p>
          </article>
        </FadeIn>

        <FadeIn delay={0.3} direction="left">
          <article className="h-full rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-primary mb-5">
                Nos approches
              </h3>
              <div className="space-y-3">
                {acceentEllesApproche.map((item) => {
                  const Icon = iconMap[item.icon as keyof typeof iconMap];
                  return (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200/60 bg-slate-50 p-4"
                    >
                      <div className="flex items-start gap-3.5">
                        {Icon ? (
                          <div className="mt-0.5 shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
                            <Icon size={18} />
                          </div>
                        ) : null}
                        <div>
                          <h4 className="font-semibold text-slate-900 text-sm sm:text-base">
                            {item.libelle}
                          </h4>
                          <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {item.detail}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="mt-6 text-sm text-slate-600 leading-relaxed">
              Une approche combinant formation, mentorat personnalisé et suivi bienveillant.
            </p>
          </article>
        </FadeIn>
      </div>

      {/* 3. Banner CTA */}
      <FadeIn delay={0.4} direction="up">
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm sm:text-base font-medium text-slate-800 text-center sm:text-left max-w-xl">
            Vous souhaitez soutenir le programme ou orienter une bénéficiaire ? Notre équipe peut vous accompagner.
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
