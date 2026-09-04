import Image from "next/image";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/Animations";
import { equipeAcceent } from "@/data/list-equipe-acceent";
import {
  ArrowRight,
  Target,
  Lightbulb,
  Zap,
  Compass,
  HeartHandshake,
  Sparkles,
  EyeIcon,
} from "lucide-react";

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
  const stats = [
    { number: "17+", label: "Partenaires engagés" },
    { number: "3000+", label: "Bénéficiaires" },
    { number: "03+", label: "Années d'expérience" },
  ];

  const values = [
    {
      title: "Impact local",
      description:
        "Chaque initiative est conçue avec les acteurs du territoire pour répondre à des besoins réels.",
      icon: <Target className="w-6 h-6 text-primary" />,
      color: "bg-primary",
    },
    {
      title: "Inclusion",
      description:
        "Nos programmes donnent une place centrale aux jeunes et aux femmes pour créer des opportunités durables.",
      icon: <HeartHandshake className="w-6 h-6 text-[#b9939e]" />,
      color: "bg-[#b9939e]",
    },
    {
      title: "Innovation utile",
      description:
        "Nous utilisons le numérique comme levier concret d'apprentissage, d'insertion professionnelle et d'entrepreneuriat.",
      icon: <Lightbulb className="w-6 h-6 text-primary" />,
      color: "bg-primary",
    },
  ];

  const pillars = [
    { title: "Éducation", href: "/education" },
    { title: "Entrepreneuriat", href: "/entreprenariat" },
    { title: "Numérique", href: "/numerique" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 selection:bg-primary/30">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] py-24 md:py-32 flex items-center justify-center overflow-hidden bg-slate-950 text-white">
        {/* Background Image with ACCEENT Brand Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/campus.jpeg"
            alt="L'équipe ACCEENT et les bénéficiaires à Ziguinchor"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center bg-fixed opacity-30 scale-105 transition-transform duration-1000"
          />
          {/* Brand-infused overlays with #836182 & #b9939e gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-[#271826]/85 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent" />
        </div>

        {/* Ambient background glow orbs */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/25 rounded-full blur-[140px]" />
          <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#b9939e]/20 rounded-full blur-[120px]" />
        </div>

        <div className="container relative z-10 mx-auto px-6 lg:px-8 flex flex-col items-center text-center">
          {/* Badge */}
          <FadeIn delay={0.1} direction="down">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/20 backdrop-blur-md px-5 py-2 text-xs md:text-sm font-semibold tracking-wide text-[#f4e6ea] shadow-lg shadow-primary/10">
              Engagement & Impact à Ziguinchor
            </span>
          </FadeIn>

          {/* Title */}
          <FadeIn delay={0.2} direction="up">
            <h1 className="max-w-4xl text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f3e8eb] to-[#b9939e] mb-6 drop-shadow-sm">
              ACCEENT
            </h1>
          </FadeIn>

          {/* Acronym Breakdown Glassmorphism Card */}
          <FadeIn delay={0.3} direction="up" className="w-full max-w-3xl mx-auto mb-12">
            <div className="relative rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/40 overflow-hidden group hover:border-primary/40 transition-all duration-500">
              <p className="text-lg sm:text-xl md:text-2xl text-slate-100 font-medium leading-relaxed">
                Action pour la Contribution Collective pour l&apos;Éducation, l&apos;Entrepreneuriat et le Numérique des Territoires
              </p>
            </div>
          </FadeIn>

          {/* Stats Bar */}
          <StaggerContainer
            delay={0.4}
            className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-3xl mx-auto"
          >
            {stats.map((stat, i) => (
              <StaggerItem key={i}>
                <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl hover:border-primary/50 hover:bg-white/10 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden text-center">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[2px] bg-gradient-to-r from-transparent via-[#b9939e] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <p className="relative text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#f4e6ea] to-[#b9939e] mb-1">
                    {stat.number}
                  </p>
                  <p className="relative text-xs sm:text-sm uppercase tracking-wider font-semibold text-slate-300">
                    {stat.label}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 2. A PROPOS (Histoire & Domaines) */}
      <section className="py-16 md:py-20 relative bg-white overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: Image with Editorial Layout */}
            <FadeIn
              delay={0.2}
              direction="right"
              className="relative group perspective-[1000px] max-w-lg mx-auto lg:max-w-none w-full"
            >
              <div className="absolute -inset-3 bg-gradient-to-tr from-primary/10 to-[#b9939e]/20 rounded-[2.5rem] transform -rotate-2 group-hover:rotate-0 transition-transform duration-700 ease-out opacity-60" />
              <div className="relative rounded-[2rem] overflow-hidden shadow-xl shadow-slate-900/10 transform transition-transform duration-700 ease-out group-hover:scale-[1.01]">
                <div className="absolute inset-0 bg-slate-900/10 z-10 group-hover:bg-transparent transition-colors duration-500" />
                <Image
                  src="/images/aboutacceent.jpeg"
                  alt="L'équipe ACCEENT en action"
                  width={800}
                  height={533}
                  className="w-full h-[320px] md:h-[380px] object-cover object-center"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg shadow-slate-900/10 hidden md:flex items-center gap-3 z-20 border border-slate-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Compass className="text-primary w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">Ancrage Local</p>
                  <p className="text-xs font-medium text-slate-500">
                    Ziguinchor, Sénégal
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Right: Content */}
            <FadeIn delay={0.3} direction="left" className="space-y-6">
              <div>
                <span className="text-primary font-bold uppercase tracking-widest text-xs mb-2 block">
                  À propos de ACCEENT
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
                  Au cœur de <span className="text-primary">Ziguinchor</span>
                </h2>
                <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                  Basée à Ziguinchor (quartier Santhiaba), l&apos;association
                  ACCEENT s&apos;investit dans l&apos;éducation,
                  l&apos;entrepreneuriat, le numérique et le développement
                  durable à travers ses programmes. Son action repose sur un
                  ancrage territorial fort pour impulser un changement social
                  inclusif et pérenne. ACCEENT forme et accompagne les jeunes sur l&apos;entrepreneuriat, le numérique et renforce les capacités des GIE en gestion administrative et financière grâce au projet <strong>YEAH</strong>.
                </p>
              </div>

              <div className="pt-5 border-t border-slate-100">
                <span className="text-primary font-bold text-base mb-4 block">
                  Découvrez nos 3 piliers d&apos;action :
                </span>
                <div className="flex flex-wrap gap-3">
                  {pillars.map((pillar) => (
                    <Link
                      key={pillar.title}
                      href={pillar.href}
                      className="group flex items-center gap-2.5 rounded-xl border border-slate-200/60 bg-slate-50 px-4 py-2.5 transition-all duration-300 hover:bg-white hover:shadow-md hover:shadow-slate-200/50 hover:border-primary/30"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <Zap className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-slate-800 font-bold text-sm">
                        {pillar.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 3. NOS VALEURS */}
      <section className="py-16 md:py-20 relative bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <FadeIn className="mb-10">
            <h2 className="text-3xl md:text-4xl text-center font-extrabold text-slate-900 mb-3">
              Nos valeurs
            </h2>
            <p className="lg:max-w-2xl lg:mx-auto text-base md:text-lg text-center text-slate-600 leading-relaxed">
              Une inclusion des jeunes et des femmes, un impact local et une
              innovation utile sont au cœur de notre action.
            </p>
          </FadeIn>

          <StaggerContainer className="grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <Card className="group relative h-full overflow-hidden rounded-3xl border-0 bg-white p-6 md:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgb(0,0,0,0.06)]">
                  {/* Hover glow effect */}
                  <div
                    className={`absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-transparent to-${value.color.split("-")[1]}-500/10 pointer-events-none`}
                  />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 shadow-sm group-hover:scale-110 transition-transform duration-500 ease-out">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2.5 group-hover:text-blue-600 transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-sm md:text-base leading-relaxed text-slate-600 flex-1">
                      {value.description}
                    </p>
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 4. MISSION & VISION (DARK MODE) */}
      <section className="relative py-16 md:py-20 bg-slate-950 text-white overflow-hidden">
        {/* Abstract shapes for dark mode */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-purple-600/20 rounded-full blur-[150px] mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
        </div>

        <StaggerContainer className="container relative z-10 mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
            <StaggerItem>
              <div className="h-full p-6 md:p-8 lg:p-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                    <Target className="w-6 h-6 text-secondary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
                    Notre mission
                  </h2>
                </div>
                <p className="text-sm md:text-base text-slate-300 leading-relaxed font-normal">
                  Acceent s&apos;engage à autonomiser les populations locales,
                  en particulier les jeunes et les femmes, en leur fournissant
                  des outils, des ressources et des compétences adaptés pour
                  relever les défis socio-économiques. L&apos;organisation
                  conçoit et met en œuvre des solutions innovantes et
                  contextualisées visant à améliorer durablement les conditions
                  de vie des communautés locales.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="h-full p-6 md:p-8 lg:p-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                    <EyeIcon className="w-6 h-6 text-secondary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
                    Notre vision
                  </h2>
                </div>
                <p className="text-sm md:text-base text-slate-300 leading-relaxed font-normal">
                  Acceent aspire à bâtir des communautés où les bénéficiaires
                  deviennent de véritables acteurs du changement, capables de
                  participer activement au développement de leur territoire.
                  L&apos;organisation imagine un avenir dans lequel les
                  populations locales disposent des compétences, de
                  l&apos;autonomie et du pouvoir d&apos;agir nécessaires pour
                  conduire leur propre développement et contribuer à un progrès
                  social durable.
                </p>
              </div>
            </StaggerItem>
          </div>
        </StaggerContainer>
      </section>

      {/* 5. NOTRE ÉQUIPE */}
      <section className="relative py-16 md:py-20 bg-slate-50 overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] rounded-full bg-blue-100/40 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] rounded-full bg-cyan-100/40 blur-[80px] pointer-events-none" />

        <div className="container relative z-10 mx-auto px-6 lg:px-8">
          <FadeIn className="mx-auto max-w-3xl text-center mb-10">
            <span className="mb-4 inline-flex items-center rounded-full border border-blue-200/50 bg-white/50 backdrop-blur-md px-5 py-2 text-sm font-bold text-primary shadow-sm">
              L&apos;humain au cœur
            </span>
            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
              Notre Équipe
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              Des professionnels passionnés et engagés pour vous accompagner
              dans la réussite de vos projets.
            </p>
          </FadeIn>

          <StaggerContainer className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-6xl mx-auto">
            {equipeAcceent.map((member) => (
              <StaggerItem key={member.id}>
                <Card className="group relative flex flex-col h-full overflow-hidden rounded-3xl border border-slate-100 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-500">
                  {/* Image container inside card padding */}
                  <div className="aspect-square w-full relative overflow-hidden rounded-2xl bg-slate-50">
                    <Image
                      src={member.photoProphile}
                      alt={member.nomComplet}
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                  {/* Name and role info */}
                  <div className="pt-4 flex flex-col flex-grow text-center items-center justify-between">
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-primary transition-colors duration-300 leading-snug line-clamp-1 mb-2">
                      {member.nomComplet}
                    </h3>
                    <div className="w-full mt-auto flex items-center justify-center min-h-[3rem]">
                      <span className="inline-flex items-center justify-center px-3 py-1.5 text-[11px] font-extrabold text-primary bg-slate-50 border border-slate-100 rounded-2xl leading-normal text-center w-full">
                        {member.role}
                      </span>
                    </div>
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="py-16 px-6 lg:px-8 bg-slate-50">
        <FadeIn delay={0.2} direction="up" className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-12 md:px-16 md:py-16 text-center shadow-2xl">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] opacity-10 animate-[spin_4s_linear_infinite]" />
              <div className="absolute inset-[2px] rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800" />
              <div className="absolute top-[-50%] left-[-50%] w-[100%] h-[100%] bg-blue-600/30 blur-[120px] rounded-full mix-blend-screen" />
              <div className="absolute bottom-[-50%] right-[-50%] w-[100%] h-[100%] bg-cyan-600/30 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
                Rejoignez-nous
              </h2>
              <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
                Ensemble, transformons les territoires par l&apos;éducation,
                l&apos;entrepreneuriat et le numérique.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
                <Link
                  href="/contact"
                  className="group relative flex items-center justify-center gap-3 px-7 py-3.5 bg-white text-slate-950 font-bold text-base rounded-xl hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.25)]"
                >
                  Nous contacter
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/"
                  className="flex items-center justify-center px-7 py-3.5 border border-white/20 text-white font-bold text-base rounded-xl hover:bg-white/10 transition-colors"
                >
                  Retour à l&apos;accueil
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
