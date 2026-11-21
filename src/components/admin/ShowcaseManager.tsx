"use client";

import { useState } from "react";
import {
  Plus,
  Handshake,
  Quote,
  Star,
  PencilLine,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import {
  createPartnerAction,
  updatePartnerAction,
  deletePartnerAction,
  togglePartnerActiveAction,
  seedDefaultPartnersAction,
  createTestimonialAction,
  updateTestimonialAction,
  deleteTestimonialAction,
  toggleTestimonialActiveAction,
} from "@/actions/showcase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { partnerSchema, testimonialSchema } from "@/validation/showcase";

export interface AdminPartnerItem {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  website: string | null;
  displayOrder: number;
  active: boolean;
}

export interface AdminTestimonialItem {
  id: string;
  authorName: string;
  authorRole: string;
  program: string | null;
  quote: string;
  avatarUrl: string | null;
  rating: number;
  displayOrder: number;
  active: boolean;
}

interface ShowcaseManagerProps {
  partners: AdminPartnerItem[];
  testimonials: AdminTestimonialItem[];
}

export function ShowcaseManager({ partners, testimonials }: ShowcaseManagerProps) {
  const [tab, setTab] = useState<"partners" | "testimonials">("partners");

  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<AdminPartnerItem | null>(null);
  const [pName, setPName] = useState("");
  const [pLogoUrl, setPLogoUrl] = useState("");
  const [pDescription, setPDescription] = useState("Partenaire de ACCEENT.");
  const [pWebsite, setPWebsite] = useState("");
  const [pOrder, setPOrder] = useState(0);
  const [pActive, setPActive] = useState(true);

  const [testModalOpen, setTestModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<AdminTestimonialItem | null>(null);
  const [tAuthorName, setTAuthorName] = useState("");
  const [tAuthorRole, setTAuthorRole] = useState("");
  const [tProgram, setTProgram] = useState("");
  const [tQuote, setTQuote] = useState("");
  const [tAvatarUrl, setTAvatarUrl] = useState("");
  const [tRating, setTRating] = useState(5);
  const [tOrder, setTOrder] = useState(0);
  const [tActive, setTActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const openPartnerCreate = () => {
    setEditingPartner(null);
    setPName("");
    setPLogoUrl("");
    setPDescription("Partenaire de ACCEENT.");
    setPWebsite("");
    setPOrder(partners.length);
    setPActive(true);
    setErrorMsg(null);
    setPartnerModalOpen(true);
  };

  const openPartnerEdit = (p: AdminPartnerItem) => {
    setEditingPartner(p);
    setPName(p.name);
    setPLogoUrl(p.logoUrl);
    setPDescription(p.description);
    setPWebsite(p.website || "");
    setPOrder(p.displayOrder);
    setPActive(p.active);
    setErrorMsg(null);
    setPartnerModalOpen(true);
  };

  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const payload = {
      name: pName,
      logoUrl: pLogoUrl,
      description: pDescription,
      website: pWebsite.trim() || undefined,
      displayOrder: Number(pOrder) || 0,
      active: pActive,
    };
    const parsed = partnerSchema.safeParse(payload);
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message || "Veuillez vérifier les champs saisis.");
      return;
    }

    setLoading(true);
    const res = editingPartner
      ? await updatePartnerAction(editingPartner.id, parsed.data)
      : await createPartnerAction(parsed.data);
    setLoading(false);
    if (res.success) {
      setPartnerModalOpen(false);
      setSuccessMsg(res.message);
      setTimeout(() => setSuccessMsg(null), 4000);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleSeedPartners = async () => {
    setSeeding(true);
    const res = await seedDefaultPartnersAction();
    setSeeding(false);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => setSuccessMsg(null), 5000);
    } else {
      setErrorMsg(res.message);
    }
  };

  const openTestCreate = () => {
    setEditingTest(null);
    setTAuthorName("");
    setTAuthorRole("");
    setTProgram("");
    setTQuote("");
    setTAvatarUrl("");
    setTRating(5);
    setTOrder(testimonials.length);
    setTActive(true);
    setErrorMsg(null);
    setTestModalOpen(true);
  };

  const openTestEdit = (t: AdminTestimonialItem) => {
    setEditingTest(t);
    setTAuthorName(t.authorName);
    setTAuthorRole(t.authorRole);
    setTProgram(t.program || "");
    setTQuote(t.quote);
    setTAvatarUrl(t.avatarUrl || "");
    setTRating(t.rating);
    setTOrder(t.displayOrder);
    setTActive(t.active);
    setErrorMsg(null);
    setTestModalOpen(true);
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const payload = {
      authorName: tAuthorName,
      authorRole: tAuthorRole,
      program: tProgram.trim() || undefined,
      quote: tQuote,
      avatarUrl: tAvatarUrl.trim() || undefined,
      rating: tRating,
      displayOrder: Number(tOrder) || 0,
      active: tActive,
    };
    const parsed = testimonialSchema.safeParse(payload);
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message || "Veuillez vérifier les champs saisis.");
      return;
    }

    setLoading(true);
    const res = editingTest
      ? await updateTestimonialAction(editingTest.id, parsed.data)
      : await createTestimonialAction(parsed.data);
    setLoading(false);
    if (res.success) {
      setTestModalOpen(false);
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

      {errorMsg && !partnerModalOpen && !testModalOpen && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-300 text-sm font-medium">
          <AlertCircle className="size-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs value={tab} onValueChange={(v) => setTab(v as "partners" | "testimonials")}>
          <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl h-auto">
            <TabsTrigger value="partners" className="rounded-lg px-4 py-2 text-xs font-bold cursor-pointer flex items-center gap-2">
              <Handshake className="size-4" />
              <span>Partenaires ({partners.length})</span>
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="rounded-lg px-4 py-2 text-xs font-bold cursor-pointer flex items-center gap-2">
              <Quote className="size-4" />
              <span>Témoignages ({testimonials.length})</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {tab === "partners" ? (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={seeding}
              onClick={handleSeedPartners}
              className="text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
            >
              {seeding ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Sparkles className="size-3.5 text-[#836182]" />
              )}
              <span>Importer les partenaires initiaux</span>
            </Button>
            <Button
              onClick={openPartnerCreate}
              className="bg-[#836182] hover:bg-[#6f4f6e] text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="size-4" />
              <span>Ajouter un partenaire</span>
            </Button>
          </div>
        ) : (
          <Button
            onClick={openTestCreate}
            className="bg-[#836182] hover:bg-[#6f4f6e] text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="size-4" />
            <span>Ajouter un témoignage</span>
          </Button>
        )}
      </div>

      {tab === "partners" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center space-y-2 shadow-xs">
              <p className="text-sm text-slate-900 dark:text-white font-bold">
                Aucun partenaire dynamique enregistré en base de données.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Importez les partenaires initiaux en 1 clic pour les modifier librement.
              </p>
            </div>
          ) : (
            partners.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-col justify-between gap-3 shadow-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="size-12 rounded-xl bg-white border border-slate-200 p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.logoUrl} alt={p.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {p.name}
                      </h4>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.active
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {p.active ? "Actif" : "Masqué"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">
                      {p.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                  <span>Ordre : #{p.displayOrder}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => togglePartnerActiveAction(p.id)}
                      className="size-7 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                    >
                      {p.active ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => openPartnerEdit(p)}
                      className="size-7 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                    >
                      <PencilLine className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePartnerAction(p.id)}
                      className="size-7 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-500 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "testimonials" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center space-y-2 shadow-xs">
              <Quote className="size-8 text-[#836182] mx-auto" />
              <p className="text-sm text-slate-900 dark:text-white font-bold">
                Aucun témoignage enregistré
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ajoutez des retours de jeunes bénéficiaires, entrepreneurs ou partenaires.
              </p>
            </div>
          ) : (
            testimonials.map((t) => (
              <div
                key={t.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between gap-4 shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="size-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.active
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {t.active ? "Affiché" : "Masqué"}
                    </span>
                  </div>

                  <p className="text-sm text-slate-700 dark:text-slate-200 italic leading-relaxed">
                    &laquo; {t.quote} &raquo;
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {t.authorName}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {t.authorRole} {t.program ? `• ${t.program}` : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleTestimonialActiveAction(t.id)}
                      className="size-7 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                    >
                      {t.active ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => openTestEdit(t)}
                      className="size-7 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                    >
                      <PencilLine className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteTestimonialAction(t.id)}
                      className="size-7 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-500 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modale Partenaire */}
      {partnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingPartner ? "Modifier le partenaire" : "Ajouter un partenaire"}
              </h3>
              <button
                type="button"
                onClick={() => setPartnerModalOpen(false)}
                className="text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-300 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSavePartner} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Nom du partenaire *</Label>
                <Input
                  required
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                />
              </div>

              <ImageUploader
                id="partner-logo"
                label="Logo du partenaire *"
                folder="partners"
                required
                value={pLogoUrl}
                onChange={setPLogoUrl}
              />

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Description courte</Label>
                <Input
                  value={pDescription}
                  onChange={(e) => setPDescription(e.target.value)}
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Site web (optionnel)</Label>
                  <Input
                    type="url"
                    placeholder="https://..."
                    value={pWebsite}
                    onChange={(e) => setPWebsite(e.target.value)}
                    className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Ordre d&apos;affichage</Label>
                  <Input
                    type="number"
                    min={0}
                    value={pOrder}
                    onChange={(e) => setPOrder(Number(e.target.value))}
                    className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <input
                  id="p-active"
                  type="checkbox"
                  checked={pActive}
                  onChange={(e) => setPActive(e.target.checked)}
                  className="size-4 accent-[#836182]"
                />
                <Label htmlFor="p-active" className="text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                  Afficher sur le site public
                </Label>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <Button type="button" variant="outline" onClick={() => setPartnerModalOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={loading} className="bg-[#836182] hover:bg-[#6f4f6e] text-white cursor-pointer">
                  {loading ? <Loader2 className="size-4 animate-spin" /> : "Enregistrer"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale Témoignage */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingTest ? "Modifier le témoignage" : "Ajouter un témoignage"}
              </h3>
              <button
                type="button"
                onClick={() => setTestModalOpen(false)}
                className="text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-300 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSaveTestimonial} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Nom complet *</Label>
                  <Input
                    required
                    value={tAuthorName}
                    onChange={(e) => setTAuthorName(e.target.value)}
                    placeholder="ex: Awa Diatta"
                    className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Qualité / Rôle *</Label>
                  <Input
                    required
                    value={tAuthorRole}
                    onChange={(e) => setTAuthorRole(e.target.value)}
                    placeholder="ex: Fondatrice de EcoCasamance"
                    className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Programme suivi</Label>
                  <Input
                    value={tProgram}
                    onChange={(e) => setTProgram(e.target.value)}
                    placeholder="ex: ACCEENT Incub"
                    className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Note (1 à 5)</Label>
                  <select
                    value={tRating}
                    onChange={(e) => setTRating(Number(e.target.value))}
                    className="w-full h-9 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 text-xs text-slate-900 dark:text-white"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} étoile{n > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Ordre</Label>
                  <Input
                    type="number"
                    min={0}
                    value={tOrder}
                    onChange={(e) => setTOrder(Number(e.target.value))}
                    className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">Témoignage *</Label>
                <Textarea
                  required
                  rows={4}
                  value={tQuote}
                  onChange={(e) => setTQuote(e.target.value)}
                  placeholder="Partagez le retour d'expérience du bénéficiaire…"
                  className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                />
              </div>

              <ImageUploader
                id="test-avatar"
                label="Photo portrait (optionnel)"
                folder="testimonials"
                value={tAvatarUrl}
                onChange={setTAvatarUrl}
              />

              <div className="flex items-center gap-2.5">
                <input
                  id="t-active"
                  type="checkbox"
                  checked={tActive}
                  onChange={(e) => setTActive(e.target.checked)}
                  className="size-4 accent-[#836182]"
                />
                <Label htmlFor="t-active" className="text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                  Afficher sur le site public
                </Label>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                <Button type="button" variant="outline" onClick={() => setTestModalOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={loading} className="bg-[#836182] hover:bg-[#6f4f6e] text-white cursor-pointer">
                  {loading ? <Loader2 className="size-4 animate-spin" /> : "Enregistrer"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
