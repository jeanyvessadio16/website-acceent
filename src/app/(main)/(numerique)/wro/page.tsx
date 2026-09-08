import ProgrammeLayout from "@/components/layout/ProgrammeLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { wroAction } from "@/data/numerique/wroAction";
import { createPageMetadata } from "@/lib/seo";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/Animations";

export const metadata = createPageMetadata({
  title: "World Robot Olympiad (WRO)",
  description:
    "Programme WRO d'ACCEENT à Ziguinchor : compétition internationale de robotique, ateliers d'initiation et défis locaux pour apprendre à programmer, construire et collaborer.",
  path: "/wro",
  keywords: [
    "World Robot Olympiad Sénégal",
    "robotique jeunes Ziguinchor",
    "programmation visuelle collège lycée",
    "compétition robotique Casamance",
  ],
});

export default function WROPage() {
  const programme = {
    titre: "World Robot Olympiad (WRO)",
    description:
      "Compétition internationale WRO, ateliers d'initiation et challenges locaux à Ziguinchor. Apprendre à programmer, construire, collaborer… et s'amuser.",
  };

  return (
    <ProgrammeLayout
      image="/images/WRO.webp"
      text="Programme Numérique"
      {...programme}
    >
      {/* 1. Présentation du programme */}
      <FadeIn delay={0.1} direction="up">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 md:p-12 text-center shadow-xs space-y-4">
          <span className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            STEM & Robotique
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900">
            World Robot Olympiad (WRO)
          </h2>
          <p className="mx-auto max-w-3xl text-slate-600 text-base sm:text-lg leading-relaxed">
            Une compétition de robotique véritablement mondiale dédiée à la science, à la technologie et à l&apos;éducation. Notre mission est d&apos;aider les jeunes à développer leur créativité et leur capacité à résoudre des problèmes de manière ludique et stimulante.
          </p>
          <p className="mx-auto max-w-3xl text-slate-600 text-sm sm:text-base leading-relaxed">
            Nous organisons des concours de robotique dans quatre catégories différentes pour les élèves de 8 à 19 ans. Dans notre catégorie Futurs Ingénieurs, les étudiants peuvent avoir jusqu&apos;à 22 ans. L&apos;Association World Robot Olympiad™ promeut la robotique dans l&apos;enseignement des STEM à travers le monde.
          </p>
        </div>
      </FadeIn>

      {/* 2. Actions WRO */}
      <div className="space-y-8">
        <FadeIn delay={0.2} direction="down" className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Nos actions à ACCEENT
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto">
            Découvrez les actions menées par ACCEENT dans le domaine de la robotique à Ziguinchor.
          </p>
        </FadeIn>

        <StaggerContainer delay={0.3} className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {wroAction.map((item) => (
            <StaggerItem key={item.id}>
              <Card className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md h-full flex flex-col p-0">
                <CardHeader className="p-0">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      alt={item.nom}
                      fill
                      src={item.image}
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6 flex flex-col flex-grow">
                  <CardTitle className="text-primary text-lg font-bold mb-2">
                    {item.nom}
                  </CardTitle>
                  <CardDescription className="text-slate-600 text-sm leading-relaxed flex-grow">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* 3. Banner CTA */}
      <FadeIn delay={0.4} direction="up">
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm sm:text-base font-medium text-slate-800 text-center sm:text-left max-w-xl">
            Vous souhaitez soutenir les équipes de robotique de Ziguinchor ou devenir mentor ? N&apos;hésitez pas à nous contacter.
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
  );
}
