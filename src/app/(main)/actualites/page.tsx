import { createPageMetadata } from "@/lib/seo";
import prisma from "@/lib/prisma";
import { ActualitesList } from "@/components/actualites/ActualitesList";
import { FadeIn } from "@/components/shared/Animations";
import { Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = createPageMetadata({
  title: "Actualités & Événements — Association ACCEENT Ziguinchor",
  description:
    "Suivez l'actualité des programmes, témoignages, événements et réussites portés par l'association ACCEENT en éducation, entrepreneuriat et numérique à Ziguinchor et en Casamance.",
  path: "/actualites",
  keywords: [
    "actualités ACCEENT Ziguinchor",
    "événements Ziguinchor Casamance",
    "projets association ACCEENT",
    "blog éducation Ziguinchor",
    "nouvelles entrepreneuriat Casamance",
    "activités jeunesse Ziguinchor",
    "succès ACCEENT",
  ],
});

export default async function ActualitesPage() {
  let posts: Array<{
    id: string;
    title: string;
    slug: string;
    content: string;
    imageUrl: string | null;
    authorName: string;
    createdAt: string;
  }> = [];

  try {
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

    posts = dbPosts.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      content: p.content,
      imageUrl: p.imageUrl,
      link: p.link,
      authorName: p.author
        ? `${p.author.firstname} ${p.author.lastname}`
        : "ACCEENT",
      createdAt: p.createdAt.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    }));
  } catch (error) {
    console.error("Erreur de connexion à la base de données dans ActualitesPage:", error);
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", item: "/" },
          { name: "Actualités", item: "/actualites" },
        ]}
      />
      <main className="min-h-screen bg-slate-50/50 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl space-y-12">
        {/* Header Hero */}
        <FadeIn direction="up">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#836182]/10 border border-[#836182]/20 text-[#836182] text-xs font-bold uppercase tracking-wider">
              <Newspaper className="size-3.5" />
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

        {/* ── Section d'incitation à la navigation & CTA ── */}
        <FadeIn direction="up" delay={0.25}>
          <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-white p-8 sm:p-12 text-center shadow-xs space-y-6">
            <div className="mx-auto max-w-2xl space-y-3">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                <span>Passer à l&apos;action</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Envie de participer à l&apos;aventure ACCEENT ?
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Que vous soyez un·e jeune porteur de projet, une étudiante, un partenaire institutionnel ou une association locale, nous avons des opportunités adaptées à vos besoins.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 pt-2">
              <Button
                asChild
                size="lg"
                className="rounded-full px-7 bg-primary text-white hover:bg-primary/90 font-semibold shadow-xs transition-all hover:scale-[1.02]"
              >
                <Link href="/contact">
                  Nous contacter
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-7 border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold shadow-2xs hover:border-primary/50 transition-all"
              >
                <Link href="/education">
                  <span>Explorer nos programmes</span>
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-6 border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium shadow-2xs transition-all"
              >
                <Link href="/about">
                  <span>À propos d&apos;ACCEENT</span>
                </Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </main>
    </>
  );
}
