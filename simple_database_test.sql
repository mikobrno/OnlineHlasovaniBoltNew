-- ÚPLNĚ JEDNODUCHÝ TEST
-- Spusťte tento kód po částech v Supabase SQL Editoru

-- 1. Nejdříve zkontrolujte, zda máte práva
SELECT current_user, session_user;

-- 2. Zkontrolujte existující tabulky
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- 3. Zkuste vytvořit jednoduchou tabulku jako test
CREATE TABLE IF NOT EXISTS test_table (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

-- 4. Vložte testovací data
INSERT INTO test_table (name) VALUES ('test');

-- 5. Zkontrolujte, zda to funguje
SELECT * FROM test_table;

-- 6. Smaže testovací tabulku
DROP TABLE test_table;
