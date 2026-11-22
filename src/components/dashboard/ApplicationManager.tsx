"use client";

import { useState } from "react";
import {
  Plus,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Trash2,
  X,
  Loader2,
  Send,
  MapPin,
  Phone,
  MessageSquare,
} from "lucide-react";
import {
  APPLICATION_STATUSES,
  PROGRAM_POLES,
  type AcceentProgramMeta,
  type ApplicationStatusKey,
  type ProgramPoleKey,
} from "@/lib/constants/platform";
import {
  submitApplicationAction,
  withdrawApplicationAction,
} from "@/actions/application";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DocumentUploader } from "@/components/shared/DocumentUploader";
import { submitApplicationSchema } from "@/validation/application";

export interface MemberApplicationItem {
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
  reviewedAt?: string | null;
}

interface ApplicationManagerProps {
  applications: MemberApplicationItem[];
  availablePrograms: AcceentProgramMeta[];
  initialOpenCreate?: boolean;
  initialProgramSlug?: string;
}

export function ApplicationManager({
  applications,
  availablePrograms,
  initialOpenCreate = false,
  initialProgramSlug,
}: ApplicationManagerProps) {
  const hasAvailablePrograms = availablePrograms.length > 0;
  const [isModalOpen, setIsModalOpen] = useState(
    hasAvailablePrograms && initialOpenCreate
  );
  const [programSlug, setProgramSlug] = useState(
    initialProgramSlug && availablePrograms.some((p) => p.slug === initialProgramSlug)
      ? initialProgramSlug
      : (availablePrograms[0]?.slug ?? "")
  );
  const effectiveProgramSlug = availablePrograms.some((p) => p.slug === programSlug)
    ? programSlug
    : (availablePrograms[0]?.slug ?? "");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Ziguinchor");
  const [projectTitle, setProjectTitle] = useState("");
  const [motivation, setMotivation] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");

  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleOpenCreate = () => {
    if (!hasAvailablePrograms) return;
    setErrorMsg(null);
    if (!availablePrograms.some((p) => p.slug === programSlug)) {
      setProgramSlug(availablePrograms[0].slug);
    }
    setPhone("");
    setCity("Ziguinchor");
    setProjectTitle("");
    setMotivation("");
    setDocumentUrl("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!availablePrograms.some((p) => p.slug === effectiveProgramSlug)) {
      setErrorMsg("Aucun programme n'est actuellement ouvert aux candidatures.");
      return;
    }

    const payload = {
      programSlug: effectiveProgramSlug,
      phone,
      city,
      projectTitle: projectTitle || undefined,
      motivation,
      documentUrl: documentUrl || undefined,
    };
    const parsed = submitApplicationSchema.safeParse(payload);
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message || "Veuillez vérifier les champs saisis.");
      return;
    }

    setLoading(true);
    const res = await submitApplicationAction(parsed.data);

    setLoading(false);
    if (res.success) {
      setIsModalOpen(false);
      setSuccessMsg(res.message);
      setTimeout(() => setSuccessMsg(null), 5000);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleWithdraw = async (id: string) => {
    setWithdrawingId(id);
    setErrorMsg(null);
    const res = await withdrawApplicationAction(id);
    setWithdrawingId(null);

    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {successMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-300 text-sm font-medium">
          <CheckCircle2 className="size-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && !isModalOpen && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-300 text-sm font-medium">
          <AlertCircle className="size-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
        <div>
          <h2 className="text-slate-900 dark:text-white font-bold text-base">
            Suivi de vos candidatures ({applications.length})
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Déposez votre candidature aux programmes d&apos;accompagnement d&apos;ACCEENT et suivez son avancement en temps réel.
          </p>
        </div>
        {hasAvailablePrograms ? (
          <Button
            onClick={handleOpenCreate}
            className="bg-[#836182] hover:bg-[#6f4f6e] text-white font-semibold rounded-xl px-4 h-10 shrink-0 cursor-pointer flex items-center gap-2"
          >
            <Plus className="size-4" />
            <span>Nouvelle candidature</span>
          </Button>
        ) : (
          <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold shrink-0">
            Candidatures temporairement fermées
          </span>
        )}
      </div>

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-4 shadow-xs">
          <div className="size-14 rounded-2xl bg-[#836182]/10 border border-[#836182]/25 flex items-center justify-center text-[#836182] mx-auto">
            <FileText className="size-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-slate-900 dark:text-white font-bold text-base">
              Aucune candidature soumise
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
              {hasAvailablePrograms
                ? "Vous n'avez encore déposé aucun dossier pour nos programmes d'accompagnement."
                : "Aucun programme n'est actuellement ouvert aux candidatures."}
            </p>
          </div>
          {hasAvailablePrograms && (
            <Button
              onClick={handleOpenCreate}
              className="bg-[#836182] hover:bg-[#6f4f6e] text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Déposer ma première candidature
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const statusMeta = APPLICATION_STATUSES[app.status];
            const poleMeta = PROGRAM_POLES[app.pole];
            return (
              <div
                key={app.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${poleMeta.badge}`}
                      >
                        {poleMeta.label}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusMeta.badge}`}
                      >
                        {statusMeta.label}
                      </span>
                    </div>
                    <h3 className="text-slate-900 dark:text-white font-bold text-base sm:text-lg">
                      {app.programName}
                      {app.projectTitle && (
                        <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                          {" "}
                          — {app.projectTitle}
                        </span>
                      )}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-xs">
                      {statusMeta.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 shrink-0">
                    <Clock className="size-3.5" />
                    <span>Déposée le {app.createdAt}</span>
                  </div>
                </div>

                <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 whitespace-pre-line">
                  {app.motivation}
                </p>

                {app.adminNotes && (
                  <div className="p-3.5 rounded-xl bg-[#836182]/10 border border-[#836182]/25 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#6d4c6c] dark:text-[#f4e6ea]">
                      <MessageSquare className="size-3.5 text-[#836182]" />
                      <span>Retour de l&apos;équipe ACCEENT {app.reviewedAt ? `(${app.reviewedAt})` : ""}</span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 text-xs leading-relaxed whitespace-pre-line">
                      {app.adminNotes}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Phone className="size-3.5 text-[#836182]" />
                      {app.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5 text-[#836182]" />
                      {app.city}
                    </span>
                    {app.documentUrl && (
                      <a
                        href={app.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#836182] dark:text-[#d8b4d7] hover:underline font-semibold"
                      >
                        <span>Pièce jointe</span>
                        <ExternalLink className="size-3" />
                      </a>
                    )}
                  </div>

                  {app.status === "PENDING" && (
                    <button
                      type="button"
                      disabled={withdrawingId === app.id}
                      onClick={() => handleWithdraw(app.id)}
                      className="inline-flex items-center gap-1.5 text-xs text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 dark:text-red-300 dark:bg-red-500/10 dark:border-red-500/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      {withdrawingId === app.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="size-3.5" />
                      )}
                      <span>Retirer la candidature</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && hasAvailablePrograms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Postuler à un programme
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Complétez votre dossier pour rejoindre la prochaine cohorte ACCEENT
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
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
                <Label htmlFor="app-program" className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  Programme visé <span className="text-red-500">*</span>
                </Label>
                <select
                  id="app-program"
                  value={effectiveProgramSlug}
                  onChange={(e) => setProgramSlug(e.target.value)}
                  className="w-full h-10 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 text-xs text-slate-900 dark:text-white"
                >
                  {availablePrograms.map((prog) => (
                    <option key={prog.slug} value={prog.slug}>
                      {prog.name} ({PROGRAM_POLES[prog.pole].label})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="app-phone" className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                    Téléphone (WhatsApp) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="app-phone"
                    type="tel"
                    required
                    placeholder="+221 77 000 00 00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="app-city" className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                    Ville / Quartier <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="app-city"
                    type="text"
                    required
                    placeholder="Ziguinchor"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="app-project" className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  Nom du projet ou niveau scolaire (optionnel)
                </Label>
                <Input
                  id="app-project"
                  type="text"
                  placeholder="ex: Plateforme AgroTech Casamance / Terminale S2"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="app-motivation" className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  Présentation et motivation <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="app-motivation"
                  required
                  rows={5}
                  placeholder="Décrivez votre parcours, vos objectifs ou votre idée de projet (minimum 20 caractères)…"
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                />
              </div>

              <DocumentUploader
                id="app-document"
                label="CV, dossier de projet ou relevé (PDF/Word - optionnel)"
                folder="applications"
                value={documentUrl}
                onChange={(url) => setDocumentUrl(url)}
                placeholder="Ou lien Google Drive / PDF de votre dossier…"
              />

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#836182] hover:bg-[#6f4f6e] text-white cursor-pointer flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Envoi en cours…</span>
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      <span>Soumettre ma candidature</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
