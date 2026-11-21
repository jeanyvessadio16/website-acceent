import { z } from "zod";
import { isSafeUrl } from "@/lib/constants/platform";
import {
  FILE_SIZE_REGEX,
  SAFE_TEXT_REGEX,
  SAFE_URL_OR_PATH_REGEX,
} from "./patterns";

export const createResourceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Le titre doit contenir au moins 3 caractères.")
    .max(150, "Le titre ne peut pas dépasser 150 caractères.")
    .regex(SAFE_TEXT_REGEX, "Les chevrons < et > ne sont pas autorisés."),
  description: z
    .string()
    .trim()
    .min(10, "La description doit contenir au moins 10 caractères.")
    .max(2000, "La description ne peut pas dépasser 2000 caractères.")
    .regex(SAFE_TEXT_REGEX, "Les balises HTML (< ou >) ne sont pas autorisées."),
  pole: z.enum(["EDUCATION", "ENTREPRENEURIAT", "NUMERIQUE"]),
  programTag: z
    .string()
    .trim()
    .max(80)
    .regex(SAFE_TEXT_REGEX, "Les chevrons < et > ne sont pas autorisés.")
    .optional()
    .or(z.literal("")),
  type: z.enum(["PDF", "GUIDE", "TEMPLATE", "VIDEO", "LINK"]).default("PDF"),
  fileUrl: z
    .string()
    .trim()
    .min(1, "Le fichier ou l'URL de la ressource est obligatoire.")
    .regex(
      SAFE_URL_OR_PATH_REGEX,
      "L'URL ou le chemin de la ressource doit être valide sans espaces."
    )
    .refine(isSafeUrl, "L'URL de la ressource doit être sûre (https:// ou chemin valide)."),
  fileSize: z
    .string()
    .trim()
    .max(30)
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || FILE_SIZE_REGEX.test(val),
      "Format attendu : ex. 2.4 Mo, 450 Ko ou 15 min."
    ),
  published: z.boolean().default(true),
});

export const updateResourceSchema = createResourceSchema.partial();

export type CreateResourceInput = z.input<typeof createResourceSchema>;
export type UpdateResourceInput = z.input<typeof updateResourceSchema>;
