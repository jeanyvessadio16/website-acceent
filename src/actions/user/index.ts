"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { MilieuResidence, Role, Sexe } from "@/generated/prisma/client";
import {
  createSupabaseAdminClient,
  createSupabaseServerClient,
  createSupabaseStatelessClient,
} from "@/lib/supabase/server";
import {
  requireSession,
  requireAdmin,
  fromZodError,
  handleActionError,
  recordAuditLog,
  deleteUserCompletely,
  getRequestOrigin,
  logger,
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
  age: number;
  sexe: "HOMME" | "FEMME";
  milieuResidence: "RURAL" | "URBAIN";
  telephone: string;
  sdh: boolean;
}

export interface CreateUserInput {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: "USER" | "AUTHOR" | "ADMIN";
  age: number;
  sexe: "HOMME" | "FEMME";
  milieuResidence: "RURAL" | "URBAIN";
  telephone: string;
  sdh: boolean;
}

export async function updateProfileAction(data: UpdateProfileInput) {
  const guard = await requireSession();
  if (!guard.authorized) return guard.response;

  const parsed = updateProfileSchema.safeParse(data);
  if (!parsed.success) return fromZodError(parsed.error);

  const {
    firstname,
    lastname,
    password,
    age,
    sexe,
    milieuResidence,
    telephone,
    sdh,
  } = parsed.data;

  try {
    const existing = await prisma.user.findFirst({
      where: {
        telephone,
        NOT: { id: guard.session.userId },
      },
      select: { id: true },
    });
    if (existing) {
      return fail(
        "Ce numéro de téléphone est déjà utilisé par un autre compte.",
        "CONFLICT"
      );
    }

    const passwordChanged = Boolean(password && password.length > 0);

    if (passwordChanged) {
      const supabase = await createSupabaseServerClient();
      const { error: authError } = await supabase.auth.updateUser({
        password,
      });

      if (authError) {
        return fail(
          "Impossible de mettre à jour le mot de passe dans Supabase Auth. Veuillez réessayer.",
          "VALIDATION_ERROR"
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: guard.session.userId },
      data: {
        firstname,
        lastname,
        age,
        sexe: sexe as Sexe,
        milieuResidence: milieuResidence as MilieuResidence,
        telephone,
        sdh,
      },
      select: { id: true },
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
    const existingTarget = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true },
    });
    if (!existingTarget) {
      return fail("Utilisateur introuvable.", "NOT_FOUND");
    }

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { telephone }],
        NOT: { id },
      },
      select: { email: true, telephone: true },
    });

    if (existing) {
      if (existing.email === email) {
        return fail("Cet e-mail est déjà utilisé par un autre membre.", "CONFLICT");
      }
      return fail(
        "Ce numéro de téléphone est déjà utilisé par un autre membre.",
        "CONFLICT"
      );
    }

    if (email !== existingTarget.email.toLowerCase()) {
      const adminClient = createSupabaseAdminClient();
      if (!adminClient) {
        return fail(
          "Pour modifier l'adresse e-mail d'un autre utilisateur dans Supabase Auth, configurez SUPABASE_SERVICE_ROLE_KEY côté serveur.",
          "VALIDATION_ERROR"
        );
      }

      const { error: authErr } = await adminClient.auth.admin.updateUserById(id, {
        email,
        email_confirm: true,
      });
      if (authErr) {
        logger.warn("actions.user.updateUser", "Échec mise à jour e-mail Supabase Auth", {
          userId: id,
          code: authErr.code,
          message: authErr.message,
        });
        return fail(
          "Impossible de mettre à jour l'adresse e-mail dans Supabase Auth.",
          "CONFLICT"
        );
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        firstname,
        lastname,
        email,
        role: role as Role,
        age,
        sexe: sexe as Sexe,
        milieuResidence: milieuResidence as MilieuResidence,
        telephone,
        sdh,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

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

  if (!userId?.trim()) {
    return fail("Identifiant utilisateur invalide.", "VALIDATION_ERROR");
  }

  if (guard.session.userId === userId) {
    return fail(
      "Vous ne pouvez pas supprimer le compte actuellement connecté.",
      "VALIDATION_ERROR"
    );
  }

  try {
    const target = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true },
    });

    if (!target) {
      return fail("Utilisateur introuvable.", "NOT_FOUND");
    }

    const { deletedUser, deletedAuthVia, deletedAuthRows } =
      await deleteUserCompletely(target);

    await recordAuditLog({
      session: guard.session,
      action: "USER_DELETED",
      entity: "User",
      entityId: deletedUser.id,
      metadata: {
        targetEmail: deletedUser.email,
        previousRole: deletedUser.role,
        deletedAuthVia,
        deletedAuthRows,
      },
    });

    revalidatePath("/admin/utilisateurs");
    revalidatePath("/admin");
    revalidatePath("/admin/newsletter");
    return ok(
      "Utilisateur supprimé définitivement de la base de données et de l'authentification."
    );
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
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { telephone }] },
      select: { email: true, telephone: true },
    });
    if (existing) {
      if (existing.email === email) {
        return fail("Un compte existe déjà avec cette adresse e-mail.", "CONFLICT");
      }
      return fail("Un compte existe déjà avec ce numéro de téléphone.", "CONFLICT");
    }

    const origin = await getRequestOrigin();
    const supabase = createSupabaseStatelessClient();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/confirm`,
        data: { firstname, lastname },
      },
    });

    if (
      authError ||
      !authData.user ||
      (authData.user.identities && authData.user.identities.length === 0)
    ) {
      if (authError) {
        logger.warn(
          "actions.user.createUser",
          "Erreur Supabase Auth lors de la création de compte",
          {
            name: authError.name,
            status: authError.status,
            code: authError.code,
            message: authError.message,
          }
        );
      }
      return fail(
        "Impossible de créer ce compte dans Supabase Auth (e-mail déjà utilisé ou mot de passe refusé).",
        "CONFLICT"
      );
    }

    const created = await prisma.user.create({
      data: {
        id: authData.user.id,
        firstname,
        lastname,
        email,
        password: null,
        role: role as Role,
        age,
        sexe: sexe as Sexe,
        milieuResidence: milieuResidence as MilieuResidence,
        telephone,
        sdh,
        emailVerifiedAt: authData.user.email_confirmed_at
          ? new Date(authData.user.email_confirmed_at)
          : null,
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

    return ok(
      `L'utilisateur ${firstname} ${lastname} a été créé (${role}) et un e-mail de confirmation a été envoyé !`
    );
  } catch (error) {
    return handleActionError(
      "actions.user.createUser",
      error,
      "Une erreur est survenue lors de la création de l'utilisateur."
    );
  }
}
