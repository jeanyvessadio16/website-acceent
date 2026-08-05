"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { registerSchema, type RegisterInput } from "@/zodSchema/auth";
import prisma from "@/lib/prisma";

export interface RegisterActionResult {
    success: boolean;
    message: string;
    fieldErrors?: Partial<Record<keyof RegisterInput, string>>;
}

/**
 * Inscrit un nouvel utilisateur :
 * 1. Valide les données avec Zod
 * 2. Vérifie que l'e-mail n'est pas déjà utilisé
 * 3. Hache le mot de passe avec bcrypt
 * 4. Crée l'utilisateur en base de données avec le rôle USER
 * 5. Redirige vers la page de connexion (/auth/login?registered=true) pour authentification
 */
export async function registerAction(
    data: RegisterInput
): Promise<RegisterActionResult> {
    const parsed = registerSchema.safeParse(data);

    if (!parsed.success) {
        const fieldErrors: RegisterActionResult["fieldErrors"] = {};
        for (const issue of parsed.error.issues) {
            const field = issue.path[0] as keyof RegisterInput;
            if (field && !fieldErrors[field]) {
                fieldErrors[field] = issue.message;
            }
        }
        return {
            success: false,
            message: "Veuillez corriger les erreurs dans le formulaire.",
            fieldErrors,
        };
    }

    const { firstname, lastname, email, password, role } = parsed.data;

    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return {
                success: false,
                message: "Un compte existe déjà avec cette adresse e-mail.",
                fieldErrors: {
                    email: "Cette adresse e-mail est déjà utilisée.",
                },
            };
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await prisma.user.create({
            data: {
                firstname,
                lastname,
                email,
                password: hashedPassword,
                role: role ?? "USER",
            },
        });
    } catch (error) {
        console.error("[registerAction] Erreur :", error);
        return {
            success: false,
            message:
                "Une erreur inattendue s'est produite. Veuillez réessayer.",
        };
    }

    // ── Redirection vers la page de connexion après l'inscription ──
    redirect("/auth/login?registered=true");
}
