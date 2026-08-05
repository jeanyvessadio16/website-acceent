import { z } from "zod";

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
    .max(150, "Le titre ne peut pas dépasser 150 caractères."),

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
    .min(1, "L'URL ou le chemin de l'image est obligatoire."),

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
    .max(150, "Le titre ne peut pas dépasser 150 caractères."),

  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Le slug doit contenir au moins 3 caractères.")
    .max(150, "Le slug ne peut pas dépasser 150 caractères.")
    .regex(
      SLUG_REGEX,
      "Le slug ne doit contenir que des lettres minuscules, chiffres et tirets."
    )
    .optional(),

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
    .min(1, "L'URL ou le chemin de l'image est obligatoire."),

  published: z.boolean().default(false),

  authorId: z
    .string()
    .uuid("L'identifiant de l'auteur (UUID) est invalide.")
    .optional(),
});

// ─── Schéma de mise à jour d'un article ─────────────────────────────────────

export const updatePostSchema = createPostSchema.partial();

// ─── Types inférés ────────────────────────────────────────────────────────────

export type Post = z.infer<typeof postSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
