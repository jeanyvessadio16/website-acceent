import { createPageMetadata } from "@/lib/seo";
import prisma from "@/lib/prisma";
import { ActualitesList } from "@/components/actualites/ActualitesList";
import { FadeIn } from "@/components/shared/Animations";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = createPageMetadata({
  title: "Actualités",
  description:
    "Suivez toute l'actualité, les événements et les réussites portés par l'association ACCEENT à Ziguinchor.",
  path: "/actualites",
  keywords: [
    "actualités ACCEENT",
    "événements Ziguinchor",
    "projets Casamance",
    "nouvelles éducation entrepreneuriat numérique",
  ],
});

export default async function ActualitesPage() {
  const dbPosts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          firstname: true,
          lastname: true,
        },
      },
    },
  });

  const posts = dbPosts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    content: p.content,
    imageUrl: p.imageUrl,
    authorName: p.author
      ? `${p.author.firstname} ${p.author.lastname}`
      : "ACCEENT",
    createdAt: p.createdAt.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  }));

  return (
    <main className="min-h-screen bg-slate-50/50 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-12">
        {/* Header Hero */}
        <FadeIn direction="up">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#836182]/10 border border-[#836182]/20 text-[#836182] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="size-3.5" />
              <span>Actualités & Publications</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Toutes les actualités <span className="text-[#836182]">ACCEENT</span>
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Découvrez nos derniers articles, l'avancement de nos projets et les réussites des jeunes et des femmes accompagnés à Ziguinchor.
            </p>
          </div>
        </FadeIn>

        {/* Liste des articles */}
        <FadeIn direction="up" delay={0.15}>
          <ActualitesList posts={posts} />
        </FadeIn>
      </div>
    </main>
  );
}
