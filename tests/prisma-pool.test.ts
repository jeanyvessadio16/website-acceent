import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildPgPoolConfig } from "@/lib/prisma-pool";
import { SUPABASE_ROOT_2021_CA_PEM } from "@/lib/supabase-ca";

describe("Prisma pg.Pool SSL Configuration", () => {
  it("active la vérification TLS stricte avec la CA officielle Supabase lorsque sslmode=require", () => {
    const cfg = buildPgPoolConfig(
      "postgresql://postgres.ref:secret@aws-1-eu-west-3.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require",
      3,
      { customCa: undefined, allowInsecureSsl: false }
    );

    assert.equal(cfg.max, 3);
    assert.deepEqual(cfg.ssl, {
      ca: SUPABASE_ROOT_2021_CA_PEM,
      rejectUnauthorized: true,
    });
    assert.ok(cfg.connectionString);
    const parsed = new URL(cfg.connectionString);
    assert.equal(parsed.searchParams.get("pgbouncer"), "true");
    assert.equal(parsed.searchParams.get("sslmode"), null);
  });

  it("utilise aussi la CA officielle Supabase avec sslmode=verify-full ou sans sslmode", () => {
    const withVerifyFull = buildPgPoolConfig(
      "postgresql://postgres.ref:secret@aws-1-eu-west-3.pooler.supabase.com:5432/postgres?sslmode=verify-full",
      5,
      { customCa: undefined, allowInsecureSsl: false }
    );
    assert.deepEqual(withVerifyFull.ssl, {
      ca: SUPABASE_ROOT_2021_CA_PEM,
      rejectUnauthorized: true,
    });

    const withoutSslMode = buildPgPoolConfig(
      "postgresql://postgres.ref:secret@aws-1-eu-west-3.pooler.supabase.com:5432/postgres?pgbouncer=true",
      10,
      { customCa: undefined, allowInsecureSsl: false }
    );
    assert.equal(withoutSslMode.max, 10);
    assert.deepEqual(withoutSslMode.ssl, {
      ca: SUPABASE_ROOT_2021_CA_PEM,
      rejectUnauthorized: true,
    });
    assert.ok(withoutSslMode.connectionString?.includes("pgbouncer=true"));
  });

  it("prend en charge une CA personnalisée (customCa avec retours à la ligne échappés)", () => {
    const escapedCa = "-----BEGIN CERTIFICATE-----\\nABC123\\n-----END CERTIFICATE-----";
    const cfg = buildPgPoolConfig(
      "postgresql://postgres.ref:secret@aws-1-eu-west-3.pooler.supabase.com:5432/postgres?sslmode=require",
      4,
      { customCa: escapedCa, allowInsecureSsl: false }
    );

    assert.deepEqual(cfg.ssl, {
      ca: "-----BEGIN CERTIFICATE-----\nABC123\n-----END CERTIFICATE-----",
      rejectUnauthorized: true,
    });
  });

  it("active rejectUnauthorized: true sans CA embarquée pour un hôte distant non-Supabase", () => {
    const cfg = buildPgPoolConfig(
      "postgresql://postgres:secret@db.example.com:5432/acceent?sslmode=require",
      5,
      { customCa: undefined, allowInsecureSsl: false }
    );

    assert.deepEqual(cfg.ssl, { rejectUnauthorized: true });
    assert.equal(cfg.connectionString, "postgresql://postgres:secret@db.example.com:5432/acceent");
  });

  it("ne force pas SSL pour une base PostgreSQL locale (localhost / 127.0.0.1)", () => {
    const cfg = buildPgPoolConfig("postgresql://postgres:secret@localhost:5432/acceent", 10, {
      customCa: undefined,
      allowInsecureSsl: false,
    });
    assert.equal(cfg.ssl, undefined);
    assert.equal(cfg.connectionString, "postgresql://postgres:secret@localhost:5432/acceent");
  });

  it("préserve sslmode=disable sans imposer SSL", () => {
    const disabledUrl =
      "postgresql://postgres:secret@aws-1-eu-west-3.pooler.supabase.com:5432/postgres?sslmode=disable";
    const disabledCfg = buildPgPoolConfig(disabledUrl, 5, {
      customCa: undefined,
      allowInsecureSsl: false,
    });
    assert.equal(disabledCfg.ssl, undefined);
    assert.equal(disabledCfg.connectionString, disabledUrl);
  });

  it("n'autorise rejectUnauthorized: false que si allowInsecureSsl est explicitement activé", () => {
    const cfg = buildPgPoolConfig(
      "postgresql://postgres.ref:secret@aws-1-eu-west-3.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require",
      3,
      { customCa: undefined, allowInsecureSsl: true }
    );
    assert.deepEqual(cfg.ssl, { rejectUnauthorized: false });
  });

  it("retourne une configuration sûre sans lever d'exception si DATABASE_URL est vide ou invalide", () => {
    const emptyCfg = buildPgPoolConfig(undefined, 3, {
      customCa: undefined,
      allowInsecureSsl: false,
    });
    assert.equal(emptyCfg.connectionString, undefined);
    assert.equal(emptyCfg.max, 3);
    assert.equal(emptyCfg.ssl, undefined);

    const invalidCfg = buildPgPoolConfig("not-a-valid-url", 3, {
      customCa: undefined,
      allowInsecureSsl: false,
    });
    assert.equal(invalidCfg.connectionString, "not-a-valid-url");
    assert.equal(invalidCfg.ssl, undefined);
  });
});
