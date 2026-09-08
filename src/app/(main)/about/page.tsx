import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/Animations";
import { equipeAcceent } from "@/data/list-equipe-acceent";

export const metadata = createPageMetadata({
  title: "À propos",
  description:
    "Découvrez ACCEENT : une équipe engagée à Ziguinchor pour former, inspirer et accompagner les jeunes et les femmes vers l'autonomie à travers l'éducation, l'entrepreneuriat et le numérique.",
  path: "/about",
  keywords: [
    "association ACCEENT",
    "équipe ACCEENT Ziguinchor",
    "impact local Casamance",
    "valeurs inclusion jeunes femmes",
  ],
});

export default function About() {
  const values = [
    {
      title: "Impact local",
      description:
        "Chaque initiative est conçue avec les acteurs du territoire pour répondre à des besoins réels de la communauté de Ziguinchor.",
    },
    {
      title: "Inclusion",
      description:
        "Nos programmes donnent une place centrale aux jeunes et aux femmes pour créer des opportunités d'autonomie durables.",
    },
    {
      title: "Innovation utile",
      description:
        "Nous utilisons le numérique comme levier concret d'apprentissage, d'insertion professionnelle et d'entrepreneuriat.",
    },
  ];

  const pillars = [
    { title: "Éducation", href: "/education" },
    { title: "Entrepreneuriat", href: "/entreprenariat" },
    { title: "Numérique", href: "/numerique" },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* 1. HERO SECTION */}
      <section className="relative py-20 md:py-28 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/campus.jpeg"
            alt="L'équipe ACCEENT à Ziguinchor"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-slate-950/80" />
        </div>

        <div className="container relative z-10 mx-auto px-6 lg:px-8 flex flex-col items-center text-center">
          <FadeIn delay={0.1} direction="down">
            <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-200">
              Organisation locale à Ziguinchor
            </span>
          </FadeIn>

          <FadeIn delay={0.2} direction="up">
            <h1 className="max-w-4xl text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6">
              À propos d&apos;ACCEENT
            </h1>
          </FadeIn>

          <FadeIn delay={0.3} direction="up" className="w-full max-w-3xl mx-auto">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-6 sm:p-8 backdrop-blur-xs">
              <p className="text-base sm:text-xl text-slate-100 font-medium leading-relaxed">
                Action pour la Contribution Collective pour l&apos;Éducation, l&apos;Entrepreneuriat et le Numérique des Territoires
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 2. NOTRE HISTOIRE & ANCRAGE */}
      <section className="py-16 md:py-24 bg-white" id="histoire">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <FadeIn delay={0.2} direction="right" className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200">
                <Image
                  src="/images/aboutacceent.jpeg"
                  alt="L'équipe ACCEENT en action"
                  width={800}
                  height={533}
                  className="w-full h-[340px] md:h-[400px] object-cover"
                />
              </div>
            </FadeIn>

            <FadeIn delay={0.3} direction="left" className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary block mb-2">
                  Notre Histoire
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                  Au cœur de Ziguinchor
                </h2>
                <p className="text-base text-slate-600 leading-relaxed mb-4">
                  Basée à Ziguinchor (quartier Santhiaba), l&apos;association ACCEENT s&apos;investit dans l&apos;éducation, l&apos;entrepreneuriat, le numérique et le développement durable. Son action repose sur un ancrage territorial fort pour impulser un changement social inclusif et pérenne.
                </p>
                <p className="text-base text-slate-600 leading-relaxed">
                  ACCEENT forme et accompagne les jeunes dans le numérique et l&apos;entrepreneuriat, tout en renforçant les capacités des GIE locaux en gestion administrative et financière grâce à des initiatives ciblées comme le projet <strong>YEAH</strong>.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <span className="text-sm font-bold text-slate-900 mb-3 block">
                  Nos 3 domaines d&apos;intervention :
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {pillars.map((pillar) => (
                    <Link
                      key={pillar.title}
                      href={pillar.href}
                      className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                    >
                      {pillar.title} &rarr;
                    </Link>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 3. MISSION & VISION */}
      <section className="py-16 md:py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-6 lg:px-8">
          <StaggerContainer className="grid md:grid-cols-2 gap-8">
            <StaggerItem>
              <div className="h-full p-8 rounded-2xl border border-white/10 bg-slate-800/80 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Orientation
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Notre mission
                  </h2>
                  <p className="text-base text-slate-300 leading-relaxed font-normal">
                    ACCEENT s&apos;engage à autonomiser les populations locales, en particulier les jeunes et les femmes, en leur fournissant des outils, des ressources et des compétences adaptés pour relever les défis socio-économiques. L&apos;organisation conçoit et met en œuvre des solutions concrètes et contextualisées visant à améliorer durablement les conditions de vie des communautés.
                  </p>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="h-full p-8 rounded-2xl border border-white/10 bg-slate-800/80 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Perspectives
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Notre vision
                  </h2>
                  <p className="text-base text-slate-300 leading-relaxed font-normal">
                    ACCEENT aspire à bâtir des communautés où les bénéficiaires deviennent de véritables acteurs du changement, capables de participer activement au développement de leur territoire. L&apos;organisation imagine un avenir dans lequel les populations locales disposent des compétences et de l&apos;autonomie nécessaires pour conduire leur propre progrès social.
                  </p>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* 4. NOS VALEURS */}
      <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/60">
        <div className="container mx-auto px-6 lg:px-8">
          <FadeIn className="mb-12 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Principes directeurs
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-1 mb-3">
              Nos valeurs
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Trois piliers fondamentaux guident l&apos;ensemble de nos projets et partenariats.
            </p>
          </FadeIn>

          <StaggerContainer className="grid gap-6 md:grid-cols-3">
            {values.map((value, idx) => (
              <StaggerItem key={value.title}>
                <div className="h-full rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      0{idx + 1}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 5. NOTRE ÉQUIPE */}
      <section className="py-16 md:py-24 bg-white" id="equipe">
        <div className="container mx-auto px-6 lg:px-8">
          <FadeIn className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Organisation
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mt-1 mb-4">
              Notre Équipe
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Les membres engagés qui coordonnent, forment et accompagnent au quotidien les activités d&apos;ACCEENT.
            </p>
          </FadeIn>

          <StaggerContainer className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {equipeAcceent.map((member) => (
              <StaggerItem key={member.id}>
                <Card className="flex flex-col h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-xs">
                  <div className="aspect-square w-full relative overflow-hidden rounded-xl bg-slate-100">
                    <Image
                      src={member.photoProphile}
                      alt={member.nomComplet}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <div className="pt-4 pb-2 px-1 flex flex-col flex-grow justify-between text-center">
                    <h3 className="text-sm font-bold text-slate-900 leading-snug mb-1">
                      {member.nomComplet}
                    </h3>
                    <p className="text-xs font-medium text-primary leading-normal">
                      {member.role}
                    </p>
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="py-16 px-6 lg:px-8 bg-slate-50 border-t border-slate-200/60">
        <FadeIn delay={0.2} direction="up" className="max-w-4xl mx-auto text-center">
          <div className="rounded-2xl bg-slate-900 px-6 py-12 md:px-12 md:py-14 text-white shadow-md">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              En savoir plus sur nos activités ?
            </h2>
            <p className="text-base text-slate-300 mb-8 max-w-xl mx-auto leading-relaxed">
              N&apos;hésitez pas à nous contacter pour toute question ou opportunité d&apos;échange avec l&apos;équipe ACCEENT.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="rounded-full bg-primary text-white font-medium px-8">
                <Link href="/contact">Nous contacter</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-white/30 text-white hover:bg-white/10 font-medium px-8">
                <Link href="/">Retour à l&apos;accueil</Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
