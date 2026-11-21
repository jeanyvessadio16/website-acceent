import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

function getSupabaseCredentials() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Les variables d'environnement Supabase sont manquantes.");
  }

  return { url, key };
}

/**
 * Client Supabase côté serveur (@supabase/ssr) branché sur les cookies Next.js.
 * Toujours instancier par requête, jamais en singleton global.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const { url, key } = getSupabaseCredentials();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Appelé depuis un Server Component en lecture seule ; le proxy rafraîchit la session.
        }
      },
    },
  });
}

/**
 * Client Supabase sans persistance de session ni écriture de cookies
 * (utile lors de la création d'un utilisateur par un administrateur connecté).
 */
export function createSupabaseStatelessClient() {
  const { url, key } = getSupabaseCredentials();

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

/**
 * Client administrateur Supabase Auth côté serveur uniquement (nécessite SUPABASE_SERVICE_ROLE_KEY).
 * Retourne null si la clé service_role n'est pas configurée dans l'environnement.
 */
export function createSupabaseAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!serviceKey) return null;

  const { url } = getSupabaseCredentials();
  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
