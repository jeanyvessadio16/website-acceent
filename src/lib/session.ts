import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";

// ─── Configuration ────────────────────────────────────────────────────────────

const SESSION_COOKIE = "acceent_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 jours en secondes

function getSecret(): Uint8Array {
    const secret = process.env.SESSION_SECRET;
    if (!secret) {
        throw new Error(
            "Variable d'environnement SESSION_SECRET manquante. Ajoutez-la dans .env.local."
        );
    }
    return new TextEncoder().encode(secret);
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SessionPayload extends JWTPayload {
    userId: string;
    email: string;
    role: string;
    firstname: string;
    lastname: string;
}

// ─── Création & lecture du token ─────────────────────────────────────────────

/**
 * Signe un JWT contenant les données de session.
 */
export async function signSession(payload: SessionPayload): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(`${SESSION_MAX_AGE}s`)
        .sign(getSecret());
}

/**
 * Vérifie et decode un JWT de session.
 * Retourne null si le token est invalide ou expiré.
 */
export async function verifySession(
    token: string
): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(token, getSecret());
        return payload as SessionPayload;
    } catch {
        return null;
    }
}

// ─── Cookie de session ────────────────────────────────────────────────────────

/**
 * Crée et pose le cookie de session httpOnly après connexion.
 */
export async function createSession(payload: SessionPayload): Promise<void> {
    const token = await signSession(payload);
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_MAX_AGE,
        path: "/",
    });
}

/**
 * Lit et vérifie la session depuis le cookie.
 * Retourne null si absent ou invalide.
 */
export async function getSession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    return verifySession(token);
}

/**
 * Supprime le cookie de session (déconnexion).
 */
export async function destroySession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
}
