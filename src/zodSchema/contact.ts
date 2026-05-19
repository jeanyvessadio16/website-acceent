import { z } from "zod";

export const contactSchema = z.object({
  // Honeypot Web3Forms (doit rester vide / non coché)
  botcheck: z
    .boolean()
    .optional()
    .refine((val) => val !== true, { message: "Envoi refusé." }),

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

  // ── 3. TÉLÉPHONE ────────────────────────────────────────
  telephone: z
    .string()
    .trim()
    .min(1, { message: "Le numéro de téléphone est obligatoire." })
    .max(20, {
      message: "Le numéro de téléphone ne peut pas dépasser 20 caractères.",
    })
    .regex(/^[+]?[\d\s().-]+$/, {
      message:
        "Caractères autorisés : chiffres, espaces, +, tirets ou parenthèses.",
    })
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, "");
        return digits.length >= 8 && digits.length <= 15;
      },
      {
        message: "Le numéro doit contenir entre 8 et 15 chiffres.",
      },
    )
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, "");
        if (digits.startsWith("221")) {
          return /^221[67]\d{8}$/.test(digits);
        }
        if (digits.length === 9) {
          return /^[67]\d{8}$/.test(digits);
        }
        return true;
      },
      {
        message:
          "Format Sénégal attendu : 7X XXX XX XX ou +221 7X XXX XX XX.",
      },
    ),

  // ── 4. MESSAGE ──────────────────────────────────────────
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
