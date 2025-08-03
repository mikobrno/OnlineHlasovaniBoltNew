-- KONTROLA STRUKTURY DATABÁZE
-- Spustit před step2 pro ověření, že všechny tabulky a sloupce existují

-- ========================================
-- KONTROLA EXISTENCE TABULEK
-- ========================================

SELECT 
  schemaname,
  tablename,
  'Tabulka existuje' as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'buildings', 'members', 'votes', 'questions', 'email_templates',
  'vote_delegations', 'notifications', 'sms_verifications', 'audit_log',
  'vote_analytics', 'reports', 'proxy_votes', 'attachments', 'observers',
  'voting_tokens', 'member_votes', 'question_responses', 
  'manual_vote_attachments', 'manual_vote_notes'
)
ORDER BY tablename;

-- ========================================
-- KONTROLA SLOUPCŮ PRO FOREIGN KEY VAZBY
-- ========================================

-- Kontrola notifications tabulky
SELECT 
  'notifications' as table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'notifications'
AND column_name IN ('id', 'recipient_id', 'building_id', 'vote_id')
ORDER BY column_name;

-- Kontrola members tabulky
SELECT 
  'members' as table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'members'
AND column_name IN ('id', 'representative_id', 'building_id')
ORDER BY column_name;

-- Kontrola votes tabulky
SELECT 
  'votes' as table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'votes'
AND column_name IN ('id', 'building_id')
ORDER BY column_name;

-- Kontrola manual_vote_attachments tabulky
SELECT 
  'manual_vote_attachments' as table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'manual_vote_attachments'
ORDER BY column_name;

-- Kontrola manual_vote_notes tabulky
SELECT 
  'manual_vote_notes' as table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'manual_vote_notes'
ORDER BY column_name;

-- ========================================
-- POČET VŠECH TABULEK
-- ========================================

SELECT 
  COUNT(*) as pocet_tabulek,
  'Celkový počet tabulek vytvořených v public schema' as popis
FROM pg_tables 
WHERE schemaname = 'public';
