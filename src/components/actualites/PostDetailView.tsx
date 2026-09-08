"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowLeft, BookOpen, Clock, UserCheck, Maximize2, X, Share2, Check, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/shared/Animations";

interface PostDetailViewProps {
  post: {
    id: string;
    title: string;
    slug: string;
    content: string;
    imageUrl: string | null;
    link?: string | null;
    createdAt: string;
    authorName: string;
  };
}

export function PostDetailView({ post }: PostDetailViewProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const defaultImage =
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80";
  const imageSrc = post.imageUrl || defaultImage;

  const wordCount = post.content ? post.content.split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleShare = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <>
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-8">
        {/* Lien retour */}
        <FadeIn direction="up">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#836182] hover:text-[#6d4c6c] transition-colors bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm"
          >
            <ArrowLeft className="size-4" />
            <span>Retour à toutes les actualités</span>
          </Link>
        </FadeIn>

        {/* Header de l'article */}
        <FadeIn direction="up" delay={0.1}>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200/80 shadow-xs">
                <Calendar className="size-3.5 text-[#836182]" />
                {post.createdAt}
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200/80 shadow-xs">
                <Clock className="size-3.5 text-[#836182]" />
                {readingTime} min de lecture
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
              {post.title}
            </h1>
          </div>
        </FadeIn>

        {/* ── Image principale Haute Visibilité ── */}
        <FadeIn direction="up" delay={0.15}>
          <div className="relative group rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border border-slate-200/80">
            <div className="relative h-80 sm:h-[440px] w-full overflow-hidden">
              <Image
                src={imageSrc}
                alt={post.title}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />

              {/* Subtly darkened bottom for badge contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20" />

              {/* Bouton pour agrandir en plein écran */}
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="absolute top-4 right-4 px-4 py-2 rounded-full bg-slate-900/75 hover:bg-[#836182] backdrop-blur-md text-white text-xs font-bold flex items-center gap-2 transition-all duration-200 shadow-lg hover:scale-105 cursor-pointer border border-white/20"
              >
                <Maximize2 className="size-3.5" />
                <span>Voir en plein écran</span>
              </button>

              <div className="absolute bottom-4 left-4 text-white/90 text-xs font-medium bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                Cliquez pour agrandir la photo
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Corps de l'article */}
        <FadeIn direction="up" delay={0.2}>
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-8">
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-base sm:text-lg whitespace-pre-line">
              {post.content}
            </div>

            {/* Block du lien externe s'il est renseigné */}
            {post.link && (
              <div className="p-4 sm:p-6 rounded-2xl bg-[#836182]/5 border border-[#836182]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-[#836182]/10 border border-[#836182]/20 flex items-center justify-center text-[#836182] shrink-0">
                    <ExternalLink className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#836182] uppercase tracking-wider">Lien externe associé</p>
                    <p className="text-sm text-slate-700 font-semibold truncate max-w-xs sm:max-w-md">{post.link}</p>
                  </div>
                </div>
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#836182] hover:bg-[#6d4c6c] text-white text-xs sm:text-sm font-bold transition-all shadow-md shrink-0"
                >
                  <span>Visiter le lien</span>
                  <ExternalLink className="size-4" />
                </a>
              </div>
            )}

            <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/actualites"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#836182] text-white text-sm font-bold hover:bg-[#6d4c6c] transition-colors shadow-md w-full sm:w-auto justify-center"
              >
                <BookOpen className="size-4" />
                <span>Voir d&apos;autres actualités</span>
              </Link>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-semibold transition-colors w-full sm:w-auto justify-center cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="size-4 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Lien copié !</span>
                  </>
                ) : (
                  <>
                    <Share2 className="size-4 text-[#836182]" />
                    <span>Partager l&apos;article</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </FadeIn>
      </article>

      {/* ── LIGHTBOX MODAL PLEIN ÉCRAN ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-6xl w-full max-h-[92vh] flex flex-col items-center justify-center rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border border-white/10"
            >
              <div className="w-full flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur-md border-b border-white/10 text-white z-10">
                <h4 className="text-sm sm:text-base font-bold truncate pr-4 text-slate-100">
                  {post.title}
                </h4>
                <button
                  type="button"
                  onClick={() => setLightboxOpen(false)}
                  className="size-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="relative w-full h-[65vh] sm:h-[80vh] bg-black flex items-center justify-center p-2">
                <Image
                  src={imageSrc}
                  alt={post.title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
