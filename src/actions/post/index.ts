"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import {
  createPostSchema,
  updatePostSchema,
  SLUG_REGEX,
  type CreatePostInput,
  type UpdatePostInput,
} from "@/zodSchema/post";

// Helper pour générer un slug propre à partir d'un titre
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
    .replace(/[^a-z0-9\s-]/g, "") // Supprime les caractères spéciaux
    .trim()
    .replace(/\s+/g, "-") // Remplace les espaces par des tirets
    .replace(/-+/g, "-"); // Évite les tirets consécutifs
}

// ─── 1. Basculer l'état de publication d'un article (Publier / Dépublier) ────

export async function togglePublishPostAction(postId: string) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Non autorisé. Veuillez vous connecter." };
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, published: true, title: true },
    });

    if (!post) {
      return { success: false, message: "Article introuvable dans la base de données." };
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { published: !post.published },
    });

    revalidatePath("/actualites");
    revalidatePath("/actualites/[slug]", "page");
    revalidatePath("/admin/articles");
    revalidatePath("/admin");
    revalidatePath("/");

    const statusText = updatedPost.published ? "publié" : "passé en brouillon";
    return {
      success: true,
      published: updatedPost.published,
      message: `L'article "${updatedPost.title}" est désormais ${statusText}.`,
    };
  } catch (error) {
    console.error("[togglePublishPostAction] Erreur:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors du changement de statut de publication.",
    };
  }
}

// ─── 2. Publier / Créer un nouvel article ────────────────────────────────────

export async function createPostAction(data: CreatePostInput) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Non autorisé. Veuillez vous connecter." };
  }

  try {
    // Validation avec Zod
    const parseResult = createPostSchema.safeParse(data);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Données invalides.";
      return { success: false, message: firstError };
    }

    const validatedData = parseResult.data;

    // Génération du slug s'il n'est pas renseigné
    let slug = validatedData.slug?.trim();
    if (!slug) {
      slug = slugify(validatedData.title);
    } else if (!SLUG_REGEX.test(slug)) {
      slug = slugify(slug);
    }

    // Vérifier si le slug existe déjà
    const existingSlug = await prisma.post.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // Déterminer l'auteur (utilisateur connecté par défaut)
    const authorId = validatedData.authorId || session.userId;

    const newPost = await prisma.post.create({
      data: {
        title: validatedData.title,
        slug,
        content: validatedData.content,
        imageUrl: validatedData.imageUrl,
        published: validatedData.published ?? true, // Publié directement par défaut si formulaire soumis
        authorId,
      },
    });

    revalidatePath("/actualites");
    revalidatePath("/actualites/[slug]", "page");
    revalidatePath("/admin/articles");
    revalidatePath("/admin");
    revalidatePath("/");

    return {
      success: true,
      post: newPost,
      message: `L'article "${newPost.title}" a été créé et ${newPost.published ? "publié" : "enregistré comme brouillon"} avec succès !`,
    };
  } catch (error) {
    console.error("[createPostAction] Erreur:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la création de l'article.",
    };
  }
}

// ─── 3. Mettre à jour un article existant ────────────────────────────────────

export async function updatePostAction(id: string, data: UpdatePostInput) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Non autorisé. Veuillez vous connecter." };
  }

  try {
    const parseResult = updatePostSchema.safeParse(data);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Données invalides.";
      return { success: false, message: firstError };
    }

    const validatedData = parseResult.data;

    const existingPost = await prisma.post.findUnique({ where: { id } });
    if (!existingPost) {
      return { success: false, message: "Article introuvable." };
    }

    const updatePayload: Record<string, any> = {};

    if (validatedData.title !== undefined) updatePayload.title = validatedData.title;
    if (validatedData.content !== undefined) updatePayload.content = validatedData.content;
    if (validatedData.imageUrl !== undefined) updatePayload.imageUrl = validatedData.imageUrl;
    if (validatedData.published !== undefined) updatePayload.published = validatedData.published;
    if (validatedData.slug !== undefined && validatedData.slug !== existingPost.slug) {
      let slug = slugify(validatedData.slug);
      const slugCheck = await prisma.post.findFirst({
        where: { slug, NOT: { id } },
      });
      if (slugCheck) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }
      updatePayload.slug = slug;
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: updatePayload,
    });

    revalidatePath("/actualites");
    revalidatePath("/actualites/[slug]", "page");
    revalidatePath("/admin/articles");
    revalidatePath("/admin");
    revalidatePath("/");

    return {
      success: true,
      post: updatedPost,
      message: `L'article "${updatedPost.title}" a été mis à jour avec succès.`,
    };
  } catch (error) {
    console.error("[updatePostAction] Erreur:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la mise à jour de l'article.",
    };
  }
}

// ─── 4. Supprimer un article ──────────────────────────────────────────────────

export async function deletePostAction(postId: string) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Non autorisé." };
  }

  try {
    const post = await prisma.post.delete({
      where: { id: postId },
    });

    revalidatePath("/actualites");
    revalidatePath("/actualites/[slug]", "page");
    revalidatePath("/admin/articles");
    revalidatePath("/admin");
    revalidatePath("/");

    return {
      success: true,
      message: `L'article "${post.title}" a été supprimé avec succès.`,
    };
  } catch (error) {
    console.error("[deletePostAction] Erreur:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la suppression de l'article.",
    };
  }
}
