import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildUsersWorkbook } from "@/lib/export/excel";

describe("Export Excel XLSX (ExcelJS + uuid)", () => {
  it("génère un classeur XLSX valide (en-tête ZIP PK\\x03\\x04)", async () => {
    const bytes = await buildUsersWorkbook(
      [
        {
          fullName: "Aïssatou Diallo",
          email: "aissatou@acceent.org",
          age: 24,
          sexe: "Femme",
          milieuResidence: "Urbain",
          telephone: "771234567",
          sdh: false,
          date: "21/11/2026",
        },
      ],
      "21 novembre 2026 à 12:00"
    );

    assert.ok(bytes instanceof Uint8Array);
    assert.ok(bytes.length > 100);
    assert.equal(bytes[0], 0x50);
    assert.equal(bytes[1], 0x4b);
    assert.equal(bytes[2], 0x03);
    assert.equal(bytes[3], 0x04);
  });
});
