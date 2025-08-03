-- KROK 2C - PROBLEMATICKÉ VAZBY (notifications a další)
-- Spustit až po úspěšném dokončení step2b_extended_foreign_keys.sql

-- ========================================
-- KROK 2C - NOTIFICATIONS A KOMPLEXNÍ VAZBY
-- ========================================

-- Vazby pro notifications tabulku (problematická)
DO $$
BEGIN
    -- Kontrola existence všech sloupců
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'recipient_id') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'building_id') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'vote_id') THEN
        
        ALTER TABLE notifications ADD CONSTRAINT fk_notifications_recipient FOREIGN KEY (recipient_id) REFERENCES members(id) ON DELETE CASCADE;
        RAISE NOTICE 'FK notifications->members (recipient) přidán';
        
        ALTER TABLE notifications ADD CONSTRAINT fk_notifications_building FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE;
        RAISE NOTICE 'FK notifications->buildings přidán';
        
        ALTER TABLE notifications ADD CONSTRAINT fk_notifications_vote FOREIGN KEY (vote_id) REFERENCES votes(id) ON DELETE CASCADE;
        RAISE NOTICE 'FK notifications->votes přidán';
    ELSE
        RAISE NOTICE 'CHYBA: Některé sloupce v notifications tabulce neexistují';
        
        -- Detailní kontrola
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'recipient_id') THEN
            RAISE NOTICE 'CHYBÍ: notifications.recipient_id';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'building_id') THEN
            RAISE NOTICE 'CHYBÍ: notifications.building_id';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'vote_id') THEN
            RAISE NOTICE 'CHYBÍ: notifications.vote_id';
        END IF;
    END IF;
END $$;

-- Vazby pro sms_verifications tabulku
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sms_verifications' AND column_name = 'member_id') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sms_verifications' AND column_name = 'vote_id') THEN
        ALTER TABLE sms_verifications ADD CONSTRAINT fk_sms_verifications_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE;
        ALTER TABLE sms_verifications ADD CONSTRAINT fk_sms_verifications_vote FOREIGN KEY (vote_id) REFERENCES votes(id) ON DELETE CASCADE;
        RAISE NOTICE 'FK sms_verifications vazby přidány';
    ELSE
        RAISE NOTICE 'CHYBA: Sloupce pro sms_verifications vazby neexistují';
    END IF;
END $$;

-- Vazby pro vote_analytics tabulku
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vote_analytics' AND column_name = 'vote_id') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vote_analytics' AND column_name = 'building_id') THEN
        ALTER TABLE vote_analytics ADD CONSTRAINT fk_vote_analytics_vote FOREIGN KEY (vote_id) REFERENCES votes(id) ON DELETE CASCADE;
        ALTER TABLE vote_analytics ADD CONSTRAINT fk_vote_analytics_building FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE;
        RAISE NOTICE 'FK vote_analytics vazby přidány';
    ELSE
        RAISE NOTICE 'CHYBA: Sloupce pro vote_analytics vazby neexistují';
    END IF;
END $$;

SELECT 'KROK 2C dokončen - notifications a komplexní vazby' as status;
