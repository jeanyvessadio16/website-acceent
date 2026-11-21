CREATE TABLE IF NOT EXISTS "public"."rate_limit_buckets" (
    "key" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "resetAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "rate_limit_buckets_pkey" PRIMARY KEY ("key")
);

CREATE INDEX IF NOT EXISTS "rate_limit_buckets_resetAt_idx"
  ON "public"."rate_limit_buckets"("resetAt");

ALTER TABLE "public"."rate_limit_buckets" ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  REVOKE ALL ON TABLE "public"."rate_limit_buckets" FROM PUBLIC;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON TABLE "public"."rate_limit_buckets" FROM anon;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON TABLE "public"."rate_limit_buckets" FROM authenticated;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth')
     AND to_regclass('storage.objects') IS NOT NULL
     AND to_regprocedure('public.is_staff_user()') IS NOT NULL THEN

    REVOKE ALL ON FUNCTION public.is_staff_user() FROM PUBLIC;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
      REVOKE ALL ON FUNCTION public.is_staff_user() FROM anon;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
      GRANT EXECUTE ON FUNCTION public.is_staff_user() TO authenticated;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
      GRANT EXECUTE ON FUNCTION public.is_staff_user() TO service_role;
    END IF;

    EXECUTE $fn$
      CREATE OR REPLACE FUNCTION public.is_admin_user()
      RETURNS boolean
      LANGUAGE sql
      STABLE
      SECURITY DEFINER
      SET search_path TO ''
      AS $body$
        SELECT EXISTS (
          SELECT 1
          FROM public.users
          WHERE id = (SELECT auth.uid())::text
            AND role = 'ADMIN'
            AND "emailVerifiedAt" IS NOT NULL
        );
      $body$;
    $fn$;

    REVOKE ALL ON FUNCTION public.is_admin_user() FROM PUBLIC;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
      REVOKE ALL ON FUNCTION public.is_admin_user() FROM anon;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
      GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
      GRANT EXECUTE ON FUNCTION public.is_admin_user() TO service_role;
    END IF;

    DROP POLICY IF EXISTS "Authenticated select documents" ON storage.objects;
    CREATE POLICY "Authenticated select documents"
      ON storage.objects
      FOR SELECT
      TO authenticated
      USING (
        bucket_id = 'documents'
        AND (
          (storage.foldername(name))[1] = 'resources'
          OR (
            (storage.foldername(name))[1] = 'applications'
            AND (
              (storage.foldername(name))[2] = ((SELECT auth.uid()))::text
              OR public.is_admin_user()
            )
          )
        )
      );

    DROP POLICY IF EXISTS "Authenticated delete documents" ON storage.objects;
    CREATE POLICY "Authenticated delete documents"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'documents'
        AND (
          (
            (storage.foldername(name))[1] = 'resources'
            AND public.is_staff_user()
          )
          OR (
            (storage.foldername(name))[1] = 'applications'
            AND (
              (storage.foldername(name))[2] = ((SELECT auth.uid()))::text
              OR public.is_admin_user()
            )
          )
        )
      );
  END IF;
END $$;
