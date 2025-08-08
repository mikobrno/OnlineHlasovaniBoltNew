-- SMAZÁNÍ VŠECH TABULEK A RESTART
-- Spusťte tento skript NEJDŘÍVE pro vyčištění databáze

-- Smazat všechny tabulky v správném pořadí (kvůli foreign keys)
DROP TABLE IF EXISTS votes_questions CASCADE;
DROP TABLE IF EXISTS manual_vote_notes CASCADE;
DROP TABLE IF EXISTS manual_vote_attachments CASCADE;
DROP TABLE IF EXISTS voting_tokens CASCADE;
DROP TABLE IF EXISTS member_votes CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS observers CASCADE;
DROP TABLE IF EXISTS email_templates CASCADE;
DROP TABLE IF EXISTS buildings CASCADE;
DROP TABLE IF EXISTS building_variable_definitions CASCADE;
DROP TABLE IF EXISTS global_variables CASCADE;

-- Smazat triggery a funkce
DROP TRIGGER IF EXISTS update_buildings_updated_at ON buildings;
DROP TRIGGER IF EXISTS update_members_updated_at ON members;
DROP TRIGGER IF EXISTS update_votes_updated_at ON votes;
DROP TRIGGER IF EXISTS update_email_templates_updated_at ON email_templates;
DROP TRIGGER IF EXISTS update_global_variables_updated_at ON global_variables;
DROP TRIGGER IF EXISTS update_building_variable_definitions_updated_at ON building_variable_definitions;

DROP FUNCTION IF EXISTS update_updated_at_column();

-- Zkontrolovat, že je vše smazáno
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
