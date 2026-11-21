import { getSession, type SessionPayload } from "@/lib/session";
import { fail, type ActionResult } from "./result";

export type GuardResult =
  | { authorized: true; session: SessionPayload }
  | { authorized: false; response: ActionResult<never> };

export async function requireSession(): Promise<GuardResult> {
  const session = await getSession();
  if (!session) {
    return {
      authorized: false,
      response: fail("Authentification requise. Veuillez vous connecter.", "UNAUTHORIZED"),
    };
  }
  return { authorized: true, session };
}

export async function requireAdmin(): Promise<GuardResult> {
  const base = await requireSession();
  if (!base.authorized) return base;
  if (base.session.role !== "ADMIN") {
    return {
      authorized: false,
      response: fail("Accès refusé. Rôle administrateur requis.", "FORBIDDEN"),
    };
  }
  return base;
}

export async function requireAuthorOrAdmin(): Promise<GuardResult> {
  const base = await requireSession();
  if (!base.authorized) return base;
  if (base.session.role !== "ADMIN" && base.session.role !== "AUTHOR") {
    return {
      authorized: false,
      response: fail("Accès refusé. Rôle administrateur ou auteur requis.", "FORBIDDEN"),
    };
  }
  return base;
}

export function canManageOwnedResource(session: SessionPayload, ownerId: string): boolean {
  return session.role === "ADMIN" || session.userId === ownerId;
}
