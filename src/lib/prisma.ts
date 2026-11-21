import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { logger } from "./core/logger";

const globalForPrisma = globalThis as unknown as {
  pgPool: Pool | undefined;
  prisma: PrismaClient | undefined;
};

const rawPoolMax = Number(process.env.PG_POOL_MAX ?? 10);
const poolMax = Number.isFinite(rawPoolMax) && rawPoolMax > 0 ? Math.min(rawPoolMax, 50) : 10;

const pool =
  globalForPrisma.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: poolMax,
    idleTimeoutMillis: 20_000,
    connectionTimeoutMillis: 10_000,
    allowExitOnIdle: true,
  });

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

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.pgPool = pool;
  globalForPrisma.prisma = prisma;
}

export default prisma;
