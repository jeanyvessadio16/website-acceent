import prisma from "@/lib/prisma";
import {
  ACCEENT_PROGRAMS,
  getProgramBySlug,
  type AcceentProgramMeta,
} from "@/lib/constants/platform";
import {
  buildProgramStatusMap,
  filterActivePrograms,
  mergeProgramsWithStatus,
  type ProgramWithStatus,
} from "@/lib/core/program-settings";

export type { ProgramWithStatus };

/**
 * Charge la table des paramètres de programmes et retourne une map slug -> active.
 * Tous les programmes absents de la table sont considérés comme actifs par défaut.
 */
export async function getProgramSettingsMap(): Promise<Map<string, boolean>> {
  const rows = await prisma.programSetting.findMany({
    select: { slug: true, active: true },
  });
  return buildProgramStatusMap(rows);
}

/**
 * Retourne tous les programmes ACCEENT enrichis avec leur statut d'ouverture actuel.
 */
export async function getProgramsWithStatus(): Promise<ProgramWithStatus[]> {
  const statusMap = await getProgramSettingsMap();
  return mergeProgramsWithStatus(ACCEENT_PROGRAMS, statusMap);
}

/**
 * Retourne uniquement les programmes actuellement ouverts aux candidatures.
 */
export async function getActivePrograms(): Promise<AcceentProgramMeta[]> {
  const statusMap = await getProgramSettingsMap();
  return filterActivePrograms(ACCEENT_PROGRAMS, statusMap);
}

/**
 * Vérifie côté serveur si un programme donné est connu et ouvert aux candidatures.
 */
export async function isProgramActive(slug: string): Promise<boolean> {
  const program = getProgramBySlug(slug);
  if (!program) return false;

  const row = await prisma.programSetting.findUnique({
    where: { slug: program.slug },
    select: { active: true },
  });
  return row ? row.active : true;
}
