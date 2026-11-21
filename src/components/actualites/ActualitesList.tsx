"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { BookOpen, Search, X, ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PostCard, PublishedPost } from "./PostCard";
import { POST_CATEGORIES, type PostCategoryKey } from "@/lib/constants/platform";

interface ActualitesListProps {
  posts: PublishedPost[];
}

const PAGE_SIZE = 9;

export function ActualitesList({ posts }: ActualitesListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | PostCategoryKey>("ALL");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 15000);

    const handleFocus = () => {
      router.refresh();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [router]);

  const filteredPosts = posts.filter((post) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.content.toLowerCase().includes(q) ||
      (post.tags || []).some((t) => t.toLowerCase().includes(q));

    const matchesCategory =
      selectedCategory === "ALL" || (post.category || "GENERAL") === selectedCategory;

    const matchesTag =
      !selectedTag ||
      (post.tags || []).some((t) => t.toLowerCase() === selectedTag.toLowerCase());

    return matchesSearch && matchesCategory && matchesTag;
  });

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedPosts = filteredPosts.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const handleCategoryChange = (cat: "ALL" | PostCategoryKey) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag((prev) => (prev?.toLowerCase() === tag.toLowerCase() ? null : tag));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("ALL");
    setSelectedTag(null);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8">
      {/* ── Barre de recherche ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-3 sm:p-4 rounded-3xl border border-slate-200/80 shadow-sm max-w-3xl mx-auto">
        <div className="relative flex-1 w-full flex items-center gap-3 px-3">
          <Search className="size-5 text-[#836182] shrink-0" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Rechercher une actualité, un thème ou un #tag..."
            className="w-full bg-transparent text-slate-800 text-sm placeholder:text-slate-400 outline-none font-medium"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setCurrentPage(1);
              }}
              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <div className="text-xs font-semibold text-slate-600 shrink-0 bg-[#836182]/10 px-3.5 py-1.5 rounded-full border border-[#836182]/20">
          {filteredPosts.length} article{filteredPosts.length > 1 ? "s" : ""} trouvé{filteredPosts.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* ── Filtres par Catégorie & Tag actif ──────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => handleCategoryChange("ALL")}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
            selectedCategory === "ALL"
              ? "bg-[#836182] text-white border-[#836182] shadow-sm"
              : "bg-white text-slate-600 border-slate-200 hover:border-[#836182]/40 hover:text-[#836182]"
          }`}
        >
          Toutes les catégories
        </button>

        {(Object.keys(POST_CATEGORIES) as PostCategoryKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => handleCategoryChange(key)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
              selectedCategory === key
                ? "bg-[#836182] text-white border-[#836182] shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:border-[#836182]/40 hover:text-[#836182]"
            }`}
          >
            {POST_CATEGORIES[key].label}
          </button>
        ))}

        {selectedTag && (
          <button
            type="button"
            onClick={() => setSelectedTag(null)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold bg-slate-900 text-white cursor-pointer hover:bg-slate-800"
          >
            <Tag className="size-3" />
            <span>#{selectedTag}</span>
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* ── Liste vide ou Grille d'articles ─────────────────────────────────── */}
      {paginatedPosts.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/70 max-w-2xl mx-auto shadow-sm">
          <div className="size-16 rounded-2xl bg-[#836182]/10 border border-[#836182]/20 flex items-center justify-center text-[#836182] mx-auto mb-4">
            <BookOpen className="size-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Aucune actualité trouvée</h3>
          <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
            {searchTerm || selectedCategory !== "ALL" || selectedTag
              ? "Aucun article ne correspond aux critères sélectionnés."
              : "Aucune publication n'a été mise en ligne pour le moment. Revenez régulièrement pour découvrir nos dernières actualités."}
          </p>
          {(searchTerm || selectedCategory !== "ALL" || selectedTag) && (
            <button
              type="button"
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-full bg-[#836182] text-white text-sm font-semibold hover:bg-[#6d4c6c] transition-all shadow-md cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {paginatedPosts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                index={index}
                onImagePreview={(url, title) => setLightboxImage({ url, title })}
                onTagClick={handleTagClick}
              />
            ))}
          </div>

          {/* ── Pagination ──────────────────────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="size-4" />
                Précédent
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`size-9 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    page === safePage
                      ? "bg-[#836182] text-white shadow-sm"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-[#836182]"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                Suivant
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* ── LIGHTBOX MODAL ─────────────────────────────────────────────────── */}
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
