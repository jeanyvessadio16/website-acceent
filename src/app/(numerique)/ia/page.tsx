import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Intelligence artificielle",
  description:
    "Découvrez le futur programme d'intelligence artificielle d'ACCEENT à Ziguinchor : initiation à l'IA et usages du numérique pour les jeunes de la Casamance.",
  path: "/ia",
  keywords: [
    "intelligence artificielle jeunes Sénégal",
    "formation IA Ziguinchor",
    "numérique Casamance",
  ],
  noIndex: true,
});

export default function IAPage() {
  return (
    <section className="section-padding">
      <div className="section-container text-center">
        <h1 className="section-heading mb-4">Intelligence artificielle</h1>
        <p className="section-subheading max-w-2xl mx-auto">
          Ce programme est en cours de préparation. Revenez bientôt pour
          découvrir nos ateliers et parcours autour de l&apos;IA à Ziguinchor.
        </p>
      </div>
    </section>
  );
}
