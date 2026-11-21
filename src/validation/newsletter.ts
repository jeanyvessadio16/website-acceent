import { z } from "zod";
import {
  NAME_REGEX,
  SAFE_TEXT_REGEX,
  emailFieldSchema,
} from "./patterns";

export const subscribeNewsletterSchema = z.object({
  email: emailFieldSchema,
  name: z
    .string()
    .trim()
    .max(100, "Le prénom ne peut pas dépasser 100 caractères.")
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || NAME_REGEX.test(val),
      "Le prénom ne doit contenir que des lettres, espaces, tirets ou apostrophes."
    ),
});

export const sendCampaignSchema = z.object({
  subject: z
    .string()
    .trim()
    .min(3, "L'objet de la campagne est obligatoire.")
    .max(180)
    .regex(SAFE_TEXT_REGEX, "Les chevrons < et > ne sont pas autorisés dans l'objet."),
  previewText: z
    .string()
    .trim()
    .max(240)
    .regex(SAFE_TEXT_REGEX, "Les chevrons < et > ne sont pas autorisés.")
    .optional()
    .or(z.literal("")),
  content: z
    .string()
    .trim()
    .min(15, "Le contenu du message doit faire au moins 15 caractères.")
    .max(20000),
  postId: z.string().trim().optional().or(z.literal("")),
  includeMembers: z.boolean().default(true),
});

export type SubscribeNewsletterInput = z.input<typeof subscribeNewsletterSchema>;
export type SendCampaignInput = z.input<typeof sendCampaignSchema>;
