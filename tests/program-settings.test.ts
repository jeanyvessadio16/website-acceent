import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ACCEENT_PROGRAMS } from "@/lib/constants/platform";
import {
  buildProgramStatusMap,
  filterActivePrograms,
  isProgramSlugEnabled,
  mergeProgramsWithStatus,
  resolveInitialProgramSlug,
} from "@/lib/core/program-settings";

describe("Program Activation Helpers", () => {
  it("considère tous les programmes actifs par défaut quand la table est vide", () => {
    const statusMap = buildProgramStatusMap([]);
    const withStatus = mergeProgramsWithStatus(ACCEENT_PROGRAMS, statusMap);
    const active = filterActivePrograms(ACCEENT_PROGRAMS, statusMap);

    assert.equal(withStatus.length, ACCEENT_PROGRAMS.length);
    assert.equal(withStatus.every((p) => p.active), true);
    assert.equal(active.length, ACCEENT_PROGRAMS.length);
    assert.equal(isProgramSlugEnabled("acceent-incub", statusMap), true);
  });

  it("exclut les programmes désactivés des listes et rejette leur activation", () => {
    const statusMap = buildProgramStatusMap([
      { slug: "acceent-incub", active: false },
      { slug: "wro", active: false },
      { slug: "tut-tank", active: true },
    ]);

    const withStatus = mergeProgramsWithStatus(ACCEENT_PROGRAMS, statusMap);
    const active = filterActivePrograms(ACCEENT_PROGRAMS, statusMap);

    assert.equal(
      withStatus.find((p) => p.slug === "acceent-incub")?.active,
      false
    );
    assert.equal(withStatus.find((p) => p.slug === "wro")?.active, false);
    assert.equal(withStatus.find((p) => p.slug === "tut-tank")?.active, true);
    assert.equal(withStatus.find((p) => p.slug === "ai4good")?.active, true);

    assert.equal(active.length, ACCEENT_PROGRAMS.length - 2);
    assert.equal(
      active.some((p) => p.slug === "acceent-incub" || p.slug === "wro"),
      false
    );

    assert.equal(isProgramSlugEnabled("acceent-incub", statusMap), false);
    assert.equal(isProgramSlugEnabled("tut-tank", statusMap), true);
    assert.equal(isProgramSlugEnabled("programme-inexistant", statusMap), false);

    assert.equal(resolveInitialProgramSlug("acceent-incub", active), undefined);
    assert.equal(resolveInitialProgramSlug("tut-tank", active), "tut-tank");
    assert.equal(resolveInitialProgramSlug("inconnu", active), undefined);
  });

  it("gère proprement le cas où tous les programmes sont désactivés", () => {
    const statusMap = buildProgramStatusMap(
      ACCEENT_PROGRAMS.map((program) => ({ slug: program.slug, active: false }))
    );
    const active = filterActivePrograms(ACCEENT_PROGRAMS, statusMap);

    assert.equal(active.length, 0);
    assert.equal(resolveInitialProgramSlug("ai4good", active), undefined);
  });
});
