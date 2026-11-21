import { z } from "zod";
import { RoleSchema } from "./auth";
import {
  MilieuResidenceSchema,
  NAME_REGEX,
  STRONG_PASSWORD_REGEX,
  SexeSchema,
  emailFieldSchema,
  optionalAgeFieldSchema,
  optionalPhoneFieldSchema,
} from "./patterns";

const strongPasswordSchema = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
  .max(100, "Le mot de passe ne peut pas dépasser 100 caractères.")
  .regex(
    STRONG_PASSWORD_REGEX,
    "Le mot de passe doit contenir au moins 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial (@$!%*?&) et aucun espace."
  );

const personNameSchema = (fieldLabel: string) =>
  z
    .string()
    .trim()
    .min(2, `${fieldLabel} doit contenir au moins 2 caractères.`)
    .max(50, `${fieldLabel} ne peut pas dépasser 50 caractères.`)
    .regex(
      NAME_REGEX,
      `${fieldLabel} ne doit contenir que des lettres, espaces, tirets ou apostrophes.`
    );

export const updateProfileSchema = z.object({
  firstname: personNameSchema("Le prénom"),
  lastname: personNameSchema("Le nom"),
  email: emailFieldSchema,
  age: optionalAgeFieldSchema,
  sexe: SexeSchema.nullable().optional(),
  milieuResidence: MilieuResidenceSchema.nullable().optional(),
  telephone: optionalPhoneFieldSchema,
  sdh: z.boolean().default(false),
  password: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || strongPasswordSchema.safeParse(val).success,
      "Le nouveau mot de passe doit contenir au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial (@$!%*?&) et aucun espace."
    ),
});

export const adminCreateUserSchema = z.object({
  firstname: personNameSchema("Le prénom"),
  lastname: personNameSchema("Le nom"),
  email: emailFieldSchema,
  password: strongPasswordSchema,
  role: RoleSchema,
  age: optionalAgeFieldSchema,
  sexe: SexeSchema.nullable().optional(),
  milieuResidence: MilieuResidenceSchema.nullable().optional(),
  telephone: optionalPhoneFieldSchema,
  sdh: z.boolean().default(false),
});

export const adminUpdateUserSchema = z.object({
  id: z.string().uuid("Identifiant utilisateur invalide."),
  firstname: personNameSchema("Le prénom"),
  lastname: personNameSchema("Le nom"),
  email: emailFieldSchema,
  role: RoleSchema,
  age: optionalAgeFieldSchema,
  sexe: SexeSchema.nullable().optional(),
  milieuResidence: MilieuResidenceSchema.nullable().optional(),
  telephone: optionalPhoneFieldSchema,
  sdh: z.boolean().default(false),
});

export type UpdateProfileInput = z.input<typeof updateProfileSchema>;
export type AdminCreateUserInput = z.input<typeof adminCreateUserSchema>;
export type AdminUpdateUserInput = z.input<typeof adminUpdateUserSchema>;
