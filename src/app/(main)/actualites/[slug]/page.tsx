import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { createPageMetadata } from "@/lib/seo";
import { Calendar, ArrowLeft, Share2, Sparkles, BookOpen } from "lucide-react";
import { FadeIn } from "@/components/shared/Animations";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
    });

    if (!post) {
      return createPageMetadata({
        title: "Article introuvable",
        description: "L'article demandé n'existe pas ou n'est plus disponible.",
        path: `/actualites/${slug}`,
      });
    }

    return createPageMetadata({
      title: post.title,
      description: post.content.slice(0, 160),
      path: `/actualites/${post.slug}`,
    });
  } catch {
    return createPageMetadata({
      title: "Actualités ACCEENT",
      description: "Découvrez les actualités d'ACCEENT.",
      path: `/actualites/${slug}`,
    });
  }
}

export default async function PostDetailPage({ params }: PostPageProps) {
  const { slug } = await params;

  let post = null;

  try {
    post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Erreur de connexion à la base de données dans PostDetailPage:", error);
  }

  if (!post || !post.published) {
    notFound();
  }

  const formattedDate = post.createdAt.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const authorName = post.author
    ? `${post.author.firstname} ${post.author.lastname}`
    : "ACCEENT";

  return (
    <main className="min-h-screen bg-slate-50/50 py-12 sm:py-16">
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-8">
        {/* Lien retour */}
        <FadeIn direction="up">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#836182] hover:text-[#6d4c6c] transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Retour à toutes les actualités</span>
          </Link>
        </FadeIn>

        {/* Header de l'article */}
        <FadeIn direction="up" delay={0.1}>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-slate-200">
                <Calendar className="size-3.5" />
                {formattedDate}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
              {post.title}
            </h1>
          </div>
        </FadeIn>

        {/* Image principale */}
        <FadeIn direction="up" delay={0.15}>
          <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden bg-slate-100 shadow-xl border border-slate-200/80">
            <Image
              src={post.imageUrl || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"}
              alt={post.title}
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </FadeIn>

        {/* Corps de l'article */}
        <FadeIn direction="up" delay={0.2}>
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6">
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-base sm:text-lg whitespace-pre-line">
              {post.content}
            </div>

            <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/actualites"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#836182] text-white text-sm font-semibold hover:bg-[#6d4c6c] transition-colors shadow-md"
              >
                <BookOpen className="size-4" />
                <span>Voir d'autres actualités</span>
              </Link>
            </div>
          </div>
        </FadeIn>
      </article>
    </main>
  );
}
