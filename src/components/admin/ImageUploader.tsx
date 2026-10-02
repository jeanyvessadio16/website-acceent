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
import { uploadPostImage } from "@/services/storage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  id?: string;
  label?: string;
  required?: boolean;
}

export function ImageUploader({
  value,
  onChange,
  id = "image-url",
  label = "Image de couverture",
  required = false,
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
    // Reset file input so re-selecting same file triggers change
    if (e.target) e.target.value = "";
  };

  const processFileUpload = async (file: File) => {
    // Basic validation
    if (!file.type.startsWith("image/")) {
      setUploadError("Veuillez sélectionner un fichier image valide (JPG, PNG, WebP, GIF, SVG).");
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
      const publicUrl = await uploadPostImage(file);
      onChange(publicUrl);
      setUploadSuccess("Image téléversée avec succès dans Supabase !");
      setTimeout(() => setUploadSuccess(null), 5000);
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(err.message || "Erreur lors du téléversement de l'image.");
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
        <Label htmlFor={id} className="text-xs text-zinc-300 font-medium flex items-center gap-1.5">
          <ImageIcon className="size-3.5 text-[#b9939e]" />
          {label} {required && <span className="text-red-400">*</span>}
        </Label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[11px] text-zinc-500 hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <X className="size-3" />
            Effacer
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Zone de Drag & Drop / Preview */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative group rounded-xl border border-dashed transition-all duration-200 cursor-pointer overflow-hidden p-4 min-h-[140px] flex flex-col items-center justify-center text-center ${
          isDragging
            ? "border-[#836182] bg-[#836182]/10 scale-[1.01]"
            : value
            ? "border-white/10 bg-zinc-900/60 hover:border-[#836182]/50"
            : "border-white/15 bg-white/[0.02] hover:border-[#836182]/50 hover:bg-white/[0.04]"
        }`}
      >
        {/* Loading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 gap-2 animate-in fade-in duration-200">
            <Loader2 className="size-8 text-[#b9939e] animate-spin" />
            <p className="text-xs font-medium text-zinc-200">Téléversement vers Supabase Storage…</p>
            <p className="text-[11px] text-zinc-400">Génération de l'URL automatique</p>
          </div>
        )}

        {/* Aperçu d'image s'il y en a une */}
        {value ? (
          <div className="w-full flex flex-col sm:flex-row items-center gap-4">
            <div className="relative size-24 shrink-0 rounded-lg overflow-hidden border border-white/10 bg-black/40 group-hover:border-[#836182]/40 transition-colors">
              {/* eslint-disable-next-html-element-suppression */}
              <img
                src={value}
                alt="Aperçu"
                className="size-full object-cover"
                onError={(e) => {
                  // Fallback pour URL d'image cassée
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>

            <div className="flex-1 text-left min-w-0 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="size-3" />
                  Image définie
                </span>
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-zinc-400 hover:text-zinc-100 text-xs flex items-center gap-1 transition-colors"
                  title="Ouvrir l'image originale dans un nouvel onglet"
                >
                  <ExternalLink className="size-3" />
                  Voir
                </a>
              </div>

              <p className="text-xs text-zinc-400 truncate font-mono bg-white/[0.03] p-1.5 rounded border border-white/[0.06] select-all">
                {value}
              </p>

              <div className="flex items-center gap-2 pt-1">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="h-7 text-xs border-white/10 bg-white/5 hover:bg-white/10 text-zinc-200 cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="size-3 text-[#b9939e]" />
                  Changer l'image
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Zone de téléversement initiale */
          <div className="space-y-2 py-2">
            <div className="size-10 rounded-full bg-[#836182]/15 border border-[#836182]/30 flex items-center justify-center text-[#b9939e] mx-auto group-hover:scale-110 transition-transform">
              <Upload className="size-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-200">
                <span className="text-[#b9939e] underline underline-offset-2">Cliquez ici pour choisir une image</span> ou glissez-déposez-la
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">
                Téléversera automatiquement le fichier dans Supabase et copiera son URL (PNG, JPG, WebP jusqu'à 10 Mo)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Saisie manuelle / Affichage de l'URL avec protection */}
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
            className={`text-xs font-mono transition-colors ${
              value
                ? "bg-zinc-900/90 border-white/10 text-zinc-400 cursor-not-allowed opacity-75 pr-8"
                : "bg-white/[0.03] border-white/[0.1] text-zinc-100 placeholder:text-zinc-600 focus:border-[#836182]"
            }`}
          />
          {value && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500" title="URL générée automatiquement et verrouillée">
              <Lock className="size-3.5" />
            </div>
          )}
        </div>
        {value && (
          <p className="text-[10px] text-zinc-500 flex items-center gap-1 font-medium">
            <Lock className="size-2.5 text-[#b9939e]" />
            L'URL est verrouillée pour empêcher toute modification accidentelle. Cliquez sur « Effacer » pour réinitialiser.
          </p>
        )}
      </div>

      {/* Notifications d'erreur / succès */}
      {uploadError && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs animate-in fade-in duration-150">
          <AlertCircle className="size-3.5 shrink-0 text-red-400" />
          <span>{uploadError}</span>
        </div>
      )}

      {uploadSuccess && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs animate-in fade-in duration-150">
          <CheckCircle2 className="size-3.5 shrink-0 text-emerald-400" />
          <span>{uploadSuccess}</span>
        </div>
      )}
    </div>
  );
}
