"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Calendar,
  MapPin,
  Users,
  PencilLine,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Download,
  Globe,
  GlobeOff,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { PROGRAM_POLES, type ProgramPoleKey } from "@/lib/constants/platform";
import {
  createEventAction,
  updateEventAction,
  deleteEventAction,
  togglePublishEventAction,
  toggleAttendanceAction,
} from "@/actions/event";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { createEventSchema, updateEventSchema } from "@/validation/event";

export interface EventAttendeeItem {
  id: string;
  ticketCode: string;
  name: string;
  email: string;
  phone: string | null;
  attended: boolean;
  createdAt: string;
}

export interface AdminEventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  pole: ProgramPoleKey | null;
  location: string;
  isOnline: boolean;
  meetingUrl: string | null;
  imageUrl: string | null;
  startDateInput: string;
  endDateInput: string;
  startDateFormatted: string;
  capacity: number | null;
  published: boolean;
  createdById: string;
  registrations: EventAttendeeItem[];
}

interface EventAdminListProps {
  events: AdminEventItem[];
  currentUserId: string;
  currentUserRole: string;
  initialOpenCreate?: boolean;
}

export function EventAdminList({
  events,
  currentUserId,
  currentUserRole,
  initialOpenCreate = false,
}: EventAdminListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(initialOpenCreate);
  const [editingEvent, setEditingEvent] = useState<AdminEventItem | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<AdminEventItem | null>(null);
  const [attendeesEvent, setAttendeesEvent] = useState<AdminEventItem | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pole, setPole] = useState<"" | ProgramPoleKey>("");
  const [location, setLocation] = useState("Ziguinchor (Quartier Santhiaba)");
  const [isOnline, setIsOnline] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [capacityStr, setCapacityStr] = useState("");
  const [published, setPublished] = useState(true);

  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const canManage = (ev: AdminEventItem) =>
    currentUserRole === "ADMIN" || ev.createdById === currentUserId;

  const filtered = events.filter((e) => {
    const q = searchTerm.toLowerCase().trim();
    return (
      !q ||
      e.title.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q)
    );
  });

  const openCreate = () => {
    setTitle("");
    setDescription("");
    setPole("");
    setLocation("Ziguinchor (Quartier Santhiaba)");
    setIsOnline(false);
    setMeetingUrl("");
    setImageUrl("");
    setStartDate("");
    setEndDate("");
    setCapacityStr("");
    setPublished(true);
    setErrorMsg(null);
    setIsCreateOpen(true);
  };

  const openEdit = (ev: AdminEventItem) => {
    setEditingEvent(ev);
    setTitle(ev.title);
    setDescription(ev.description);
    setPole(ev.pole || "");
    setLocation(ev.location);
    setIsOnline(ev.isOnline);
    setMeetingUrl(ev.meetingUrl || "");
    setImageUrl(ev.imageUrl || "");
    setStartDate(ev.startDateInput);
    setEndDate(ev.endDateInput);
    setCapacityStr(ev.capacity !== null ? String(ev.capacity) : "");
    setPublished(ev.published);
    setErrorMsg(null);
  };

  const buildPayload = () => {
    const parsedCap = capacityStr.trim() ? Number.parseInt(capacityStr.trim(), 10) : null;
    return {
      title,
      description,
      pole: pole || null,
      location,
      isOnline,
      meetingUrl: meetingUrl.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      startDate,
      endDate: endDate.trim() || undefined,
      capacity: parsedCap && !Number.isNaN(parsedCap) ? parsedCap : null,
      published,
    };
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const payload = buildPayload();
    const parsed = createEventSchema.safeParse(payload);
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message || "Veuillez vérifier les champs saisis.");
      return;
    }

    setLoading(true);
    const res = await createEventAction(parsed.data);
    setLoading(false);
    if (res.success) {
      setIsCreateOpen(false);
      setSuccessMsg(res.message);
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    setErrorMsg(null);
    const payload = buildPayload();
    const parsed = updateEventSchema.safeParse(payload);
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message || "Veuillez vérifier les champs saisis.");
      return;
    }

    setLoading(true);
    const res = await updateEventAction(editingEvent.id, parsed.data);
    setLoading(false);
    if (res.success) {
      setEditingEvent(null);
      setSuccessMsg(res.message);
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleTogglePublish = async (ev: AdminEventItem) => {
    setTogglingId(ev.id);
    const res = await togglePublishEventAction(ev.id);
    setTogglingId(null);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleDelete = async () => {
    if (!deletingEvent) return;
    setLoading(true);
    const res = await deleteEventAction(deletingEvent.id);
    setLoading(false);
    if (res.success) {
      setDeletingEvent(null);
      setSuccessMsg(res.message);
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleToggleAttendance = async (regId: string) => {
    const res = await toggleAttendanceAction(regId);
    if (res.success && attendeesEvent) {
      setAttendeesEvent({
        ...attendeesEvent,
        registrations: attendeesEvent.registrations.map((r) =>
          r.id === regId ? { ...r, attended: Boolean(res.attended) } : r
        ),
      });
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

      {errorMsg && !isCreateOpen && !editingEvent && !deletingEvent && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-300 text-sm font-medium">
          <AlertCircle className="size-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 shadow-2xs">
          <Search className="size-4 text-slate-400 shrink-0" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un événement par titre ou lieu…"
            className="bg-transparent text-slate-900 dark:text-white text-sm placeholder:text-slate-400 outline-none flex-1"
          />
        </div>

        <Button
          onClick={openCreate}
          className="bg-[#836182] hover:bg-[#6f4f6e] text-white font-semibold rounded-xl px-4 h-10 cursor-pointer flex items-center gap-2"
        >
          <Plus className="size-4" />
          <span>Créer un événement</span>
        </Button>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 shadow-xs">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-slate-500 dark:text-slate-400 text-sm">
            Aucun événement enregistré.
          </div>
        ) : (
          filtered.map((ev) => {
            const manageable = canManage(ev);
            return (
              <div
                key={ev.id}
                className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-slate-900 dark:text-white font-bold text-sm sm:text-base">
                      {ev.title}
                    </h3>
                    {ev.pole && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${PROGRAM_POLES[ev.pole].badge}`}
                      >
                        {PROGRAM_POLES[ev.pole].label}
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        ev.published
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30"
                          : "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30"
                      }`}
                    >
                      {ev.published ? "En ligne" : "Masqué"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5 text-[#836182]" />
                      {ev.startDateFormatted}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5 text-[#836182]" />
                      {ev.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="size-3.5 text-cyan-600 dark:text-cyan-400" />
                      {ev.registrations.length}
                      {ev.capacity !== null ? ` / ${ev.capacity}` : ""} inscrit(s)
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {manageable ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setAttendeesEvent(ev)}
                        className="text-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Users className="size-3.5 text-cyan-600 dark:text-cyan-400" />
                        <span>Inscrits ({ev.registrations.length})</span>
                      </Button>

                      <a
                        href={`/api/admin/export/excel?type=event&eventId=${ev.id}`}
                        download
                        title="Exporter la liste des inscrits au format Excel (.xlsx)"
                        className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                      >
                        <FileSpreadsheet className="size-3.5" />
                        <span className="hidden xl:inline">Excel</span>
                      </a>

                      <a
                        href={`/api/admin/export/pdf?type=event&eventId=${ev.id}`}
                        download
                        title="Télécharger la feuille d'émargement PDF"
                        className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                      >
                        <FileText className="size-3.5" />
                        <span className="hidden xl:inline">PDF</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => handleTogglePublish(ev)}
                        disabled={togglingId === ev.id}
                        title={ev.published ? "Masquer" : "Publier"}
                        className="size-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        {ev.published ? (
                          <Globe className="size-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <GlobeOff className="size-4 text-amber-600 dark:text-amber-400" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => openEdit(ev)}
                        title="Modifier"
                        className="size-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <PencilLine className="size-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeletingEvent(ev)}
                        title="Supprimer"
                        className="size-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md text-[11px] text-slate-500 bg-slate-100 dark:bg-slate-800 italic">
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
      {(isCreateOpen || editingEvent) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingEvent ? "Modifier l'événement" : "Créer un événement"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsCreateOpen(false);
                  setEditingEvent(null);
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

            <form
              onSubmit={editingEvent ? handleUpdate : handleCreate}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  Titre de l&apos;événement *
                </Label>
                <Input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ex: Forum de l'Entrepreneur de Ziguinchor"
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                    Pôle associé
                  </Label>
                  <select
                    value={pole}
                    onChange={(e) => setPole(e.target.value as "" | ProgramPoleKey)}
                    className="w-full h-9 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="">Transversal / Tous publics</option>
                    {(Object.keys(PROGRAM_POLES) as ProgramPoleKey[]).map((key) => (
                      <option key={key} value={key}>
                        {PROGRAM_POLES[key].label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                    Nombre de places max (optionnel)
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="ex: 60"
                    value={capacityStr}
                    onChange={(e) => setCapacityStr(e.target.value)}
                    className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                    Date &amp; heure de début *
                  </Label>
                  <Input
                    type="datetime-local"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                    Date &amp; heure de fin (optionnel)
                  </Label>
                  <Input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  Lieu *
                </Label>
                <Input
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <input
                  id="ev-online"
                  type="checkbox"
                  checked={isOnline}
                  onChange={(e) => setIsOnline(e.target.checked)}
                  className="size-4 accent-[#836182] cursor-pointer"
                />
                <Label htmlFor="ev-online" className="text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                  Événement accessible en ligne (visioconférence)
                </Label>
              </div>

              {isOnline && (
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                    Lien de la réunion (Google Meet / Zoom)
                  </Label>
                  <Input
                    type="url"
                    placeholder="https://meet.google.com/..."
                    value={meetingUrl}
                    onChange={(e) => setMeetingUrl(e.target.value)}
                    className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>
              )}

              <ImageUploader
                id="ev-image"
                label="Visuel de l'événement (optionnel)"
                folder="events"
                value={imageUrl}
                onChange={setImageUrl}
              />

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  Description *
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
                  id="ev-published"
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="size-4 accent-[#836182] cursor-pointer"
                />
                <Label htmlFor="ev-published" className="text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                  Publier immédiatement (ouvert aux inscriptions)
                </Label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingEvent(null);
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
                  ) : editingEvent ? (
                    "Enregistrer"
                  ) : (
                    "Créer l'événement"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale Inscrits & Exports (Excel, PDF, CSV + Checkbox shadcn) */}
      {attendeesEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-5 max-h-[85vh] flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Participants — {attendeesEvent.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {attendeesEvent.registrations.length} inscrit(s) • Pointage et émargement
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`/api/admin/export/excel?type=event&eventId=${attendeesEvent.id}`}
                  download
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                >
                  <FileSpreadsheet className="size-3.5" />
                  <span>Excel (.xlsx)</span>
                </a>
                <a
                  href={`/api/admin/export/pdf?type=event&eventId=${attendeesEvent.id}`}
                  download
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#836182] hover:bg-[#6f4f6e] text-white text-xs font-bold transition-colors"
                >
                  <FileText className="size-3.5" />
                  <span>Émargement PDF</span>
                </a>
                <a
                  href={`/api/admin/events/${attendeesEvent.id}/export`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
                >
                  <Download className="size-3.5" />
                  <span>CSV</span>
                </a>
                <button
                  type="button"
                  onClick={() => setAttendeesEvent(null)}
                  className="size-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800">
              {attendeesEvent.registrations.length === 0 ? (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                  Aucun participant inscrit pour le moment.
                </div>
              ) : (
                attendeesEvent.registrations.map((reg) => (
                  <div key={reg.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#836182]/10 text-[#6d4c6c] dark:bg-[#836182]/25 dark:text-[#f4e6ea]">
                          {reg.ticketCode}
                        </span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {reg.name}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {reg.email} {reg.phone ? `• ${reg.phone}` : ""}
                      </p>
                    </div>

                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 cursor-pointer shrink-0 select-none">
                      <Checkbox
                        checked={reg.attended}
                        onCheckedChange={() => handleToggleAttendance(reg.id)}
                      />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {reg.attended ? "Présent" : "Marquer présent"}
                      </span>
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modale suppression */}
      {deletingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Supprimer l&apos;événement
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Voulez-vous supprimer <strong className="text-slate-900 dark:text-white">{deletingEvent.title}</strong> ainsi que ses inscriptions ?
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeletingEvent(null)} className="text-xs">
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
