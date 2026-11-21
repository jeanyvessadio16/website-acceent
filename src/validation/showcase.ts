import { z } from "zod";
import { isSafeUrl } from "@/lib/constants/platform";
import {
  NAME_REGEX,
  SAFE_TEXT_REGEX,
  SAFE_URL_OR_PATH_REGEX,
} from "./patterns";

export const partnerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom du partenaire est obligatoire.")
    .max(100)
    .regex(SAFE_TEXT_REGEX, "Les chevrons < et > ne sont pas autorisés."),
  logoUrl: z
    .string()
    .trim()
    .min(1, "Le logo est obligatoire.")
    .regex(SAFE_URL_OR_PATH_REGEX, "L'URL du logo doit être valide.")
    .refine(isSafeUrl, "L'URL du logo est invalide."),
  description: z
    .string()
    .trim()
    .max(300)
    .regex(SAFE_TEXT_REGEX, "Les chevrons < et > ne sont pas autorisés.")
    .default("Partenaire de ACCEENT."),
  website: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) =>
        !val || val === "#" || (SAFE_URL_OR_PATH_REGEX.test(val) && isSafeUrl(val)),
      "L'URL du site web est invalide."
    ),
  displayOrder: z.number().int().min(0).max(1000).default(0),
  active: z.boolean().default(true),
});

export const testimonialSchema = z.object({
  authorName: z
    .string()
    .trim()
    .min(2, "Le nom est obligatoire.")
    .max(100)
    .regex(
      NAME_REGEX,
      "Le nom ne doit contenir que des lettres, espaces, tirets ou apostrophes."
    ),
  authorRole: z
    .string()
    .trim()
    .min(2, "Le rôle ou profil est obligatoire.")
    .max(120)
    .regex(SAFE_TEXT_REGEX, "Les chevrons < et > ne sont pas autorisés."),
  program: z
    .string()
    .trim()
    .max(100)
    .regex(SAFE_TEXT_REGEX, "Les chevrons < et > ne sont pas autorisés.")
    .optional()
    .or(z.literal("")),
  quote: z
    .string()
    .trim()
    .min(15, "Le témoignage doit contenir au moins 15 caractères.")
    .max(1000)
    .regex(SAFE_TEXT_REGEX, "Les chevrons < et > ne sont pas autorisés."),
  avatarUrl: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || (SAFE_URL_OR_PATH_REGEX.test(val) && isSafeUrl(val)),
      "L'URL de l'avatar est invalide."
    ),
  rating: z.number().int().min(1).max(5).default(5),
  displayOrder: z.number().int().min(0).max(1000).default(0),
  active: z.boolean().default(true),
});

export type PartnerInput = z.input<typeof partnerSchema>;
export type TestimonialInput = z.input<typeof testimonialSchema>;
