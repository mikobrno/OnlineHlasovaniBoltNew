-- FIX RLS POLICIES FOR ONLINE HLASOVÁNÍ
-- Tento skript opraví Row Level Security políčky v Supabase

-- OPTION 1: Completely disable RLS (easiest for development)
ALTER TABLE buildings DISABLE ROW LEVEL SECURITY;
ALTER TABLE members DISABLE ROW LEVEL SECURITY;
ALTER TABLE votes DISABLE ROW LEVEL SECURITY;
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE votes_questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE global_variables DISABLE ROW LEVEL SECURITY;
ALTER TABLE building_variables DISABLE ROW LEVEL SECURITY;
ALTER TABLE voting_tokens DISABLE ROW LEVEL SECURITY;

-- OPTION 2: Enable RLS but allow all operations (more secure)
-- Uncomment the following if you want to keep RLS enabled but allow all operations

/*
-- Enable RLS on all tables
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_variables ENABLE ROW LEVEL SECURITY;
ALTER TABLE building_variables ENABLE ROW LEVEL SECURITY;
ALTER TABLE voting_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations
CREATE POLICY "Allow all operations on buildings" ON buildings FOR ALL USING (true);
CREATE POLICY "Allow all operations on members" ON members FOR ALL USING (true);
CREATE POLICY "Allow all operations on votes" ON votes FOR ALL USING (true);
CREATE POLICY "Allow all operations on questions" ON questions FOR ALL USING (true);
CREATE POLICY "Allow all operations on votes_questions" ON votes_questions FOR ALL USING (true);
CREATE POLICY "Allow all operations on templates" ON templates FOR ALL USING (true);
CREATE POLICY "Allow all operations on global_variables" ON global_variables FOR ALL USING (true);
CREATE POLICY "Allow all operations on building_variables" ON building_variables FOR ALL USING (true);
CREATE POLICY "Allow all operations on voting_tokens" ON voting_tokens FOR ALL USING (true);
*/

-- Check current RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
    AND tablename IN ('buildings', 'members', 'votes', 'questions', 'votes_questions', 'templates', 'global_variables', 'building_variables', 'voting_tokens');
