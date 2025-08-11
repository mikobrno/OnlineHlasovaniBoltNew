-- Allow authenticated users to insert into audit_log (needed for triggers on many tables)
-- Idempotent and safe to run multiple times

ALTER TABLE IF EXISTS public.audit_log ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'audit_log' AND policyname = 'audit_log_insert_authenticated'
  ) THEN
    CREATE POLICY "audit_log_insert_authenticated" ON public.audit_log
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END$$;

-- Optional: allow select for authenticated (often already present as public read)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'audit_log' AND policyname = 'audit_log_select_authenticated'
  ) THEN
    CREATE POLICY "audit_log_select_authenticated" ON public.audit_log
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END$$;

-- Verification
-- SELECT policyname, cmd, roles, qual, with_check FROM pg_policies WHERE tablename='audit_log' ORDER BY policyname;
