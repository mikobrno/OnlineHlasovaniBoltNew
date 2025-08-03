-- KROK 2B - ROZŠÍŘENÉ VAZBY
-- Spustit až po úspěšném dokončení step2a_basic_foreign_keys.sql

-- ========================================
-- KROK 2B - SLOŽITĚJŠÍ VAZBY
-- ========================================

-- Self-reference pro members (representative)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'members' AND column_name = 'representative_id') THEN
        ALTER TABLE members ADD CONSTRAINT fk_members_representative FOREIGN KEY (representative_id) REFERENCES members(id);
        RAISE NOTICE 'FK members->members (representative) přidán';
    ELSE
        RAISE NOTICE 'CHYBA: Sloupec representative_id v members neexistuje';
    END IF;
END $$;

-- Vazby pro email_templates tabulku
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'email_templates' AND column_name = 'building_id') THEN
        ALTER TABLE email_templates ADD CONSTRAINT fk_email_templates_building FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE;
        RAISE NOTICE 'FK email_templates->buildings přidán';
    ELSE
        RAISE NOTICE 'CHYBA: Sloupec building_id v email_templates neexistuje';
    END IF;
END $$;

-- Vazby pro vote_delegations tabulku
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vote_delegations' AND column_name = 'vote_id') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vote_delegations' AND column_name = 'delegator_id') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vote_delegations' AND column_name = 'delegate_id') THEN
        ALTER TABLE vote_delegations ADD CONSTRAINT fk_vote_delegations_vote FOREIGN KEY (vote_id) REFERENCES votes(id) ON DELETE CASCADE;
        ALTER TABLE vote_delegations ADD CONSTRAINT fk_vote_delegations_delegator FOREIGN KEY (delegator_id) REFERENCES members(id) ON DELETE CASCADE;
        ALTER TABLE vote_delegations ADD CONSTRAINT fk_vote_delegations_delegate FOREIGN KEY (delegate_id) REFERENCES members(id) ON DELETE CASCADE;
        RAISE NOTICE 'FK vote_delegations vazby přidány';
    ELSE
        RAISE NOTICE 'CHYBA: Sloupce pro vote_delegations vazby neexistují';
    END IF;
END $$;

SELECT 'KROK 2B dokončen - rozšířené vazby' as status;
