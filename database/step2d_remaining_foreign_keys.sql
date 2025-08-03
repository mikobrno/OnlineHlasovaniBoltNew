-- KROK 2D - ZBÝVAJÍCÍ VAZBY
-- Spustit až po úspěšném dokončení step2c_notifications_foreign_keys.sql

-- ========================================
-- KROK 2D - VŠECHNY ZBÝVAJÍCÍ VAZBY
-- ========================================

-- Vazby pro reports tabulku
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reports' AND column_name = 'vote_id') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reports' AND column_name = 'building_id') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reports' AND column_name = 'generated_by') THEN
        ALTER TABLE reports ADD CONSTRAINT fk_reports_vote FOREIGN KEY (vote_id) REFERENCES votes(id) ON DELETE CASCADE;
        ALTER TABLE reports ADD CONSTRAINT fk_reports_building FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE;
        ALTER TABLE reports ADD CONSTRAINT fk_reports_generated_by FOREIGN KEY (generated_by) REFERENCES members(id);
        RAISE NOTICE 'FK reports vazby přidány';
    ELSE
        RAISE NOTICE 'CHYBA: Sloupce pro reports vazby neexistují';
    END IF;
END $$;

-- Vazby pro proxy_votes tabulku
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proxy_votes' AND column_name = 'vote_id') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proxy_votes' AND column_name = 'proxy_holder_id') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proxy_votes' AND column_name = 'represented_member_id') THEN
        ALTER TABLE proxy_votes ADD CONSTRAINT fk_proxy_votes_vote FOREIGN KEY (vote_id) REFERENCES votes(id) ON DELETE CASCADE;
        ALTER TABLE proxy_votes ADD CONSTRAINT fk_proxy_votes_proxy_holder FOREIGN KEY (proxy_holder_id) REFERENCES members(id) ON DELETE CASCADE;
        ALTER TABLE proxy_votes ADD CONSTRAINT fk_proxy_votes_represented_member FOREIGN KEY (represented_member_id) REFERENCES members(id) ON DELETE CASCADE;
        RAISE NOTICE 'FK proxy_votes vazby přidány';
    ELSE
        RAISE NOTICE 'CHYBA: Sloupce pro proxy_votes vazby neexistují';
    END IF;
END $$;

-- Vazby pro attachments tabulku
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'attachments' AND column_name = 'uploaded_by') THEN
        ALTER TABLE attachments ADD CONSTRAINT fk_attachments_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES members(id);
        RAISE NOTICE 'FK attachments->members přidán';
    ELSE
        RAISE NOTICE 'CHYBA: Sloupec uploaded_by v attachments neexistuje';
    END IF;
END $$;

-- Vazby pro observers tabulku
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'observers' AND column_name = 'building_id') THEN
        ALTER TABLE observers ADD CONSTRAINT fk_observers_building FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE;
        RAISE NOTICE 'FK observers->buildings přidán';
    ELSE
        RAISE NOTICE 'CHYBA: Sloupec building_id v observers neexistuje';
    END IF;
END $$;

-- Vazby pro voting_tokens tabulku
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'voting_tokens' AND column_name = 'vote_id') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'voting_tokens' AND column_name = 'member_id') THEN
        ALTER TABLE voting_tokens ADD CONSTRAINT fk_voting_tokens_vote FOREIGN KEY (vote_id) REFERENCES votes(id) ON DELETE CASCADE;
        ALTER TABLE voting_tokens ADD CONSTRAINT fk_voting_tokens_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE;
        RAISE NOTICE 'FK voting_tokens vazby přidány';
    ELSE
        RAISE NOTICE 'CHYBA: Sloupce pro voting_tokens vazby neexistují';
    END IF;
END $$;

-- Vazby pro member_votes tabulku
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'member_votes' AND column_name = 'vote_id') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'member_votes' AND column_name = 'member_id') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'member_votes' AND column_name = 'question_id') THEN
        ALTER TABLE member_votes ADD CONSTRAINT fk_member_votes_vote FOREIGN KEY (vote_id) REFERENCES votes(id) ON DELETE CASCADE;
        ALTER TABLE member_votes ADD CONSTRAINT fk_member_votes_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE;
        ALTER TABLE member_votes ADD CONSTRAINT fk_member_votes_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE;
        
        -- Volitelné sloupce
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'member_votes' AND column_name = 'delegated_by') THEN
            ALTER TABLE member_votes ADD CONSTRAINT fk_member_votes_delegated_by FOREIGN KEY (delegated_by) REFERENCES members(id);
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'member_votes' AND column_name = 'proxy_for') THEN
            ALTER TABLE member_votes ADD CONSTRAINT fk_member_votes_proxy_for FOREIGN KEY (proxy_for) REFERENCES members(id);
        END IF;
        
        RAISE NOTICE 'FK member_votes vazby přidány';
    ELSE
        RAISE NOTICE 'CHYBA: Sloupce pro member_votes vazby neexistují';
    END IF;
END $$;

-- Vazby pro question_responses tabulku
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'question_responses' AND column_name = 'member_vote_id') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'question_responses' AND column_name = 'question_id') THEN
        ALTER TABLE question_responses ADD CONSTRAINT fk_question_responses_member_vote FOREIGN KEY (member_vote_id) REFERENCES member_votes(id) ON DELETE CASCADE;
        ALTER TABLE question_responses ADD CONSTRAINT fk_question_responses_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE;
        RAISE NOTICE 'FK question_responses vazby přidány';
    ELSE
        RAISE NOTICE 'CHYBA: Sloupce pro question_responses vazby neexistují';
    END IF;
END $$;

-- Vazby pro manual_vote_attachments tabulku
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'manual_vote_attachments' AND column_name = 'vote_id') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'manual_vote_attachments' AND column_name = 'member_id') THEN
        ALTER TABLE manual_vote_attachments ADD CONSTRAINT fk_manual_vote_attachments_vote FOREIGN KEY (vote_id) REFERENCES votes(id) ON DELETE CASCADE;
        ALTER TABLE manual_vote_attachments ADD CONSTRAINT fk_manual_vote_attachments_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE;
        RAISE NOTICE 'FK manual_vote_attachments vazby přidány';
    ELSE
        RAISE NOTICE 'CHYBA: Sloupce pro manual_vote_attachments vazby neexistují';
    END IF;
END $$;

-- Vazby pro manual_vote_notes tabulku
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'manual_vote_notes' AND column_name = 'vote_id') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'manual_vote_notes' AND column_name = 'member_id') THEN
        ALTER TABLE manual_vote_notes ADD CONSTRAINT fk_manual_vote_notes_vote FOREIGN KEY (vote_id) REFERENCES votes(id) ON DELETE CASCADE;
        ALTER TABLE manual_vote_notes ADD CONSTRAINT fk_manual_vote_notes_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE;
        RAISE NOTICE 'FK manual_vote_notes vazby přidány';
    ELSE
        RAISE NOTICE 'CHYBA: Sloupce pro manual_vote_notes vazby neexistují';
    END IF;
END $$;

SELECT 'ÚSPĚCH! KROK 2D dokončen - všechny foreign key vazby přidány!' as status;
