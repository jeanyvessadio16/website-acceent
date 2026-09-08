import { z } from "zod";

// ─── Enum Role (miroir de l'enum Prisma) ────────────────────────────────────

export const RoleSchema = z.enum(["USER", "AUTHOR", "ADMIN"]);

// ─── Schéma d'inscription ────────────────────────────────────────────────────

export const registerSchema = z
    .object({
        firstname: z
            .string({
                error: (issue) =>
                    issue.input === undefined
                        ? "Le prénom est obligatoire."
                        : "Le prénom doit être une chaîne de caractères.",
            })
            .min(2, "Le prénom doit contenir au moins 2 caractères.")
            .max(50, "Le prénom ne peut pas dépasser 50 caractères.")
            .trim(),

        lastname: z
            .string({
                error: (issue) =>
                    issue.input === undefined
                        ? "Le nom est obligatoire."
                        : "Le nom doit être une chaîne de caractères.",
            })
            .min(2, "Le nom doit contenir au moins 2 caractères.")
            .max(50, "Le nom ne peut pas dépasser 50 caractères.")
            .trim(),

        email: z
            .email({
                error: (issue) =>
                    issue.input === undefined
                        ? "L'adresse e-mail est obligatoire."
                        : "L'adresse e-mail n'est pas valide.",
            })
            .toLowerCase()
            .trim(),

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
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&)."
            ),

        role: RoleSchema.default("USER").optional(),
    })
// ─── Schéma de connexion ─────────────────────────────────────────────────────

export const loginSchema = z.object({
    email: z
        .email({
            error: (issue) =>
                issue.input === undefined
                    ? "L'adresse e-mail est obligatoire."
                    : "L'adresse e-mail n'est pas valide.",
        })
        .toLowerCase()
        .trim(),

    password: z
        .string({
            error: (issue) =>
                issue.input === undefined
                    ? "Le mot de passe est obligatoire."
                    : "Le mot de passe doit être une chaîne de caractères.",
        })
        .min(1, "Le mot de passe est obligatoire."),
});

// ─── Types inférés ────────────────────────────────────────────────────────────

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
