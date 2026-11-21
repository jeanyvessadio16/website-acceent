// Constantes métier et helpers de sécurité partagés sur toute la plateforme ACCEENT

export type PostCategoryKey =
  | "EDUCATION"
  | "ENTREPRENEURIAT"
  | "NUMERIQUE"
  | "VIE_ASSOCIATIVE"
  | "EVENEMENT"
  | "GENERAL";

export type ProgramPoleKey = "EDUCATION" | "ENTREPRENEURIAT" | "NUMERIQUE";

export type ApplicationStatusKey =
  | "PENDING"
  | "REVIEWING"
  | "INTERVIEW"
  | "ACCEPTED"
  | "REJECTED";

export type ResourceTypeKey = "PDF" | "GUIDE" | "TEMPLATE" | "VIDEO" | "LINK";

export const POST_CATEGORIES: Record<
  PostCategoryKey,
  {
    label: string;
    badgeLight: string;
    badgeDark: string;
    badge: string;
  }
> = {
  EDUCATION: {
    label: "Éducation",
    badgeLight: "bg-[#836182]/10 text-[#836182] border-[#836182]/25",
    badgeDark: "bg-[#836182]/20 text-[#f4e6ea] border-[#836182]/40",
    badge:
      "bg-[#836182]/10 text-[#6d4c6c] border-[#836182]/25 dark:bg-[#836182]/25 dark:text-[#f4e6ea] dark:border-[#836182]/45",
  },
  ENTREPRENEURIAT: {
    label: "Entrepreneuriat",
    badgeLight: "bg-amber-500/10 text-amber-700 border-amber-500/25",
    badgeDark: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    badge:
      "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
  },
  NUMERIQUE: {
    label: "Numérique & Tech",
    badgeLight: "bg-cyan-500/10 text-cyan-700 border-cyan-500/25",
    badgeDark: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    badge:
      "bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30",
  },
  VIE_ASSOCIATIVE: {
    label: "Vie associative",
    badgeLight: "bg-emerald-500/10 text-emerald-700 border-emerald-500/25",
    badgeDark: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    badge:
      "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
  },
  EVENEMENT: {
    label: "Événement",
    badgeLight: "bg-rose-500/10 text-rose-700 border-rose-500/25",
    badgeDark: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    badge:
      "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30",
  },
  GENERAL: {
    label: "Publication",
    badgeLight: "bg-slate-100 text-slate-700 border-slate-200",
    badgeDark: "bg-white/10 text-zinc-300 border-white/15",
    badge:
      "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  },
};

export const PROGRAM_POLES: Record<
  ProgramPoleKey,
  {
    label: string;
    badgeLight: string;
    badgeDark: string;
    badge: string;
  }
> = {
  EDUCATION: {
    label: "Éducation",
    badgeLight: "bg-[#836182]/10 text-[#836182] border-[#836182]/25",
    badgeDark: "bg-[#836182]/20 text-[#b9939e] border-[#836182]/35",
    badge:
      "bg-[#836182]/10 text-[#6d4c6c] border-[#836182]/25 dark:bg-[#836182]/25 dark:text-[#f4e6ea] dark:border-[#836182]/45",
  },
  ENTREPRENEURIAT: {
    label: "Entrepreneuriat",
    badgeLight: "bg-amber-500/10 text-amber-700 border-amber-500/25",
    badgeDark: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    badge:
      "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
  },
  NUMERIQUE: {
    label: "Numérique",
    badgeLight: "bg-cyan-500/10 text-cyan-700 border-cyan-500/25",
    badgeDark: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    badge:
      "bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30",
  },
};

export const APPLICATION_STATUSES: Record<
  ApplicationStatusKey,
  {
    label: string;
    description: string;
    badgeDark: string;
    badge: string;
  }
> = {
  PENDING: {
    label: "Dossier déposé",
    description: "Votre candidature a bien été reçue et attend son examen.",
    badgeDark: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    badge:
      "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
  },
  REVIEWING: {
    label: "En cours d'étude",
    description: "L'équipe ACCEENT analyse actuellement votre dossier.",
    badgeDark: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    badge:
      "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30",
  },
  INTERVIEW: {
    label: "Entretien prévu",
    description: "Vous êtes présélectionné·e pour un entretien d'orientation.",
    badgeDark: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    badge:
      "bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30",
  },
  ACCEPTED: {
    label: "Validée",
    description: "Félicitations ! Votre candidature au programme est retenue.",
    badgeDark: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    badge:
      "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
  },
  REJECTED: {
    label: "Non retenue",
    description: "Votre dossier n'a pas été retenu pour cette cohorte.",
    badgeDark: "bg-red-500/15 text-red-300 border-red-500/30",
    badge:
      "bg-red-50 text-red-800 border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-red-500/30",
  },
};

export const RESOURCE_TYPES: Record<
  ResourceTypeKey,
  {
    label: string;
    badgeDark: string;
    badge: string;
  }
> = {
  PDF: {
    label: "Document PDF",
    badgeDark: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    badge:
      "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30",
  },
  GUIDE: {
    label: "Guide pratique",
    badgeDark: "bg-[#836182]/20 text-[#f4e6ea] border-[#836182]/40",
    badge:
      "bg-[#836182]/10 text-[#6d4c6c] border-[#836182]/25 dark:bg-[#836182]/25 dark:text-[#f4e6ea] dark:border-[#836182]/45",
  },
  TEMPLATE: {
    label: "Modèle / Canevas",
    badgeDark: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    badge:
      "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
  },
  VIDEO: {
    label: "Vidéo / Tutoriel",
    badgeDark: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    badge:
      "bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30",
  },
  LINK: {
    label: "Ressource externe",
    badgeDark: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    badge:
      "bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30",
  },
};

export interface AcceentProgramMeta {
  slug: string;
  name: string;
  pole: ProgramPoleKey;
  description: string;
  href: string;
}

export const ACCEENT_PROGRAMS: AcceentProgramMeta[] = [
  {
    slug: "acceent-incub",
    name: "ACCEENT Incub",
    pole: "ENTREPRENEURIAT",
    description:
      "Programme d'incubation de projets innovants : structuration du business model, mentorat et préparation à la levée de fonds.",
    href: "/acceent-incub",
  },
  {
    slug: "atelier-entreprenariat",
    name: "Atelier d'Entrepreneuriat",
    pole: "ENTREPRENEURIAT",
    description:
      "Sessions pratiques de formation à l'idéation, à la gestion financière et au leadership entrepreneurial.",
    href: "/atelier-entreprenariat",
  },
  {
    slug: "forum-entrepreneur",
    name: "Forum de l'Entrepreneur",
    pole: "ENTREPRENEURIAT",
    description:
      "Rencontres annuelles, tables rondes et réseautage entre porteurs de projets et acteurs économiques locaux.",
    href: "/forum-entrepreneur",
  },
  {
    slug: "acceent-elles",
    name: "ACCEENT-Elles",
    pole: "EDUCATION",
    description:
      "Programme dédié à l'autonomisation, au mentorat scolaire et au leadership des jeunes filles et des femmes.",
    href: "/acceent-elles",
  },
  {
    slug: "tut-tank",
    name: "Tut-Tank",
    pole: "EDUCATION",
    description:
      "Soutien scolaire intensif, remise à niveau scientifique et accès aux ressources méthodologiques pour les élèves et étudiants.",
    href: "/tut-tank",
  },
  {
    slug: "ai4good",
    name: "AI4Good",
    pole: "NUMERIQUE",
    description:
      "Initiation à l'intelligence artificielle, à l'éthique des données et à la création de solutions numériques à impact local.",
    href: "/ai4good",
  },
  {
    slug: "wro",
    name: "WRO Robotique",
    pole: "NUMERIQUE",
    description:
      "Préparation à la World Robot Olympiad : programmation, conception mécanique et travail en équipe pour les jeunes.",
    href: "/wro",
  },
];

export function getProgramBySlug(slug: string): AcceentProgramMeta | undefined {
  return ACCEENT_PROGRAMS.find((p) => p.slug === slug);
}

/**
 * Vérifie qu'une URL est sûre (bloque javascript:, data:, vbscript:, etc.).
 * Autorise uniquement http://, https:// ou un chemin relatif commençant par / (pas //).
 */
export function isSafeUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return true;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * Échappe une cellule CSV et neutralise l'injection de formules (=, +, -, @, \t, \r).
 */
export function escapeCsvCell(val: string | number | boolean | null | undefined): string {
  if (val === null || val === undefined) return '""';
  let str = String(val);
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

/**
 * Vérifie si une URL d'image peut être optimisée par Next/Image selon next.config.ts.
 */
export function isOptimizableImageUrl(src: string): boolean {
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    const parsed = new URL(src);
    return (
      parsed.hostname === "twizxowdhtmhwsytlztr.supabase.co" ||
      parsed.hostname === "images.unsplash.com"
    );
  } catch {
    return false;
  }
}
