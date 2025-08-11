-- Check active RLS policies for key tables
-- Run in Supabase SQL Editor

SELECT schemaname, tablename, policyname AS polname, cmd, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('members','buildings','votes','questions','email_templates','member_votes','voting_tokens')
ORDER BY tablename, policyname;

-- Also check if RLS is enabled per table
SELECT relname AS table_name, relrowsecurity AS rls_enabled
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND relname IN ('members','buildings','votes','questions','email_templates','member_votes','voting_tokens')
ORDER BY relname;
