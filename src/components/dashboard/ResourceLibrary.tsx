"use client";

import { useState } from "react";
import {
  Search,
  BookOpen,
  Download,
  ExternalLink,
  FileText,
  Video,
  Link as LinkIcon,
  FolderOpen,
} from "lucide-react";
import {
  PROGRAM_POLES,
  RESOURCE_TYPES,
  type ProgramPoleKey,
  type ResourceTypeKey,
} from "@/lib/constants/platform";
import { trackResourceDownloadAction } from "@/actions/resource";

export interface MemberResourceItem {
  id: string;
  title: string;
  description: string;
  pole: ProgramPoleKey;
  programTag: string | null;
  type: ResourceTypeKey;
  fileUrl: string;
  fileSize: string | null;
  downloadCount: number;
  createdAt: string;
}

interface ResourceLibraryProps {
  resources: MemberResourceItem[];
}

export function ResourceLibrary({ resources }: ResourceLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [poleFilter, setPoleFilter] = useState<"ALL" | ProgramPoleKey>("ALL");
  const [typeFilter, setTypeFilter] = useState<"ALL" | ResourceTypeKey>("ALL");
  const [counts, setCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(resources.map((r) => [r.id, r.downloadCount]))
  );

  const filtered = resources.filter((r) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      (r.programTag || "").toLowerCase().includes(q);
    const matchesPole = poleFilter === "ALL" || r.pole === poleFilter;
    const matchesType = typeFilter === "ALL" || r.type === typeFilter;
    return matchesSearch && matchesPole && matchesType;
  });

  const handleOpenResource = (resId: string) => {
    setCounts((prev) => ({ ...prev, [resId]: (prev[resId] ?? 0) + 1 }));
    void trackResourceDownloadAction(resId);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Filtres */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 shadow-2xs">
          <Search className="size-4 text-slate-400 shrink-0" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un guide, cours Tut-Tank, modèle PDF…"
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
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as "ALL" | ResourceTypeKey)}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none shadow-2xs"
        >
          <option value="ALL">Tous les formats</option>
          {(Object.keys(RESOURCE_TYPES) as ResourceTypeKey[]).map((key) => (
            <option key={key} value={key}>
              {RESOURCE_TYPES[key].label}
            </option>
          ))}
        </select>
      </div>

      {/* Grille des ressources */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-2 shadow-xs">
          <FolderOpen className="size-9 text-[#836182] mx-auto" />
          <p className="text-slate-900 dark:text-white font-bold text-sm">
            Aucune ressource trouvée
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            L&apos;équipe pédagogique publiera bientôt de nouveaux supports et fiches pratiques ici.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((res) => {
            const poleMeta = PROGRAM_POLES[res.pole];
            const typeMeta = RESOURCE_TYPES[res.type];
            const Icon =
              res.type === "VIDEO"
                ? Video
                : res.type === "LINK"
                ? LinkIcon
                : res.type === "GUIDE"
                ? BookOpen
                : FileText;

            return (
              <div
                key={res.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between gap-4 hover:border-[#836182]/50 transition-all shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="size-9 rounded-xl bg-[#836182]/10 border border-[#836182]/25 flex items-center justify-center text-[#836182] dark:text-[#d8b4d7]">
                      <Icon className="size-4" />
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${poleMeta.badge}`}
                      >
                        {poleMeta.label}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${typeMeta.badge}`}
                      >
                        {typeMeta.label}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-slate-900 dark:text-white font-bold text-sm sm:text-base leading-snug">
                      {res.title}
                    </h3>
                    {res.programTag && (
                      <span className="inline-block text-[11px] font-semibold text-[#836182] dark:text-[#d8b4d7] mt-1">
                        Programme : {res.programTag}
                      </span>
                    )}
                    <p className="text-slate-600 dark:text-slate-400 text-xs mt-2 leading-relaxed line-clamp-3">
                      {res.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{res.fileSize || "Support numérique"}</span>
                    <span>{counts[res.id] ?? res.downloadCount} consultation(s)</span>
                  </div>

                  <a
                    href={res.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleOpenResource(res.id)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#836182] hover:bg-[#6f4f6e] text-white text-xs font-bold transition-colors"
                  >
                    {res.type === "LINK" || res.type === "VIDEO" ? (
                      <>
                        <span>Accéder à la ressource</span>
                        <ExternalLink className="size-3.5" />
                      </>
                    ) : (
                      <>
                        <Download className="size-3.5" />
                        <span>Télécharger / Ouvrir</span>
                      </>
                    )}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
