"use client";

import Link from "next/link";
import { ArrowRight, Newspaper, Calendar, Clock, ExternalLink } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/Animations";
import { PostCard, PublishedPost } from "./PostCard";
import { Button } from "@/components/ui/button";

interface HomeActualitesSectionProps {
  posts: PublishedPost[];
}

export function HomeActualitesSection({ posts }: HomeActualitesSectionProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section
      className="py-16 md:py-24 bg-slate-50/70 border-y border-slate-200/60"
      aria-labelledby="home-actualites-heading"
    >
      <div className="section-container">
        {/* En-tête de la section */}
        <FadeIn delay={0.1} direction="up" className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#836182]/10 border border-[#836182]/20 text-[#836182] text-xs font-bold uppercase tracking-wider">
              <Newspaper className="size-3.5" />
              <span>Actualités & Publications</span>
            </div>
            <h2 id="home-actualites-heading" className="text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight">
              Nos dernières actualités
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Découvrez les récents évènements, projets et réalisations d&apos;ACCEENT sur le terrain à Ziguinchor.
            </p>
          </div>

          <div className="shrink-0">
            <Button
              asChild
              variant="outline"
              className="rounded-full border-[#836182]/30 text-[#836182] hover:bg-[#836182] hover:text-white font-semibold text-xs sm:text-sm px-6 h-11 transition-all shadow-xs group"
            >
              <Link href="/actualites" className="flex items-center gap-2">
                <span>Toutes les actualités</span>
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </FadeIn>

        {/* Grille des articles */}
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          delay={0.2}
        >
          {posts.map((post, index) => (
            <StaggerItem key={post.id}>
              <PostCard post={post} index={index} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Bouton mobile sous la liste */}
        <div className="mt-10 text-center md:hidden">
          <Button
            asChild
            className="rounded-full bg-[#836182] text-white hover:bg-[#6d4c6c] font-semibold text-sm px-8 h-11 w-full max-w-xs shadow-md"
          >
            <Link href="/actualites" className="flex items-center justify-center gap-2">
              <span>Voir toutes les actualités</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
