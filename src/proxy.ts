import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";

// ─── Routes protégées et publiques ───────────────────────────────────────────

/** Routes accessibles uniquement si NON authentifié */
const AUTH_ROUTES = ["/auth/login", "/auth/register"];

/** Préfixe de l'espace administration (ADMIN & AUTHOR) */
const ADMIN_PREFIX = "/admin";

/** Préfixe de l'espace membre indépendant (USER) */
const USER_PREFIX = "/dashboard";

/** Routes de l'admin strictement réservées au rôle ADMIN (les AUTHOR sont redirigés vers /admin) */
const ADMIN_ONLY_PREFIXES = [
  "/admin/utilisateurs",
  "/admin/candidatures",
  "/admin/partenaires",
  "/admin/newsletter",
  "/admin/audit",
];

/** Routes publiques qui ne nécessitent aucune vérification d'auth */
const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/contact",
  "/actualites",
  "/evenements",
  "/newsletter",
  "/education",
  "/tut-tank",
  "/acceent-elles",
  "/entreprenariat",
  "/acceent-incub",
  "/atelier-entreprenariat",
  "/forum-entrepreneur",
  "/numerique",
  "/ai4good",
  "/wro",
  "/api/health",
];

// ─── Proxy (Next.js 16) ───────────────────────────────────────────────────────

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") || "";

  // ── 0. Anti-cannibalisation SEO : Redirection des domaines Vercel ─────────
  if (host.includes(".vercel.app") && !host.includes("localhost")) {
    const canonicalUrl = new URL(pathname + request.nextUrl.search, "https://acceent.org");
    return NextResponse.redirect(canonicalUrl, 301);
  }

  // ── Passe directement les routes entièrement publiques ────────────────────
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  try {
    const token = request.cookies.get("acceent_session")?.value;
    const session = token ? await verifySession(token) : null;
    const isAuthenticated = session !== null;

    // ── 1. Protection de l'espace Admin (/admin) ───────────────────────────
    if (pathname.startsWith(ADMIN_PREFIX)) {
      if (!isAuthenticated) {
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (session.role !== "ADMIN" && session.role !== "AUTHOR") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      if (
        ADMIN_ONLY_PREFIXES.some((prefix) => pathname.startsWith(prefix)) &&
        session.role !== "ADMIN"
      ) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }

    // ── 2. Protection de l'espace Membre (/dashboard) ──────────────────────
    if (pathname.startsWith(USER_PREFIX)) {
      if (!isAuthenticated) {
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    // ── 3. Redirection si déjà connecté sur connexion / inscription ────────
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

    if (isAuthRoute && isAuthenticated) {
      const targetDashboard =
        session.role === "ADMIN" || session.role === "AUTHOR"
          ? "/admin"
          : "/dashboard";
      return NextResponse.redirect(new URL(targetDashboard, request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("[Proxy Auth Error]", error);
    // Sécurité Fail-Closed sur les routes protégées
    if (pathname.startsWith(ADMIN_PREFIX) || pathname.startsWith(USER_PREFIX)) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo|images|team|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
