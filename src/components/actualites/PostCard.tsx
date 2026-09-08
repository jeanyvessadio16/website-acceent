"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight, Clock, UserCheck, Maximize2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export interface PublishedPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl: string | null;
  link?: string | null;
  createdAt: string;
  authorName: string;
}

interface PostCardProps {
  post: PublishedPost;
  onImagePreview?: (imageUrl: string, title: string) => void;
  index?: number;
}

export function PostCard({ post, onImagePreview, index = 0 }: PostCardProps) {
  // Calcul rapide du temps de lecture estimé (ex: 200 mots par minute)
  const wordCount = post.content ? post.content.split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const defaultImage =
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80";
  const imageSrc = post.imageUrl || defaultImage;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="h-full flex"
    >
      <div className="group relative flex flex-col w-full bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-[#836182]/40 transition-all duration-300 overflow-hidden hover:-translate-y-1">
        {/* ── Conteneur d'image Haute Visibilité ── */}
        <div className="relative h-60 w-full overflow-hidden bg-slate-900">
          <Image
            src={imageSrc}
            alt={post.title}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Fondu graduel vers le bas pour maximiser la lisibilité des badges */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

          {/* Badges superposés sur l'image */}
          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
            <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-md border border-white/50">
              Publication
            </span>

            {/* Bouton pour agrandir l'image en plein écran */}
            {onImagePreview && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onImagePreview(imageSrc, post.title);
                }}
                className="pointer-events-auto size-8 rounded-full bg-slate-900/60 hover:bg-[#836182] backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 shadow-md hover:scale-110"
                title="Agrandir l'image en plein écran"
              >
                <Maximize2 className="size-3.5" />
              </button>
            )}
          </div>

          {/* Tempe de lecture & date en bas de l'image */}
          <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-xs font-medium">
            <span className="flex items-center gap-1 bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[11px]">
              <Calendar className="size-3 text-pink-300" />
              {post.createdAt}
            </span>
            <span className="flex items-center gap-1 bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[11px]">
              <Clock className="size-3 text-pink-300" />
              {readingTime} min de lecture
            </span>
          </div>
        </div>

        {/* ── Contenu texte de la carte ── */}
        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <Link href={`/actualites/${post.slug}`} className="block">
              <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-[#836182] transition-colors line-clamp-2">
                {post.title}
              </h3>
            </Link>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
              {post.content}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
            <Link
              href={`/actualites/${post.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#836182] group-hover:text-[#6d4c6c] transition-colors"
            >
              <span>Lire l&apos;article</span>
              <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>

            {post.link && (
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-[#836182] bg-slate-100 hover:bg-[#836182]/10 px-3 py-1 rounded-full border border-slate-200 transition-all shadow-2xs"
                title="Ouvrir le lien externe"
              >
                <span>Lien</span>
                <ExternalLink className="size-3 text-[#836182]" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
