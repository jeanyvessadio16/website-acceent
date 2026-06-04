import ProgrammeLayout from "@/components/layout/ProgrammeLayout";
import { Button } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ai4good } from "@/data/numerique/AI4GOOD";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BrainCircuit, 
  Globe2, 
  Lightbulb, 
  Rocket, 
  HeartHandshake, 
  Target, 
  ArrowRight,
  Sparkles
} from "lucide-react";

export const metadata = createPageMetadata({
  title: "AI4GOOD Festival",
  description:
    "Inspirer la nouvelle génération à utiliser l'intelligence artificielle pour résoudre les défis mondiaux et créer un avenir meilleur.",
  path: "/ia4good",
  keywords: [
    "intelligence artificielle jeunes Sénégal",
    "formation IA Ziguinchor",
    "numérique Casamance",
  ],
  noIndex: true,
});

const featureIcons = [BrainCircuit, Globe2, Lightbulb, Rocket];

export default function AI4GoodPage() {
  return (
    <>
      <ProgrammeLayout
        titre="AI4GOOD Festival"
        description="Ensemble, créons un futur numérique où la technologie élève, protège et émancipe."
      >
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary font-medium text-sm">
            <Sparkles className="w-4 h-4" />
            <span>À propos de AI4GOOD</span>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:gap-12 items-stretch">
            {/* Engagement Card */}
            <div className="relative overflow-hidden group rounded-3xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 p-8 md:p-10 border border-neutral-200/60 dark:border-neutral-800/60 transition-all duration-300 hover:shadow-xl hover:border-primary/30">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 text-primary">
                <HeartHandshake className="w-48 h-48" />
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <HeartHandshake className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400">
                  Notre engagement
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-lg flex-grow">
                  Le AI4GOOD Festival est une initiative mondiale à but non lucratif
                  qui mobilise et accompagne les jeunes dans la maîtrise de
                  l’intelligence artificielle, de la créativité et de l’innovation
                  numérique. En réunissant art, design et technologie, nous
                  éveillons leur curiosité, stimulons leur potentiel et les
                  encourageons à imaginer un futur où l’IA est mise au service d’une
                  société plus inclusive et durable stimulante.
                </p>
              </div>
            </div>

            {/* Mission Card */}
            <div className="relative overflow-hidden group rounded-3xl bg-gradient-to-br from-primary/5 via-background to-background p-8 md:p-10 border border-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40">
              <div className="absolute bottom-0 right-0 -mb-8 -mr-8 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 text-primary">
                <Target className="w-48 h-48" />
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
                  <Target className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Notre mission</h3>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-lg flex-grow">
                  Nous nous engageons à rendre l’éducation à l’IA accessible à
                  toutes et à tous, en particulier dans les régions où les
                  opportunités restent limitées. Nous donnons aux jeunes les moyens
                  d’apprendre, d’expérimenter et de collaborer grâce à des outils
                  numériques pour résoudre des enjeux concrets. Nous croyons
                  fermement qu’une technologie guidée par l’éthique, l’empathie et
                  un sens aigu des responsabilités peut devenir un véritable moteur
                  de progrès pour le bien commun.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos piliers d'action</h2>
            <p className="text-neutral-500 max-w-2xl mx-auto text-lg">
              Découvrez comment nous structurons notre approche pour maximiser notre impact positif.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {ai4good.map((item, index) => {
              const Icon = featureIcons[index % featureIcons.length];
              return (
                <Card 
                  key={item.id + index.toString()} 
                  className="group relative overflow-hidden border-neutral-200/60 dark:border-neutral-800/60 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader className="relative z-10 pb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <div className="mt-20 text-center relative z-10">
          <Button
            asChild
            size="lg"
            className="rounded-full h-14 px-8 text-lg font-medium shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1 group"
          >
            <Link href="https://ai4goodfestival.org/" target="_blank">
              <span>Découvrir le festival</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </ProgrammeLayout>
    </>
  );
}
