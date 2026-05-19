import NotFoundContent from "@/components/shared/NotFoundContent";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Page introuvable",
  description:
    "La page demandée est introuvable sur le site d'ACCEENT. Retournez à l'accueil pour découvrir nos programmes à Ziguinchor.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return <NotFoundContent />;
}
