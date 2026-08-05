import { type NextRequest, NextResponse } from "next/server";
import { destroySession } from "@/lib/session";

/**
 * POST /api/auth/logout
 * Supprime le cookie de session et redirige vers la page de connexion.
 */
export async function POST(request: NextRequest) {
    await destroySession();
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl, { status: 303 });
}

/**
 * GET /api/auth/logout
 * Permet la déconnexion via un lien simple (ex: bouton <a>).
 */
export async function GET(request: NextRequest) {
    await destroySession();
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl, { status: 303 });
}
