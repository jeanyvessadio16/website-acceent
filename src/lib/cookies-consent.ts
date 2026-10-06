"use client";

export interface CookiePreferences {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  updatedAt: string;
}

export const COOKIE_CONSENT_KEY = "acceent_cookie_consent";

export const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: true,
  marketing: false,
  functional: true,
  updatedAt: new Date().toISOString(),
};

/**
  * Récupère les préférences de cookies sauvegardées.
  */
export function getStoredCookieConsent(): CookiePreferences | null {
  if (typeof window === "undefined") return null;

  try {
    const value = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${COOKIE_CONSENT_KEY}=`))
      ?.split("=")[1];

    if (value) {
      return JSON.parse(decodeURIComponent(value));
    }
  } catch (error) {
    console.error("Erreur lors de la lecture du cookie de consentement:", error);
  }

  return null;
}

/**
  * Sauvegarde les préférences de cookies avec une validité de 1 an.
  */
export function setStoredCookieConsent(prefs: Omit<CookiePreferences, "essential" | "updatedAt">): CookiePreferences {
  const fullPrefs: CookiePreferences = {
    essential: true,
    analytics: prefs.analytics,
    marketing: prefs.marketing,
    functional: prefs.functional,
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    const jsonValue = encodeURIComponent(JSON.stringify(fullPrefs));
    const oneYearSeconds = 365 * 24 * 60 * 60;
    document.cookie = `${COOKIE_CONSENT_KEY}=${jsonValue}; path=/; max-age=${oneYearSeconds}; SameSite=Lax; ${
      window.location.protocol === "https:" ? "Secure" : ""
    }`;

    // Émettre un événement personnalisé pour notifier les composants ou scripts (ex: GA, Facebook Pixel, etc.)
    window.dispatchEvent(new CustomEvent("acceent-cookie-consent-change", { detail: fullPrefs }));
  }

  return fullPrefs;
}

/**
  * Ouvre le modal de gestion des cookies depuis n'importe où dans l'application.
  */
export function openCookieSettings() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-acceent-cookie-settings"));
  }
}
