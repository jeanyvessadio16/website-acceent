import ProgrammeLayout from "@/components/layout/ProgrammeLayout";
import { Button } from "@/components/ui/button";
import { createPageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ai4good } from "@/data/numerique/AI4GOOD";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/Animations";

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

export default function AI4GoodPage() {
  return (
    <ProgrammeLayout
      titre="AI4GOOD Festival"
      description="Ensemble, créons un futur numérique où la technologie élève, protège et émancipe."
      image="/images/ai4good.png"
      text="Programme Numérique"
    >
      {/* 1. Engagement & Mission */}
      <div className="grid gap-8 md:grid-cols-2 items-stretch">
        <FadeIn delay={0.1} direction="right">
          <div className="relative overflow-hidden group rounded-3xl bg-white p-6 sm:p-10 border border-slate-200/80 shadow-xs h-full flex flex-col justify-between">
            <div>
              <span className="mb-4 inline-flex items-center justify-center rounded-xl bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
                Engagement
              </span>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">
                Notre engagement
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Le AI4GOOD Festival est une initiative mondiale à but non lucratif qui mobilise et accompagne les jeunes dans la maîtrise de l’intelligence artificielle, de la créativité et de l’innovation numérique. En réunissant art, design et technologie, nous éveillons leur curiosité et les encourageons à imaginer un futur où l’IA est au service du bien commun.
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.2} direction="left">
          <div className="relative overflow-hidden group rounded-3xl bg-white p-6 sm:p-10 border border-slate-200/80 shadow-xs h-full flex flex-col justify-between">
            <div>
              <span className="mb-4 inline-flex items-center justify-center rounded-xl bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
                Mission
              </span>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">Notre mission</h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Nous nous engageons à rendre l’éducation à l’IA accessible à toutes et à tous, en particulier dans les régions où les opportunités restent limitées. Nous donnons aux jeunes les moyens d’apprendre, d’expérimenter et de collaborer grâce à des outils numériques pour résoudre des enjeux concrets.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* 2. Piliers d'action */}
      <div className="space-y-8">
        <FadeIn delay={0.3} direction="down" className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Nos piliers d&apos;action
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            Découvrez comment nous structurons notre approche pour maximiser notre impact positif.
          </p>
        </FadeIn>

        <StaggerContainer delay={0.4} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {ai4good.map((item, index) => {
            return (
              <StaggerItem key={item.id + index.toString()}>
                <Card className="group relative overflow-hidden border-slate-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md h-full flex flex-col p-0">
                  <CardHeader className="pb-3 p-6">
                    <div className="mb-3 inline-flex items-center justify-center rounded-xl bg-primary/10 px-3 py-1 text-xs font-bold text-primary w-fit">
                      0{index + 1}
                    </div>
                    <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow p-6 pt-0">
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>

      {/* 3. Banner CTA */}
      <FadeIn delay={0.5} direction="up">
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm sm:text-base font-medium text-slate-800 text-center sm:text-left max-w-xl">
            Ensemble, créons un futur numérique où la technologie élève, protège et émancipe.
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-full px-6 py-3 bg-primary text-white font-semibold shadow-xs hover:bg-primary/90 shrink-0"
          >
            <Link href="https://ai4goodfestival.org/" target="_blank">
              <span>Découvrir le festival</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </FadeIn>
    </ProgrammeLayout>
  );
}
