import prisma from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  firstname: string;
  lastname: string;
}

/**
 * Lit l'utilisateur authentifié depuis Supabase Auth (`getUser`)
 * puis charge son profil et rôle autoritaire depuis PostgreSQL (`public.users`).
 * Ne fait jamais confiance aux `user_metadata` pour les décisions d'autorisation.
 */
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user || !user.email_confirmed_at) {
      return null;
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        role: true,
        firstname: true,
        lastname: true,
      },
    });

    if (!dbUser) {
      return null;
    }

    return {
      userId: dbUser.id,
      email: dbUser.email,
      role: dbUser.role,
      firstname: dbUser.firstname,
      lastname: dbUser.lastname,
    };
  } catch {
    return null;
  }
}

/**
 * Déconnecte la session Supabase Auth active et supprime les cookies associés.
 */
export async function destroySession(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
}
