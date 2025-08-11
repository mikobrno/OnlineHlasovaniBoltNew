-- ÚPLNÉ SMAZÁNÍ VŠECH UŽIVATELSKÝCH TABULEK V SUPABASE
-- POZOR: Tento příkaz smaže VŠECHNY vaše data!

-- Smazat všechny tabulky v public schématu (kromě systémových)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Smazat všechny triggery
    FOR r IN (SELECT trigger_name, event_object_table FROM information_schema.triggers WHERE trigger_schema = 'public') LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(r.trigger_name) || ' ON ' || quote_ident(r.event_object_table) || ' CASCADE';
    END LOOP;
    
    -- Smazat všechny tabulky
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
    
    -- Smazat všechny funkce
    FOR r IN (SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public' AND routine_type = 'FUNCTION') LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS ' || quote_ident(r.routine_name) || ' CASCADE';
    END LOOP;
    
    -- Smazat všechny views
    FOR r IN (SELECT viewname FROM pg_views WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP VIEW IF EXISTS ' || quote_ident(r.viewname) || ' CASCADE';
    END LOOP;
    
    -- Smazat všechny sequences
    FOR r IN (SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public') LOOP
        EXECUTE 'DROP SEQUENCE IF EXISTS ' || quote_ident(r.sequence_name) || ' CASCADE';
    END LOOP;
END $$;

-- Zkontrolovat, že je vše smazáno
SELECT 
    'Tables' as type, 
    COUNT(*) as count 
FROM information_schema.tables 
WHERE table_schema = 'public'
UNION ALL
SELECT 
    'Functions' as type, 
    COUNT(*) as count 
FROM information_schema.routines 
WHERE routine_schema = 'public' AND routine_type = 'FUNCTION'
UNION ALL
SELECT 
    'Views' as type, 
    COUNT(*) as count 
FROM information_schema.views 
WHERE table_schema = 'public';
