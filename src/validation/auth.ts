import { z } from "zod";
import {
  EMAIL_REGEX,
  MilieuResidenceSchema,
  NAME_REGEX,
  RESET_TOKEN_REGEX,
  STRONG_PASSWORD_REGEX,
  SexeSchema,
  emailFieldSchema,
  phoneFieldSchema,
  requiredAgeFieldSchema,
} from "./patterns";

export { SexeSchema, MilieuResidenceSchema, EMAIL_REGEX, NAME_REGEX };

// ─── Enum Role (miroir de l'enum Prisma) ────────────────────────────────────

export const RoleSchema = z.enum(["USER", "AUTHOR", "ADMIN"]);

// ─── Schéma d'inscription ────────────────────────────────────────────────────

export const registerSchema = z.object({
  firstname: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Le prénom est obligatoire."
          : "Le prénom doit être une chaîne de caractères.",
    })
    .trim()
    .min(2, "Le prénom doit contenir au moins 2 caractères.")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères.")
    .regex(
      NAME_REGEX,
      "Le prénom ne doit contenir que des lettres, espaces, tirets ou apostrophes."
    ),

  lastname: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Le nom est obligatoire."
          : "Le nom doit être une chaîne de caractères.",
    })
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères.")
    .max(50, "Le nom ne peut pas dépasser 50 caractères.")
    .regex(
      NAME_REGEX,
      "Le nom ne doit contenir que des lettres, espaces, tirets ou apostrophes."
    ),

  email: emailFieldSchema,

  age: requiredAgeFieldSchema,

  sexe: SexeSchema,

  milieuResidence: MilieuResidenceSchema,

  telephone: phoneFieldSchema,

  sdh: z.boolean({
    error: () => "Veuillez préciser si vous êtes en situation de handicap (Oui ou Non).",
  }),

  password: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Le mot de passe est obligatoire."
          : "Le mot de passe doit être une chaîne de caractères.",
    })
    .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
    .max(100, "Le mot de passe ne peut pas dépasser 100 caractères.")
    .regex(
      STRONG_PASSWORD_REGEX,
      "Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial (@$!%*?&) et aucun espace."
    ),
});

// ─── Schéma de connexion ─────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: emailFieldSchema,

  password: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Le mot de passe est obligatoire."
          : "Le mot de passe doit être une chaîne de caractères.",
    })
    .min(1, "Le mot de passe est obligatoire.")
    .max(100, "Le mot de passe ne peut pas dépasser 100 caractères."),
});

// ─── Schémas de réinitialisation de mot de passe ────────────────────────────

export const forgotPasswordSchema = z.object({
  email: emailFieldSchema,
});

export const resetPasswordSchema = z
  .object({
    token: z
      .string()
      .trim()
      .regex(
        RESET_TOKEN_REGEX,
        "Le jeton de réinitialisation est invalide ou mal formé."
      ),
    password: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Le nouveau mot de passe est obligatoire."
            : "Le mot de passe doit être une chaîne de caractères.",
      })
      .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
      .max(100, "Le mot de passe ne peut pas dépasser 100 caractères.")
      .regex(
        STRONG_PASSWORD_REGEX,
        "Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial (@$!%*?&) et aucun espace."
      ),
    confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

// ─── Types inférés ────────────────────────────────────────────────────────────

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
