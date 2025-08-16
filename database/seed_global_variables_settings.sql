-- Seed základních aplikačních proměnných používaných komponentou SettingsView
-- Spusť v Hasura SQL konzoli jednou (ON CONFLICT ochrání proti duplicitám)

INSERT INTO global_variables (name, description, value, is_editable)
VALUES
  ('app_name', 'Název aplikace', 'Online Hlasování', true),
  ('app_description', 'Popis aplikace', 'Systém pro online hlasování SVJ/BD', true),
  ('default_language', 'Výchozí jazyk', 'cs', true),
  ('timezone', 'Časové pásmo', 'Europe/Prague', true),
  ('session_timeout', 'Timeout relace (minuty)', '30', true),
  ('max_login_attempts', 'Maximální počet pokusů o přihlášení', '5', true),
  ('password_min_length', 'Minimální délka hesla', '8', true),
  ('require_two_factor', 'Vyžadovat 2FA', 'false', true),
  ('email_notifications', 'Emailové notifikace', 'true', true),
  ('sms_notifications', 'SMS notifikace', 'false', true),
  ('browser_notifications', 'Prohlížečové notifikace', 'false', true),
  ('default_theme', 'Výchozí téma', 'system', true),
  ('primary_color', 'Primární barva', '#3b82f6', true),
  ('logo_url', 'URL loga', '', true)
ON CONFLICT (name) DO NOTHING;

-- Volitelně doplnění podpisu a právního upozornění, pokud ještě nejsou
INSERT INTO global_variables (name, description, value, is_editable)
VALUES
  ('podpis_spravce', 'Podpis správce', 'S pozdravem,\nTým správy', true),
  ('pravni_upozorneni', 'Právní upozornění', 'Tato zpráva je určena pouze adresátovi.', true)
ON CONFLICT (name) DO NOTHING;

-- Po seednutí lze měnit přes UI (mutace dělá upsert na value)
