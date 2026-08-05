"use server";

import { destroySession } from "@/lib/session";
import { redirect } from "next/navigation";

/**
 * Déconnecte l'utilisateur actuel :
 * 1. Supprime le cookie de session httpOnly
 * 2. Redirige vers la page de connexion /auth/login
 */
export async function logoutAction() {
  await destroySession();
  redirect("/auth/login");
}
