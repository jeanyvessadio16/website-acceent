"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, ShieldCheck, Check, X, Settings2, Lock, ChevronRight, Info } from "lucide-react";
import {
  getStoredCookieConsent,
  setStoredCookieConsent,
  CookiePreferences,
  DEFAULT_PREFERENCES,
} from "@/lib/cookies-consent";

export function CookieBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // État local des préférences lorsqu'on est en mode personnalisation
  const [preferences, setPreferences] = useState<Omit<CookiePreferences, "essential" | "updatedAt">>({
    analytics: DEFAULT_PREFERENCES.analytics,
    marketing: DEFAULT_PREFERENCES.marketing,
    functional: DEFAULT_PREFERENCES.functional,
  });

  useEffect(() => {
    // Vérification initiale du consentement
    const consent = getStoredCookieConsent();
    if (!consent) {
      // Petite temporisation pour une entrée fluide
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    } else {
      setPreferences({
        analytics: consent.analytics,
        marketing: consent.marketing,
        functional: consent.functional,
      });
    }
  }, []);

  useEffect(() => {
    // Écouteur pour ré-ouvrir le modal via le bouton du footer par exemple
    const handleOpenSettings = () => {
      const consent = getStoredCookieConsent();
      if (consent) {
        setPreferences({
          analytics: consent.analytics,
          marketing: consent.marketing,
          functional: consent.functional,
        });
      }
      setShowDetails(true);
      setIsOpen(true);
    };

    window.addEventListener("open-acceent-cookie-settings", handleOpenSettings);
    return () => {
      window.removeEventListener("open-acceent-cookie-settings", handleOpenSettings);
    };
  }, []);

  const handleAcceptAll = () => {
    setStoredCookieConsent({ analytics: true, marketing: true, functional: true });
    setIsOpen(false);
    setShowDetails(false);
  };

  const handleRefuseAll = () => {
    setStoredCookieConsent({ analytics: false, marketing: false, functional: false });
    setIsOpen(false);
    setShowDetails(false);
  };

  const handleSaveCustom = () => {
    setStoredCookieConsent(preferences);
    setIsOpen(false);
    setShowDetails(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-none flex items-end sm:items-bottom justify-center p-3 sm:p-6">
        {/* Backdrop quand le mode personnalisé est ouvert */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetails(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs pointer-events-auto z-0"
          />
        )}

        {/* Panneau principal du Cookie Banner */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-2xl bg-slate-900/95 backdrop-blur-2xl border border-slate-800/90 text-slate-100 shadow-2xl rounded-3xl p-5 sm:p-7 pointer-events-auto z-10 overflow-hidden ring-1 ring-white/10"
        >
          {/* Ligne lumineuse en haut */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#836182] via-pink-500 to-[#836182]" />

          {/* Header du banner */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-[#836182]/20 border border-[#836182]/40 text-[#836182] flex items-center justify-center shrink-0">
                <Cookie className="size-6 text-pink-400" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  Respect de votre vie privée
                  <ShieldCheck className="size-4 text-emerald-400" />
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Association ACCEENT Ziguinchor
                </p>
              </div>
            </div>

            {/* Bouton de fermeture si le consentement est déjà enregistré */}
            {getStoredCookieConsent() && (
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="size-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                title="Fermer"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
            Nous utilisons des cookies pour optimiser votre expérience, mesurer l&apos;audience de nos programmes et sécuriser le site d&apos;ACCEENT. Vous pouvez personnaliser vos choix à tout moment.
          </p>

          {/* ── MODE DÉTAILS / PERSONNALISATION ────────────────────────────── */}
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3 mb-6 pt-3 border-t border-slate-800 max-h-[50vh] overflow-y-auto pr-1"
            >
              {/* 1. Cookies Essentiels (Obligatoires) */}
              <div className="p-3.5 rounded-2xl bg-slate-850/80 border border-slate-800 flex items-center justify-between gap-4">
                <div className="space-y-1 pr-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <span>Cookies Essentiels & Sécurité</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 font-semibold">
                      <Lock className="size-2.5" /> Toujours actifs
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Indispensables au fonctionnement du site, à l&apos;authentification et à la mémorisation de vos choix de confidentialité.
                  </p>
                </div>
                <div className="shrink-0 size-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <Check className="size-3.5" />
                </div>
              </div>

              {/* 2. Cookies Analytics */}
              <div className="p-3.5 rounded-2xl bg-slate-850/80 border border-slate-800 flex items-center justify-between gap-4">
                <div className="space-y-1 pr-2">
                  <span className="text-xs font-bold text-white">Statistiques & Mesure d&apos;audience</span>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Nous permettent d&apos;analyser la fréquentation du site et l&apos;impact de nos actualités à Ziguinchor (ex: Google Analytics anonymisé).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreferences((prev) => ({ ...prev, analytics: !prev.analytics }))}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    preferences.analytics ? "bg-[#836182]" : "bg-slate-700"
                  }`}
                  role="switch"
                  aria-checked={preferences.analytics}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      preferences.analytics ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* 3. Cookies Fonctionnels & Contenus enrichis */}
              <div className="p-3.5 rounded-2xl bg-slate-850/80 border border-slate-800 flex items-center justify-between gap-4">
                <div className="space-y-1 pr-2">
                  <span className="text-xs font-bold text-white">Fonctionnalités & Médias intégrés</span>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Améliorent la fluidité de navigation et permettent l&apos;affichage de vidéos et cartes interactives.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreferences((prev) => ({ ...prev, functional: !prev.functional }))}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    preferences.functional ? "bg-[#836182]" : "bg-slate-700"
                  }`}
                  role="switch"
                  aria-checked={preferences.functional}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      preferences.functional ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* 4. Cookies Marketing / Réseaux Sociaux */}
              <div className="p-3.5 rounded-2xl bg-slate-850/80 border border-slate-800 flex items-center justify-between gap-4">
                <div className="space-y-1 pr-2">
                  <span className="text-xs font-bold text-white">Réseaux sociaux & Partage</span>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Facilitent le partage de nos initiatives et articles sur les réseaux sociaux.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreferences((prev) => ({ ...prev, marketing: !prev.marketing }))}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    preferences.marketing ? "bg-[#836182]" : "bg-slate-700"
                  }`}
                  role="switch"
                  aria-checked={preferences.marketing}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      preferences.marketing ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── BOUTONS D'ACTION ────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2">
            {!showDetails ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowDetails(true)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer border border-slate-700/60"
                >
                  <Settings2 className="size-3.5 text-pink-400" />
                  <span>Personnaliser</span>
                  <ChevronRight className="size-3.5 opacity-60" />
                </button>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRefuseAll}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer border border-slate-700/70"
                  >
                    Tout refuser
                  </button>

                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#836182] hover:bg-[#6d4c6c] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    Tout accepter
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  Retour
                </button>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRefuseAll}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Tout refuser
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveCustom}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#836182] hover:bg-[#6d4c6c] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    Enregistrer mes choix
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
