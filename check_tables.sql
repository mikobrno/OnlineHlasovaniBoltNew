-- Jednoduchý test existence tabulek
-- Spusťte v Supabase SQL Editor

-- Zjistit, jaké tabulky existují
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Pokud nevrátí žádné řádky, tabulky neexistují
-- Pokud vrátí tabulky, pak je problém s RLS nebo přístupovými právy
