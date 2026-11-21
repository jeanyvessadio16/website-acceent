"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  BookOpen,
  PencilLine,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Globe,
  GlobeOff,
} from "lucide-react";
import {
  PROGRAM_POLES,
  RESOURCE_TYPES,
  type ProgramPoleKey,
  type ResourceTypeKey,
} from "@/lib/constants/platform";
import {
  createResourceAction,
  updateResourceAction,
  deleteResourceAction,
  togglePublishResourceAction,
} from "@/actions/resource";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DocumentUploader } from "@/components/shared/DocumentUploader";
import { createResourceSchema, updateResourceSchema } from "@/validation/resource";

export interface AdminResourceItem {
  id: string;
  title: string;
  description: string;
  pole: ProgramPoleKey;
  programTag: string | null;
  type: ResourceTypeKey;
  fileUrl: string;
  fileSize: string | null;
  published: boolean;
  downloadCount: number;
  createdById: string;
  authorName: string;
  createdAt: string;
}

interface ResourceAdminListProps {
  resources: AdminResourceItem[];
  currentUserId: string;
  currentUserRole: string;
  initialOpenCreate?: boolean;
}

export function ResourceAdminList({
  resources,
  currentUserId,
  currentUserRole,
  initialOpenCreate = false,
}: ResourceAdminListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [poleFilter, setPoleFilter] = useState<"ALL" | ProgramPoleKey>("ALL");

  const [isCreateOpen, setIsCreateOpen] = useState(initialOpenCreate);
  const [editingRes, setEditingRes] = useState<AdminResourceItem | null>(null);
  const [deletingRes, setDeletingRes] = useState<AdminResourceItem | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pole, setPole] = useState<ProgramPoleKey>("EDUCATION");
  const [programTag, setProgramTag] = useState("");
  const [type, setType] = useState<ResourceTypeKey>("PDF");
  const [fileUrl, setFileUrl] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [published, setPublished] = useState(true);

  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const canManage = (r: AdminResourceItem) =>
    currentUserRole === "ADMIN" || r.createdById === currentUserId;

  const filtered = resources.filter((r) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      (r.programTag || "").toLowerCase().includes(q);
    const matchesPole = poleFilter === "ALL" || r.pole === poleFilter;
    return matchesSearch && matchesPole;
  });

  const openCreate = () => {
    setTitle("");
    setDescription("");
    setPole("EDUCATION");
    setProgramTag("");
    setType("PDF");
    setFileUrl("");
    setFileSize("");
    setPublished(true);
    setErrorMsg(null);
    setIsCreateOpen(true);
  };

  const openEdit = (r: AdminResourceItem) => {
    setEditingRes(r);
    setTitle(r.title);
    setDescription(r.description);
    setPole(r.pole);
    setProgramTag(r.programTag || "");
    setType(r.type);
    setFileUrl(r.fileUrl);
    setFileSize(r.fileSize || "");
    setPublished(r.published);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const payload = {
      title,
      description,
      pole,
      programTag: programTag.trim() || undefined,
      type,
      fileUrl,
      fileSize: fileSize.trim() || undefined,
      published,
    };

    const parsed = editingRes
      ? updateResourceSchema.safeParse(payload)
      : createResourceSchema.safeParse(payload);

    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message || "Veuillez vérifier les champs saisis.");
      return;
    }

    setLoading(true);
    const res = editingRes
      ? await updateResourceAction(editingRes.id, parsed.data)
      : await createResourceAction(parsed.data as Parameters<typeof createResourceAction>[0]);

    setLoading(false);
    if (res.success) {
      setIsCreateOpen(false);
      setEditingRes(null);
      setSuccessMsg(res.message);
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleToggle = async (r: AdminResourceItem) => {
    setTogglingId(r.id);
    const res = await togglePublishResourceAction(r.id);
    setTogglingId(null);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleDelete = async () => {
    if (!deletingRes) return;
    setLoading(true);
    const res = await deleteResourceAction(deletingRes.id);
    setLoading(false);
    if (res.success) {
      setDeletingRes(null);
      setSuccessMsg(res.message);
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {successMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-300 text-sm font-medium">
          <CheckCircle2 className="size-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 shadow-2xs">
          <Search className="size-4 text-slate-400 shrink-0" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une ressource ou un programme…"
            className="bg-transparent text-slate-900 dark:text-white text-sm placeholder:text-slate-400 outline-none flex-1"
          />
        </div>

        <select
          value={poleFilter}
          onChange={(e) => setPoleFilter(e.target.value as "ALL" | ProgramPoleKey)}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none shadow-2xs"
        >
          <option value="ALL">Tous les pôles</option>
          {(Object.keys(PROGRAM_POLES) as ProgramPoleKey[]).map((key) => (
            <option key={key} value={key}>
              {PROGRAM_POLES[key].label}
            </option>
          ))}
        </select>

        <Button
          onClick={openCreate}
          className="bg-[#836182] hover:bg-[#6f4f6e] text-white font-semibold rounded-xl px-4 h-10 cursor-pointer flex items-center gap-2"
        >
          <Plus className="size-4" />
          <span>Ajouter une ressource</span>
        </Button>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 shadow-xs">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-slate-500 dark:text-slate-400 text-sm">
            Aucune ressource pédagogique enregistrée.
          </div>
        ) : (
          filtered.map((r) => {
            const manageable = canManage(r);
            return (
              <div
                key={r.id}
                className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <BookOpen className="size-4 text-[#836182] shrink-0" />
                    <h3 className="text-slate-900 dark:text-white font-bold text-sm">{r.title}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${PROGRAM_POLES[r.pole].badge}`}
                    >
                      {PROGRAM_POLES[r.pole].label}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${RESOURCE_TYPES[r.type].badge}`}
                    >
                      {RESOURCE_TYPES[r.type].label}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        r.published
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30"
                          : "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30"
                      }`}
                    >
                      {r.published ? "Visible" : "Masquée"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Par {r.authorName}
                    {r.programTag ? ` • ${r.programTag}` : ""}
                    {r.fileSize ? ` • ${r.fileSize}` : ""} • {r.downloadCount} consultation(s)
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={r.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-8 rounded-lg flex items-center justify-center text-[#836182] hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Ouvrir le document"
                  >
                    <ExternalLink className="size-4" />
                  </a>

                  {manageable ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleToggle(r)}
                        disabled={togglingId === r.id}
                        className="size-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        title={r.published ? "Masquer" : "Rendre visible"}
                      >
                        {r.published ? (
                          <Globe className="size-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <GlobeOff className="size-4 text-amber-600 dark:text-amber-400" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => openEdit(r)}
                        className="size-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        title="Modifier"
                      >
                        <PencilLine className="size-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeletingRes(r)}
                        className="size-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="size-4" />
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

      {/* Modale Création / Édition */}
      {(isCreateOpen || editingRes) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingRes ? "Modifier la ressource" : "Ajouter une ressource pédagogique"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsCreateOpen(false);
                  setEditingRes(null);
                }}
                className="size-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-300 text-xs">
                <AlertCircle className="size-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  Titre de la ressource *
                </Label>
                <Input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ex: Guide du Business Model Canvas — ACCEENT Incub"
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Pôle *</Label>
                  <select
                    value={pole}
                    onChange={(e) => setPole(e.target.value as ProgramPoleKey)}
                    className="w-full h-9 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 text-xs text-slate-900 dark:text-white"
                  >
                    {(Object.keys(PROGRAM_POLES) as ProgramPoleKey[]).map((key) => (
                      <option key={key} value={key}>
                        {PROGRAM_POLES[key].label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Format *</Label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ResourceTypeKey)}
                    className="w-full h-9 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 text-xs text-slate-900 dark:text-white"
                  >
                    {(Object.keys(RESOURCE_TYPES) as ResourceTypeKey[]).map((key) => (
                      <option key={key} value={key}>
                        {RESOURCE_TYPES[key].label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Programme (optionnel)</Label>
                  <Input
                    placeholder="ex: Tut-Tank / AI4Good"
                    value={programTag}
                    onChange={(e) => setProgramTag(e.target.value)}
                    className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <DocumentUploader
                id="res-file"
                label="Document ou lien cible *"
                folder="resources"
                required
                value={fileUrl}
                onChange={(url, detectedSize) => {
                  setFileUrl(url);
                  if (detectedSize && !fileSize) setFileSize(detectedSize);
                }}
              />

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  Taille / Durée affichée (optionnel)
                </Label>
                <Input
                  placeholder="ex: 2.4 Mo / 15 min"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  Description pédagogique *
                </Label>
                <Textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <input
                  id="res-published"
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="size-4 accent-[#836182] cursor-pointer"
                />
                <Label htmlFor="res-published" className="text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                  Visible par les membres connectés
                </Label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingRes(null);
                  }}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#836182] hover:bg-[#6f4f6e] text-white cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : editingRes ? (
                    "Enregistrer"
                  ) : (
                    "Publier la ressource"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingRes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Supprimer la ressource
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Confirmez-vous la suppression de{" "}
              <strong className="text-slate-900 dark:text-white">{deletingRes.title}</strong> ?
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeletingRes(null)} className="text-xs">
                Annuler
              </Button>
              <Button
                onClick={handleDelete}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white text-xs"
              >
                {loading ? "Suppression…" : "Supprimer"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
