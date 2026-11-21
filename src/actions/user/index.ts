"use server";

import prisma from "@/lib/prisma";
import { createSession } from "@/lib/session";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import type { MilieuResidence, Role, Sexe } from "@/generated/prisma/client";
import {
  requireSession,
  requireAdmin,
  fromZodError,
  handleActionError,
  recordAuditLog,
  ok,
  fail,
} from "@/lib/core";
import {
  updateProfileSchema,
  adminCreateUserSchema,
  adminUpdateUserSchema,
  type UpdateProfileInput,
} from "@/validation/user";

export type { UpdateProfileInput };

export interface UpdateUserInput {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: "USER" | "AUTHOR" | "ADMIN";
  age?: number | null;
  sexe?: "HOMME" | "FEMME" | null;
  milieuResidence?: "RURAL" | "URBAIN" | null;
  telephone?: string | null;
  sdh?: boolean;
}

export interface CreateUserInput {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: "USER" | "AUTHOR" | "ADMIN";
  age?: number | null;
  sexe?: "HOMME" | "FEMME" | null;
  milieuResidence?: "RURAL" | "URBAIN" | null;
  telephone?: string | null;
  sdh?: boolean;
}

export async function updateProfileAction(data: UpdateProfileInput) {
  const guard = await requireSession();
  if (!guard.authorized) return guard.response;

  const parsed = updateProfileSchema.safeParse(data);
  if (!parsed.success) return fromZodError(parsed.error);

  const {
    firstname,
    lastname,
    email,
    password,
    age,
    sexe,
    milieuResidence,
    telephone,
    sdh,
  } = parsed.data;

  try {
    if (email !== guard.session.email.toLowerCase()) {
      const existing = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
      if (existing && existing.id !== guard.session.userId) {
        return fail(
          "Cette adresse e-mail est déjà utilisée par un autre compte.",
          "CONFLICT"
        );
      }
    }

    const updateData: {
      firstname: string;
      lastname: string;
      email: string;
      age: number | null;
      sexe: Sexe | null;
      milieuResidence: MilieuResidence | null;
      telephone: string | null;
      sdh: boolean;
      password?: string;
    } = {
      firstname,
      lastname,
      email,
      age: age ?? null,
      sexe: (sexe as Sexe | null) ?? null,
      milieuResidence: (milieuResidence as MilieuResidence | null) ?? null,
      telephone: telephone && telephone.trim() ? telephone.trim() : null,
      sdh,
    };

    const passwordChanged = Boolean(password && password.length > 0);
    if (password && password.length > 0) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const updatedUser = await prisma.user.update({
      where: { id: guard.session.userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        firstname: true,
        lastname: true,
      },
    });

    await createSession({
      userId: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
    });

    await recordAuditLog({
      session: guard.session,
      action: "PROFILE_UPDATED",
      entity: "User",
      entityId: updatedUser.id,
      metadata: { passwordChanged },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/parametres");
    revalidatePath("/admin/utilisateurs");
    revalidatePath("/dashboard/profil");

    return ok("Vos informations ont été mises à jour avec succès !");
  } catch (error) {
    return handleActionError(
      "actions.user.updateProfile",
      error,
      "Une erreur est survenue lors de la mise à jour du profil."
    );
  }
}

export async function updateUserAction(data: UpdateUserInput) {
  const guard = await requireAdmin();
  if (!guard.authorized) return guard.response;

  const parsed = adminUpdateUserSchema.safeParse(data);
  if (!parsed.success) return fromZodError(parsed.error);

  const {
    id,
    firstname,
    lastname,
    email,
    role,
    age,
    sexe,
    milieuResidence,
    telephone,
    sdh,
  } = parsed.data;

  try {
    const existing = await prisma.user.findFirst({
      where: { email, NOT: { id } },
      select: { id: true },
    });

    if (existing) {
      return fail("Cet e-mail est déjà utilisé par un autre membre.", "CONFLICT");
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        firstname,
        lastname,
        email,
        role: role as Role,
        age: age ?? null,
        sexe: (sexe as Sexe | null) ?? null,
        milieuResidence: (milieuResidence as MilieuResidence | null) ?? null,
        telephone: telephone && telephone.trim() ? telephone.trim() : null,
        sdh,
      },
      select: {
        id: true,
        email: true,
        role: true,
        firstname: true,
        lastname: true,
      },
    });

    if (guard.session.userId === updated.id) {
      await createSession({
        userId: updated.id,
        email: updated.email,
        role: updated.role,
        firstname: updated.firstname,
        lastname: updated.lastname,
      });
    }

    await recordAuditLog({
      session: guard.session,
      action: "USER_UPDATED",
      entity: "User",
      entityId: updated.id,
      metadata: { targetEmail: updated.email, assignedRole: updated.role },
    });

    revalidatePath("/admin/utilisateurs");
    revalidatePath("/admin");

    return ok("Informations de l'utilisateur mises à jour !");
  } catch (error) {
    return handleActionError(
      "actions.user.updateUser",
      error,
      "Erreur lors de la modification de l'utilisateur."
    );
  }
}

export async function deleteUserAction(userId: string) {
  const guard = await requireAdmin();
  if (!guard.authorized) return guard.response;

  if (guard.session.userId === userId) {
    return fail(
      "Vous ne pouvez pas supprimer le compte actuellement connecté.",
      "VALIDATION_ERROR"
    );
  }

  try {
    const deleted = await prisma.user.delete({
      where: { id: userId },
      select: { id: true, email: true, role: true },
    });

    await recordAuditLog({
      session: guard.session,
      action: "USER_DELETED",
      entity: "User",
      entityId: deleted.id,
      metadata: { targetEmail: deleted.email, previousRole: deleted.role },
    });

    revalidatePath("/admin/utilisateurs");
    revalidatePath("/admin");
    return ok("Utilisateur supprimé avec succès.");
  } catch (error) {
    return handleActionError(
      "actions.user.deleteUser",
      error,
      "Erreur lors de la suppression de l'utilisateur."
    );
  }
}

export async function createUserAction(data: CreateUserInput) {
  const guard = await requireAdmin();
  if (!guard.authorized) return guard.response;

  const parsed = adminCreateUserSchema.safeParse(data);
  if (!parsed.success) return fromZodError(parsed.error);

  const {
    firstname,
    lastname,
    email,
    password,
    role,
    age,
    sexe,
    milieuResidence,
    telephone,
    sdh,
  } = parsed.data;

  try {
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existing) {
      return fail("Un compte existe déjà avec cette adresse e-mail.", "CONFLICT");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const created = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashedPassword,
        role: role as Role,
        age: age ?? null,
        sexe: (sexe as Sexe | null) ?? null,
        milieuResidence: (milieuResidence as MilieuResidence | null) ?? null,
        telephone: telephone && telephone.trim() ? telephone.trim() : null,
        sdh,
      },
      select: { id: true, email: true, role: true },
    });

    await recordAuditLog({
      session: guard.session,
      action: "USER_CREATED",
      entity: "User",
      entityId: created.id,
      metadata: { targetEmail: created.email, assignedRole: created.role },
    });

    revalidatePath("/admin/utilisateurs");
    revalidatePath("/admin");

    return ok(`L'utilisateur ${firstname} ${lastname} a été créé avec le rôle ${role} !`);
  } catch (error) {
    return handleActionError(
      "actions.user.createUser",
      error,
      "Une erreur est survenue lors de la création de l'utilisateur."
    );
  }
}
