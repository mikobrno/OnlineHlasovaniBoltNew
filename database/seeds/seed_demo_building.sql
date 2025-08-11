-- Seed: Demo budova + členové + pozorovatelé + 1 aktivní hlasování
-- Prostředí: Supabase (PostgreSQL)
-- Použití: Zkopírujte a spusťte v Supabase SQL editoru. Skript je idempotentní (ON CONFLICT na pevných UUID).

BEGIN;

-- Pevná UUID pro deterministické opakované spuštění
-- Budova
INSERT INTO buildings (id, name, address, total_units, variables)
VALUES (
  '11111111-1111-4111-8111-111111111111',
  'SVJ Vinohradská 125',
  'Vinohradská 125, Praha 2',
  24,
  '{
    "nazev_budovy": "SVJ Vinohradská 125",
    "zkraceny_nazev": "SVJ Vinohradská",
    "plny_nazev": "Společenství vlastníků jednotek Vinohradská 125",
    "adresa": "Vinohradská 125, Praha 2",
    "osloveni": "Vážení vlastníci",
    "predseda": "Ing. Jan Novák",
    "telefon_predsedy": "+420 777 111 222",
    "email_predsedy": "predseda@vinohradska125.cz",
    "kontaktni_osoba": "Správa budovy",
    "banka": "Česká spořitelna",
    "cislo_uctu": "123456789/0800",
    "web": "www.vinohradska125.cz"
  }'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  total_units = EXCLUDED.total_units,
  variables = EXCLUDED.variables;

-- Členové (10 demo záznamů)
INSERT INTO members (id, name, email, phone, unit, vote_weight, representative_id, building_id)
VALUES
  ('11111111-1111-4111-8111-111111111201','Jan Novák','jan.novak+demo@example.com','+420601000001','1.01',1.0,NULL,'11111111-1111-4111-8111-111111111111'),
  ('11111111-1111-4111-8111-111111111202','Marie Svobodová','marie.svobodova+demo@example.com','+420601000002','1.02',1.2,NULL,'11111111-1111-4111-8111-111111111111'),
  ('11111111-1111-4111-8111-111111111203','Petr Dvořák','petr.dvorak+demo@example.com','+420601000003','2.01',0.8,NULL,'11111111-1111-4111-8111-111111111111'),
  ('11111111-1111-4111-8111-111111111204','Lucie Procházková','lucie.prochazkova+demo@example.com','+420601000004','2.02',1.0,NULL,'11111111-1111-4111-8111-111111111111'),
  ('11111111-1111-4111-8111-111111111205','Karel Černý','karel.cerny+demo@example.com','+420601000005','3.01',1.5,NULL,'11111111-1111-4111-8111-111111111111'),
  ('11111111-1111-4111-8111-111111111206','Eva Králová','eva.kralova+demo@example.com','+420601000006','3.02',1.1,NULL,'11111111-1111-4111-8111-111111111111'),
  ('11111111-1111-4111-8111-111111111207','Tomáš Pokorný','tomas.pokorny+demo@example.com','+420601000007','4.01',0.9,NULL,'11111111-1111-4111-8111-111111111111'),
  ('11111111-1111-4111-8111-111111111208','Alena Jelínková','alena.jelinkova+demo@example.com','+420601000008','4.02',1.3,NULL,'11111111-1111-4111-8111-111111111111'),
  ('11111111-1111-4111-8111-111111111209','Milan Beneš','milan.benes+demo@example.com','+420601000009','5.01',1.0,NULL,'11111111-1111-4111-8111-111111111111'),
  ('11111111-1111-4111-8111-111111111210','Hana Fialová','hana.fialova+demo@example.com','+420601000010','5.02',1.0,NULL,'11111111-1111-4111-8111-111111111111')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  unit = EXCLUDED.unit,
  vote_weight = EXCLUDED.vote_weight,
  representative_id = EXCLUDED.representative_id,
  building_id = EXCLUDED.building_id;

-- Pozorovatelé (2 demo záznamy)
INSERT INTO observers (id, name, email, building_id, created_at)
VALUES
  ('11111111-1111-4111-8111-111111112301','Ing. Pavel Správce','spravce+vino@onlinesprava.cz','11111111-1111-4111-8111-111111111111', NOW()),
  ('11111111-1111-4111-8111-111111112302','Bc. Jana Kontrolorka','kontrolor+vino@onlinesprava.cz','11111111-1111-4111-8111-111111111111', NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  building_id = EXCLUDED.building_id,
  created_at = EXCLUDED.created_at;

-- Hlasování (1 aktivní hlasování + 2 otázky)
INSERT INTO votes (id, title, description, building_id, status, created_at, start_date, end_date, attachments, observers)
VALUES (
  '11111111-1111-4111-8111-111111113401',
  'Schválení ročního rozpočtu',
  'Hlasování per rollam o rozpočtu a příspěvcích do fondů.',
  '11111111-1111-4111-8111-111111111111',
  'active',
  NOW(),
  NOW(),
  NOW() + INTERVAL '7 days',
  NULL,
  ARRAY[]::text[]
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  building_id = EXCLUDED.building_id,
  status = EXCLUDED.status,
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  attachments = EXCLUDED.attachments,
  observers = EXCLUDED.observers;

-- Otázky k hlasování
INSERT INTO questions (id, vote_id, text, quorum_type, custom_quorum_numerator, custom_quorum_denominator)
VALUES
  ('11111111-1111-4111-8111-111111114501','11111111-1111-4111-8111-111111113401','Schvalujete navržený rozpočet?','qualified', NULL, NULL),
  ('11111111-1111-4111-8111-111111114502','11111111-1111-4111-8111-111111113401','Souhlasíte se zvýšením příspěvků o 5%?','simple', NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
  vote_id = EXCLUDED.vote_id,
  text = EXCLUDED.text,
  quorum_type = EXCLUDED.quorum_type,
  custom_quorum_numerator = EXCLUDED.custom_quorum_numerator,
  custom_quorum_denominator = EXCLUDED.custom_quorum_denominator;

COMMIT;

-- Poznámka:
-- 1) E-mailové šablony naplňte zvlášť skriptem: database/seeds/insert_email_templates.sql
-- 2) Členové obdrží své unikátní linky až při rozesílce z aplikace (generátory tokenů v app)
