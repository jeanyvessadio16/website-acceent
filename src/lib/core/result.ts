import type { ZodError } from "zod";
import { logger } from "./logger";

export type ActionErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

export type ActionResult<T = undefined> =
  | {
      success: true;
      message: string;
      data?: T;
    }
  | {
      success: false;
      code: ActionErrorCode;
      message: string;
      fieldErrors?: Record<string, string>;
    };

export function ok<T = undefined>(message: string, data?: T): ActionResult<T> {
  return data !== undefined ? { success: true, message, data } : { success: true, message };
}

export function fail(
  message: string,
  code: ActionErrorCode = "INTERNAL_ERROR",
  fieldErrors?: Record<string, string>
): ActionResult<never> {
  return fieldErrors ? { success: false, code, message, fieldErrors } : { success: false, code, message };
}

export function fromZodError(
  zodError: ZodError,
  fallbackMessage = "Veuillez corriger les erreurs dans le formulaire."
): ActionResult<never> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of zodError.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  const firstMessage = zodError.issues[0]?.message || fallbackMessage;
  return fail(firstMessage, "VALIDATION_ERROR", fieldErrors);
}

export function handleActionError(
  scope: string,
  error: unknown,
  fallbackMessage: string
): ActionResult<never> {
  logger.error(scope, fallbackMessage, error);

  if (typeof error === "object" && error !== null && "code" in error) {
    const prismaCode = (error as { code?: unknown }).code;
    if (prismaCode === "P2002") {
      return fail("Un enregistrement identique existe déjà.", "CONFLICT");
    }
    if (prismaCode === "P2025") {
      return fail("Élément introuvable ou déjà supprimé.", "NOT_FOUND");
    }
    if (prismaCode === "P2003") {
      return fail("Référence liée invalide.", "VALIDATION_ERROR");
    }
  }

  return fail(fallbackMessage, "INTERNAL_ERROR");
}
