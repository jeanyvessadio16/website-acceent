import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildPgPoolConfig } from "@/lib/prisma-pool";

describe("Prisma pg.Pool SSL Configuration", () => {
  it("supprime sslmode=require sur Supabase pooler, conserve pgbouncer=true et active ssl.rejectUnauthorized=false", () => {
    const cfg = buildPgPoolConfig(
      "postgresql://postgres.ref:secret@aws-1-eu-west-3.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require",
      3
    );

    assert.equal(cfg.max, 3);
    assert.deepEqual(cfg.ssl, { rejectUnauthorized: false });
    assert.ok(cfg.connectionString);
    const parsed = new URL(cfg.connectionString);
    assert.equal(parsed.searchParams.get("pgbouncer"), "true");
    assert.equal(parsed.searchParams.get("sslmode"), null);
  });

  it("configure ssl.rejectUnauthorized=false pour un pooler distant même sans sslmode explicite", () => {
    const cfg = buildPgPoolConfig(
      "postgresql://postgres.ref:secret@aws-1-eu-west-3.pooler.supabase.com:5432/postgres?pgbouncer=true",
      10
    );

    assert.equal(cfg.max, 10);
    assert.deepEqual(cfg.ssl, { rejectUnauthorized: false });
    assert.ok(cfg.connectionString?.includes("pgbouncer=true"));
  });

  it("ne force pas SSL pour une base PostgreSQL locale (localhost / 127.0.0.1)", () => {
    const cfg = buildPgPoolConfig("postgresql://postgres:secret@localhost:5432/acceent", 10);
    assert.equal(cfg.ssl, undefined);
    assert.equal(cfg.connectionString, "postgresql://postgres:secret@localhost:5432/acceent");
  });

  it("préserve les modes explicites sslmode=disable et sslmode=verify-full sans imposer rejectUnauthorized=false", () => {
    const disabledUrl =
      "postgresql://postgres:secret@aws-1-eu-west-3.pooler.supabase.com:5432/postgres?sslmode=disable";
    const disabledCfg = buildPgPoolConfig(disabledUrl, 5);
    assert.equal(disabledCfg.ssl, undefined);
    assert.equal(disabledCfg.connectionString, disabledUrl);

    const verifyFullUrl =
      "postgresql://postgres:secret@aws-1-eu-west-3.pooler.supabase.com:5432/postgres?sslmode=verify-full";
    const verifyFullCfg = buildPgPoolConfig(verifyFullUrl, 5);
    assert.equal(verifyFullCfg.ssl, undefined);
    assert.equal(verifyFullCfg.connectionString, verifyFullUrl);
  });

  it("retourne une configuration sûre sans lever d'exception si DATABASE_URL est vide ou invalide", () => {
    const emptyCfg = buildPgPoolConfig(undefined, 3);
    assert.equal(emptyCfg.connectionString, undefined);
    assert.equal(emptyCfg.max, 3);
    assert.equal(emptyCfg.ssl, undefined);

    const invalidCfg = buildPgPoolConfig("not-a-valid-url", 3);
    assert.equal(invalidCfg.connectionString, "not-a-valid-url");
    assert.equal(invalidCfg.ssl, undefined);
  });
});
