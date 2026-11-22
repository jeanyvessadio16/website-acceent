import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { buildCspHeader, generateCspNonce } from "@/lib/core/csp";

// ─── Routes protégées et publiques ───────────────────────────────────────────

/** Préfixe de l'espace administration (ADMIN & AUTHOR) */
const ADMIN_PREFIX = "/admin";

/** Préfixe de l'espace membre indépendant (USER) */
const USER_PREFIX = "/dashboard";

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
  "/cgu",
  "/politique-de-confidentialite",
  "/auth/confirm",
  "/api/health",
];

// ─── Proxy (Next.js 16 + Supabase SSR) ───────────────────────────────────────

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const host = request.headers.get("host") || "";

  // ── 0. Anti-cannibalisation SEO : Redirection des domaines Vercel ─────────
  if (host.includes(".vercel.app") && !host.includes("localhost")) {
    const canonicalUrl = new URL(pathname + request.nextUrl.search, "https://www.acceent.org");
    return NextResponse.redirect(canonicalUrl, 301);
  }

  // Fallback : si Supabase redirige vers "/" avec ?code=... ou ?token_hash=...&type=...
  if (
    pathname === "/" &&
    (searchParams.has("code") ||
      (searchParams.has("token_hash") && searchParams.has("type")))
  ) {
    const confirmUrl = new URL("/auth/confirm", request.url);
    confirmUrl.search = request.nextUrl.search;
    return NextResponse.redirect(confirmUrl);
  }

  const nonce = generateCspNonce();
  const cspHeader = buildCspHeader(nonce, process.env.NODE_ENV === "production");

  const nextWithCsp = () => {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("Content-Security-Policy", cspHeader);
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    response.headers.set("Content-Security-Policy", cspHeader);
    return response;
  };

  // ── Passe directement les routes entièrement publiques ────────────────────
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isPublicRoute) {
    return nextWithCsp();
  }

  let supabaseResponse = nextWithCsp();

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Variables Supabase manquantes dans proxy.ts");
    }

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = nextWithCsp();
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    });

    // Rafraîchit les jetons expirés et vérifie la signature JWT via Supabase Auth
    const { data } = await supabase.auth.getClaims();
    const isAuthenticated = Boolean(data?.claims?.sub);

    // ── Protection préliminaire /admin et /dashboard ────────────────────────
    if (pathname.startsWith(ADMIN_PREFIX) || pathname.startsWith(USER_PREFIX)) {
      if (!isAuthenticated) {
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    return supabaseResponse;
  } catch (error) {
    console.error("[Proxy Auth Error]", error);
    // Sécurité Fail-Closed sur les routes protégées
    if (pathname.startsWith(ADMIN_PREFIX) || pathname.startsWith(USER_PREFIX)) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return supabaseResponse;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|logo|images|team|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
