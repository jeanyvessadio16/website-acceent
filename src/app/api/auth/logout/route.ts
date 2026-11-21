import { type NextRequest, NextResponse } from "next/server";
import { destroySession } from "@/lib/session";

/**
 * POST /api/auth/logout
 * Supprime le cookie de session et redirige vers la page de connexion.
 * Restreint à POST pour protéger contre la déconnexion CSRF par requête GET.
 */
export async function POST(request: NextRequest) {
  await destroySession();
  const loginUrl = new URL("/auth/login", request.url);
  return NextResponse.redirect(loginUrl, { status: 303 });
}
