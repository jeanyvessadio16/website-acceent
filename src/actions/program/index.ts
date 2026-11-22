"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getProgramBySlug } from "@/lib/constants/platform";
import {
  fail,
  fromZodError,
  handleActionError,
  ok,
  recordAuditLog,
  requireAdmin,
} from "@/lib/core";

const toggleProgramActiveSchema = z.object({
  slug: z.string().trim().min(1, "Programme requis."),
  active: z.boolean(),
});

export async function toggleProgramActiveAction(input: {
  slug: string;
  active: boolean;
}) {
  const guard = await requireAdmin();
  if (!guard.authorized) return guard.response;

  const parsed = toggleProgramActiveSchema.safeParse(input);
  if (!parsed.success) return fromZodError(parsed.error);

  const program = getProgramBySlug(parsed.data.slug);
  if (!program) {
    return fail("Programme introuvable.", "NOT_FOUND");
  }

  try {
    await prisma.programSetting.upsert({
      where: { slug: program.slug },
      create: {
        slug: program.slug,
        active: parsed.data.active,
        updatedById: guard.session.userId,
      },
      update: {
        active: parsed.data.active,
        updatedById: guard.session.userId,
      },
    });

    await recordAuditLog({
      session: guard.session,
      action: "PROGRAM_STATUS_UPDATED",
      entity: "ProgramSetting",
      entityId: program.slug,
      metadata: {
        programName: program.name,
        pole: program.pole,
        active: parsed.data.active,
      },
    });

    revalidatePath("/admin/parametres");
    revalidatePath("/admin");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/programmes");
    revalidatePath("/dashboard/candidatures");

    return ok(
      parsed.data.active
        ? `Les candidatures pour ${program.name} sont désormais ouvertes.`
        : `Les candidatures pour ${program.name} sont désormais fermées.`,
      { slug: program.slug, active: parsed.data.active }
    );
  } catch (error) {
    return handleActionError(
      "actions.program.toggleActive",
      error,
      "Impossible de mettre à jour le statut du programme."
    );
  }
}
