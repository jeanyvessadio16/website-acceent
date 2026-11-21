"use server";

import prisma from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import {
  requireAuthorOrAdmin,
  canManageOwnedResource,
  slugify,
  fromZodError,
  handleActionError,
  recordAuditLog,
} from "@/lib/core";
import {
  createPostSchema,
  updatePostSchema,
  SLUG_REGEX,
  type CreatePostInput,
  type UpdatePostInput,
} from "@/validation/post";

function revalidatePostPaths() {
  try {
    revalidatePath("/actualites");
    revalidatePath("/actualites/[id]", "page");
    revalidatePath("/admin/articles");
    revalidatePath("/admin");
    revalidatePath("/");
  } catch {
    // Hors contexte HTTP standard
  }
}

export async function togglePublishPostAction(postId: string) {
  const guard = await requireAuthorOrAdmin();
  if (!guard.authorized) return guard.response;

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, published: true, title: true, authorId: true },
    });

    if (!post) {
      return { success: false, message: "Article introuvable dans la base de données." };
    }

    if (!canManageOwnedResource(guard.session, post.authorId)) {
      return { success: false, message: "Vous n'êtes pas autorisé à modifier cet article." };
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { published: !post.published },
    });

    await recordAuditLog({
      session: guard.session,
      action: "POST_TOGGLE_PUBLISH",
      entity: "Post",
      entityId: updatedPost.id,
      metadata: { title: updatedPost.title, published: updatedPost.published },
    });

    revalidatePostPaths();

    const statusText = updatedPost.published ? "publié" : "passé en brouillon";
    return {
      success: true,
      published: updatedPost.published,
      message: `L'article "${updatedPost.title}" est désormais ${statusText}.`,
    };
  } catch (error) {
    return handleActionError(
      "actions.post.togglePublish",
      error,
      "Une erreur est survenue lors du changement de statut de publication."
    );
  }
}

export async function createPostAction(data: CreatePostInput) {
  const guard = await requireAuthorOrAdmin();
  if (!guard.authorized) return guard.response;

  const parseResult = createPostSchema.safeParse(data);
  if (!parseResult.success) {
    return fromZodError(parseResult.error);
  }

  const validatedData = parseResult.data;

  try {
    let slug = validatedData.slug?.trim();
    if (!slug) {
      slug = slugify(validatedData.title) || "article";
    } else if (!SLUG_REGEX.test(slug)) {
      slug = slugify(slug) || "article";
    }

    const existingSlug = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    let authorId =
      guard.session.role === "ADMIN" && validatedData.authorId
        ? validatedData.authorId
        : guard.session.userId;

    let authorUser = await prisma.user.findUnique({
      where: { id: authorId },
      select: { id: true },
    });
    if (!authorUser) {
      authorUser =
        (await prisma.user.findFirst({ where: { role: "ADMIN" }, select: { id: true } })) ||
        (await prisma.user.findFirst({ select: { id: true } }));
    }

    if (!authorUser) {
      return {
        success: false,
        message: "Impossible de créer l'article : aucun compte utilisateur valide n'a été trouvé.",
      };
    }

    authorId = authorUser.id;

    const newPost = await prisma.post.create({
      data: {
        title: validatedData.title,
        slug,
        content: validatedData.content,
        imageUrl:
          validatedData.imageUrl ||
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
        link: validatedData.link || null,
        category: validatedData.category,
        tags: validatedData.tags,
        published: validatedData.published ?? true,
        authorId,
      },
    });

    await recordAuditLog({
      session: guard.session,
      action: "POST_CREATED",
      entity: "Post",
      entityId: newPost.id,
      metadata: { title: newPost.title, category: newPost.category, published: newPost.published },
    });

    revalidatePostPaths();

    return {
      success: true,
      post: newPost,
      message: `L'article "${newPost.title}" a été créé et ${
        newPost.published ? "publié" : "enregistré comme brouillon"
      } avec succès !`,
    };
  } catch (error) {
    return handleActionError(
      "actions.post.create",
      error,
      "Une erreur est survenue lors de la création de l'article."
    );
  }
}

export async function updatePostAction(id: string, data: UpdatePostInput) {
  const guard = await requireAuthorOrAdmin();
  if (!guard.authorized) return guard.response;

  const parseResult = updatePostSchema.safeParse(data);
  if (!parseResult.success) {
    return fromZodError(parseResult.error);
  }

  const validatedData = parseResult.data;

  try {
    const existingPost = await prisma.post.findUnique({
      where: { id },
      select: { id: true, slug: true, authorId: true },
    });
    if (!existingPost) {
      return { success: false, message: "Article introuvable." };
    }

    if (!canManageOwnedResource(guard.session, existingPost.authorId)) {
      return { success: false, message: "Vous n'êtes pas autorisé à modifier cet article." };
    }

    const updatePayload: Prisma.PostUpdateInput = {};

    if (validatedData.title !== undefined) updatePayload.title = validatedData.title;
    if (validatedData.content !== undefined) updatePayload.content = validatedData.content;
    if (validatedData.imageUrl !== undefined) updatePayload.imageUrl = validatedData.imageUrl;
    if (validatedData.link !== undefined) updatePayload.link = validatedData.link || null;
    if (validatedData.category !== undefined) updatePayload.category = validatedData.category;
    if (validatedData.tags !== undefined) updatePayload.tags = validatedData.tags;
    if (validatedData.published !== undefined) updatePayload.published = validatedData.published;
    if (validatedData.slug !== undefined && validatedData.slug !== existingPost.slug) {
      let slug = slugify(validatedData.slug) || "article";
      const slugCheck = await prisma.post.findFirst({
        where: { slug, NOT: { id } },
        select: { id: true },
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

    await recordAuditLog({
      session: guard.session,
      action: "POST_UPDATED",
      entity: "Post",
      entityId: updatedPost.id,
      metadata: { title: updatedPost.title, published: updatedPost.published },
    });

    revalidatePostPaths();

    return {
      success: true,
      post: updatedPost,
      message: `L'article "${updatedPost.title}" a été mis à jour avec succès.`,
    };
  } catch (error) {
    return handleActionError(
      "actions.post.update",
      error,
      "Une erreur est survenue lors de la mise à jour de l'article."
    );
  }
}

export async function deletePostAction(postId: string) {
  const guard = await requireAuthorOrAdmin();
  if (!guard.authorized) return guard.response;

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, title: true, authorId: true },
    });
    if (!post) {
      return { success: false, message: "Article introuvable." };
    }

    if (!canManageOwnedResource(guard.session, post.authorId)) {
      return { success: false, message: "Vous n'êtes pas autorisé à supprimer cet article." };
    }

    await prisma.post.delete({ where: { id: postId } });

    await recordAuditLog({
      session: guard.session,
      action: "POST_DELETED",
      entity: "Post",
      entityId: post.id,
      metadata: { title: post.title },
    });

    revalidatePostPaths();

    return {
      success: true,
      message: `L'article "${post.title}" a été supprimé avec succès.`,
    };
  } catch (error) {
    return handleActionError(
      "actions.post.delete",
      error,
      "Une erreur est survenue lors de la suppression de l'article."
    );
  }
}
