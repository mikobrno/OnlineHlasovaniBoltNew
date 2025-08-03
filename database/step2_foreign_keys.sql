-- KROK 2 - Přidání všech foreign key vazeb
-- Spustit až po úspěšném dokončení step1_tables_only.sql

-- ========================================
-- PŘIDÁNÍ VŠECH FOREIGN KEY VAZEB
-- ========================================

-- Vazby pro members tabulku
ALTER TABLE members ADD CONSTRAINT fk_members_representative FOREIGN KEY (representative_id) REFERENCES members(id);
ALTER TABLE members ADD CONSTRAINT fk_members_building FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE;

-- Vazby pro votes tabulku
ALTER TABLE votes ADD CONSTRAINT fk_votes_building FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE;

-- Vazby pro questions tabulku
ALTER TABLE questions ADD CONSTRAINT fk_questions_vote FOREIGN KEY (vote_id) REFERENCES votes(id) ON DELETE CASCADE;

-- Vazby pro email_templates tabulku
ALTER TABLE email_templates ADD CONSTRAINT fk_email_templates_building FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE;

-- Vazby pro vote_delegations tabulku
ALTER TABLE vote_delegations ADD CONSTRAINT fk_vote_delegations_vote FOREIGN KEY (vote_id) REFERENCES votes(id) ON DELETE CASCADE;
ALTER TABLE vote_delegations ADD CONSTRAINT fk_vote_delegations_delegator FOREIGN KEY (delegator_id) REFERENCES members(id) ON DELETE CASCADE;
ALTER TABLE vote_delegations ADD CONSTRAINT fk_vote_delegations_delegate FOREIGN KEY (delegate_id) REFERENCES members(id) ON DELETE CASCADE;

-- Vazby pro notifications tabulku
ALTER TABLE notifications ADD CONSTRAINT fk_notifications_recipient FOREIGN KEY (recipient_id) REFERENCES members(id) ON DELETE CASCADE;
ALTER TABLE notifications ADD CONSTRAINT fk_notifications_building FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE;
ALTER TABLE notifications ADD CONSTRAINT fk_notifications_vote FOREIGN KEY (vote_id) REFERENCES votes(id) ON DELETE CASCADE;

-- Vazby pro sms_verifications tabulku
ALTER TABLE sms_verifications ADD CONSTRAINT fk_sms_verifications_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE;
ALTER TABLE sms_verifications ADD CONSTRAINT fk_sms_verifications_vote FOREIGN KEY (vote_id) REFERENCES votes(id) ON DELETE CASCADE;

-- Vazby pro vote_analytics tabulku
ALTER TABLE vote_analytics ADD CONSTRAINT fk_vote_analytics_vote FOREIGN KEY (vote_id) REFERENCES votes(id) ON DELETE CASCADE;
ALTER TABLE vote_analytics ADD CONSTRAINT fk_vote_analytics_building FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE;

-- Vazby pro reports tabulku
ALTER TABLE reports ADD CONSTRAINT fk_reports_vote FOREIGN KEY (vote_id) REFERENCES votes(id) ON DELETE CASCADE;
ALTER TABLE reports ADD CONSTRAINT fk_reports_building FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE;
ALTER TABLE reports ADD CONSTRAINT fk_reports_generated_by FOREIGN KEY (generated_by) REFERENCES members(id);

-- Vazby pro proxy_votes tabulku
ALTER TABLE proxy_votes ADD CONSTRAINT fk_proxy_votes_vote FOREIGN KEY (vote_id) REFERENCES votes(id) ON DELETE CASCADE;
ALTER TABLE proxy_votes ADD CONSTRAINT fk_proxy_votes_proxy_holder FOREIGN KEY (proxy_holder_id) REFERENCES members(id) ON DELETE CASCADE;
ALTER TABLE proxy_votes ADD CONSTRAINT fk_proxy_votes_represented_member FOREIGN KEY (represented_member_id) REFERENCES members(id) ON DELETE CASCADE;

-- Vazby pro attachments tabulku
ALTER TABLE attachments ADD CONSTRAINT fk_attachments_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES members(id);

-- Vazby pro observers tabulku
ALTER TABLE observers ADD CONSTRAINT fk_observers_building FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE;

-- Vazby pro voting_tokens tabulku
ALTER TABLE voting_tokens ADD CONSTRAINT fk_voting_tokens_vote FOREIGN KEY (vote_id) REFERENCES votes(id) ON DELETE CASCADE;
ALTER TABLE voting_tokens ADD CONSTRAINT fk_voting_tokens_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE;

-- Vazby pro member_votes tabulku
ALTER TABLE member_votes ADD CONSTRAINT fk_member_votes_vote FOREIGN KEY (vote_id) REFERENCES votes(id) ON DELETE CASCADE;
ALTER TABLE member_votes ADD CONSTRAINT fk_member_votes_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE;
ALTER TABLE member_votes ADD CONSTRAINT fk_member_votes_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE;
ALTER TABLE member_votes ADD CONSTRAINT fk_member_votes_delegated_by FOREIGN KEY (delegated_by) REFERENCES members(id);
ALTER TABLE member_votes ADD CONSTRAINT fk_member_votes_proxy_for FOREIGN KEY (proxy_for) REFERENCES members(id);

-- Vazby pro question_responses tabulku
ALTER TABLE question_responses ADD CONSTRAINT fk_question_responses_member_vote FOREIGN KEY (member_vote_id) REFERENCES member_votes(id) ON DELETE CASCADE;
ALTER TABLE question_responses ADD CONSTRAINT fk_question_responses_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE;

-- Vazby pro manual_vote_attachments tabulku (POUZE vote_id a member_id, NEMÁ building_id!)
ALTER TABLE manual_vote_attachments ADD CONSTRAINT fk_manual_vote_attachments_vote FOREIGN KEY (vote_id) REFERENCES votes(id) ON DELETE CASCADE;
ALTER TABLE manual_vote_attachments ADD CONSTRAINT fk_manual_vote_attachments_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE;

-- Vazby pro manual_vote_notes tabulku (POUZE vote_id a member_id, NEMÁ building_id!)
ALTER TABLE manual_vote_notes ADD CONSTRAINT fk_manual_vote_notes_vote FOREIGN KEY (vote_id) REFERENCES votes(id) ON DELETE CASCADE;
ALTER TABLE manual_vote_notes ADD CONSTRAINT fk_manual_vote_notes_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE;

-- Test - všechny vazby přidány
SELECT 'ÚSPĚCH! Všechny foreign key vazby přidány!' as status;
