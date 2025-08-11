-- Diagnostics for 403 on updating members
-- Safe to run in Supabase SQL editor. Does not modify data.

-- 1) Check RLS enabled flags for key tables
SELECT c.relname AS table_name, c.relrowsecurity AS rls_enabled
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind = 'r'
  AND c.relname IN ('members', 'audit_log')
ORDER BY c.relname;

-- 2) List policies on members and audit_log
SELECT schemaname, tablename, policyname, cmd, roles, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public' AND tablename IN ('members', 'audit_log')
ORDER BY tablename, policyname;

-- 3) Inspect triggers on members (audit trigger should be present)
SELECT event_object_table AS table_name, trigger_name, action_timing, event_manipulation AS event, action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'public' AND event_object_table = 'members'
ORDER BY trigger_name;

-- 4) Optional: Dry-run style update plan (no actual data change). Replace <EXISTING_MEMBER_ID>
-- BEGIN;
-- UPDATE public.members SET name = name || ' '
-- WHERE id = '<EXISTING_MEMBER_ID>'::uuid;
-- ROLLBACK;

-- If error mentions audit_log permission or RLS, you likely need either:
--  a) a policy allowing INSERT on audit_log for authenticated users (see policies_audit_log_write.sql), or
--  b) define the audit trigger function as SECURITY DEFINER so it inserts as table owner (see audit_trigger_security_definer.sql).
