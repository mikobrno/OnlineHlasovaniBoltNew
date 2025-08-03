-- KROK 2 - Přidání foreign key vazeb POSTUPNĚ S KONTROLOU
-- Spustit až po úspěšném dokončení step1_tables_only.sql a check_structure.sql

-- ========================================
-- KROK 2A - ZÁKLADNÍ VAZBY
-- ========================================

-- Vazby pro members tabulku (základní)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'members' AND column_name = 'building_id') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'buildings' AND column_name = 'id') THEN
        ALTER TABLE members ADD CONSTRAINT fk_members_building FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE;
        RAISE NOTICE 'FK members->buildings přidán';
    ELSE
        RAISE NOTICE 'CHYBA: Sloupce pro members->buildings vazbu neexistují';
    END IF;
END $$;

-- Vazby pro votes tabulku
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'votes' AND column_name = 'building_id') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'buildings' AND column_name = 'id') THEN
        ALTER TABLE votes ADD CONSTRAINT fk_votes_building FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE;
        RAISE NOTICE 'FK votes->buildings přidán';
    ELSE
        RAISE NOTICE 'CHYBA: Sloupce pro votes->buildings vazbu neexistují';
    END IF;
END $$;

-- Vazby pro questions tabulku
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'vote_id') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'votes' AND column_name = 'id') THEN
        ALTER TABLE questions ADD CONSTRAINT fk_questions_vote FOREIGN KEY (vote_id) REFERENCES votes(id) ON DELETE CASCADE;
        RAISE NOTICE 'FK questions->votes přidán';
    ELSE
        RAISE NOTICE 'CHYBA: Sloupce pro questions->votes vazbu neexistují';
    END IF;
END $$;

SELECT 'KROK 2A dokončen - základní vazby buildings/votes/questions' as status;
