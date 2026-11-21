import { z } from "zod";
import { isSafeUrl } from "@/lib/constants/platform";
import {
  CITY_REGEX,
  ISO_DATETIME_REGEX,
  SAFE_TEXT_REGEX,
  SAFE_URL_OR_PATH_REGEX,
} from "./patterns";

export const createEventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Le titre doit contenir au moins 3 caractères.")
    .max(150, "Le titre ne peut pas dépasser 150 caractères.")
    .regex(SAFE_TEXT_REGEX, "Les chevrons < et > ne sont pas autorisés dans le titre."),
  description: z
    .string()
    .trim()
    .min(10, "La description doit contenir au moins 10 caractères.")
    .max(5000, "La description ne peut pas dépasser 5000 caractères.")
    .regex(SAFE_TEXT_REGEX, "Les balises HTML (< ou >) ne sont pas autorisées."),
  pole: z
    .enum(["EDUCATION", "ENTREPRENEURIAT", "NUMERIQUE"])
    .nullable()
    .optional(),
  location: z
    .string()
    .trim()
    .min(2, "Le lieu est obligatoire.")
    .max(200, "Le lieu ne peut pas dépasser 200 caractères.")
    .regex(
      CITY_REGEX,
      "Le lieu contient des caractères non autorisés."
    ),
  isOnline: z.boolean().default(false),
  meetingUrl: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || (SAFE_URL_OR_PATH_REGEX.test(val) && isSafeUrl(val)),
      "Le lien de visioconférence doit être une URL valide (https://)."
    ),
  imageUrl: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || (SAFE_URL_OR_PATH_REGEX.test(val) && isSafeUrl(val)),
      "L'URL de l'image est invalide."
    ),
  startDate: z
    .string()
    .trim()
    .min(1, "La date de début est obligatoire.")
    .regex(ISO_DATETIME_REGEX, "Format de date de début invalide (AAAA-MM-JJTHH:MM).")
    .refine((val) => !Number.isNaN(Date.parse(val)), "Date de début invalide."),
  endDate: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) =>
        !val || (ISO_DATETIME_REGEX.test(val) && !Number.isNaN(Date.parse(val))),
      "Date de fin invalide."
    ),
  capacity: z
    .union([
      z.number().int().positive("La capacité doit être positive.").max(10000),
      z.null(),
    ])
    .optional(),
  published: z.boolean().default(true),
});

export const updateEventSchema = createEventSchema.partial();

export type CreateEventInput = z.input<typeof createEventSchema>;
export type UpdateEventInput = z.input<typeof updateEventSchema>;
