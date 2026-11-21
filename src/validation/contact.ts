import { z } from "zod";
import {
  NAME_REGEX,
  SAFE_TEXT_REGEX,
  emailFieldSchema,
  phoneFieldSchema,
} from "./patterns";

export const contactSchema = z.object({
  // Honeypot (doit rester vide / non coché)
  botcheck: z
    .boolean()
    .optional()
    .superRefine((val, ctx) => {
      if (val === true) {
        ctx.addIssue({
          code: "custom",
          message: "Envoi refusé.",
        });
      }
    }),

  // ── 1. NOM COMPLET ──────────────────────────────────────
  nomComplet: z
    .string({
      error: () => "Le nom complet est obligatoire.",
    })
    .trim()
    .min(3, { message: "Le nom complet doit contenir au moins 3 caractères." })
    .max(100, {
      message: "Le nom complet ne peut pas dépasser 100 caractères.",
    })
    .regex(NAME_REGEX, {
      message: "Lettres, espaces, apostrophes ou tirets uniquement.",
    }),

  // ── 2. EMAIL ────────────────────────────────────────────
  email: emailFieldSchema,

  // ── 3. TÉLÉPHONE ────────────────────────────────────────
  telephone: phoneFieldSchema,

  // ── 4. MESSAGE ──────────────────────────────────────────
  message: z
    .string({
      error: () => "Le message est obligatoire.",
    })
    .trim()
    .min(20, { message: "Le message doit contenir au moins 20 caractères." })
    .max(1000, { message: "Le message ne peut pas dépasser 1000 caractères." })
    .regex(SAFE_TEXT_REGEX, {
      message: "Les balises HTML (< ou >) ne sont pas autorisées dans le message.",
    }),
});

export type ContactFormData = z.infer<typeof contactSchema>;
