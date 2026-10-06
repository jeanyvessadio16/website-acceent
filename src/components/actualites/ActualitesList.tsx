"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { BookOpen, Search, X } from "lucide-react";
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

  const handleOpenPreview = (url: string, title: string) => {
    setLightboxImage({ url, title });
  };

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

      {/* ── Liste vide ou Grille d'articles ─────────────────────────────────── */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPosts.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              index={index}
              onImagePreview={handleOpenPreview}
            />
          ))}
        </div>
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

