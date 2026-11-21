import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isEmailEnvConfigured, isStorageEnvConfigured } from "@/lib/env";
import { logger } from "@/lib/core";

export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();
  let databaseOk = false;
  let dbLatencyMs: number | null = null;

  try {
    await prisma.$queryRaw`SELECT 1`;
    databaseOk = true;
    dbLatencyMs = Date.now() - startedAt;
  } catch (error) {
    dbLatencyMs = Date.now() - startedAt;
    logger.error("api.health", "Échec de vérification de la connexion PostgreSQL", error);
  }

  const status = databaseOk ? "ok" : "degraded";
  const httpStatus = databaseOk ? 200 : 503;

  return NextResponse.json(
    {
      status,
      timestamp: new Date().toISOString(),
      uptimeSec: Math.floor(process.uptime()),
      services: {
        database: databaseOk ? "up" : "down",
        dbLatencyMs,
        emailConfigured: isEmailEnvConfigured(),
        storageConfigured: isStorageEnvConfigured(),
      },
    },
    {
      status: httpStatus,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
