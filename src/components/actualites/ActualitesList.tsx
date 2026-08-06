"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight, BookOpen, Search, X, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export interface PublishedPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  authorName: string;
}

interface ActualitesListProps {
  posts: PublishedPost[];
}

export function ActualitesList({ posts }: ActualitesListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // ── Rafraîchissement automatique en temps réel ─────────────────────────────
  useEffect(() => {
    // Polling toutes les 10 secondes pour charger les modifications en temps réel
    const interval = setInterval(() => {
      router.refresh();
    }, 10000);

    // Rafraîchit les données lorsque l'utilisateur revient sur la page / l'onglet
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

  return (
    <div className="space-y-12">
      {/* ── Barre de recherche et filtre ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm max-w-3xl mx-auto">
        <div className="relative flex-1 w-full flex items-center gap-3 px-3">
          <Search className="size-5 text-slate-400 shrink-0" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une actualité, un mot-clé ou un auteur..."
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
        <div className="text-xs font-semibold text-slate-500 shrink-0 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
          {filteredPosts.length} article{filteredPosts.length > 1 ? "s" : ""} trouvé{filteredPosts.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* ── Liste vide ───────────────────────────────────────────────────────── */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white/60 backdrop-blur-md rounded-3xl border border-slate-200/70 max-w-2xl mx-auto shadow-sm">
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
              className="px-5 py-2.5 rounded-full bg-[#836182] text-white text-sm font-semibold hover:bg-[#6d4c6c] transition-all shadow-md"
            >
              Réinitialiser la recherche
            </button>
          )}
        </div>
      ) : (
        <>
          {/* ── Article à la une (Featured) ──────────────────────────────────── */}
          {featuredPost && !searchTerm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href={`/actualites/${featuredPost.slug}`}
                className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-0 group block"
              >
                <div className="lg:col-span-7 relative h-72 lg:h-auto min-h-[320px] overflow-hidden bg-slate-100">
                  <Image
                    src={featuredPost.imageUrl || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"}
                    alt={featuredPost.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                  />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="bg-[#836182] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                      <Sparkles className="size-3.5" />
                      À la une
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="size-3.5" />
                        {featuredPost.createdAt}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight group-hover:text-[#836182] transition-colors">
                      {featuredPost.title}
                    </h3>

                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-4">
                      {featuredPost.content}
                    </p>
                  </div>

                  <div className="flex items-center pt-4 border-t border-slate-100">
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-[#836182] group-hover:text-[#6d4c6c] transition-colors">
                      <span>Lire la suite</span>
                      <ArrowRight className="size-4 group-hover:translate-x-1.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* ── Grille d'articles ────────────────────────────────────────────── */}
          <div className="space-y-6">
            {!searchTerm && featuredPost && regularPosts.length > 0 && (
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="size-5 text-[#836182]" />
                Toutes les actualités
              </h3>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {(searchTerm ? filteredPosts : regularPosts).map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <Link
                    href={`/actualites/${post.slug}`}
                    className="flex flex-col bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1 h-full block"
                  >
                    {/* Image */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                      <Image
                        src={post.imageUrl || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"}
                        alt={post.title}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-slate-200/50">
                          Publication
                        </span>
                      </div>
                    </div>

                    {/* Contenu */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {post.createdAt}
                          </span>
                        </div>

                        <h4 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-[#836182] transition-colors line-clamp-2">
                          {post.title}
                        </h4>

                        <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                          {post.content}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#836182] group-hover:text-[#6d4c6c] transition-colors">
                          <span>Lire l&apos;article</span>
                          <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
