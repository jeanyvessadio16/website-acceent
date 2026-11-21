"use client";

import { useState } from "react";
import { Search, ShieldAlert, Clock, Globe, User } from "lucide-react";
import type { AuditLogDTO } from "@/repositories/audit.repository";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 15;

export function AuditLogList({ logs }: { logs: AuditLogDTO[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const uniqueActions = Array.from(new Set(logs.map((l) => l.action))).sort();

  const filtered = logs.filter((log) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      log.action.toLowerCase().includes(q) ||
      log.entity.toLowerCase().includes(q) ||
      (log.actorEmail || "").toLowerCase().includes(q) ||
      (log.entityId || "").toLowerCase().includes(q) ||
      (log.ipAddress || "").toLowerCase().includes(q);
    const matchesAction = actionFilter === "ALL" || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="space-y-5 max-w-6xl">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 shadow-2xs">
          <Search className="size-4 text-slate-400 shrink-0" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Rechercher par acteur, action, entité ou adresse IP…"
            className="bg-transparent text-slate-900 dark:text-white text-sm placeholder:text-slate-400 outline-none flex-1"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => {
            setActionFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200 outline-none shadow-2xs"
        >
          <option value="ALL">Toutes les actions ({logs.length})</option>
          {uniqueActions.map((act) => (
            <option key={act} value={act}>
              {act}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 shadow-xs">
        {paginated.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <ShieldAlert className="size-8 text-[#836182] mx-auto" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Aucun événement d&apos;audit trouvé
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Les actions critiques (connexions, modifications de rôles, exports, publications) apparaîtront ici.
            </p>
          </div>
        ) : (
          paginated.map((log) => (
            <div
              key={log.id}
              className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-3"
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#836182]/10 text-[#6d4c6c] border border-[#836182]/25 dark:bg-[#836182]/25 dark:text-[#f4e6ea] dark:border-[#836182]/40 font-mono">
                    {log.action}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                    {log.entity}
                    {log.entityId ? ` #${log.entityId.slice(0, 8)}` : ""}
                  </span>
                  {log.actorRole && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30">
                      {log.actorRole}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <User className="size-3.5 text-[#836182]" />
                    {log.actorEmail || "Système / Anonyme"}
                  </span>
                  {log.ipAddress && (
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Globe className="size-3 text-slate-400" />
                      {log.ipAddress}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="size-3 text-slate-400" />
                    {log.createdAt}
                  </span>
                </div>

                {log.metadataText && (
                  <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 truncate">
                    {log.metadataText}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
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
    </div>
  );
}
