import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Cpu, TrendingUp, MapPin, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Partenaire from "@/components/shared/Partenaires";
import Contact from "@/components/shared/contact/Contact";
import { OrganizationJsonLd, WebSiteJsonLd, FAQJsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/seo";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/Animations";
import { list_domaines } from "@/data/list-domaines";
import { list_actions } from "@/data/list-actions";

// ─── SEO ────────────────────────────────────────────────────────────────────

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = createPageMetadata({
  title: "Éducation, Entrepreneuriat & Numérique à Ziguinchor (Sénégal)",
  description:
    "ACCEENT est une association sénégalaise basée à Ziguinchor (Santhiaba) qui accompagne les jeunes et les femmes vers l'autonomie à travers l'éducation, l'entrepreneuriat et le numérique en Casamance.",
  path: "/",
  keywords: [
    "ACCEENT Ziguinchor",
    "association Ziguinchor",
    "ONG Ziguinchor Santhiaba",
    "association Casamance",
    "éducation Ziguinchor",
    "entrepreneuriat jeunes Sénégal",
    "incubateur ACCEENT Incub Ziguinchor",
    "formation numérique Casamance",
    "robotique WRO Sénégal",
    "Tut-Tank soutien scolaire Ziguinchor",
    "ACCEENT4ELLES autonomisation femmes",
    "inclusion numérique filles Ziguinchor",
    "mentorat jeunes filles Sénégal",
    "développement local Casamance",
  ],
});

// ─── Données FAQ (Schema.org) ────────────────────────────────────────────────

const homeFaqs = [
  {
    question: "Qu'est-ce que l'association ACCEENT ?",
    answer:
      "ACCEENT (Action pour la Contribution Collective pour l'Éducation, l'Entrepreneuriat et le Numérique des Territoires) est une association sénégalaise basée à Ziguinchor (quartier Santhiaba). Elle accompagne les jeunes et les femmes vers l'autonomie.",
  },
  {
    question: "Quels sont les piliers d'intervention d'ACCEENT à Ziguinchor ?",
    answer:
      "ACCEENT agit à travers trois piliers majeurs : l'Éducation (accompagnement scolaire, Tut-Tank, ACCEENT4ELLES), l'Entrepreneuriat (ACCEENT Incub, ateliers et forums), et le Numérique (initiation au code, robotique WRO et intelligence artificielle).",
  },
  {
    question: "Où se situe l'association ACCEENT ?",
    answer:
      "L'association ACCEENT est située au quartier Santhiaba à Ziguinchor, en Casamance (Sénégal).",
  },
  {
    question: "Qui peut participer aux programmes d'ACCEENT ?",
    answer:
      "Les programmes s'adressent principalement aux jeunes et aux femmes de la région de Ziguinchor et de la Casamance souhaitant se former, lancer un projet ou développer des compétences numériques.",
  },
];

// ─── Icônes par domaine ──────────────────────────────────────────────────────

const domaineIcons = [BookOpen, TrendingUp, Cpu] as const;

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      {/* Structured data */}
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <FAQJsonLd faqs={homeFaqs} />

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="hero-heading"
        className="relative w-full h-[calc(100dvh-5rem)] flex flex-col justify-center items-start overflow-hidden"
      >
        {/* Image de fond */}
        <Image
          src="/team/team.jpeg"
          alt="L'équipe ACCEENT en action à Ziguinchor"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Overlay sombre pour lisibilité */}
        <div className="pointer-events-none absolute inset-0 bg-slate-950/90" />
        {/* Dégradé bas pour transition douce */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950/40 to-transparent" />

        <div className="relative section-container z-10 flex flex-col items-start text-left text-white gap-4 sm:gap-6">

          {/* Titre principal — h1 unique sur la page */}
          <FadeIn delay={0.2} direction="up">
            <h1
              id="hero-heading"
              className="max-w-3xl text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight"
            >
              Autonomiser les Jeunes et les Femmes par&nbsp;
              <span className="text-primary">l&apos;Éducation</span>,{" "}
              <span className="text-primary">l&apos;Entrepreneuriat</span> et le{" "}
              <span className="text-primary">Numérique</span>
            </h1>
          </FadeIn>

          {/* Accroche */}
          <FadeIn delay={0.3} direction="up">
            <p className="max-w-2xl text-slate-200 text-sm sm:text-base md:text-lg leading-relaxed">
              ACCEENT accompagne la jeunesse et les femmes de Ziguinchor à travers des
              initiatives concrètes d&apos;éducation, d&apos;entrepreneuriat et d&apos;inclusion
              numérique pour favoriser l&apos;autonomie et le développement local durable.
            </p>
          </FadeIn>

          {/* CTAs */}
          <FadeIn delay={0.4} direction="up">
            <div className="flex flex-row flex-wrap gap-3 pt-1">
              <Button
                asChild
                size="default"
                className="rounded-full px-5 sm:px-8 bg-primary text-white hover:bg-primary/90 font-semibold text-xs sm:text-sm h-10 sm:h-11 shadow-lg"
              >
                <Link href="/contact">Nous contacter</Link>
              </Button>
              <Button
                asChild
                size="default"
                variant="outline"
                className="rounded-full px-5 sm:px-8 bg-white/10 text-white hover:bg-white/20 border border-white/30 backdrop-blur-md font-semibold text-xs sm:text-sm h-10 sm:h-11"
              >
                <Link href="/about">Découvrir ACCEENT</Link>
              </Button>
            </div>
          </FadeIn>

          {/* Indicateur de scroll */}
          <FadeIn delay={0.6} direction="none" className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <div
              aria-hidden
              className="flex flex-col items-center gap-1.5 text-white/50"
            >
              <div className="w-px h-8 bg-white/30 animate-pulse" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── 2. QUI SOMMES-NOUS ──────────────────────────────────────────────── */}
      <section
        aria-labelledby="presentation-heading"
        className="py-16 md:py-24 bg-white"
      >
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Texte */}
            <FadeIn delay={0.1} direction="right" className="space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Qui sommes-nous ?
              </span>
              <h2
                id="presentation-heading"
                className="text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight leading-tight"
              >
                Un ancrage territorial fort au service de la communauté de Ziguinchor
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Basée au quartier Santhiaba à Ziguinchor, l&apos;association ACCEENT
                s&apos;investit dans l&apos;éducation, l&apos;entrepreneuriat et le numérique.
                Notre démarche est ancrée dans la réalité locale pour répondre aux
                besoins concrets des jeunes et des femmes.
              </p>
              <p className="text-slate-600 text-base leading-relaxed">
                À travers des programmes pratiques, de l&apos;accompagnement à la création
                d&apos;activité et du renforcement de capacités, nous œuvrons pour un
                développement inclusif et autonome.
              </p>

              {/* Coordonnées résumées */}
              <ul className="space-y-2 text-sm text-slate-500" aria-label="Coordonnées ACCEENT">
                <li className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0 text-primary" aria-hidden />
                  Quartier Santhiaba, Ziguinchor, Sénégal
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="size-4 shrink-0 text-primary" aria-hidden />
                  <a href="mailto:info@acceent.org" className="hover:text-primary transition-colors">
                    info@acceent.org
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="size-4 shrink-0 text-primary" aria-hidden />
                  <a href="tel:+221761417070" className="hover:text-primary transition-colors">
                    +221 76 141 70 70
                  </a>
                </li>
              </ul>

              <div>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-slate-300 text-slate-800 hover:bg-slate-50 font-medium"
                >
                  <Link href="/about" className="inline-flex items-center gap-2">
                    En savoir plus sur notre histoire
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </Button>
              </div>
            </FadeIn>

            {/* Image */}
            <FadeIn delay={0.2} direction="left">
              <div className="relative h-[340px] sm:h-[420px] w-full overflow-hidden rounded-2xl border border-slate-200/80 shadow-md">
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

      {/* ── 3. DOMAINES D'INTERVENTION ──────────────────────────────────────── */}
      <section
        id="domaines"
        aria-labelledby="domaines-heading"
        className="bg-slate-50 py-16 md:py-24 border-y border-slate-200/60"
      >
        <div className="section-container">
          {/* En-tête de section */}
          <FadeIn delay={0.1} direction="up" className="mb-12 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Notre action
            </span>
            <h2
              id="domaines-heading"
              className="text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight mt-1 mb-3"
            >
              3 domaines d&apos;intervention
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Trois piliers complémentaires pour accompagner durablement les
              parcours d&apos;apprentissage, d&apos;insertion et d&apos;initiative à Ziguinchor.
            </p>
          </FadeIn>

          {/* Grille des domaines */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8" delay={0.2}>
            {list_domaines.map((domaine, index) => {
              const Icon = domaineIcons[index];
              return (
                <StaggerItem key={domaine.id}>
                  <article className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs h-full flex flex-col hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    {/* Image */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100 flex-shrink-0">
                      <Image
                        src={domaine.image}
                        alt={`Programme ${domaine.nom} — ACCEENT`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      {/* Badge numéro */}
                      <div
                        aria-hidden
                        className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full"
                      >
                        0{index + 1}
                      </div>
                    </div>

                    {/* Contenu */}
                    <div className="p-6 flex flex-col flex-grow gap-3">
                      {/* Icône + Titre */}
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                          <Icon className="size-4" aria-hidden />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {domaine.nom}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-slate-600 leading-relaxed flex-grow">
                        {domaine.description}
                      </p>

                      {/* Lien */}
                      <Link
                        href={domaine.page}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all duration-200 mt-auto pt-1"
                        aria-label={`Voir les programmes ${domaine.nom}`}
                      >
                        Voir les programmes
                        <ArrowRight className="size-4" aria-hidden />
                      </Link>
                    </div>
                  </article>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* ── 4. NOS ACTIONS SUR LE TERRAIN ───────────────────────────────────── */}
      <section
        id="actions"
        aria-labelledby="actions-heading"
        className="bg-white py-16 md:py-24"
      >
        <div className="section-container">
          {/* En-tête */}
          <FadeIn delay={0.1} direction="up" className="mb-12 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Activités réelles
            </span>
            <h2
              id="actions-heading"
              className="text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight mt-1 mb-3"
            >
              Nos actions sur le terrain
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Aperçu des formations, ateliers et accompagnements menés par ACCEENT
              avec les habitants et acteurs locaux de la Casamance.
            </p>
          </FadeIn>

          {/* Grille des actions */}
          <StaggerContainer
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            delay={0.2}
          >
            {list_actions.map((action) => (
              <StaggerItem key={action.id}>
                <article className="group bg-slate-50 border border-slate-200/70 rounded-xl overflow-hidden h-full flex flex-col hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
                  {/* Photo */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-200 flex-shrink-0">
                    <Image
                      src={action.src}
                      alt={action.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  {/* Texte */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-base font-bold text-slate-900 mb-1.5">
                      {action.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── 5. PARTENAIRES ──────────────────────────────────────────────────── */}
      <section
        aria-labelledby="partenaires-heading"
        className="py-16 bg-slate-50 border-t border-slate-200/60"
      >
        <div className="section-container">
          <FadeIn delay={0.1} direction="up">
            {/* Le titre visible est géré dans le composant Partenaire */}
            <h2 id="partenaires-heading" className="sr-only">
              Nos partenaires
            </h2>
            <Partenaire />
          </FadeIn>
        </div>
      </section>

      {/* ── 6. CONTACT ──────────────────────────────────────────────────────── */}
      <section
        id="contact-section"
        aria-labelledby="contact-heading"
        className="py-16 md:py-24 bg-white"
      >
        <h2 id="contact-heading" className="sr-only">
          Nous contacter
        </h2>
        <Contact />
      </section>
    </>
  );
}
