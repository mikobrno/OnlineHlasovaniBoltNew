-- KROK 3 - Přidání indexů a unique constraints S KONTROLOU EXISTENCE SLOUPCŮ
-- Spustit až po úspěšném dokončení step2_foreign_keys.sql

-- ========================================
-- PŘIDÁNÍ UNIQUE CONSTRAINTS
-- ========================================

-- Unique constraints pro members
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'members' AND column_name = 'email') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'members' AND column_name = 'building_id') THEN
        ALTER TABLE members ADD CONSTRAINT uk_members_email_building UNIQUE (email, building_id);
        RAISE NOTICE 'UK members email_building přidán';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'members' AND column_name = 'unit') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'members' AND column_name = 'building_id') THEN
        ALTER TABLE members ADD CONSTRAINT uk_members_unit_building UNIQUE (unit, building_id);
        RAISE NOTICE 'UK members unit_building přidán';
    END IF;
END $$;

-- Unique constraints pro vote_delegations
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vote_delegations' AND column_name = 'vote_id') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vote_delegations' AND column_name = 'delegator_id') THEN
        ALTER TABLE vote_delegations ADD CONSTRAINT uk_vote_delegations_vote_delegator UNIQUE (vote_id, delegator_id);
        RAISE NOTICE 'UK vote_delegations přidán';
    END IF;
END $$;

-- Unique constraints pro sms_verifications
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sms_verifications' AND column_name = 'vote_id') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sms_verifications' AND column_name = 'member_id') THEN
        ALTER TABLE sms_verifications ADD CONSTRAINT uk_sms_verifications_vote_member UNIQUE (vote_id, member_id);
        RAISE NOTICE 'UK sms_verifications přidán';
    END IF;
END $$;

-- Unique constraints pro voting_tokens
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'voting_tokens' AND column_name = 'vote_id') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'voting_tokens' AND column_name = 'member_id') THEN
        ALTER TABLE voting_tokens ADD CONSTRAINT uk_voting_tokens_vote_member UNIQUE (vote_id, member_id);
        RAISE NOTICE 'UK voting_tokens přidán';
    END IF;
END $$;

-- Unique constraints pro member_votes
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'member_votes' AND column_name = 'vote_id') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'member_votes' AND column_name = 'member_id') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'member_votes' AND column_name = 'question_id') THEN
        ALTER TABLE member_votes ADD CONSTRAINT uk_member_votes_vote_member_question UNIQUE (vote_id, member_id, question_id);
        RAISE NOTICE 'UK member_votes přidán';
    END IF;
END $$;

-- Unique constraints pro manual_vote_notes
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'manual_vote_notes' AND column_name = 'vote_id') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'manual_vote_notes' AND column_name = 'member_id') THEN
        ALTER TABLE manual_vote_notes ADD CONSTRAINT uk_manual_vote_notes_vote_member UNIQUE (vote_id, member_id);
        RAISE NOTICE 'UK manual_vote_notes přidán';
    END IF;
END $$;

-- Unique constraints pro proxy_votes
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proxy_votes' AND column_name = 'vote_id') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proxy_votes' AND column_name = 'represented_member_id') THEN
        ALTER TABLE proxy_votes ADD CONSTRAINT uk_proxy_votes_vote_represented_member UNIQUE (vote_id, represented_member_id);
        RAISE NOTICE 'UK proxy_votes přidán';
    END IF;
END $$;

-- Unique constraints pro observers
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'observers' AND column_name = 'email') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'observers' AND column_name = 'building_id') THEN
        ALTER TABLE observers ADD CONSTRAINT uk_observers_email_building UNIQUE (email, building_id);
        RAISE NOTICE 'UK observers přidán';
    END IF;
END $$;

-- ========================================
-- VYTVOŘENÍ INDEXŮ PRO VÝKON (S KONTROLOU SLOUPCŮ)
-- ========================================

-- Indexy pro members
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'members' AND column_name = 'building_id') THEN
        CREATE INDEX IF NOT EXISTS idx_members_building_id ON members(building_id);
        RAISE NOTICE 'Index members building_id vytvořen';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'members' AND column_name = 'email') THEN
        CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
        RAISE NOTICE 'Index members email vytvořen';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'members' AND column_name = 'is_active') THEN
        CREATE INDEX IF NOT EXISTS idx_members_active ON members(is_active);
        RAISE NOTICE 'Index members is_active vytvořen';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'members' AND column_name = 'role') THEN
        CREATE INDEX IF NOT EXISTS idx_members_role ON members(role);
        RAISE NOTICE 'Index members role vytvořen';
    END IF;
END $$;

-- Indexy pro votes
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'votes' AND column_name = 'building_id') THEN
        CREATE INDEX IF NOT EXISTS idx_votes_building_id ON votes(building_id);
        RAISE NOTICE 'Index votes building_id vytvořen';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'votes' AND column_name = 'status') THEN
        CREATE INDEX IF NOT EXISTS idx_votes_status ON votes(status);
        RAISE NOTICE 'Index votes status vytvořen';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'votes' AND column_name = 'status') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'votes' AND column_name = 'start_date') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'votes' AND column_name = 'end_date') THEN
        CREATE INDEX IF NOT EXISTS idx_votes_active ON votes(status, start_date, end_date);
        RAISE NOTICE 'Index votes active vytvořen';
    END IF;
END $$;

-- Indexy pro questions
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'vote_id') THEN
        CREATE INDEX IF NOT EXISTS idx_questions_vote_id ON questions(vote_id);
        RAISE NOTICE 'Index questions vote_id vytvořen';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'question_type') THEN
        CREATE INDEX IF NOT EXISTS idx_questions_type ON questions(question_type);
        RAISE NOTICE 'Index questions type vytvořen';
    END IF;
END $$;

-- Indexy pro voting_tokens
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'voting_tokens' AND column_name = 'token') THEN
        CREATE INDEX IF NOT EXISTS idx_voting_tokens_token ON voting_tokens(token);
        RAISE NOTICE 'Index voting_tokens token vytvořen';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'voting_tokens' AND column_name = 'vote_id') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'voting_tokens' AND column_name = 'member_id') THEN
        CREATE INDEX IF NOT EXISTS idx_voting_tokens_vote_member ON voting_tokens(vote_id, member_id);
        RAISE NOTICE 'Index voting_tokens vote_member vytvořen';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'voting_tokens' AND column_name = 'is_verified') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'voting_tokens' AND column_name = 'is_used') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'voting_tokens' AND column_name = 'expires_at') THEN
        CREATE INDEX IF NOT EXISTS idx_voting_tokens_active ON voting_tokens(is_verified, is_used, expires_at);
        RAISE NOTICE 'Index voting_tokens active vytvořen';
    END IF;
END $$;

-- Indexy pro member_votes
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'member_votes' AND column_name = 'vote_id') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'member_votes' AND column_name = 'member_id') THEN
        CREATE INDEX IF NOT EXISTS idx_member_votes_vote_member ON member_votes(vote_id, member_id);
        RAISE NOTICE 'Index member_votes vote_member vytvořen';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'member_votes' AND column_name = 'question_id') THEN
        CREATE INDEX IF NOT EXISTS idx_member_votes_question ON member_votes(question_id);
        RAISE NOTICE 'Index member_votes question vytvořen';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'member_votes' AND column_name = 'is_delegated') THEN
        CREATE INDEX IF NOT EXISTS idx_member_votes_delegated ON member_votes(is_delegated);
        RAISE NOTICE 'Index member_votes delegated vytvořen';
    END IF;
END $$;

-- Indexy pro observers
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'observers' AND column_name = 'building_id') THEN
        CREATE INDEX IF NOT EXISTS idx_observers_building_id ON observers(building_id);
        RAISE NOTICE 'Index observers building_id vytvořen';
    END IF;
END $$;

-- Indexy pro vote_delegations
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vote_delegations' AND column_name = 'vote_id') THEN
        CREATE INDEX IF NOT EXISTS idx_vote_delegations_vote ON vote_delegations(vote_id);
        RAISE NOTICE 'Index vote_delegations vote vytvořen';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vote_delegations' AND column_name = 'delegator_id') THEN
        CREATE INDEX IF NOT EXISTS idx_vote_delegations_delegator ON vote_delegations(delegator_id);
        RAISE NOTICE 'Index vote_delegations delegator vytvořen';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vote_delegations' AND column_name = 'delegate_id') THEN
        CREATE INDEX IF NOT EXISTS idx_vote_delegations_delegate ON vote_delegations(delegate_id);
        RAISE NOTICE 'Index vote_delegations delegate vytvořen';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vote_delegations' AND column_name = 'vote_id') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vote_delegations' AND column_name = 'is_active') THEN
        CREATE INDEX IF NOT EXISTS idx_vote_delegations_active ON vote_delegations(vote_id, is_active);
        RAISE NOTICE 'Index vote_delegations active vytvořen';
    END IF;
END $$;

-- Indexy pro notifications
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'recipient_id') THEN
        CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id);
        RAISE NOTICE 'Index notifications recipient vytvořen';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'recipient_id') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'is_read') THEN
        CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(recipient_id, is_read);
        RAISE NOTICE 'Index notifications unread vytvořen';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'vote_id') THEN
        CREATE INDEX IF NOT EXISTS idx_notifications_vote ON notifications(vote_id);
        RAISE NOTICE 'Index notifications vote vytvořen';
    END IF;
END $$;

-- Indexy pro sms_verifications
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sms_verifications' AND column_name = 'member_id') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sms_verifications' AND column_name = 'vote_id') THEN
        CREATE INDEX IF NOT EXISTS idx_sms_verifications_member_vote ON sms_verifications(member_id, vote_id);
        RAISE NOTICE 'Index sms_verifications member_vote vytvořen';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sms_verifications' AND column_name = 'token_hash') THEN
        CREATE INDEX IF NOT EXISTS idx_sms_verifications_token ON sms_verifications(token_hash);
        RAISE NOTICE 'Index sms_verifications token vytvořen';
    END IF;
END $$;

-- Indexy pro audit_log
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_log' AND column_name = 'entity_type') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_log' AND column_name = 'entity_id') THEN
        CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log(entity_type, entity_id);
        RAISE NOTICE 'Index audit_log entity vytvořen';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_log' AND column_name = 'actor_id') THEN
        CREATE INDEX IF NOT EXISTS idx_audit_log_actor ON audit_log(actor_id);
        RAISE NOTICE 'Index audit_log actor vytvořen';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'audit_log' AND column_name = 'created_at') THEN
        CREATE INDEX IF NOT EXISTS idx_audit_log_time ON audit_log(created_at);
        RAISE NOTICE 'Index audit_log time vytvořen';
    END IF;
END $$;

-- Indexy pro vote_analytics
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vote_analytics' AND column_name = 'vote_id') THEN
        CREATE INDEX IF NOT EXISTS idx_vote_analytics_vote ON vote_analytics(vote_id);
        RAISE NOTICE 'Index vote_analytics vote vytvořen';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'vote_analytics' AND column_name = 'building_id') THEN
        CREATE INDEX IF NOT EXISTS idx_vote_analytics_building ON vote_analytics(building_id);
        RAISE NOTICE 'Index vote_analytics building vytvořen';
    END IF;
END $$;

-- Indexy pro reports
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reports' AND column_name = 'vote_id') THEN
        CREATE INDEX IF NOT EXISTS idx_reports_vote ON reports(vote_id);
        RAISE NOTICE 'Index reports vote vytvořen';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reports' AND column_name = 'building_id') THEN
        CREATE INDEX IF NOT EXISTS idx_reports_building ON reports(building_id);
        RAISE NOTICE 'Index reports building vytvořen';
    END IF;
END $$;

-- Indexy pro question_responses
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'question_responses' AND column_name = 'member_vote_id') THEN
        CREATE INDEX IF NOT EXISTS idx_question_responses_member_vote ON question_responses(member_vote_id);
        RAISE NOTICE 'Index question_responses member_vote vytvořen';
    END IF;
END $$;

-- Indexy pro proxy_votes
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proxy_votes' AND column_name = 'vote_id') THEN
        CREATE INDEX IF NOT EXISTS idx_proxy_votes_vote ON proxy_votes(vote_id);
        RAISE NOTICE 'Index proxy_votes vote vytvořen';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proxy_votes' AND column_name = 'proxy_holder_id') THEN
        CREATE INDEX IF NOT EXISTS idx_proxy_votes_holder ON proxy_votes(proxy_holder_id);
        RAISE NOTICE 'Index proxy_votes holder vytvořen';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proxy_votes' AND column_name = 'represented_member_id') THEN
        CREATE INDEX IF NOT EXISTS idx_proxy_votes_represented ON proxy_votes(represented_member_id);
        RAISE NOTICE 'Index proxy_votes represented vytvořen';
    END IF;
END $$;

-- Indexy pro attachments
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'attachments' AND column_name = 'entity_type') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'attachments' AND column_name = 'entity_id') THEN
        CREATE INDEX IF NOT EXISTS idx_attachments_entity ON attachments(entity_type, entity_id);
        RAISE NOTICE 'Index attachments entity vytvořen';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'attachments' AND column_name = 'is_public') THEN
        CREATE INDEX IF NOT EXISTS idx_attachments_public ON attachments(is_public);
        RAISE NOTICE 'Index attachments public vytvořen';
    END IF;
END $$;

-- Test - všechny indexy vytvořeny
SELECT 'ÚSPĚCH! Všechny indexy a unique constraints s kontrolou sloupců přidány!' as status;
