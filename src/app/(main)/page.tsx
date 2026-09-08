import { Button } from "@/components/ui/button";
import Link from "next/link";
import { list_domaines } from "@/data/list-domaines";
import Image from "next/image";
import Partenaire from "@/components/shared/Partenaires";
import Contact from "@/components/shared/contact/Contact";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/seo";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/Animations";

export const metadata = createPageMetadata({
  title: "Accueil",
  description:
    "ACCEENT accompagne les jeunes et les femmes de Ziguinchor à travers des programmes d'éducation, d'entrepreneuriat et de numérique pour favoriser l'autonomie et l'impact local.",
  path: "/",
  keywords: [
    "ACCEENT Ziguinchor",
    "association Ziguinchor",
    "association éducation Ziguinchor",
    "formation entrepreneuriat Ziguinchor",
    "programmes numériques Ziguinchor",
    "inclusion numérique filles Ziguinchor",
    "autonomie des jeunes filles Ziguinchor",
    "mentorat jeunes filles Ziguinchor",
    "égalité filles-garçons Ziguinchor",
  ],
});

export default function Home() {
  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <div>
        {/* Section 1 — Hero */}
        <section
          className="relative w-full h-[calc(100dvh-5rem)] flex flex-col justify-center items-center overflow-hidden bg-slate-900 bg-[url('/team/team.jpeg')] bg-cover bg-fixed bg-center"
          aria-labelledby="hero-heading"
        >
          <div className="pointer-events-none absolute inset-0 bg-slate-950/75 backdrop-blur-[2px]" />
          <div className="relative section-container py-4 sm:py-10 z-10 flex flex-col items-center justify-center text-center text-white space-y-3 sm:space-y-6">
            <FadeIn delay={0.1} direction="down">
              <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 sm:px-4 sm:py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-200">
                Association — Ziguinchor, Sénégal
              </span>
            </FadeIn>

            <FadeIn delay={0.2} direction="up">
              <h1 id="hero-heading" className="max-w-4xl text-xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                Action pour la Contribution Collective pour l&apos;Éducation, l&apos;Entrepreneuriat et le Numérique des Territoires
              </h1>
            </FadeIn>

            <FadeIn delay={0.3} direction="up">
              <p className="max-w-2xl text-slate-200 text-xs sm:text-base md:text-lg leading-relaxed">
                ACCEENT accompagne les jeunes et les femmes de Ziguinchor à travers des initiatives d&apos;éducation, d&apos;entrepreneuriat et de numérique pour favoriser l&apos;autonomie et le développement local durable.
              </p>
            </FadeIn>

            <FadeIn delay={0.4} direction="up">
              <div className="flex flex-row gap-2.5 sm:gap-4 pt-1 sm:pt-2">
                <Button
                  asChild
                  size="default"
                  className="rounded-full px-5 sm:px-8 bg-primary text-white hover:bg-primary/90 font-semibold text-xs sm:text-sm h-10 sm:h-11"
                >
                  <Link href="/contact">
                    Nous contacter
                  </Link>
                </Button>
                <Button
                  asChild
                  size="default"
                  className="rounded-full px-5 sm:px-8 bg-white/15 text-white hover:bg-white/25 border border-white/30 backdrop-blur-md font-semibold text-xs sm:text-sm h-10 sm:h-11 transition-colors shadow-xs"
                >
                  <Link href="/about">
                    Découvrir ACCEENT
                  </Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Section 2 — Qui sommes-nous ? */}
        <section className="py-16 md:py-24 bg-white" aria-labelledby="presentation-heading">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              <FadeIn delay={0.1} direction="right" className="lg:col-span-6 space-y-6">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Qui sommes-nous ?
                </span>
                <h2 id="presentation-heading" className="text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight leading-tight">
                  Un ancrage territorial fort au service de la communauté de Ziguinchor
                </h2>
                <p className="text-slate-600 text-base leading-relaxed">
                  Basée au quartier Santhiaba à Ziguinchor, l&apos;association ACCEENT s&apos;investit dans l&apos;éducation, l&apos;entrepreneuriat et le numérique. Notre démarche est ancrée dans la réalité locale pour répondre aux besoins concrets des jeunes et des femmes.
                </p>
                <p className="text-slate-600 text-base leading-relaxed">
                  À travers des programmes pratiques, de l&apos;accompagnement à la création d&apos;activité et du renforcement de capacités (projet YEAH, ateliers, formations), nous œuvrons pour un développement inclusif et autonome.
                </p>
                <div>
                  <Button asChild variant="outline" className="rounded-full border-slate-300 text-slate-800 hover:bg-slate-50 font-medium">
                    <Link href="/about">En savoir plus sur notre histoire</Link>
                  </Button>
                </div>
              </FadeIn>

              <FadeIn delay={0.2} direction="left" className="lg:col-span-6">
                <div className="relative h-[340px] sm:h-[400px] w-full overflow-hidden rounded-2xl border border-slate-200/80 shadow-md">
                  <Image
                    src="/images/aboutacceent.jpeg"
                    alt="L'équipe ACCEENT à Ziguinchor"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Section 3 — Domaines d'intervention */}
        <section
          className="bg-slate-50 py-16 md:py-24 border-y border-slate-200/60"
          aria-labelledby="domaines-heading"
        >
          <div className="section-container">
            <FadeIn delay={0.1} direction="up" className="mb-12 max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Notre action
              </span>
              <h2 id="domaines-heading" className="text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight mt-1 mb-4">
                Nos 3 domaines d&apos;intervention
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Trois piliers complémentaires pour accompagner durablement les parcours d&apos;apprentissage, d&apos;insertion et d&apos;initiative à Ziguinchor.
              </p>
            </FadeIn>

            <StaggerContainer
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              delay={0.2}
            >
              {list_domaines.map((domaine, index) => (
                <StaggerItem key={domaine.id}>
                  <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs h-full flex flex-col justify-between">
                    <div>
                      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                        <Image
                          src={domaine.image}
                          alt={`Domaine ${domaine.nom} — ACCEENT`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full">
                          0{index + 1}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-3">
                          {domaine.nom}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {domaine.description}
                        </p>
                      </div>
                    </div>
                    <div className="px-6 pb-6 pt-2">
                      <Link
                        href={domaine.page}
                        className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
                      >
                        Voir les programmes {domaine.nom.toLowerCase()} &rarr;
                      </Link>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Section 4 — Nos actions */}
        <section
          id="actions"
          className="bg-white py-16 md:py-24"
          aria-labelledby="actions-heading"
        >
          <div className="section-container">
            <FadeIn delay={0.1} direction="up" className="mb-12 max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Activités réelles
              </span>
              <h2 id="actions-heading" className="text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight mt-1 mb-4">
                Nos actions sur le terrain
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Aperçu des formations, ateliers et accompagnements menés par ACCEENT avec les habitants et acteurs locaux.
              </p>
            </FadeIn>

            <StaggerContainer
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              delay={0.2}
            >
              {[
                {
                  src: "/images/batik.jpeg",
                  alt: "Formation batik et teinture",
                  title: "Batik et Teinture",
                  description:
                    "Initiation aux techniques artisanales de création textile et valorisation des savoir-faire.",
                },
                {
                  src: "/images/femmes.jpeg",
                  alt: "Renforcement de capacité des femmes",
                  title: "Renforcement de Capacité",
                  description:
                    "Accompagnement structuré des femmes vers l'autonomie et la gestion d'activités.",
                },
                {
                  src: "/images/designthinkig.jpeg",
                  alt: "Formation en design thinking",
                  title: "Design Thinking",
                  description:
                    "Ateliers pratiques d'innovation et de résolution créative de problèmes du territoire.",
                },
                {
                  src: "/images/leadership.jpeg",
                  alt: "Formation leadership",
                  title: "Leadership & Gestion",
                  description:
                    "Développement des compétences d'organisation, de prise d'initiative et de projet.",
                },
                {
                  src: "/images/sensibilisation.jpeg",
                  alt: "Sensibilisation citoyenne",
                  title: "Sensibilisation Citoyenne",
                  description:
                    "Actions d'information et d'échanges de proximité auprès des communautés.",
                },
                {
                  src: "/images/formation-outil-digital.jpeg",
                  alt: "Outils digitaux",
                  title: "Compétences Digitales",
                  description:
                    "Formations pratiques aux outils numériques essentiels de communication et gestion.",
                },
              ].map((act, idx) => (
                <StaggerItem key={idx}>
                  <div className="bg-slate-50 border border-slate-200/70 rounded-xl overflow-hidden h-full flex flex-col">
                    <div className="relative h-48 w-full overflow-hidden bg-slate-200">
                      <Image
                        src={act.src}
                        alt={act.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-5 flex flex-col justify-between flex-grow">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">
                          {act.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {act.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Section 5 — Partenaires */}
        <section
          className="py-16 bg-slate-50 border-t border-slate-200/60"
          aria-labelledby="partenaires-heading"
        >
          <FadeIn delay={0.1} direction="up">
            <h2 id="partenaires-heading" className="sr-only">
              Nos partenaires
            </h2>
            <Partenaire />
          </FadeIn>
        </section>

        {/* Section 6 — Contact */}
        <section
          className="py-16 md:py-24 bg-white"
          id="contact-section"
          aria-labelledby="contact-heading"
        >
          <FadeIn delay={0.1} direction="up">
            <h2 id="contact-heading" className="sr-only">
              Nous contacter
            </h2>
            <Contact />
          </FadeIn>
        </section>
      </div>
    </>
  );
}
