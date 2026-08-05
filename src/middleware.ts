import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";

// ─── Routes protégées et publiques ───────────────────────────────────────────

/** Routes accessibles uniquement si NON authentifié */
const AUTH_ROUTES = ["/auth/login", "/auth/register"];

/** Prefix de l'espace administration (ADMIN & AUTHOR) */
const ADMIN_PREFIX = "/admin";

/** Prefix de l'espace membre indépendant (USER) */
const USER_PREFIX = "/dashboard";

// ─── Middleware ───────────────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("acceent_session")?.value;

    // Vérification de la session (null si absente ou expirée)
    const session = token ? await verifySession(token) : null;
    const isAuthenticated = session !== null;

    // ── 1. Protection de l'espace Admin (/admin) ─────────────────────────
    if (pathname.startsWith(ADMIN_PREFIX)) {
        if (!isAuthenticated) {
            const loginUrl = new URL("/auth/login", request.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Si l'utilisateur a le rôle USER classique, il n'a pas accès à l'admin -> Redirection vers son espace membre
        if (session.role !== "ADMIN" && session.role !== "AUTHOR") {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    // ── 2. Protection de l'espace Membre (/dashboard) ────────────────────
    if (pathname.startsWith(USER_PREFIX)) {
        if (!isAuthenticated) {
            const loginUrl = new URL("/auth/login", request.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // ── 3. Redirection si déjà connecté sur les pages de connexion / inscription ──
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

    if (isAuthRoute && isAuthenticated) {
        // Redirige l'administrateur/rédacteur vers /admin, et le membre classique vers /dashboard
        const targetDashboard =
            session.role === "ADMIN" || session.role === "AUTHOR"
                ? "/admin"
                : "/dashboard";
        return NextResponse.redirect(new URL(targetDashboard, request.url));
    }

    return NextResponse.next();
}

// ─── Matcher : routes concernées par le middleware ───────────────────────────

export const config = {
    matcher: [
        /*
         * Applique le middleware à toutes les routes sauf les ressources statiques et API
         */
        "/((?!_next/static|_next/image|favicon.ico|logo|images|team|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
