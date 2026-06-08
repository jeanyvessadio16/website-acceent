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
      icon: <Target className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-500",
    },
    {
      title: "Inclusion",
      description:
        "Nos programmes donnent une place centrale aux jeunes et aux femmes pour créer des opportunités durables.",
      icon: <HeartHandshake className="w-6 h-6 text-purple-600" />,
      color: "bg-purple-500",
    },
    {
      title: "Innovation utile",
      description:
        "Nous utilisons le numérique comme levier concret d'apprentissage, d'emploi et d'entrepreneuriat.",
      icon: <Lightbulb className="w-6 h-6 text-amber-600" />,
      color: "bg-amber-500",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 selection:bg-blue-200">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Mesh Gradient Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] h-[70vw] w-[70vw] rounded-full bg-blue-300/30 blur-[120px] mix-blend-multiply" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[60vw] w-[60vw] rounded-full bg-purple-300/30 blur-[120px] mix-blend-multiply" />
          <div className="absolute top-[30%] left-[30%] h-[40vw] w-[40vw] rounded-full bg-cyan-200/40 blur-[100px] mix-blend-overlay" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/50 to-slate-50" />
        </div>

        <div className="container relative z-10 mx-auto px-6 lg:px-8 flex flex-col items-center text-center">
          <FadeIn delay={0.1} direction="down">
            <span className="mb-6 inline-flex items-center rounded-full border border-blue-200/50 bg-white/60 backdrop-blur-md px-5 py-2 text-sm font-bold text-blue-700 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              Découvrez ACCEENT
            </span>
          </FadeIn>

          <FadeIn delay={0.2} direction="up">
            <h1 className="max-w-5xl text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
              Qui sommes-
              <span>nous ?</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.3} direction="up">
            <p className="max-w-2xl mx-auto text-xl md:text-2xl text-slate-600 leading-relaxed mb-16">
              Une équipe motivée et engagée pour former, inspirer et accompagner
              les jeunes et les femmes de Ziguinchor vers l&apos;autonomie.
            </p>
          </FadeIn>

          <StaggerContainer
            delay={0.4}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mx-auto"
          >
            {stats.map((stat, i) => (
              <StaggerItem key={i}>
                <div className="group relative rounded-3xl border border-white/60 bg-white/40 p-8 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:bg-white/60 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-500 overflow-hidden text-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <p className="relative text-4xl md:text-5xl font-black text-slate-900 mb-2">
                    {stat.number}
                  </p>
                  <p className="relative text-sm uppercase tracking-widest font-bold text-slate-500">
                    {stat.label}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 2. A PROPOS (Histoire & Domaines) */}
      <section className="py-32 relative bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left: Image with Editorial Layout */}
            <FadeIn
              delay={0.2}
              direction="right"
              className="relative group perspective-[1000px]"
            >
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 to-purple-50 rounded-[3rem] transform -rotate-3 group-hover:rotate-0 transition-transform duration-700 ease-out opacity-50" />
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-900/10 transform transition-transform duration-700 ease-out group-hover:scale-[1.02]">
                <div className="absolute inset-0 bg-slate-900/10 z-10 group-hover:bg-transparent transition-colors duration-500" />
                <Image
                  src="/images/aboutImage.jpg"
                  alt="L'équipe ACCEENT en action"
                  width={800}
                  height={800}
                  className="w-full h-auto object-cover aspect-[4/3] lg:aspect-square"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-3xl shadow-xl shadow-slate-900/10 hidden md:flex items-center gap-4 z-20 animate-bounce-slow">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                  <Compass className="text-blue-600 w-7 h-7" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Ancrage Local</p>
                  <p className="text-sm font-medium text-slate-500">
                    Ziguinchor, Sénégal
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Right: Content */}
            <FadeIn delay={0.3} direction="left" className="space-y-10">
              <div>
                <span className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4 block">
                  Notre histoire
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                  Au cœur de{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                    Santhiaba
                  </span>
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed">
                  ACCEENT est une association profondément ancrée dans son
                  territoire. Nous œuvrons chaque jour pour créer des ponts
                  entre les talents locaux et les opportunités de demain, en
                  mettant l&apos;humain au centre de notre démarche.
                </p>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <span className="text-slate-900 font-bold text-xl mb-6 block">
                  Nos 3 piliers d&apos;action :
                </span>
                <div className="flex flex-wrap gap-4">
                  {["Éducation", "Entrepreneuriat", "Numérique"].map(
                    (item, i) => (
                      <div
                        key={i}
                        className="group flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-slate-50 px-6 py-4 transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 hover:border-blue-200"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                          <Zap className="w-4 h-4" />
                        </div>
                        <span className="text-slate-800 font-bold text-lg">
                          {item}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 3. NOS VALEURS */}
      <section className="py-32 relative bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <FadeIn className="max-w-3xl mb-20">
            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6">
              Nos valeurs
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              Une approche humaine et professionnelle pour transformer
              durablement les territoires.
            </p>
          </FadeIn>

          <StaggerContainer className="grid gap-8 md:grid-cols-3">
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <Card className="group relative h-full overflow-hidden rounded-[2.5rem] border-0 bg-white p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
                  {/* Hover glow effect */}
                  <div
                    className={`absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-transparent to-${value.color.split("-")[1]}-500/10 pointer-events-none`}
                  />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 shadow-sm group-hover:scale-110 transition-transform duration-500 ease-out">
                      {value.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-lg leading-relaxed text-slate-600 flex-1">
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
      <section className="relative py-32 bg-slate-950 text-white overflow-hidden">
        {/* Abstract shapes for dark mode */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-purple-600/20 rounded-full blur-[150px] mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
        </div>

        <StaggerContainer className="container relative z-10 mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-stretch">
            <StaggerItem>
              <div className="h-full p-10 lg:p-14 rounded-[3rem] border border-white/10 bg-white/5 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                <div className="mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                    <Target className="w-8 h-8 text-blue-400" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                    Notre mission
                  </h2>
                </div>
                <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-light">
                  Mettre en mouvement les énergies locales pour que chaque
                  territoire dispose des moyens d&apos;apprendre,
                  d&apos;entreprendre et d&apos;innover. Nous concevons et
                  déployons des programmes concrets, ancrés dans le réel et
                  co-construits avec les acteurs de terrain.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="h-full p-10 lg:p-14 rounded-[3rem] border border-white/10 bg-white/5 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                <div className="mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                    <Sparkles className="w-8 h-8 text-purple-400" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                    Notre vision
                  </h2>
                </div>
                <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-light">
                  Des territoires vivants, équitables et créatifs où chacun peut
                  trouver sa place et révéler son potentiel grâce à
                  l&apos;éducation, à l&apos;entrepreneuriat et au numérique.
                </p>
              </div>
            </StaggerItem>
          </div>
        </StaggerContainer>
      </section>

      {/* 5. NOTRE ÉQUIPE */}
      <section className="relative py-32 bg-slate-50 overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] rounded-full bg-blue-100/40 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] rounded-full bg-cyan-100/40 blur-[80px] pointer-events-none" />

        <div className="container relative z-10 mx-auto px-6 lg:px-8">
          <FadeIn className="mx-auto max-w-3xl text-center mb-20">
            <span className="mb-4 inline-flex items-center rounded-full border border-blue-200/50 bg-white/50 backdrop-blur-md px-5 py-2 text-sm font-bold text-blue-700 shadow-sm">
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

          <StaggerContainer className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {equipeAcceent.map((member) => (
              <StaggerItem key={member.id}>
                <Card className="group relative p-0 overflow-hidden rounded-[2.5rem] border-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-500">
                  <div className="aspect-[4/5] w-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent z-10 opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                    <Image
                      src={member.photoProphile}
                      alt={member.nomComplet}
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-8 z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="w-12 h-1.5 bg-blue-500 rounded-full mb-5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                      <h3 className="text-3xl font-bold text-white mb-2">
                        {member.nomComplet}
                      </h3>
                      <p className="text-blue-200 font-medium text-base tracking-wide">
                        {member.role}
                      </p>
                    </div>
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="py-24 px-6 lg:px-8 bg-slate-50">
        <FadeIn delay={0.2} direction="up" className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 px-8 py-20 md:px-20 md:py-32 text-center shadow-2xl">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] opacity-10 animate-[spin_4s_linear_infinite]" />
              <div className="absolute inset-[2px] rounded-[3rem] bg-gradient-to-br from-slate-900 to-slate-800" />
              <div className="absolute top-[-50%] left-[-50%] w-[100%] h-[100%] bg-blue-600/30 blur-[120px] rounded-full mix-blend-screen" />
              <div className="absolute bottom-[-50%] right-[-50%] w-[100%] h-[100%] bg-cyan-600/30 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
                Rejoignez notre mission
              </h2>
              <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
                Ensemble, transformons les territoires par l&apos;éducation,
                l&apos;entrepreneuriat et le numérique.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center w-full sm:w-auto">
                <Link
                  href="/contact"
                  className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-950 font-bold text-lg rounded-2xl hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                >
                  Nous contacter
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/"
                  className="flex items-center justify-center px-8 py-4 border-2 border-white/20 text-white font-bold text-lg rounded-2xl hover:bg-white/10 transition-colors"
                >
                  Retour à la&apos;ccueil
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
