"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  RefreshCw,
  Lock,
} from "lucide-react";
import { uploadImage } from "@/services/storage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { isSafeUrl } from "@/lib/constants/platform";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  id?: string;
  label?: string;
  required?: boolean;
  folder?: string;
}

export function ImageUploader({
  value,
  onChange,
  id = "image-url",
  label = "Image de couverture",
  required = false,
  folder = "articles",
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFileUpload(file);
    }
    if (e.target) e.target.value = "";
  };

  const processFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Veuillez sélectionner un fichier image valide (JPG, PNG, WebP, GIF).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("L'image est trop volumineuse (maximum 10 Mo).");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const publicUrl = await uploadImage(file, folder);
      onChange(publicUrl);
      setUploadSuccess("Image téléversée avec succès !");
      setTimeout(() => setUploadSuccess(null), 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur lors du téléversement de l'image.";
      setUploadError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFileUpload(file);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-xs text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
          <ImageIcon className="size-3.5 text-[#836182] dark:text-[#d8b4d7]" />
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
        accept="image/png, image/jpeg, image/webp, image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative group rounded-xl border border-dashed transition-all duration-200 cursor-pointer overflow-hidden p-4 min-h-[130px] flex flex-col items-center justify-center text-center ${
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
              Téléversement vers Supabase Storage…
            </p>
          </div>
        )}

        {value ? (
          <div className="w-full flex flex-col sm:flex-row items-center gap-4">
            <div className="relative size-20 shrink-0 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-200 dark:bg-slate-900">
              {isSafeUrl(value) && (
                <img
                  src={value}
                  alt="Aperçu"
                  className="size-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              )}
            </div>

            <div className="flex-1 text-left min-w-0 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="size-3" />
                  Image définie
                </span>
                {isSafeUrl(value) && (
                  <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs flex items-center gap-1"
                  >
                    <ExternalLink className="size-3" />
                    Voir
                  </a>
                )}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 truncate font-mono bg-white dark:bg-slate-900 p-1.5 rounded border border-slate-200 dark:border-slate-700 select-all">
                {value}
              </p>

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="h-7 text-xs border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="size-3 text-[#836182]" />
                Changer l&apos;image
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 py-2">
            <div className="size-10 rounded-full bg-[#836182]/10 border border-[#836182]/25 flex items-center justify-center text-[#836182] dark:text-[#d8b4d7] mx-auto">
              <Upload className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                <span className="text-[#836182] dark:text-[#d8b4d7] underline underline-offset-2 font-semibold">
                  Cliquez pour choisir une image
                </span>{" "}
                ou glissez-déposez-la
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                PNG, JPG, WebP jusqu&apos;à 10 Mo
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="pt-1 space-y-1">
        <div className="relative">
          <Input
            id={id}
            type="text"
            required={required}
            readOnly={Boolean(value)}
            disabled={Boolean(value)}
            placeholder="Ou collez directement une URL (ex: https://...)"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`text-xs font-mono ${
              value
                ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 cursor-not-allowed pr-8"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            }`}
          />
          {value && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Lock className="size-3.5" />
            </div>
          )}
        </div>
      </div>

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
