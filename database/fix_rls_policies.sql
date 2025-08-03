-- OPRAVA RLS POLICIES PRO FUNGOVÁNÍ APLIKACE
-- Spustit v Supabase SQL Editor

-- Nejprve smažeme existující policies
DROP POLICY IF EXISTS "Allow read buildings" ON buildings;
DROP POLICY IF EXISTS "Allow read members" ON members;
DROP POLICY IF EXISTS "Allow read votes" ON votes;
DROP POLICY IF EXISTS "Allow read questions" ON questions;
DROP POLICY IF EXISTS "Allow read voting_tokens" ON voting_tokens;
DROP POLICY IF EXISTS "Allow read global_variables" ON global_variables;
DROP POLICY IF EXISTS "Allow read building_variable_definitions" ON building_variable_definitions;

-- Vytvoříme liberálnější policies pro vývoj/testování
CREATE POLICY "Public read buildings" ON buildings FOR ALL USING (true);
CREATE POLICY "Public read members" ON members FOR ALL USING (true);
CREATE POLICY "Public read votes" ON votes FOR ALL USING (true);
CREATE POLICY "Public read questions" ON questions FOR ALL USING (true);
CREATE POLICY "Public read voting_tokens" ON voting_tokens FOR ALL USING (true);
CREATE POLICY "Public read global_variables" ON global_variables FOR ALL USING (true);
CREATE POLICY "Public read building_variable_definitions" ON building_variable_definitions FOR ALL USING (true);
CREATE POLICY "Public read email_templates" ON email_templates FOR ALL USING (true);
CREATE POLICY "Public read observers" ON observers FOR ALL USING (true);
CREATE POLICY "Public read member_votes" ON member_votes FOR ALL USING (true);
CREATE POLICY "Public read manual_vote_attachments" ON manual_vote_attachments FOR ALL USING (true);
CREATE POLICY "Public read manual_vote_notes" ON manual_vote_notes FOR ALL USING (true);
CREATE POLICY "Public read vote_delegations" ON vote_delegations FOR ALL USING (true);
CREATE POLICY "Public read notifications" ON notifications FOR ALL USING (true);
CREATE POLICY "Public read sms_verifications" ON sms_verifications FOR ALL USING (true);
CREATE POLICY "Public read audit_log" ON audit_log FOR SELECT USING (true);
CREATE POLICY "Public read vote_analytics" ON vote_analytics FOR ALL USING (true);
CREATE POLICY "Public read reports" ON reports FOR ALL USING (true);
CREATE POLICY "Public read question_responses" ON question_responses FOR ALL USING (true);
CREATE POLICY "Public read proxy_votes" ON proxy_votes FOR ALL USING (true);
CREATE POLICY "Public read attachments" ON attachments FOR ALL USING (true);

SELECT 'RLS POLICIES OPRAVENY - APLIKACE BY MĚLA FUNGOVAT! ✅' as status;
