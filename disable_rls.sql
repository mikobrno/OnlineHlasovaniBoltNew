-- DOČASNÉ ŘEŠENÍ: Vypnutí RLS pro všechny tabulky
-- Spusťte v Supabase SQL Editor

-- Zakázat RLS na všech tabulkách
ALTER TABLE IF EXISTS public.buildings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.members DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.votes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.votes_questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.member_votes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.email_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.global_variables DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.building_variable_definitions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.observers DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.voting_tokens DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.manual_vote_attachments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.manual_vote_notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.vote_observers DISABLE ROW LEVEL SECURITY;

-- Udělit přístup anonymní roli
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Specifická oprávnění tabulek pro anon
GRANT SELECT, INSERT, UPDATE, DELETE ON public.buildings TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.members TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.votes TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.questions TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_templates TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.global_variables TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.building_variable_definitions TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.observers TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.voting_tokens TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.member_votes TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.manual_vote_attachments TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.manual_vote_notes TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vote_observers TO anon, authenticated;

-- Ověřit stav RLS
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
