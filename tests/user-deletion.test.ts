import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { deleteUserCompletely } from "@/lib/core/user-deletion";

describe("Complete User Deletion (public + auth.users)", () => {
  it("supprime newsletter_subscribers, public.users et auth.users via SQL sans SUPABASE_SERVICE_ROLE_KEY", async () => {
    const calls: string[] = [];

    const result = await deleteUserCompletely(
      { id: "user-123", email: "membre@acceent.org", role: "USER" },
      {
        getAdminClient: () => null,
        runInTransaction: async (fn) =>
          fn({
            deleteNewsletterByEmail: async (email) => {
              calls.push(`newsletter:${email}`);
            },
            deletePublicUserById: async (id) => {
              calls.push(`public:${id}`);
              return { id, email: "membre@acceent.org", role: "USER" };
            },
            hasAuthUsersTable: async () => true,
            deleteAuthUsersByIdOrEmail: async (id, email) => {
              calls.push(`auth:${id}:${email}`);
              return 1;
            },
            countRemainingAuthUsers: async () => 0,
          }),
      }
    );

    assert.equal(result.deletedAuthVia, "postgres_sql");
    assert.equal(result.deletedAuthRows, 1);
    assert.deepEqual(result.deletedUser, {
      id: "user-123",
      email: "membre@acceent.org",
      role: "USER",
    });
    assert.deepEqual(calls, [
      "newsletter:membre@acceent.org",
      "public:user-123",
      "auth:user-123:membre@acceent.org",
    ]);
  });

  it("appelle l'API Admin Supabase si disponible et exécute aussi le nettoyage transactionnel", async () => {
    let adminDeletedId: string | null = null;
    const calls: string[] = [];

    const mockAdminClient = {
      auth: {
        admin: {
          deleteUser: async (id: string) => {
            adminDeletedId = id;
            return { data: { user: null }, error: null };
          },
        },
      },
    } as unknown as NonNullable<ReturnType<typeof import("@/lib/supabase/server").createSupabaseAdminClient>>;

    const result = await deleteUserCompletely(
      { id: "user-456", email: "author@acceent.org", role: "AUTHOR" },
      {
        getAdminClient: () => mockAdminClient,
        runInTransaction: async (fn) =>
          fn({
            deleteNewsletterByEmail: async (email) => {
              calls.push(`newsletter:${email}`);
            },
            deletePublicUserById: async (id) => {
              calls.push(`public:${id}`);
              return { id, email: "author@acceent.org", role: "AUTHOR" };
            },
            hasAuthUsersTable: async () => true,
            deleteAuthUsersByIdOrEmail: async (id, email) => {
              calls.push(`auth:${id}:${email}`);
              return 0;
            },
            countRemainingAuthUsers: async () => 0,
          }),
      }
    );

    assert.equal(adminDeletedId, "user-456");
    assert.equal(result.deletedAuthVia, "supabase_admin_api");
    assert.equal(result.deletedAuthRows, 0);
    assert.deepEqual(calls, [
      "newsletter:author@acceent.org",
      "public:user-456",
      "auth:user-456:author@acceent.org",
    ]);
  });

  it("échoue et annule la transaction si un compte persiste dans auth.users", async () => {
    await assert.rejects(
      () =>
        deleteUserCompletely(
          { id: "user-789", email: "locked@acceent.org", role: "USER" },
          {
            getAdminClient: () => null,
            runInTransaction: async (fn) =>
              fn({
                deleteNewsletterByEmail: async () => {},
                deletePublicUserById: async (id) => ({
                  id,
                  email: "locked@acceent.org",
                  role: "USER",
                }),
                hasAuthUsersTable: async () => true,
                deleteAuthUsersByIdOrEmail: async () => 0,
                countRemainingAuthUsers: async () => 1,
              }),
          }
        ),
      /AUTH_USER_NOT_DELETED/
    );
  });
});
