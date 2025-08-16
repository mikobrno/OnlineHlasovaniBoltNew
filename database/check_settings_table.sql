-- Skript pro kontrolu tabulky settings
-- Tento skript zkontroluje, zda tabulka settings existuje a obsahuje záznamy

-- Kontrola existence tabulky settings
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'settings'
) AS "tabulka_settings_existuje";

-- Kontrola počtu záznamů v tabulce settings (pokud existuje)
DO $$
BEGIN
   IF EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_name = 'settings'
   ) THEN
      EXECUTE 'SELECT COUNT(*) AS "počet_záznamů" FROM settings';
   ELSE
      RAISE NOTICE 'Tabulka settings neexistuje!';
   END IF;
END $$;

-- Pokud tabulka existuje, zobrazí všechny záznamy
DO $$
BEGIN
   IF EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_name = 'settings'
   ) THEN
      EXECUTE 'SELECT key, (value::jsonb)::text AS value_preview, created_at, updated_at FROM settings';
   END IF;
END $$;
