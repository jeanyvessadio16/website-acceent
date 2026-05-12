import ProgrammeLayout from "@/components/layout/ProgrammeLayout";
import {
  acceentEllesApproche,
  acceentEllesData,
  type AcceentEllesItemIcon,
} from "@/data/education/acceentElles";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Briefcase,
  ChevronDown,
  ClipboardList,
  GraduationCap,
  Handshake,
  Heart,
  Laptop,
  LayoutList,
  MessageCircleHeart,
  Target,
  UserRound,
} from "lucide-react";
import { Metadata } from "next";

const ITEM_ICONS: Record<AcceentEllesItemIcon, LucideIcon> = {
  bookOpen: BookOpen,
  heart: Heart,
  laptop: Laptop,
  briefcase: Briefcase,
  messages: MessageCircleHeart,
  userRound: UserRound,
  graduationCap: GraduationCap,
  handshake: Handshake,
  clipboardList: ClipboardList,
};

export const metadata: Metadata = {
  title: "ACCEENT4ELLES",
  description:
    "Programme de education visant à promouvoir la diversité et l'inclusion dans le secteur de la tech en mettant en avant les parcours inspirants de femmes qui ont réussi dans ce domaine.",
};

function ListeSection({
  titre,
  description,
  sectionIcon: SectionIcon,
  sectionIconLabel,
  items,
}: {
  titre: string;
  description: string;
  sectionIcon: LucideIcon;
  sectionIconLabel: string;
  items: {
    id: number;
    icon: AcceentEllesItemIcon;
    libelle: string;
    detail: string;
  }[];
}) {
  return (
    <article className="flex flex-col rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-white/10">
      <header className="mb-6 flex gap-4 border-b border-neutral-100 pb-6 dark:border-neutral-800">
        <div
          className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-700 text-white shadow-md dark:from-neutral-100 dark:to-neutral-300 dark:text-neutral-900"
          aria-hidden
        >
          <SectionIcon className="size-7" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            {sectionIconLabel}
          </p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-neutral-900 md:text-2xl dark:text-neutral-50">
            {titre}
          </h3>
        </div>
      </header>

      <ul className="flex flex-col gap-2" role="list">
        {items.map((item) => {
          const Icon = ITEM_ICONS[item.icon];
          return (
            <li key={item.id}>
              <details className="group rounded-xl border border-neutral-200/80 bg-neutral-50/80 open:border-neutral-300 open:bg-white open:shadow-sm dark:border-neutral-800 dark:bg-neutral-900/40 dark:open:border-neutral-600 dark:open:bg-neutral-900/70">
                <summary className="flex cursor-pointer list-none items-center gap-3 px-3 py-3.5 pr-10 outline-none marker:content-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white dark:focus-visible:ring-offset-neutral-950 [&::-webkit-details-marker]:hidden">
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-neutral-700 shadow-sm ring-1 ring-neutral-200/80 dark:bg-neutral-900 dark:text-neutral-200 dark:ring-neutral-700"
                    aria-hidden
                  >
                    <Icon
                      className="size-[1.125rem] transition-transform group-open:scale-105"
                      strokeWidth={1.85}
                    />
                  </span>
                  <span className="min-w-0 flex-1 text-left text-[0.9375rem] font-medium text-neutral-900 dark:text-neutral-100">
                    {item.libelle}
                  </span>
                  <span
                    className="flex size-8 shrink-0 items-center justify-center text-neutral-500 transition-transform duration-200 group-open:rotate-180 dark:text-neutral-400"
                    aria-hidden
                  >
                    <ChevronDown className="size-5" strokeWidth={2} />
                  </span>
                </summary>
                <div className="border-t border-neutral-200/70 px-3 pb-4 pl-[3.25rem] pr-3 pt-2 text-sm leading-relaxed text-neutral-600 dark:border-neutral-700 dark:text-neutral-400">
                  {item.detail}
                </div>
              </details>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 border-t border-neutral-100 pt-6 text-sm leading-relaxed text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
        {description}
      </p>
    </article>
  );
}

export default function AcceentEllesPage() {
  const programme = {
    titre: "Acceent4ELLES ?",
    description:
      "Découvrez les parcours inspirants de femmes qui ont réussi dans le domaine de la tech, et comment elles ont surmonté les obstacles pour atteindre leurs objectifs.",
  };
  return (
    <>
      <ProgrammeLayout
        className="bg-[url('/images/acceentImage.jpg')] bg-cover bg-fixed bg-center lg:bg-top"
        {...programme}
      >
        <section>
          <div className="space-y-6 text-center">
            <h2 className="text-4xl font-bold md:text-5xl">
              A propos du programme
            </h2>
            <p className="mx-auto max-w-3xl text-neutral-700 dark:text-neutral-300">
              ACCENT4ELLES est un programme initié par ACCEENT pour accompagner
              des jeunes filles en situation de vulnérabilité, souvent
              confrontées à des difficultés scolaires, économiques ou à des
              grossesses précoces. Notre objectif est de leur offrir un cadre
              bienveillant et structurant pour les aider à reprendre confiance
              en elles, poursuivre leur scolarité et construire un avenir
              meilleur.
            </p>
          </div>
        </section>
      </ProgrammeLayout>

      <section className="border-t border-neutral-200/80 bg-gradient-to-b from-neutral-50 via-white to-neutral-50/80 px-4 py-14 sm:px-8 lg:px-14 dark:border-neutral-800 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
            <ListeSection
              sectionIcon={LayoutList}
              sectionIconLabel="Programme"
              titre="Un accompagnement global"
              description="Avec ACCENT4ELLES, nous croyons qu'aucune situation n'est définitive. Chaque fille mérite une seconde chance, un accompagnement digne et des opportunités pour se révéler et s'épanouir."
              items={acceentEllesData}
            />
            <ListeSection
              sectionIcon={Target}
              sectionIconLabel="Approches"
              titre="Nos leviers d’accompagnement"
              description="Notre approche repose sur un accompagnement global et durable, combinant formation continue, mentorat personnalisé et suivi post-formation pour garantir l'autonomie et la réussite des bénéficiaires."
              items={acceentEllesApproche}
            />
          </div>
        </div>
      </section>
    </>
  );
}
