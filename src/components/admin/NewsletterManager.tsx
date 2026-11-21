"use client";

import { useState } from "react";
import {
  Send,
  Users,
  History,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail,
  Trash2,
  Search,
  Info,
  Sparkles,
} from "lucide-react";
import {
  sendNewsletterCampaignAction,
  toggleSubscriberAction,
  deleteSubscriberAction,
} from "@/actions/newsletter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sendCampaignSchema } from "@/validation/newsletter";

export interface SubscriberItem {
  id: string;
  email: string;
  name: string | null;
  active: boolean;
  subscribedAt: string;
}

export interface CampaignItem {
  id: string;
  subject: string;
  recipientCount: number;
  sentCount: number;
  status: string;
  createdAt: string;
}

export interface PublishedPostOption {
  id: string;
  title: string;
  content: string;
}

interface NewsletterManagerProps {
  subscribers: SubscriberItem[];
  campaigns: CampaignItem[];
  recentPosts: PublishedPostOption[];
  optedInMembersCount: number;
  emailConfigured: boolean;
}

export function NewsletterManager({
  subscribers,
  campaigns,
  recentPosts,
  optedInMembersCount,
  emailConfigured,
}: NewsletterManagerProps) {
  const [tab, setTab] = useState<"compose" | "subscribers" | "history">("compose");
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedPostId, setSelectedPostId] = useState("");
  const [subject, setSubject] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [content, setContent] = useState("");
  const [includeMembers, setIncludeMembers] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const activeSubscribersCount = subscribers.filter((s) => s.active).length;

  const handlePrefillPost = (postId: string) => {
    setSelectedPostId(postId);
    const post = recentPosts.find((p) => p.id === postId);
    if (post) {
      setSubject(`À la une sur ACCEENT : ${post.title}`);
      setPreviewText("Découvrez notre dernière publication et les nouveautés de la communauté.");
      setContent(
        `${post.title}\n\n${post.content.slice(0, 700)}${
          post.content.length > 700 ? "…" : ""
        }\n\nRetrouvez l'article complet et toutes nos initiatives sur le site officiel ACCEENT.`
      );
    }
  };

  const handleSendCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const payload = {
      subject,
      previewText: previewText.trim() || undefined,
      content,
      postId: selectedPostId || undefined,
      includeMembers,
    };
    const parsed = sendCampaignSchema.safeParse(payload);
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message || "Veuillez vérifier les champs saisis.");
      return;
    }

    setLoading(true);
    const res = await sendNewsletterCampaignAction(parsed.data);

    setLoading(false);
    if (res.success) {
      setSuccessMsg(res.message);
      setSubject("");
      setPreviewText("");
      setContent("");
      setSelectedPostId("");
    } else {
      setErrorMsg(res.message);
    }
  };

  const filteredSubscribers = subscribers.filter((s) => {
    const q = searchTerm.toLowerCase().trim();
    return (
      !q ||
      s.email.toLowerCase().includes(q) ||
      (s.name || "").toLowerCase().includes(q)
    );
  });

  const handleToggleSub = async (id: string) => {
    const res = await toggleSubscriberAction(id);
    if (res.success) setSuccessMsg(res.message);
    else setErrorMsg(res.message);
  };

  const handleDeleteSub = async (id: string) => {
    const res = await deleteSubscriberAction(id);
    if (res.success) setSuccessMsg(res.message);
    else setErrorMsg(res.message);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {!emailConfigured && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 dark:bg-amber-500/10 dark:border-amber-500/25 dark:text-amber-200 text-xs sm:text-sm">
          <Info className="size-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <p className="font-bold">Fournisseur d&apos;e-mails (Resend) non encore configuré</p>
            <p className="text-amber-800 dark:text-amber-300/80 text-xs mt-0.5">
              Ajoutez <code className="bg-amber-100 dark:bg-black/30 px-1.5 py-0.5 rounded">RESEND_API_KEY</code> et{" "}
              <code className="bg-amber-100 dark:bg-black/30 px-1.5 py-0.5 rounded">EMAIL_FROM</code> dans votre fichier{" "}
              <code className="bg-amber-100 dark:bg-black/30 px-1.5 py-0.5 rounded">.env</code> pour expédier les campagnes en réel.
            </p>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-300 text-sm font-medium">
          <CheckCircle2 className="size-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-300 text-sm font-medium">
          <AlertCircle className="size-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <Tabs value={tab} onValueChange={(v) => setTab(v as "compose" | "subscribers" | "history")}>
        <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl h-auto flex-wrap">
          <TabsTrigger value="compose" className="rounded-lg px-4 py-2 text-xs font-bold cursor-pointer flex items-center gap-2">
            <Send className="size-3.5" />
            <span>Diffuser</span>
          </TabsTrigger>
          <TabsTrigger value="subscribers" className="rounded-lg px-4 py-2 text-xs font-bold cursor-pointer flex items-center gap-2">
            <Users className="size-3.5" />
            <span>Abonnés ({activeSubscribersCount})</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg px-4 py-2 text-xs font-bold cursor-pointer flex items-center gap-2">
            <History className="size-3.5" />
            <span>Historique ({campaigns.length})</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "compose" && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 max-w-3xl shadow-xs">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-[#836182]" />
              Pré-remplir à partir d&apos;un article publié (optionnel)
            </Label>
            <select
              value={selectedPostId}
              onChange={(e) => handlePrefillPost(e.target.value)}
              className="w-full h-10 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 text-xs text-slate-900 dark:text-white"
            >
              <option value="">— Rédiger un message libre —</option>
              {recentPosts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSendCampaign} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                Objet de l&apos;e-mail *
              </Label>
              <Input
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="ex: Nouveaux programmes & ateliers à Ziguinchor"
                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                Accroche / Sous-titre (optionnel)
              </Label>
              <Input
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                placeholder="Phrase d'introduction affichée en haut du message…"
                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                Contenu du message *
              </Label>
              <Textarea
                required
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Rédigez votre newsletter destinée aux abonnés et membres d'ACCEENT…"
                className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center gap-2.5">
                <input
                  id="nl-include-members"
                  type="checkbox"
                  checked={includeMembers}
                  onChange={(e) => setIncludeMembers(e.target.checked)}
                  className="size-4 accent-[#836182] cursor-pointer"
                />
                <Label htmlFor="nl-include-members" className="text-xs text-slate-800 dark:text-slate-200 cursor-pointer">
                  Inclure également les membres inscrits ayant accepté les notifications ({optedInMembersCount})
                </Label>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-6">
                Audience estimée (avant dédoublonnage) :{" "}
                <strong className="text-slate-900 dark:text-white">
                  {activeSubscribersCount + (includeMembers ? optedInMembersCount : 0)}
                </strong>{" "}
                destinataire(s)
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="bg-[#836182] hover:bg-[#6f4f6e] text-white font-bold rounded-xl px-6 cursor-pointer flex items-center gap-2"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              <span>{loading ? "Traitement…" : "Diffuser la campagne"}</span>
            </Button>
          </form>
        </div>
      )}

      {tab === "subscribers" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 max-w-md shadow-2xs">
            <Search className="size-4 text-slate-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un abonné par e-mail ou nom…"
              className="bg-transparent text-slate-900 dark:text-white text-sm outline-none flex-1"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800 shadow-xs">
            {filteredSubscribers.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-xs">
                Aucun abonné externe enregistré.
              </div>
            ) : (
              filteredSubscribers.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Mail className="size-3.5 text-[#836182] shrink-0" />
                      <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {sub.email}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sub.active
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {sub.active ? "Actif" : "Désinscrit"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {sub.name ? `${sub.name} • ` : ""}Inscrit le {sub.subscribedAt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleSub(sub.id)}
                      className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      {sub.active ? "Suspendre" : "Réactiver"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSub(sub.id)}
                      className="size-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {tab === "history" && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800 shadow-xs">
          {campaigns.length === 0 ? (
            <div className="p-10 text-center text-slate-500 dark:text-slate-400 text-sm">
              Aucune campagne envoyée ou enregistrée pour le moment.
            </div>
          ) : (
            campaigns.map((c) => (
              <div
                key={c.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{c.subject}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Créée le {c.createdAt} • {c.sentCount} / {c.recipientCount} envoyé(s)
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold w-fit border ${
                    c.status === "SENT"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30"
                      : c.status === "DRAFT"
                      ? "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30"
                      : "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/30"
                  }`}
                >
                  {c.status === "SENT"
                    ? "Envoyée"
                    : c.status === "DRAFT"
                    ? "Brouillon"
                    : c.status === "PARTIAL"
                    ? "Envoi partiel"
                    : "Échec"}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
