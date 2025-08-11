-- Zkontrolovat, které tabulky existují v databázi
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Zkontrolovat sloupce v tabulce buildings (pokud existuje)
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'buildings' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Zkontrolovat počet řádků v tabulkách
SELECT 
    'buildings' as table_name, 
    COUNT(*) as row_count 
FROM buildings
UNION ALL
SELECT 
    'members' as table_name, 
    COUNT(*) as row_count 
FROM members
UNION ALL
SELECT 
    'votes' as table_name, 
    COUNT(*) as row_count 
FROM votes;
