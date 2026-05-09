import { z } from "zod";

export const contactSchema = z.object({
  // ── 1. NOM COMPLET ──────────────────────────────────────
  nomComplet: z
    .string()
    .trim()
    .min(3, { message: "Le nom complet doit contenir au moins 3 caractères." })
    .max(100, {
      message: "Le nom complet ne peut pas dépasser 100 caractères.",
    })
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, {
      message: "Lettres, espaces, apostrophes ou tirets uniquement.",
    }),

  // ── 2. EMAIL ────────────────────────────────────────────
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "L'email ne peut pas être vide." })
    .max(254, { message: "L'email ne peut pas dépasser 254 caractères." })
    .email({ message: "Veuillez saisir une adresse email valide." }),

  // ── 3. MESSAGE ──────────────────────────────────────────
  message: z
    .string()
    .trim()
    .min(20, { message: "Le message doit contenir au moins 20 caractères." })
    .max(1000, { message: "Le message ne peut pas dépasser 1000 caractères." })
    .refine((val) => val.trim().length > 0, {
      message: "Le message ne peut pas être uniquement des espaces.",
    }),
});

export type ContactFormData = z.infer<typeof contactSchema>;
