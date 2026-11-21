"use client";

import { useState } from "react";
import {
  Search,
  ClipboardCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Trash2,
  X,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Eye,
  FileSpreadsheet,
} from "lucide-react";
import {
  APPLICATION_STATUSES,
  PROGRAM_POLES,
  type ApplicationStatusKey,
  type ProgramPoleKey,
} from "@/lib/constants/platform";
import {
  updateApplicationStatusAction,
  deleteApplicationAction,
} from "@/actions/application";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateApplicationStatusSchema } from "@/validation/application";

export interface AdminApplicationItem {
  id: string;
  programSlug: string;
  programName: string;
  pole: ProgramPoleKey;
  phone: string;
  city: string;
  projectTitle?: string | null;
  motivation: string;
  documentUrl?: string | null;
  status: ApplicationStatusKey;
  adminNotes?: string | null;
  createdAt: string;
  applicantName: string;
  applicantEmail: string;
}

interface ApplicationAdminListProps {
  applications: AdminApplicationItem[];
}

export function ApplicationAdminList({ applications }: ApplicationAdminListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | ApplicationStatusKey>("ALL");
  const [poleFilter, setPoleFilter] = useState<"ALL" | ProgramPoleKey>("ALL");

  const [reviewingApp, setReviewingApp] = useState<AdminApplicationItem | null>(null);
  const [editStatus, setEditStatus] = useState<ApplicationStatusKey>("PENDING");
  const [editNotes, setEditNotes] = useState("");
  const [notifyCandidate, setNotifyCandidate] = useState(true);

  const [deletingApp, setDeletingApp] = useState<AdminApplicationItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const filtered = applications.filter((a) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      a.applicantName.toLowerCase().includes(q) ||
      a.applicantEmail.toLowerCase().includes(q) ||
      a.programName.toLowerCase().includes(q) ||
      (a.projectTitle || "").toLowerCase().includes(q);
    const matchesStatus = statusFilter === "ALL" || a.status === statusFilter;
    const matchesPole = poleFilter === "ALL" || a.pole === poleFilter;
    return matchesSearch && matchesStatus && matchesPole;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "PENDING" || a.status === "REVIEWING").length,
    interview: applications.filter((a) => a.status === "INTERVIEW").length,
    accepted: applications.filter((a) => a.status === "ACCEPTED").length,
  };

  const openReview = (app: AdminApplicationItem) => {
    setReviewingApp(app);
    setEditStatus(app.status);
    setEditNotes(app.adminNotes || "");
    setNotifyCandidate(true);
    setErrorMsg(null);
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingApp) return;
    setErrorMsg(null);

    const payload = {
      status: editStatus,
      adminNotes: editNotes,
      notifyCandidate,
    };
    const parsed = updateApplicationStatusSchema.safeParse(payload);
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message || "Veuillez vérifier les champs saisis.");
      return;
    }

    setLoading(true);
    const res = await updateApplicationStatusAction(reviewingApp.id, parsed.data);

    setLoading(false);
    if (res.success) {
      setReviewingApp(null);
      setSuccessMsg(res.message);
      setTimeout(() => setSuccessMsg(null), 5000);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleDelete = async () => {
    if (!deletingApp) return;
    setLoading(true);
    const res = await deleteApplicationAction(deletingApp.id);
    setLoading(false);
    if (res.success) {
      setDeletingApp(null);
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

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total dossiers", value: stats.total, color: "text-slate-900 dark:text-white" },
          { label: "À traiter / En étude", value: stats.pending, color: "text-amber-700 dark:text-amber-300" },
          { label: "Entretiens prévus", value: stats.interview, color: "text-purple-700 dark:text-purple-300" },
          { label: "Candidatures validées", value: stats.accepted, color: "text-emerald-700 dark:text-emerald-300" },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xs"
          >
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{k.label}</p>
            <p className={`text-2xl font-black mt-1 tabular-nums ${k.color}`}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Filtres & Export */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 shadow-2xs">
          <Search className="size-4 text-slate-400 shrink-0" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un candidat, e-mail, programme ou projet…"
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

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "ALL" | ApplicationStatusKey)}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none shadow-2xs"
        >
          <option value="ALL">Tous les statuts</option>
          {(Object.keys(APPLICATION_STATUSES) as ApplicationStatusKey[]).map((key) => (
            <option key={key} value={key}>
              {APPLICATION_STATUSES[key].label}
            </option>
          ))}
        </select>

        <a
          href="/api/admin/export/excel?type=applications"
          download
          className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-xs font-bold shadow-2xs shrink-0"
        >
          <FileSpreadsheet className="size-4" />
          <span>Excel (.xlsx)</span>
        </a>
      </div>

      {/* Table des candidatures */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.length === 0 ? (
            <div className="p-10 text-center text-slate-500 dark:text-slate-400 text-sm">
              Aucune candidature ne correspond aux filtres actuels.
            </div>
          ) : (
            filtered.map((app) => {
              const statusMeta = APPLICATION_STATUSES[app.status];
              const poleMeta = PROGRAM_POLES[app.pole];
              return (
                <div
                  key={app.id}
                  className="p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-slate-900 dark:text-white font-bold text-sm">
                        {app.applicantName}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {app.applicantEmail}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${poleMeta.badge}`}
                      >
                        {poleMeta.label}
                      </span>
                    </div>

                    <p className="text-xs text-[#6d4c6c] dark:text-[#d8b4d7] font-semibold">
                      {app.programName}
                      {app.projectTitle && (
                        <span className="text-slate-600 dark:text-slate-400 font-normal">
                          {" "}
                          — {app.projectTitle}
                        </span>
                      )}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Phone className="size-3" /> {app.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" /> {app.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" /> {app.createdAt}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusMeta.badge}`}
                    >
                      {statusMeta.label}
                    </span>

                    <Button
                      size="sm"
                      onClick={() => openReview(app)}
                      className="bg-[#836182] hover:bg-[#6f4f6e] text-white text-xs font-semibold rounded-xl cursor-pointer flex items-center gap-1.5"
                    >
                      <Eye className="size-3.5" />
                      <span>Examiner</span>
                    </Button>

                    <button
                      type="button"
                      onClick={() => setDeletingApp(app)}
                      title="Supprimer ce dossier"
                      className="size-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer"
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

      {/* Modale d'examen */}
      {reviewingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-[#836182]/10 border border-[#836182]/25 flex items-center justify-center text-[#836182]">
                  <ClipboardCheck className="size-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {reviewingApp.applicantName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Candidature à {reviewingApp.programName}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReviewingApp(null)}
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">E-mail</span>
                <span className="text-slate-900 dark:text-white font-semibold break-all">
                  {reviewingApp.applicantEmail}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Téléphone</span>
                <span className="text-slate-900 dark:text-white font-semibold">{reviewingApp.phone}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Ville</span>
                <span className="text-slate-900 dark:text-white font-semibold">{reviewingApp.city}</span>
              </div>
            </div>

            {reviewingApp.projectTitle && (
              <div className="text-xs space-y-1">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">Intitulé / Niveau :</span>
                <p className="text-slate-900 dark:text-white font-bold">{reviewingApp.projectTitle}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Motivation du candidat :
              </span>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                {reviewingApp.motivation}
              </div>
            </div>

            {reviewingApp.documentUrl && (
              <a
                href={reviewingApp.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
              >
                <ExternalLink className="size-3.5 text-[#836182]" />
                <span>Consulter la pièce jointe du candidat</span>
              </a>
            )}

            <form onSubmit={handleSaveReview} className="space-y-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="space-y-1.5">
                <Label htmlFor="review-status" className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  Décision / Statut du dossier
                </Label>
                <select
                  id="review-status"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as ApplicationStatusKey)}
                  className="w-full h-10 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 text-xs text-slate-900 dark:text-white"
                >
                  {(Object.keys(APPLICATION_STATUSES) as ApplicationStatusKey[]).map((key) => (
                    <option key={key} value={key}>
                      {APPLICATION_STATUSES[key].label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="review-notes" className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  Message / Commentaire destiné au candidat (optionnel)
                </Label>
                <Textarea
                  id="review-notes"
                  rows={3}
                  placeholder="ex: Rendez-vous le mardi à 10h dans nos locaux à Santhiaba…"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <input
                  id="review-notify"
                  type="checkbox"
                  checked={notifyCandidate}
                  onChange={(e) => setNotifyCandidate(e.target.checked)}
                  className="size-4 accent-[#836182] cursor-pointer"
                />
                <Label htmlFor="review-notify" className="text-xs text-slate-800 dark:text-slate-200 cursor-pointer flex items-center gap-1.5">
                  <Mail className="size-3.5 text-[#836182]" />
                  <span>Notifier le candidat par e-mail de cette mise à jour</span>
                </Label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setReviewingApp(null)}>
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#836182] hover:bg-[#6f4f6e] text-white cursor-pointer"
                >
                  {loading ? <Loader2 className="size-4 animate-spin" /> : "Enregistrer la décision"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale suppression */}
      {deletingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Supprimer la candidature
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Confirmez-vous la suppression définitive du dossier de{" "}
              <strong className="text-slate-900 dark:text-white">{deletingApp.applicantName}</strong> ({deletingApp.programName}) ?
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeletingApp(null)} className="text-xs">
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
