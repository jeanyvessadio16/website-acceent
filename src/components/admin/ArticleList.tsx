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
  Image as ImageIcon,
  Send,
  Sparkles,
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

export interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  content?: string;
  imageUrl?: string;
  published: boolean;
  authorName: string;
  createdAt: string;
}

interface ArticleListProps {
  articles: ArticleItem[];
}

export function ArticleList({ articles }: ArticleListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  // ── Modale de création d'article ─────────────────────────────────────────
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createSlug, setCreateSlug] = useState("");
  const [createContent, setCreateContent] = useState("");
  const [createImageUrl, setCreateImageUrl] = useState("");
  const [createPublished, setCreatePublished] = useState(true);

  // ── Modale d'édition d'article ───────────────────────────────────────────
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editPublished, setEditPublished] = useState(false);

  // ── Modale de suppression d'article ─────────────────────────────────────
  const [deletingArticle, setDeletingArticle] = useState<ArticleItem | null>(null);

  // ── États globaux d'action & messages ────────────────────────────────────
  const [loadingId, setLoadingId] = useState<string | null>(null); // Pour la publication rapide par ligne
  const [modalLoading, setModalLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // ── Filtrage ──────────────────────────────────────────────────────────────
  const filteredArticles = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      a.authorName.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      a.slug.toLowerCase().includes(searchTerm.toLowerCase().trim());

    if (statusFilter === "published") return matchesSearch && a.published;
    if (statusFilter === "draft") return matchesSearch && !a.published;
    return matchesSearch;
  });

  // ── Action : Publier / Dépublier un article directement depuis la liste ───
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

  // ── Ouverture modale Création ────────────────────────────────────────────
  const handleOpenCreate = () => {
    setCreateTitle("");
    setCreateSlug("");
    setCreateContent("");
    setCreateImageUrl("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80");
    setCreatePublished(true);
    setErrorMsg(null);
    setIsCreateOpen(true);
  };

  // ── Soumission Création ───────────────────────────────────────────────────
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setErrorMsg(null);

    const res = await createPostAction({
      title: createTitle,
      slug: createSlug.trim() || undefined,
      content: createContent,
      imageUrl: createImageUrl || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
      published: createPublished,
    });

    setModalLoading(false);
    if (res.success) {
      setIsCreateOpen(false);
      setSuccessMsg(res.message);
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setErrorMsg(res.message);
    }
  };

  // ── Ouverture modale Édition ─────────────────────────────────────────────
  const handleOpenEdit = (article: ArticleItem) => {
    setEditingArticle(article);
    setEditTitle(article.title);
    setEditSlug(article.slug);
    setEditContent(article.content || "");
    setEditImageUrl(article.imageUrl || "");
    setEditPublished(article.published);
    setErrorMsg(null);
  };

  // ── Soumission Édition ────────────────────────────────────────────────────
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    setModalLoading(true);
    setErrorMsg(null);

    const res = await updatePostAction(editingArticle.id, {
      title: editTitle,
      slug: editSlug,
      content: editContent,
      imageUrl: editImageUrl,
      published: editPublished,
    });

    setModalLoading(false);
    if (res.success) {
      setEditingArticle(null);
      setSuccessMsg(res.message);
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setErrorMsg(res.message);
    }
  };

  // ── Soumission Suppression ────────────────────────────────────────────────
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
    <div className="space-y-5 max-w-5xl">
      {/* Messages de feedback global */}
      {successMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium animate-in fade-in duration-200">
          <CheckCircle2 className="size-5 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && !isCreateOpen && !editingArticle && !deletingArticle && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm font-medium animate-in fade-in duration-200">
          <AlertCircle className="size-5 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Barre d'action et filtres */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Recherche & Filtres */}
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Champ de recherche */}
          <div className="flex-1 flex items-center gap-2 bg-[#12131a] border border-white/[0.08] rounded-xl px-3.5 py-2.5 focus-within:border-white/[0.2] transition-colors">
            <Search className="size-4 text-zinc-500 shrink-0" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par titre, auteur ou slug…"
              className="bg-transparent text-zinc-100 text-sm placeholder:text-zinc-500 outline-none flex-1 font-normal"
            />
          </div>

          {/* Filtres de statut */}
          <div className="flex items-center gap-1 bg-[#12131a] p-1 rounded-xl border border-white/[0.08] shrink-0">
            {(
              [
                { id: "all", label: "Tous" },
                { id: "published", label: "Publiés" },
                { id: "draft", label: "Brouillons" },
              ] as const
            ).map((filter) => (
              <button
                key={filter.id}
                onClick={() => setStatusFilter(filter.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  statusFilter === filter.id
                    ? "bg-[#836182] text-white shadow-xs"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bouton Publier un article */}
        <Button
          onClick={handleOpenCreate}
          className="bg-gradient-to-r from-[#836182] to-[#6d4c6c] hover:from-[#957094] hover:to-[#7e597d] text-white font-medium shadow-md shadow-[#836182]/20 rounded-xl px-4 py-2.5 shrink-0 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Publier un article</span>
        </Button>
      </div>

      {/* Table des articles */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#12131a] overflow-hidden shadow-sm">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/[0.06] text-zinc-500 text-[11px] font-semibold uppercase tracking-wider">
          <span>Titre & Auteur</span>
          <span>Statut</span>
          <span>Date</span>
          <span>Actions</span>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {filteredArticles.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-sm">
              Aucun article ne correspond à votre recherche dans la base de données.
            </div>
          ) : (
            filteredArticles.map((a) => {
              const isToggling = loadingId === a.id;

              return (
                <div
                  key={a.id}
                  className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-5 py-3.5 hover:bg-white/[0.02] transition-colors group"
                >
                  {/* Titre & Auteur */}
                  <div className="min-w-0">
                    <p className="text-zinc-200 text-sm font-medium truncate group-hover:text-white transition-colors flex items-center gap-2">
                      <FileText className="size-3.5 text-[#b9939e] shrink-0" />
                      <span className="truncate">{a.title}</span>
                    </p>
                    <p className="text-zinc-500 text-xs mt-0.5 flex items-center gap-2 truncate">
                      <span className="flex items-center gap-1">
                        <UserCheck className="size-3 text-zinc-400" />
                        Par {a.authorName}
                      </span>
                      <span className="text-zinc-700">•</span>
                      <span className="font-mono text-[11px] text-zinc-600 truncate">/{a.slug}</span>
                    </p>
                  </div>

                  {/* Statut avec bouton interactif rapide de publication */}
                  <button
                    onClick={() => handleTogglePublish(a)}
                    disabled={isToggling}
                    title={a.published ? "Cliquer pour passer en brouillon" : "Cliquer pour publier immédiatement"}
                    className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50 ${
                      a.published
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/30"
                    }`}
                  >
                    {isToggling ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : a.published ? (
                      <Globe className="size-3 text-emerald-400" />
                    ) : (
                      <GlobeOff className="size-3 text-amber-400" />
                    )}
                    <span>{a.published ? "Publié" : "Brouillon"}</span>
                  </button>

                  {/* Date */}
                  <span className="text-zinc-500 text-xs shrink-0 flex items-center gap-1">
                    <Calendar className="size-3" />
                    {a.createdAt}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {/* Bouton Basculer Publication */}
                    <button
                      onClick={() => handleTogglePublish(a)}
                      disabled={isToggling}
                      title={a.published ? "Dépublier (remettre en brouillon)" : "Publier l'article"}
                      className={`size-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                        a.published
                          ? "text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10"
                          : "text-[#b9939e] hover:text-emerald-400 hover:bg-emerald-500/10"
                      }`}
                    >
                      {isToggling ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : a.published ? (
                        <GlobeOff className="size-3.5" />
                      ) : (
                        <Send className="size-3.5" />
                      )}
                    </button>

                    {/* Éditer */}
                    <button
                      onClick={() => handleOpenEdit(a)}
                      title="Éditer l'article"
                      className="size-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06] transition-colors cursor-pointer"
                    >
                      <PencilLine className="size-3.5" />
                    </button>

                    {/* Supprimer */}
                    <button
                      onClick={() => setDeletingArticle(a)}
                      title="Supprimer l'article"
                      className="size-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── MODALE CRÉATION / PUBLICATION D'ARTICLE ────────────────────────────── */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/[0.1] bg-[#12131a] p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header modale */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-[#836182]/20 border border-[#836182]/30 flex items-center justify-center text-[#b9939e]">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-100">Publier un nouvel article</h3>
                  <p className="text-xs text-zinc-400">Renseignez les détails pour publier directement dans le blog ACCEENT</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="size-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Alerte erreur */}
            {errorMsg && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-medium">
                <AlertCircle className="size-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleCreatePost} className="space-y-4">
              {/* Titre */}
              <div className="space-y-1.5">
                <Label htmlFor="create-title" className="text-xs text-zinc-300 font-medium">
                  Titre de l'article <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="create-title"
                  type="text"
                  required
                  placeholder="ex: Lancement du programme Éducation Numérique 2026"
                  value={createTitle}
                  onChange={(e) => setCreateTitle(e.target.value)}
                  className="bg-white/[0.03] border-white/[0.1] text-zinc-100 placeholder:text-zinc-600 focus:border-[#836182]"
                />
              </div>

              {/* Slug & Image URL (2 colonnes) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="create-slug" className="text-xs text-zinc-300 font-medium">
                    Slug (URL personnalisée - optionnel)
                  </Label>
                  <Input
                    id="create-slug"
                    type="text"
                    placeholder="lancement-education-numerique"
                    value={createSlug}
                    onChange={(e) => setCreateSlug(e.target.value)}
                    className="bg-white/[0.03] border-white/[0.1] text-zinc-100 placeholder:text-zinc-600 focus:border-[#836182]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="create-imageUrl" className="text-xs text-zinc-300 font-medium flex items-center gap-1">
                    <ImageIcon className="size-3 text-[#b9939e]" />
                    URL de l'image de couverture
                  </Label>
                  <Input
                    id="create-imageUrl"
                    type="text"
                    required
                    placeholder="https://..."
                    value={createImageUrl}
                    onChange={(e) => setCreateImageUrl(e.target.value)}
                    className="bg-white/[0.03] border-white/[0.1] text-zinc-100 placeholder:text-zinc-600 focus:border-[#836182]"
                  />
                </div>
              </div>

              {/* Contenu */}
              <div className="space-y-1.5">
                <Label htmlFor="create-content" className="text-xs text-zinc-300 font-medium">
                  Contenu de l'article <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="create-content"
                  required
                  rows={6}
                  placeholder="Rédigez ici le contenu de votre article…"
                  value={createContent}
                  onChange={(e) => setCreateContent(e.target.value)}
                  className="bg-white/[0.03] border-white/[0.1] text-zinc-100 placeholder:text-zinc-600 focus:border-[#836182] resize-y"
                />
              </div>

              {/* Statut de publication */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <input
                  id="create-published"
                  type="checkbox"
                  checked={createPublished}
                  onChange={(e) => setCreatePublished(e.target.checked)}
                  className="size-4 rounded border-white/[0.2] bg-white/[0.05] text-[#836182] focus:ring-[#836182] accent-[#836182] cursor-pointer"
                />
                <Label htmlFor="create-published" className="text-xs text-zinc-200 font-medium cursor-pointer">
                  Publier l'article immédiatement (visible publiquement)
                </Label>
              </div>

              {/* Footer actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  className="border-white/[0.1] bg-transparent text-zinc-300 hover:bg-white/[0.04] cursor-pointer"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={modalLoading}
                  className="bg-[#836182] hover:bg-[#957094] text-white cursor-pointer flex items-center gap-2"
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

      {/* ── MODALE ÉDITION D'ARTICLE ───────────────────────────────────────────── */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/[0.1] bg-[#12131a] p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Header modale */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-[#836182]/20 border border-[#836182]/30 flex items-center justify-center text-[#b9939e]">
                  <PencilLine className="size-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-100">Modifier l'article</h3>
                  <p className="text-xs text-zinc-400">Modifiez le contenu ou le statut de publication</p>
                </div>
              </div>
              <button
                onClick={() => setEditingArticle(null)}
                className="size-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Alerte erreur */}
            {errorMsg && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-medium">
                <AlertCircle className="size-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="edit-title" className="text-xs text-zinc-300 font-medium">
                  Titre de l'article
                </Label>
                <Input
                  id="edit-title"
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="bg-white/[0.03] border-white/[0.1] text-zinc-100 placeholder:text-zinc-600 focus:border-[#836182]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-slug" className="text-xs text-zinc-300 font-medium">
                    Slug
                  </Label>
                  <Input
                    id="edit-slug"
                    type="text"
                    value={editSlug}
                    onChange={(e) => setEditSlug(e.target.value)}
                    className="bg-white/[0.03] border-white/[0.1] text-zinc-100 placeholder:text-zinc-600 focus:border-[#836182]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-imageUrl" className="text-xs text-zinc-300 font-medium">
                    URL de l'image
                  </Label>
                  <Input
                    id="edit-imageUrl"
                    type="text"
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    className="bg-white/[0.03] border-white/[0.1] text-zinc-100 placeholder:text-zinc-600 focus:border-[#836182]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="edit-content" className="text-xs text-zinc-300 font-medium">
                  Contenu de l'article
                </Label>
                <Textarea
                  id="edit-content"
                  required
                  rows={6}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="bg-white/[0.03] border-white/[0.1] text-zinc-100 placeholder:text-zinc-600 focus:border-[#836182] resize-y"
                />
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <input
                  id="edit-published"
                  type="checkbox"
                  checked={editPublished}
                  onChange={(e) => setEditPublished(e.target.checked)}
                  className="size-4 rounded border-white/[0.2] bg-white/[0.05] text-[#836182] focus:ring-[#836182] accent-[#836182] cursor-pointer"
                />
                <Label htmlFor="edit-published" className="text-xs text-zinc-200 font-medium cursor-pointer">
                  Article publié (décocher pour remettre en brouillon)
                </Label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingArticle(null)}
                  className="border-white/[0.1] bg-transparent text-zinc-300 hover:bg-white/[0.04] cursor-pointer"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={modalLoading}
                  className="bg-[#836182] hover:bg-[#957094] text-white cursor-pointer flex items-center gap-2"
                >
                  {modalLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Enregistrement…</span>
                    </>
                  ) : (
                    <span>Enregistrer les modifications</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODALE SUPPRESSION D'ARTICLE ───────────────────────────────────────── */}
      {deletingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-white/[0.1] bg-[#12131a] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-red-500/15 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                <Trash2 className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-100">Supprimer l'article</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Cette action est irréversible dans la base de données.</p>
              </div>
            </div>

            <p className="text-sm text-zinc-300 bg-white/[0.02] p-3 rounded-xl border border-white/[0.06]">
              Voulez-vous vraiment supprimer l'article <span className="font-semibold text-white">"{deletingArticle.title}"</span> ?
            </p>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                <AlertCircle className="size-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeletingArticle(null)}
                className="border-white/[0.1] bg-transparent text-zinc-300 hover:bg-white/[0.04] cursor-pointer text-xs"
              >
                Annuler
              </Button>
              <Button
                type="button"
                onClick={handleDeletePost}
                disabled={modalLoading}
                className="bg-red-600 hover:bg-red-700 text-white cursor-pointer text-xs flex items-center gap-1.5"
              >
                {modalLoading ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Suppression…</span>
                  </>
                ) : (
                  <span>Supprimer définitivement</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
