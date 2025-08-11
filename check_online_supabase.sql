-- KONTROLA STAVU ONLINE SUPABASE DATABÁZE
-- Spusťte v Supabase SQL Editoru pro kontrolu

-- 1. Zkontrolovat existující tabulky
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. Zkontrolovat RLS status
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 3. Zkontrolovat počet řádků v hlavních tabulkách
SELECT 'buildings' as table_name, COUNT(*) as rows FROM buildings
UNION ALL
SELECT 'members' as table_name, COUNT(*) as rows FROM members
UNION ALL
SELECT 'votes' as table_name, COUNT(*) as rows FROM votes
UNION ALL
SELECT 'global_variables' as table_name, COUNT(*) as rows FROM global_variables
UNION ALL
SELECT 'building_variable_definitions' as table_name, COUNT(*) as rows FROM building_variable_definitions;
