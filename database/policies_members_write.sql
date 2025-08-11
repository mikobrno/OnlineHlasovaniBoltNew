-- RLS policies for members: allow authenticated users to write (INSERT/UPDATE/DELETE)
-- Safe and idempotent: can be re-run multiple times
-- Run in Supabase SQL Editor against the production database

-- Ensure RLS is enabled (no-op if already enabled)
ALTER TABLE IF EXISTS public.members ENABLE ROW LEVEL SECURITY;

-- Ensure SELECT policy for authenticated (needed when client uses update(...).select())
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'members' AND policyname = 'members_select_authenticated'
  ) THEN
    CREATE POLICY "members_select_authenticated" ON public.members
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END$$;

-- Create INSERT policy for authenticated users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
  WHERE schemaname = 'public' AND tablename = 'members' AND policyname = 'members_insert_authenticated'
  ) THEN
    CREATE POLICY "members_insert_authenticated" ON public.members
      FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END$$;

-- Create UPDATE policy for authenticated users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
  WHERE schemaname = 'public' AND tablename = 'members' AND policyname = 'members_update_authenticated'
  ) THEN
    CREATE POLICY "members_update_authenticated" ON public.members
      FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END$$;

-- Create DELETE policy for authenticated users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
  WHERE schemaname = 'public' AND tablename = 'members' AND policyname = 'members_delete_authenticated'
  ) THEN
    CREATE POLICY "members_delete_authenticated" ON public.members
      FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END$$;

-- Optional: If a too-restrictive policy exists, you can drop it explicitly (uncomment if needed)
-- DROP POLICY IF EXISTS "Allow read members" ON public.members;
-- DROP POLICY IF EXISTS "Public read members" ON public.members;

-- Verification hint
-- SELECT policyname, cmd, roles, qual, with_check FROM pg_policies WHERE tablename = 'members' ORDER BY policyname;
