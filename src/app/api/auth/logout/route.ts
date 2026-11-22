import { NextResponse } from "next/server";
import { destroySession } from "@/lib/session";
import { getPublicSiteOrigin } from "@/lib/core";

/**
 * POST /api/auth/logout
 * Supprime le cookie de session et redirige vers la page de connexion.
 * Restreint à POST pour protéger contre la déconnexion CSRF par requête GET.
 */
export async function POST() {
  await destroySession();
  const loginUrl = new URL("/auth/login", getPublicSiteOrigin());
  return NextResponse.redirect(loginUrl, { status: 303 });
}
