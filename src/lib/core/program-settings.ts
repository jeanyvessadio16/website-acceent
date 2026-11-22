import {
  ACCEENT_PROGRAMS,
  type AcceentProgramMeta,
} from "@/lib/constants/platform";

export type ProgramWithStatus = AcceentProgramMeta & { active: boolean };

/**
 * Construit une map slug -> statut actif depuis les lignes enregistrées en base.
 */
export function buildProgramStatusMap(
  rows: ReadonlyArray<{ slug: string; active: boolean }>
): Map<string, boolean> {
  const statusMap = new Map<string, boolean>();
  for (const row of rows) {
    statusMap.set(row.slug, row.active);
  }
  return statusMap;
}

/**
 * Fusionne la liste des programmes ACCEENT avec leur statut d'activation.
 * Tout programme absent de la table reste actif par défaut.
 */
export function mergeProgramsWithStatus(
  programs: ReadonlyArray<AcceentProgramMeta>,
  statusMap: ReadonlyMap<string, boolean>
): ProgramWithStatus[] {
  return programs.map((program) => ({
    ...program,
    active: statusMap.get(program.slug) ?? true,
  }));
}

/**
 * Ne conserve que les programmes actuellement ouverts aux candidatures.
 */
export function filterActivePrograms(
  programs: ReadonlyArray<AcceentProgramMeta>,
  statusMap: ReadonlyMap<string, boolean>
): AcceentProgramMeta[] {
  return programs.filter((program) => statusMap.get(program.slug) ?? true);
}

/**
 * Vérifie qu'un slug correspond à un programme connu et actuellement actif.
 */
export function isProgramSlugEnabled(
  slug: string,
  statusMap: ReadonlyMap<string, boolean>,
  programs: ReadonlyArray<AcceentProgramMeta> = ACCEENT_PROGRAMS
): boolean {
  const exists = programs.some((program) => program.slug === slug);
  if (!exists) return false;
  return statusMap.get(slug) ?? true;
}

/**
 * Valide un paramètre d'URL ?program=... uniquement s'il pointe vers un programme actif.
 */
export function resolveInitialProgramSlug(
  requestedSlug: string | undefined,
  activePrograms: ReadonlyArray<AcceentProgramMeta>
): string | undefined {
  if (!requestedSlug) return undefined;
  return activePrograms.some((program) => program.slug === requestedSlug)
    ? requestedSlug
    : undefined;
}
