"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight, BookOpen, Search, X, Newspaper, Maximize2, UserCheck, Clock, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PostCard, PublishedPost } from "./PostCard";

interface ActualitesListProps {
  posts: PublishedPost[];
}

export function ActualitesList({ posts }: ActualitesListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  // ── Rafraîchissement automatique en temps réel ─────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 10000);

    const handleFocus = () => {
      router.refresh();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [router]);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const regularPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

  const handleOpenPreview = (url: string, title: string) => {
    setLightboxImage({ url, title });
  };

  const defaultFeaturedImage =
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="space-y-12">
      {/* ── Barre de recherche et filtre ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-3 sm:p-4 rounded-3xl border border-slate-200/80 shadow-sm max-w-3xl mx-auto">
        <div className="relative flex-1 w-full flex items-center gap-3 px-3">
          <Search className="size-5 text-[#836182] shrink-0" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une actualité ou un mot-clé..."
            className="w-full bg-transparent text-slate-800 text-sm placeholder:text-slate-400 outline-none font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <div className="text-xs font-semibold text-slate-600 shrink-0 bg-[#836182]/10 px-3.5 py-1.5 rounded-full border border-[#836182]/20">
          {filteredPosts.length} article{filteredPosts.length > 1 ? "s" : ""} trouvé{filteredPosts.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* ── Liste vide ───────────────────────────────────────────────────────── */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/70 max-w-2xl mx-auto shadow-sm">
          <div className="size-16 rounded-2xl bg-[#836182]/10 border border-[#836182]/20 flex items-center justify-center text-[#836182] mx-auto mb-4">
            <BookOpen className="size-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Aucune actualité trouvée</h3>
          <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
            {searchTerm
              ? `Aucun article ne correspond à votre recherche "${searchTerm}". Essayez d'autres mots-clés.`
              : "Aucune publication n'a été mise en ligne pour le moment. Revenez régulièrement pour découvrir nos dernières actualités."}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="px-5 py-2.5 rounded-full bg-[#836182] text-white text-sm font-semibold hover:bg-[#6d4c6c] transition-all shadow-md cursor-pointer"
            >
              Réinitialiser la recherche
            </button>
          )}
        </div>
      ) : (
        <>
          {/* ── Article à la une (Featured Showcase Card) ────────────────────── */}
          {featuredPost && !searchTerm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-0 group">
                {/* ── Image Haute Visibilité ── */}
                <div className="lg:col-span-7 relative h-80 sm:h-96 lg:h-auto min-h-[360px] overflow-hidden bg-slate-900">
                  <Image
                    src={featuredPost.imageUrl || defaultFeaturedImage}
                    alt={featuredPost.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-slate-950/40" />

                  {/* Badges superposés */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="bg-[#836182] text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-white/20">
                      <Newspaper className="size-3.5" />
                      Article à la une
                    </span>

                    {/* Bouton Agrandir Image */}
                    <button
                      type="button"
                      onClick={() => handleOpenPreview(featuredPost.imageUrl || defaultFeaturedImage, featuredPost.title)}
                      className="size-9 rounded-full bg-slate-900/70 hover:bg-[#836182] backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-110 cursor-pointer"
                      title="Voir l'image en plein écran"
                    >
                      <Maximize2 className="size-4" />
                    </button>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-end text-white text-xs font-semibold">
                    <span className="inline-flex items-center gap-1.5 bg-slate-900/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                      <Calendar className="size-3.5 text-pink-300" />
                      {featuredPost.createdAt}
                    </span>
                  </div>
                </div>

                {/* ── Contenu du Featured ── */}
                <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#836182] uppercase tracking-wider">
                      <Clock className="size-3.5" />
                      <span>{Math.max(1, Math.ceil((featuredPost.content ? featuredPost.content.split(/\s+/).length : 0) / 200))} min de lecture</span>
                    </div>

                    <Link href={`/actualites/${featuredPost.slug}`}>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight group-hover:text-[#836182] transition-colors">
                        {featuredPost.title}
                      </h2>
                    </Link>

                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-4">
                      {featuredPost.content}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-100">
                    <Link
                      href={`/actualites/${featuredPost.slug}`}
                      className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#836182] hover:bg-[#6d4c6c] text-white text-sm font-bold transition-all shadow-md hover:shadow-lg group/btn"
                    >
                      <span>Lire l&apos;article complet</span>
                      <ArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>

                    {featuredPost.link && (
                      <a
                        href={featuredPost.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-sm font-bold transition-all shadow-xs"
                        title="Ouvrir le lien externe"
                      >
                        <span>Visiter le lien</span>
                        <ExternalLink className="size-4 text-[#836182]" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Grille d'articles ────────────────────────────────────────────── */}
          <div className="space-y-6">
            {!searchTerm && featuredPost && regularPosts.length > 0 && (
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 pt-4">
                <BookOpen className="size-5 text-[#836182]" />
                Toutes les actualités
              </h3>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {(searchTerm ? filteredPosts : regularPosts).map((post, index) => (
                <PostCard
                  key={post.id}
                  post={post}
                  index={index}
                  onImagePreview={handleOpenPreview}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── LIGHTBOX MODAL (Agrandissement Image Plein Écran) ──────────────── */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border border-white/10"
            >
              {/* Header avec titre et bouton fermeture */}
              <div className="w-full flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur-md border-b border-white/10 z-10 text-white">
                <h4 className="text-sm sm:text-base font-bold truncate pr-4 text-slate-100">
                  {lightboxImage.title}
                </h4>
                <button
                  type="button"
                  onClick={() => setLightboxImage(null)}
                  className="size-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Conteneur d'image plein écran */}
              <div className="relative w-full h-[60vh] sm:h-[75vh] bg-black flex items-center justify-center p-2">
                <Image
                  src={lightboxImage.url}
                  alt={lightboxImage.title}
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
    </div>
  );
}

