"use server";

import prisma from "@/lib/prisma";
import { getSession, createSession } from "@/lib/session";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { Role } from "@/generated/prisma/client";

// ─── Mise à jour du profil personnel ─────────────────────────────────────────

export interface UpdateProfileInput {
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
}

export async function updateProfileAction(data: UpdateProfileInput) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Non autorisé. Veuillez vous connecter." };
  }

  try {
    const firstname = data.firstname.trim();
    const lastname = data.lastname.trim();
    const email = data.email.trim().toLowerCase();

    if (!firstname || !lastname || !email) {
      return { success: false, message: "Le prénom, le nom et l'e-mail sont obligatoires." };
    }

    // Vérification de l'unicité de l'e-mail s'il a changé
    if (email !== session.email.toLowerCase()) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing && existing.id !== session.userId) {
        return {
          success: false,
          message: "Cette adresse e-mail est déjà utilisée par un autre compte.",
        };
      }
    }

    const updateData: {
      firstname: string;
      lastname: string;
      email: string;
      password?: string;
    } = {
      firstname,
      lastname,
      email,
    };

    if (data.password && data.password.trim().length >= 8) {
      updateData.password = await bcrypt.hash(data.password.trim(), 12);
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: updateData,
    });

    // Mise à jour du cookie de session actif
    await createSession({
      userId: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
    });

    revalidatePath("/admin");
    revalidatePath("/admin/parametres");
    revalidatePath("/admin/utilisateurs");

    return {
      success: true,
      message: "Vos informations ont été mises à jour avec succès !",
    };
  } catch (error) {
    console.error("[updateProfileAction] Erreur:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la mise à jour du profil.",
    };
  }
}

// ─── Mise à jour d'un utilisateur par un admin ─────────────────────────────

export interface UpdateUserInput {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: "USER" | "AUTHOR" | "ADMIN";
}

export async function updateUserAction(data: UpdateUserInput) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Non autorisé." };
  }

  try {
    const firstname = data.firstname.trim();
    const lastname = data.lastname.trim();
    const email = data.email.trim().toLowerCase();

    // Vérifier si l'e-mail appartient à un autre utilisateur
    const existing = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: data.id },
      },
    });

    if (existing) {
      return { success: false, message: "Cet e-mail est déjà utilisé par un autre membre." };
    }

    const updated = await prisma.user.update({
      where: { id: data.id },
      data: {
        firstname,
        lastname,
        email,
        role: data.role as Role,
      },
    });

    // Si l'utilisateur a modifié son propre profil dans le tableau des utilisateurs, on met à jour la session
    if (session.userId === updated.id) {
      await createSession({
        userId: updated.id,
        email: updated.email,
        role: updated.role,
        firstname: updated.firstname,
        lastname: updated.lastname,
      });
    }

    revalidatePath("/admin/utilisateurs");
    revalidatePath("/admin");

    return { success: true, message: "Informations de l'utilisateur mises à jour !" };
  } catch (error) {
    console.error("[updateUserAction] Erreur:", error);
    return { success: false, message: "Erreur lors de la modification de l'utilisateur." };
  }
}

// ─── Suppression d'un utilisateur par un admin ──────────────────────────────

export async function deleteUserAction(userId: string) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Non autorisé." };
  }

  if (session.userId === userId) {
    return {
      success: false,
      message: "Vous ne pouvez pas supprimer le compte actuellement connecté.",
    };
  }

  try {
    await prisma.user.delete({ where: { id: userId } });
    revalidatePath("/admin/utilisateurs");
    revalidatePath("/admin");
    return { success: true, message: "Utilisateur supprimé avec succès." };
  } catch (error) {
    console.error("[deleteUserAction] Erreur:", error);
    return { success: false, message: "Erreur lors de la suppression de l'utilisateur." };
  }
}

// ─── Création d'un nouvel utilisateur par un admin ──────────────────────────

export interface CreateUserInput {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: "USER" | "AUTHOR" | "ADMIN";
}

export async function createUserAction(data: CreateUserInput) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Non autorisé. Veuillez vous connecter." };
  }

  try {
    const firstname = data.firstname.trim();
    const lastname = data.lastname.trim();
    const email = data.email.trim().toLowerCase();
    const password = data.password.trim();
    const role = data.role;

    if (!firstname || !lastname || !email || !password) {
      return { success: false, message: "Tous les champs sont obligatoires." };
    }

    if (password.length < 8) {
      return { success: false, message: "Le mot de passe doit contenir au moins 8 caractères." };
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, message: "Un compte existe déjà avec cette adresse e-mail." };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashedPassword,
        role: role as Role,
      },
    });

    revalidatePath("/admin/utilisateurs");
    revalidatePath("/admin");

    return {
      success: true,
      message: `L'utilisateur ${firstname} ${lastname} a été créé avec le rôle ${role} !`,
    };
  } catch (error) {
    console.error("[createUserAction] Erreur:", error);
    return { success: false, message: "Une erreur est survenue lors de la création de l'utilisateur." };
  }
}
