import prisma from "@/lib/prisma";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { logger } from "./logger";

export interface DeletedUserSummary {
  id: string;
  email: string;
  role: string;
}

export interface CompleteUserDeletionResult {
  deletedUser: DeletedUserSummary;
  deletedAuthVia: "supabase_admin_api" | "postgres_sql" | "none";
  deletedAuthRows: number;
}

export interface UserDeletionTx {
  deleteNewsletterByEmail: (email: string) => Promise<void>;
  deletePublicUserById: (id: string) => Promise<DeletedUserSummary>;
  hasAuthUsersTable: () => Promise<boolean>;
  deleteAuthUsersByIdOrEmail: (id: string, email: string) => Promise<number>;
  countRemainingAuthUsers: (id: string, email: string) => Promise<number>;
}

export interface CompleteUserDeletionDeps {
  getAdminClient: () => ReturnType<typeof createSupabaseAdminClient>;
  runInTransaction: <T>(fn: (tx: UserDeletionTx) => Promise<T>) => Promise<T>;
}

const defaultDeps: CompleteUserDeletionDeps = {
  getAdminClient: () => createSupabaseAdminClient(),
  runInTransaction: (fn) =>
    prisma.$transaction(async (tx) =>
      fn({
        deleteNewsletterByEmail: async (email) => {
          await tx.newsletterSubscriber.deleteMany({
            where: { email: { equals: email, mode: "insensitive" } },
          });
        },
        deletePublicUserById: async (id) =>
          tx.user.delete({
            where: { id },
            select: { id: true, email: true, role: true },
          }),
        hasAuthUsersTable: async () => {
          const rows = await tx.$queryRaw<Array<{ exists: boolean }>>`
            SELECT to_regclass('auth.users') IS NOT NULL AS exists
          `;
          return Boolean(rows[0]?.exists);
        },
        deleteAuthUsersByIdOrEmail: async (id, email) => {
          const affected = await tx.$executeRaw`
            DELETE FROM auth.users
            WHERE id::text = ${id} OR lower(email) = lower(${email})
          `;
          return Number(affected);
        },
        countRemainingAuthUsers: async (id, email) => {
          const rows = await tx.$queryRaw<Array<{ count: number }>>`
            SELECT count(*)::int AS count
            FROM auth.users
            WHERE id::text = ${id} OR lower(email) = lower(${email})
          `;
          return Number(rows[0]?.count ?? 0);
        },
      })
    ),
};

/**
 * Supprime intégralement un utilisateur côté applicatif (`public.users`, `public.newsletter_subscribers`)
 * et côté authentification (`auth.users`) via l'API Admin Supabase si configurée, avec suppression et
 * vérification transactionnelles PostgreSQL garantissant qu'aucun compte orphelin ne subsiste.
 */
export async function deleteUserCompletely(
  target: DeletedUserSummary,
  deps?: Partial<CompleteUserDeletionDeps>
): Promise<CompleteUserDeletionResult> {
  const resolvedDeps: CompleteUserDeletionDeps = {
    ...defaultDeps,
    ...deps,
  };

  let deletedAuthViaAdminApi = false;
  const adminClient = resolvedDeps.getAdminClient();

  if (adminClient) {
    try {
      const { error: authErr } = await adminClient.auth.admin.deleteUser(target.id);
      if (
        authErr &&
        authErr.code !== "user_not_found" &&
        !/not found/i.test(authErr.message)
      ) {
        logger.warn(
          "actions.user.deleteUser",
          "Échec suppression compte Supabase Auth via API Admin — repli SQL transactionnel",
          {
            userId: target.id,
            code: authErr.code,
            message: authErr.message,
          }
        );
      } else {
        deletedAuthViaAdminApi = true;
      }
    } catch (error) {
      logger.warn(
        "actions.user.deleteUser",
        "Exception suppression Supabase Auth via API Admin — repli SQL transactionnel",
        {
          userId: target.id,
          error: error instanceof Error ? error.message : String(error),
        }
      );
    }
  } else {
    logger.warn(
      "actions.user.deleteUser",
      "SUPABASE_SERVICE_ROLE_KEY non configurée — suppression Supabase Auth via PostgreSQL",
      { userId: target.id }
    );
  }

  const { deletedUser, deletedAuthRows, authTablePresent } =
    await resolvedDeps.runInTransaction(async (tx) => {
      await tx.deleteNewsletterByEmail(target.email);
      const user = await tx.deletePublicUserById(target.id);

      const exists = await tx.hasAuthUsersTable();
      if (!exists) {
        return { deletedUser: user, deletedAuthRows: 0, authTablePresent: false };
      }

      const authRows = await tx.deleteAuthUsersByIdOrEmail(target.id, target.email);
      const remaining = await tx.countRemainingAuthUsers(target.id, target.email);
      if (remaining > 0) {
        throw new Error("AUTH_USER_NOT_DELETED");
      }

      return { deletedUser: user, deletedAuthRows: authRows, authTablePresent: true };
    });

  const deletedAuthVia: CompleteUserDeletionResult["deletedAuthVia"] = deletedAuthViaAdminApi
    ? "supabase_admin_api"
    : authTablePresent
    ? "postgres_sql"
    : "none";

  return {
    deletedUser,
    deletedAuthVia,
    deletedAuthRows,
  };
}
