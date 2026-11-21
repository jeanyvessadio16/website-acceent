import { z } from "zod";
import { isSafeUrl } from "@/lib/constants/platform";
import {
  SAFE_TEXT_REGEX,
  SAFE_URL_OR_PATH_REGEX,
  TAG_REGEX,
} from "./patterns";

export const POST_CATEGORY_VALUES = [
  "EDUCATION",
  "ENTREPRENEURIAT",
  "NUMERIQUE",
  "VIE_ASSOCIATIVE",
  "EVENEMENT",
  "GENERAL",
] as const;

// ─── Regex Slug ─────────────────────────────────────────────────────────────
// Format de slug valide : minuscules, chiffres et tirets (ex: "mon-premier-article")
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// ─── Schéma complet Post (Miroir du modèle Prisma) ───────────────────────────

export const postSchema = z.object({
  id: z.string().uuid("L'identifiant unique (UUID) est invalide."),

  title: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Le titre est obligatoire."
          : "Le titre doit être une chaîne de caractères.",
    })
    .trim()
    .min(3, "Le titre doit contenir au moins 3 caractères.")
    .max(150, "Le titre ne peut pas dépasser 150 caractères.")
    .regex(SAFE_TEXT_REGEX, "Les chevrons < et > ne sont pas autorisés dans le titre."),

  slug: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Le slug est obligatoire."
          : "Le slug doit être une chaîne de caractères.",
    })
    .trim()
    .toLowerCase()
    .min(3, "Le slug doit contenir au moins 3 caractères.")
    .max(150, "Le slug ne peut pas dépasser 150 caractères.")
    .regex(
      SLUG_REGEX,
      "Le slug ne doit contenir que des lettres minuscules, chiffres et tirets."
    ),

  content: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Le contenu est obligatoire."
          : "Le contenu doit être une chaîne de caractères.",
    })
    .trim()
    .min(10, "Le contenu doit contenir au moins 10 caractères."),

  imageUrl: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "L'URL de l'image est obligatoire."
          : "L'URL de l'image doit être une chaîne de caractères.",
    })
    .trim()
    .min(1, "L'URL ou le chemin de l'image est obligatoire.")
    .regex(
      SAFE_URL_OR_PATH_REGEX,
      "L'URL de l'image doit être une adresse http(s):// ou un chemin / valide."
    ),

  link: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || (SAFE_URL_OR_PATH_REGEX.test(val) && isSafeUrl(val)),
      "L'URL du lien externe est invalide."
    ),

  published: z.boolean().default(false),

  authorId: z.string().uuid("L'identifiant de l'auteur (UUID) est invalide."),

  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// ─── Schéma de création d'un article ─────────────────────────────────────────

export const createPostSchema = z.object({
  title: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Le titre est obligatoire."
          : "Le titre doit être une chaîne de caractères.",
    })
    .trim()
    .min(3, "Le titre doit contenir au moins 3 caractères.")
    .max(150, "Le titre ne peut pas dépasser 150 caractères.")
    .regex(SAFE_TEXT_REGEX, "Les chevrons < et > ne sont pas autorisés dans le titre."),

  slug: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || SLUG_REGEX.test(val.toLowerCase()),
      "Le slug ne doit contenir que des lettres minuscules, chiffres et tirets."
    ),

  content: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Le contenu est obligatoire."
          : "Le contenu doit être une chaîne de caractères.",
    })
    .trim()
    .min(10, "Le contenu doit contenir au moins 10 caractères."),

  imageUrl: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform(
      (val) =>
        val ||
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
    )
    .refine(
      (val) => SAFE_URL_OR_PATH_REGEX.test(val) && isSafeUrl(val),
      "L'URL de l'image de couverture est invalide."
    ),

  link: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((val) => {
      if (!val) return undefined;
      if (!/^https?:\/\//i.test(val) && !val.startsWith("/")) return `https://${val}`;
      return val;
    })
    .refine(
      (val) => !val || (SAFE_URL_OR_PATH_REGEX.test(val) && isSafeUrl(val)),
      "L'URL du lien externe est invalide ou non sécurisée."
    ),

  category: z.enum(POST_CATEGORY_VALUES).default("GENERAL"),

  tags: z
    .array(
      z
        .string()
        .trim()
        .min(1)
        .max(30)
        .regex(TAG_REGEX, "Chaque tag ne doit contenir que des lettres, chiffres, espaces, - ou _.")
    )
    .max(8, "Vous ne pouvez ajouter que 8 tags maximum.")
    .default([]),

  published: z.boolean().default(false),

  authorId: z.string().optional(),
});

// ─── Schéma de mise à jour d'un article ─────────────────────────────────────

export const updatePostSchema = createPostSchema.partial();

// ─── Types inférés ────────────────────────────────────────────────────────────

export type Post = z.infer<typeof postSchema>;
export type CreatePostInput = z.input<typeof createPostSchema>;
export type UpdatePostInput = z.input<typeof updatePostSchema>;
