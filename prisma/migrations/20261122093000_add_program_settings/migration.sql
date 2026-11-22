CREATE TABLE IF NOT EXISTS "public"."program_settings" (
    "slug" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "updatedById" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "program_settings_pkey" PRIMARY KEY ("slug")
);

ALTER TABLE "public"."program_settings" ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  REVOKE ALL ON TABLE "public"."program_settings" FROM PUBLIC;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON TABLE "public"."program_settings" FROM anon;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON TABLE "public"."program_settings" FROM authenticated;
  END IF;
END $$;
