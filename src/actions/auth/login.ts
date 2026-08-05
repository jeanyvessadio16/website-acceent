"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { loginSchema, type LoginInput } from "@/zodSchema/auth";
import prisma from "@/lib/prisma";
import { createSession } from "@/lib/session";

export interface LoginActionResult {
    success: boolean;
    message: string;
    fieldErrors?: Partial<Record<keyof LoginInput, string>>;
}

export async function loginAction(
    data: LoginInput,
    callbackUrl?: string
): Promise<LoginActionResult> {
    const parsed = loginSchema.safeParse(data);

    if (!parsed.success) {
        const fieldErrors: LoginActionResult["fieldErrors"] = {};
        for (const issue of parsed.error.issues) {
            const field = issue.path[0] as keyof LoginInput;
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

    const { email, password } = parsed.data;
    const INVALID_CREDENTIALS_MSG =
        "E-mail ou mot de passe incorrect. Vérifiez vos informations.";

    let userRole: string = "USER";

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                firstname: true,
                lastname: true,
                role: true,
            },
        });

        if (!user) {
            await bcrypt.hash(password, 12);
            return { success: false, message: INVALID_CREDENTIALS_MSG };
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return { success: false, message: INVALID_CREDENTIALS_MSG };
        }

        userRole = user.role;

        await createSession({
            userId: user.id,
            email: user.email,
            role: user.role,
            firstname: user.firstname,
            lastname: user.lastname,
        });
    } catch (error) {
        console.error("[loginAction] Erreur :", error);
        return {
            success: false,
            message:
                "Une erreur inattendue s'est produite. Veuillez réessayer.",
        };
    }

    const defaultTarget =
        userRole === "ADMIN" || userRole === "AUTHOR" ? "/admin" : "/dashboard";
    const safeRedirect =
        callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
            ? callbackUrl
            : defaultTarget;
    redirect(safeRedirect);
}
