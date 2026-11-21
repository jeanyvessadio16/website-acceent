"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  PencilLine,
  Trash2,
  Calendar,
  UserCheck,
  Globe,
  GlobeOff,
  Loader2,
  X,
  AlertCircle,
  CheckCircle2,
  FileText,
  Send,
  PlusCircle,
  ExternalLink,
  Link as LinkIcon,
} from "lucide-react";
import {
  togglePublishPostAction,
  createPostAction,
  updatePostAction,
  deletePostAction,
} from "@/actions/post";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { POST_CATEGORIES, type PostCategoryKey } from "@/lib/constants/platform";
import { createPostSchema, updatePostSchema } from "@/validation/post";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 10;

export interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  content?: string;
  imageUrl?: string;
  link?: string | null;
  category?: PostCategoryKey | string;
  tags?: string[];
  published: boolean;
  authorId?: string;
  authorName: string;
  createdAt: string;
}

function parseTagsInput(raw: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const part of raw.split(",")) {
    const clean = part.trim().slice(0, 30);
    if (clean && !seen.has(clean.toLowerCase())) {
      seen.add(clean.toLowerCase());
      result.push(clean);
    }
    if (result.length >= 8) break;
  }
  return result;
}

interface ArticleListProps {
  articles: ArticleItem[];
  currentUserId?: string;
  currentUserRole?: string;
  initialOpenCreate?: boolean;
}

export function ArticleList({
  articles,
  currentUserId,
  currentUserRole,
  initialOpenCreate = false,
}: ArticleListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [categoryFilter, setCategoryFilter] = useState<"ALL" | PostCategoryKey>("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const [isCreateOpen, setIsCreateOpen] = useState(initialOpenCreate);
  const [createTitle, setCreateTitle] = useState("");
  const [createContent, setCreateContent] = useState("");
  const [createImageUrl, setCreateImageUrl] = useState("");
  const [createLink, setCreateLink] = useState("");
  const [createCategory, setCreateCategory] = useState<PostCategoryKey>("GENERAL");
  const [createTagsInput, setCreateTagsInput] = useState("");
  const [createPublished, setCreatePublished] = useState(true);

  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editLink, setEditLink] = useState("");
  const [editCategory, setEditCategory] = useState<PostCategoryKey>("GENERAL");
  const [editTagsInput, setEditTagsInput] = useState("");
  const [editPublished, setEditPublished] = useState(false);

  const [deletingArticle, setDeletingArticle] = useState<ArticleItem | null>(null);

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const filteredArticles = articles.filter((a) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      a.title.toLowerCase().includes(q) ||
      a.authorName.toLowerCase().includes(q) ||
      a.slug.toLowerCase().includes(q) ||
      (a.tags || []).some((t) => t.toLowerCase().includes(q));

    const matchesCategory = categoryFilter === "ALL" || (a.category || "GENERAL") === categoryFilter;
    const matchesStatus =
      statusFilter === "published" ? a.published : statusFilter === "draft" ? !a.published : true;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedArticles = filteredArticles.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleTogglePublish = async (article: ArticleItem) => {
    setLoadingId(article.id);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await togglePublishPostAction(article.id);
    setLoadingId(null);

    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setErrorMsg(res.message);
      setTimeout(() => setErrorMsg(null), 4000);
    }
  };

  const handleOpenCreate = () => {
    setCreateTitle("");
    setCreateContent("");
    setCreateImageUrl("");
    setCreateLink("");
    setCreateCategory("GENERAL");
    setCreateTagsInput("");
    setCreatePublished(true);
    setErrorMsg(null);
    setIsCreateOpen(true);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const payload = {
      title: createTitle,
      content: createContent,
      imageUrl:
        createImageUrl ||
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
      link: createLink.trim() || undefined,
      category: createCategory,
      tags: parseTagsInput(createTagsInput),
      published: createPublished,
    };

    const parsed = createPostSchema.safeParse(payload);
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message || "Veuillez vérifier les champs saisis.");
      return;
    }

    setModalLoading(true);
    const res = await createPostAction(parsed.data);

    setModalLoading(false);
    if (res.success) {
      setIsCreateOpen(false);
      setSuccessMsg(res.message);
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleOpenEdit = (article: ArticleItem) => {
    setEditingArticle(article);
    setEditTitle(article.title);
    setEditContent(article.content || "");
    setEditImageUrl(article.imageUrl || "");
    setEditLink(article.link || "");
    setEditCategory((article.category as PostCategoryKey) || "GENERAL");
    setEditTagsInput((article.tags || []).join(", "));
    setEditPublished(article.published);
    setErrorMsg(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    setErrorMsg(null);

    const payload = {
      title: editTitle,
      content: editContent,
      imageUrl: editImageUrl,
      link: editLink.trim() || undefined,
      category: editCategory,
      tags: parseTagsInput(editTagsInput),
      published: editPublished,
    };

    const parsed = updatePostSchema.safeParse(payload);
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message || "Veuillez vérifier les champs saisis.");
      return;
    }

    setModalLoading(true);
    const res = await updatePostAction(editingArticle.id, parsed.data);

    setModalLoading(false);
    if (res.success) {
      setEditingArticle(null);
      setSuccessMsg(res.message);
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleDeletePost = async () => {
    if (!deletingArticle) return;
    setModalLoading(true);
    setErrorMsg(null);

    const res = await deletePostAction(deletingArticle.id);
    setModalLoading(false);

    if (res.success) {
      setDeletingArticle(null);
      setSuccessMsg(res.message);
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="space-y-5 max-w-6xl">
      {successMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-300 text-sm font-medium">
          <CheckCircle2 className="size-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && !isCreateOpen && !editingArticle && !deletingArticle && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-300 text-sm font-medium">
          <AlertCircle className="size-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Barre d'action et filtres */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 shadow-2xs">
            <Search className="size-4 text-slate-400 shrink-0" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Rechercher par titre, auteur ou tag…"
              className="bg-transparent text-slate-900 dark:text-white text-sm placeholder:text-slate-400 outline-none flex-1"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value as "ALL" | PostCategoryKey);
              setCurrentPage(1);
            }}
            aria-label="Filtrer par catégorie"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none shadow-2xs"
          >
            <option value="ALL">Toutes catégories</option>
            {(Object.keys(POST_CATEGORIES) as PostCategoryKey[]).map((key) => (
              <option key={key} value={key}>
                {POST_CATEGORIES[key].label}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0 shadow-2xs">
            {(
              [
                { id: "all", label: "Tous" },
                { id: "published", label: "Publiés" },
                { id: "draft", label: "Brouillons" },
              ] as const
            ).map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => {
                  setStatusFilter(filter.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === filter.id
                    ? "bg-[#836182] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="bg-[#836182] hover:bg-[#6f4f6e] text-white font-semibold rounded-xl px-4 h-10 shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Publier un article</span>
        </Button>
      </div>

      {/* Table des articles */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider">
          <span>Titre &amp; Auteur</span>
          <span>Statut</span>
          <span>Date</span>
          <span>Actions</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {paginatedArticles.length === 0 ? (
            <div className="p-10 text-center text-slate-500 dark:text-slate-400 text-sm">
              Aucun article ne correspond à votre recherche.
            </div>
          ) : (
            paginatedArticles.map((a) => {
              const isToggling = loadingId === a.id;
              const catMeta =
                POST_CATEGORIES[(a.category as PostCategoryKey) || "GENERAL"] ||
                POST_CATEGORIES.GENERAL;

              return (
                <div
                  key={a.id}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-3 sm:gap-4 items-start sm:items-center px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <FileText className="size-3.5 text-[#836182] dark:text-[#d8b4d7] shrink-0" />
                      <p className="text-slate-900 dark:text-white text-sm font-semibold truncate">
                        {a.title}
                      </p>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${catMeta.badge}`}
                      >
                        {catMeta.label}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1">
                        <UserCheck className="size-3" />
                        Par {a.authorName}
                      </span>
                      {a.tags && a.tags.length > 0 && (
                        <span className="text-[11px] text-[#836182] dark:text-[#d8b4d7]">
                          {a.tags.slice(0, 3).map((t) => `#${t}`).join(" ")}
                        </span>
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTogglePublish(a)}
                    disabled={isToggling}
                    className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 ${
                      a.published
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30"
                        : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30"
                    }`}
                  >
                    {isToggling ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : a.published ? (
                      <Globe className="size-3" />
                    ) : (
                      <GlobeOff className="size-3" />
                    )}
                    <span>{a.published ? "Publié" : "Brouillon"}</span>
                  </button>

                  <span className="text-slate-500 dark:text-slate-400 text-xs shrink-0 inline-flex items-center gap-1">
                    <Calendar className="size-3" />
                    {a.createdAt}
                  </span>

                  <div className="flex items-center gap-1 shrink-0">
                    {a.link && (
                      <a
                        href={a.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Ouvrir le lien externe"
                        className="size-8 rounded-lg flex items-center justify-center text-[#836182] dark:text-[#d8b4d7] hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    )}

                    {currentUserRole === "ADMIN" || (currentUserId && a.authorId === currentUserId) ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(a)}
                          disabled={isToggling}
                          title={a.published ? "Passer en brouillon" : "Publier"}
                          className="size-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          {isToggling ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : a.published ? (
                            <GlobeOff className="size-3.5" />
                          ) : (
                            <Send className="size-3.5" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(a)}
                          title="Éditer l'article"
                          className="size-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          <PencilLine className="size-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingArticle(a)}
                          title="Supprimer l'article"
                          className="size-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </>
                    ) : (
                      <span className="px-2 py-1 rounded-md text-[11px] text-slate-500 bg-slate-100 dark:bg-slate-800 italic">
                        Lecture seule
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                text="Précédent"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((p) => Math.max(1, p - 1));
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === safePage}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                text="Suivant"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Modale Création */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-[#836182]/10 border border-[#836182]/25 flex items-center justify-center text-[#836182]">
                  <PlusCircle className="size-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Publier un nouvel article
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Renseignez les détails pour publier dans le blog ACCEENT
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="size-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-300 text-xs font-medium">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="create-title" className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  Titre de l&apos;article <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="create-title"
                  type="text"
                  required
                  placeholder="ex: Lancement du programme Éducation Numérique 2026"
                  value={createTitle}
                  onChange={(e) => setCreateTitle(e.target.value)}
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="create-category" className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                    Catégorie
                  </Label>
                  <select
                    id="create-category"
                    value={createCategory}
                    onChange={(e) => setCreateCategory(e.target.value as PostCategoryKey)}
                    className="w-full h-9 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 text-xs text-slate-900 dark:text-white"
                  >
                    {(Object.keys(POST_CATEGORIES) as PostCategoryKey[]).map((key) => (
                      <option key={key} value={key}>
                        {POST_CATEGORIES[key].label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="create-tags" className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                    Tags (séparés par des virgules)
                  </Label>
                  <Input
                    id="create-tags"
                    type="text"
                    placeholder="ex: Ziguinchor, Jeunesse, Innovation"
                    value={createTagsInput}
                    onChange={(e) => setCreateTagsInput(e.target.value)}
                    className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <ImageUploader
                id="create-imageUrl"
                label="Image de couverture de l'article"
                value={createImageUrl}
                onChange={(url) => setCreateImageUrl(url)}
              />

              <div className="space-y-1.5">
                <Label htmlFor="create-link" className="text-xs text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1">
                  <LinkIcon className="size-3 text-[#836182]" />
                  Lien externe / URL associée (optionnel)
                </Label>
                <Input
                  id="create-link"
                  type="url"
                  placeholder="https://exemple.com/ressource-ou-document"
                  value={createLink}
                  onChange={(e) => setCreateLink(e.target.value)}
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="create-content" className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  Contenu de l&apos;article <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="create-content"
                  required
                  rows={6}
                  placeholder="Rédigez ici le contenu de votre article…"
                  value={createContent}
                  onChange={(e) => setCreateContent(e.target.value)}
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-y"
                />
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <input
                  id="create-published"
                  type="checkbox"
                  checked={createPublished}
                  onChange={(e) => setCreatePublished(e.target.checked)}
                  className="size-4 accent-[#836182] cursor-pointer"
                />
                <Label htmlFor="create-published" className="text-xs text-slate-800 dark:text-slate-200 font-medium cursor-pointer">
                  Publier l&apos;article immédiatement (visible publiquement)
                </Label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  className="cursor-pointer"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={modalLoading}
                  className="bg-[#836182] hover:bg-[#6f4f6e] text-white cursor-pointer flex items-center gap-2"
                >
                  {modalLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Publication en cours…</span>
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      <span>{createPublished ? "Publier l'article" : "Enregistrer en brouillon"}</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale Édition */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-[#836182]/10 border border-[#836182]/25 flex items-center justify-center text-[#836182]">
                  <PencilLine className="size-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Modifier l&apos;article
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Modifiez le contenu, le lien ou le statut de publication
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingArticle(null)}
                className="size-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-300 text-xs font-medium">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-title" className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  Titre de l&apos;article
                </Label>
                <Input
                  id="edit-title"
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-category" className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                    Catégorie
                  </Label>
                  <select
                    id="edit-category"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as PostCategoryKey)}
                    className="w-full h-9 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 text-xs text-slate-900 dark:text-white"
                  >
                    {(Object.keys(POST_CATEGORIES) as PostCategoryKey[]).map((key) => (
                      <option key={key} value={key}>
                        {POST_CATEGORIES[key].label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-tags" className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                    Tags (séparés par des virgules)
                  </Label>
                  <Input
                    id="edit-tags"
                    type="text"
                    placeholder="ex: Ziguinchor, Jeunesse"
                    value={editTagsInput}
                    onChange={(e) => setEditTagsInput(e.target.value)}
                    className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <ImageUploader
                id="edit-imageUrl"
                label="Image de couverture de l'article"
                value={editImageUrl}
                onChange={(url) => setEditImageUrl(url)}
              />

              <div className="space-y-1.5">
                <Label htmlFor="edit-link" className="text-xs text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1">
                  <LinkIcon className="size-3 text-[#836182]" />
                  Lien externe / URL associée (optionnel)
                </Label>
                <Input
                  id="edit-link"
                  type="url"
                  placeholder="https://exemple.com/..."
                  value={editLink}
                  onChange={(e) => setEditLink(e.target.value)}
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-content" className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  Contenu de l&apos;article
                </Label>
                <Textarea
                  id="edit-content"
                  required
                  rows={6}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-y"
                />
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <input
                  id="edit-published"
                  type="checkbox"
                  checked={editPublished}
                  onChange={(e) => setEditPublished(e.target.checked)}
                  className="size-4 accent-[#836182] cursor-pointer"
                />
                <Label htmlFor="edit-published" className="text-xs text-slate-800 dark:text-slate-200 font-medium cursor-pointer">
                  Article publié (décocher pour remettre en brouillon)
                </Label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingArticle(null)}
                  className="cursor-pointer"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={modalLoading}
                  className="bg-[#836182] hover:bg-[#6f4f6e] text-white cursor-pointer"
                >
                  {modalLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin mr-1.5" />
                      Enregistrement…
                    </>
                  ) : (
                    "Enregistrer les modifications"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale Suppression */}
      {deletingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-red-50 border border-red-200 dark:bg-red-500/15 dark:border-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                <Trash2 className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Supprimer l&apos;article
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Cette action est irréversible dans la base de données.
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              Voulez-vous vraiment supprimer l&apos;article{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                &laquo; {deletingArticle.title} &raquo;
              </span>{" "}
              ?
            </p>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-300 text-xs">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeletingArticle(null)}
                className="cursor-pointer text-xs"
              >
                Annuler
              </Button>
              <Button
                type="button"
                onClick={handleDeletePost}
                disabled={modalLoading}
                className="bg-red-600 hover:bg-red-700 text-white cursor-pointer text-xs"
              >
                {modalLoading ? "Suppression…" : "Supprimer définitivement"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
