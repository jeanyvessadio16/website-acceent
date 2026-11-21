import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";
import { ok, fail, fromZodError, handleActionError } from "@/lib/core/result";

describe("ActionResult & Error Mapping", () => {
  it("construit des réponses ok et fail structurées", () => {
    const successRes = ok("Opération réussie", { id: "abc" });
    assert.equal(successRes.success, true);
    if (successRes.success) {
      assert.equal(successRes.message, "Opération réussie");
      assert.deepEqual(successRes.data, { id: "abc" });
    }

    const errRes = fail("Accès refusé", "FORBIDDEN");
    assert.equal(errRes.success, false);
    if (!errRes.success) {
      assert.equal(errRes.code, "FORBIDDEN");
      assert.equal(errRes.message, "Accès refusé");
    }
  });

  it("convertit une ZodError v4 en erreurs par champ", () => {
    const schema = z.object({
      email: z.email("E-mail invalide"),
      firstname: z.string().min(2, "Prénom trop court"),
    });
    const parsed = schema.safeParse({ email: "bad", firstname: "A" });
    assert.equal(parsed.success, false);
    if (!parsed.success) {
      const res = fromZodError(parsed.error);
      assert.equal(res.success, false);
      if (!res.success) {
        assert.equal(res.code, "VALIDATION_ERROR");
        assert.equal(res.fieldErrors?.email, "E-mail invalide");
        assert.equal(res.fieldErrors?.firstname, "Prénom trop court");
      }
    }
  });

  it("mappe proprement les codes d'erreur Prisma sans fuite SQL", () => {
    const conflict = handleActionError("test", { code: "P2002" }, "Fallback");
    assert.equal(conflict.success, false);
    if (!conflict.success) assert.equal(conflict.code, "CONFLICT");

    const notFound = handleActionError("test", { code: "P2025" }, "Fallback");
    assert.equal(notFound.success, false);
    if (!notFound.success) assert.equal(notFound.code, "NOT_FOUND");

    const unknown = handleActionError("test", new Error("raw sql trace"), "Erreur générique");
    assert.equal(unknown.success, false);
    if (!unknown.success) {
      assert.equal(unknown.code, "INTERNAL_ERROR");
      assert.equal(unknown.message, "Erreur générique");
    }
  });
});
