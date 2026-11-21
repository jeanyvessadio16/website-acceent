import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { logger } from "./core/logger";
import { buildPgPoolConfig } from "./prisma-pool";

const globalForPrisma = globalThis as unknown as {
  pgPool: Pool | undefined;
  prisma: PrismaClient | undefined;
};

const defaultPoolMax = process.env.VERCEL ? 3 : 10;
const rawPoolMax = Number(process.env.PG_POOL_MAX ?? defaultPoolMax);
const poolMax = Number.isFinite(rawPoolMax) && rawPoolMax > 0 ? Math.min(rawPoolMax, 50) : defaultPoolMax;

const pool =
  globalForPrisma.pgPool ??
  new Pool(buildPgPoolConfig(process.env.DATABASE_URL, poolMax));

if (!globalForPrisma.pgPool) {
  pool.on("error", (err) => {
    logger.error("postgres.pool", "Erreur inattendue sur un client PostgreSQL inactif", err);
  });
}

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

globalForPrisma.pgPool = pool;
globalForPrisma.prisma = prisma;

export default prisma;
