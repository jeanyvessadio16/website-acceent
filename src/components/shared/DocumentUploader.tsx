"use client";

import React, { useState, useRef } from "react";
import {
  FileUp,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { uploadDocument } from "@/services/storage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface DocumentUploaderProps {
  value: string;
  onChange: (url: string, detectedSize?: string) => void;
  id?: string;
  label?: string;
  folder?: string;
  required?: boolean;
  placeholder?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export function DocumentUploader({
  value,
  onChange,
  id = "document-url",
  label = "Fichier ou lien du document",
  folder = "resources",
  required = false,
  placeholder = "Ou collez directement l'URL d'un PDF, Google Drive, YouTube…",
}: DocumentUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFileUpload = async (file: File) => {
    if (file.size > 15 * 1024 * 1024) {
      setUploadError("Le document est trop volumineux (maximum 15 Mo).");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const publicUrl = await uploadDocument(file, folder);
      onChange(publicUrl, formatBytes(file.size));
      setUploadSuccess("Document téléversé avec succès !");
      setTimeout(() => setUploadSuccess(null), 5000);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Erreur lors du téléversement du document.";
      setUploadError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFileUpload(file);
    }
    if (e.target) e.target.value = "";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-xs text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
          <FileText className="size-3.5 text-[#836182] dark:text-[#d8b4d7]" />
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[11px] text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <X className="size-3" />
            Effacer
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.ppt,.pptx,application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={async (e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) await processFileUpload(file);
        }}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative group rounded-xl border border-dashed transition-all duration-200 cursor-pointer overflow-hidden p-4 flex flex-col items-center justify-center text-center ${
          isDragging
            ? "border-[#836182] bg-[#836182]/10"
            : value
            ? "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-[#836182]"
            : "border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/30 hover:border-[#836182]"
        }`}
      >
        {isUploading && (
          <div className="absolute inset-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs flex flex-col items-center justify-center p-4 gap-2">
            <Loader2 className="size-7 text-[#836182] animate-spin" />
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
              Téléversement du document…
            </p>
          </div>
        )}

        {value ? (
          <div className="w-full flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-10 rounded-lg bg-[#836182]/15 border border-[#836182]/30 flex items-center justify-center text-[#836182] dark:text-[#d8b4d7] shrink-0">
                <FileText className="size-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="size-3" />
                  Document prêt
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 truncate font-mono">{value}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <ExternalLink className="size-3" />
                Ouvrir
              </a>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="h-7 text-xs border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className="size-3 text-[#836182]" />
                Remplacer
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5 py-1">
            <div className="size-9 rounded-full bg-[#836182]/10 border border-[#836182]/25 flex items-center justify-center text-[#836182] dark:text-[#d8b4d7] mx-auto">
              <FileUp className="size-4" />
            </div>
            <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
              <span className="text-[#836182] dark:text-[#d8b4d7] underline underline-offset-2 font-semibold">
                Cliquez pour importer un document
              </span>{" "}
              ou glissez-le ici
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              PDF, Word, PowerPoint (max 15 Mo)
            </p>
          </div>
        )}
      </div>

      <Input
        id={id}
        type="url"
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-xs font-mono bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
      />

      {uploadError && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-300 text-xs">
          <AlertCircle className="size-3.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {uploadSuccess && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-300 text-xs">
          <CheckCircle2 className="size-3.5 shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}
    </div>
  );
}
