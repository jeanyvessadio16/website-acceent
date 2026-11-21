import { z } from "zod";
import { isSafeUrl } from "@/lib/constants/platform";

// ─── Expressions régulières centralisées ─────────────────────────────────────

export const NAME_REGEX =
  /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '\u2019-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;

export const EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])\S{8,100}$/;

export const PHONE_REGEX = /^\+?[\d\s().-]{8,20}$/;

export const AGE_REGEX = /^(?:1[0-9]|[2-9][0-9]|1[01][0-9]|120)$/;

export const CITY_REGEX =
  /^[A-Za-zÀ-ÖØ-öø-ÿ0-9]+(?:[ '\u2019,/().-][A-Za-zÀ-ÖØ-öø-ÿ0-9]+)*$/;

export const SAFE_TEXT_REGEX = /^[^<>]*$/;

export const TAG_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9][A-Za-zÀ-ÖØ-öø-ÿ0-9 _-]{0,29}$/;

export const SAFE_URL_OR_PATH_REGEX =
  /^(?:\/(?!\/)[^\s]*|https?:\/\/[^\s/$.?#].[^\s]*)$/i;

export const ISO_DATETIME_REGEX =
  /^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?)?$/;

export const FILE_SIZE_REGEX =
  /^\d+(?:[.,]\d{1,2})?\s?(?:o|Ko|Mo|Go|min|h|MB|KB)$/i;

export const RESET_TOKEN_REGEX = /^[a-fA-F0-9]{10,128}$/;

export function isValidSenegalOrIntlPhone(val: string): boolean {
  const digits = val.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return false;
  if (digits.startsWith("221")) {
    return /^221(?:7[05678]|3[03]|6\d)\d{7}$/.test(digits);
  }
  if (digits.length === 9) {
    return /^(?:7[05678]|3[03]|6\d)\d{7}$/.test(digits);
  }
  return true;
}

// ─── Enums & Champs Zod réutilisables ────────────────────────────────────────

export const SexeSchema = z.enum(["HOMME", "FEMME"], {
  error: () => "Veuillez sélectionner Homme ou Femme.",
});

export const MilieuResidenceSchema = z.enum(["RURAL", "URBAIN"], {
  error: () => "Veuillez sélectionner Rural ou Urbain.",
});

export const emailFieldSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? "L'adresse e-mail est obligatoire."
        : "L'adresse e-mail n'est pas valide.",
  })
  .trim()
  .toLowerCase()
  .min(1, "L'adresse e-mail est obligatoire.")
  .max(254, "L'adresse e-mail ne peut pas dépasser 254 caractères.")
  .regex(EMAIL_REGEX, "Format d'adresse e-mail invalide (ex: nom@domaine.org).")
  .pipe(z.email("L'adresse e-mail n'est pas valide."));

export const phoneFieldSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? "Le numéro de téléphone est obligatoire."
        : "Le numéro de téléphone n'est pas valide.",
  })
  .trim()
  .min(8, "Le numéro de téléphone doit contenir au moins 8 caractères.")
  .max(20, "Le numéro de téléphone ne peut pas dépasser 20 caractères.")
  .regex(
    PHONE_REGEX,
    "Caractères autorisés : chiffres, espaces, +, parenthèses ou tirets."
  )
  .refine(
    isValidSenegalOrIntlPhone,
    "Format Sénégal (+221 7X XXX XX XX) ou international valide requis."
  );

export const optionalPhoneFieldSchema = z
  .string()
  .trim()
  .max(20, "Le numéro de téléphone ne peut pas dépasser 20 caractères.")
  .refine(
    (val) =>
      val === "" || (PHONE_REGEX.test(val) && isValidSenegalOrIntlPhone(val)),
    "Format Sénégal (+221 7X XXX XX XX) ou international valide requis."
  )
  .nullable()
  .optional();

export const requiredAgeFieldSchema = z
  .number({
    error: () => "Veuillez saisir votre âge (entre 10 et 120 ans).",
  })
  .int("L'âge doit être un nombre entier.")
  .min(10, "L'âge minimum est de 10 ans.")
  .max(120, "L'âge maximum est de 120 ans.")
  .refine(
    (n) => AGE_REGEX.test(String(n)),
    "L'âge doit être un entier compris entre 10 et 120."
  );

export const optionalAgeFieldSchema = z
  .number({
    error: () => "L'âge doit être un nombre entier valide.",
  })
  .int("L'âge doit être un nombre entier.")
  .min(10, "L'âge minimum est de 10 ans.")
  .max(120, "L'âge maximum est de 120 ans.")
  .refine(
    (n) => AGE_REGEX.test(String(n)),
    "L'âge doit être un entier compris entre 10 et 120."
  )
  .nullable()
  .optional();

export function safeUrlSchema(label = "L'URL") {
  return z
    .string()
    .trim()
    .regex(
      SAFE_URL_OR_PATH_REGEX,
      `${label} doit commencer par https://, http:// ou / sans espaces.`
    )
    .refine(isSafeUrl, `${label} est invalide ou non sécurisée.`);
}
