import { z } from "zod";
import { ACCEENT_PROGRAMS, isSafeUrl } from "@/lib/constants/platform";
import {
  CITY_REGEX,
  SAFE_TEXT_REGEX,
  SAFE_URL_OR_PATH_REGEX,
  phoneFieldSchema,
} from "./patterns";

const PROGRAM_SLUGS = ACCEENT_PROGRAMS.map((p) => p.slug) as [string, ...string[]];

export const submitApplicationSchema = z.object({
  programSlug: z.enum(PROGRAM_SLUGS, {
    error: () => "Veuillez sélectionner un programme ACCEENT valide.",
  }),
  phone: phoneFieldSchema,
  city: z
    .string()
    .trim()
    .min(2, "Veuillez renseigner votre ville ou commune.")
    .max(80, "Le nom de ville ne peut pas dépasser 80 caractères.")
    .regex(
      CITY_REGEX,
      "La ville ne doit contenir que des lettres, chiffres, espaces ou tirets."
    )
    .default("Ziguinchor"),
  projectTitle: z
    .string()
    .trim()
    .max(150, "L'intitulé du projet ne doit pas dépasser 150 caractères.")
    .regex(SAFE_TEXT_REGEX, "Les caractères < et > ne sont pas autorisés.")
    .optional()
    .or(z.literal("")),
  motivation: z
    .string()
    .trim()
    .min(20, "Votre motivation doit contenir au moins 20 caractères.")
    .max(3000, "Votre motivation ne doit pas dépasser 3000 caractères.")
    .regex(SAFE_TEXT_REGEX, "Les balises HTML (< ou >) ne sont pas autorisées."),
  documentUrl: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) =>
        !val || (SAFE_URL_OR_PATH_REGEX.test(val) && isSafeUrl(val)),
      "L'URL du document doit commencer par https:// ou http:// sans espaces."
    ),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(["PENDING", "REVIEWING", "INTERVIEW", "ACCEPTED", "REJECTED"]),
  adminNotes: z
    .string()
    .trim()
    .max(2000, "Les remarques ne peuvent pas dépasser 2000 caractères.")
    .regex(SAFE_TEXT_REGEX, "Les balises HTML (< ou >) ne sont pas autorisées.")
    .optional()
    .or(z.literal("")),
  notifyCandidate: z.boolean().default(true),
});

export type SubmitApplicationInput = z.input<typeof submitApplicationSchema>;
export type UpdateApplicationStatusInput = z.input<typeof updateApplicationStatusSchema>;
