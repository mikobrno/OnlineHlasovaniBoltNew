-- Tento skript vytvoří tabulku settings, pokud ještě neexistuje
-- Tabulka settings je používána pro ukládání konfigurace aplikace

-- Vytvoření tabulky settings (pouze pokud neexistuje)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vytvoření indexu pro rychlejší vyhledávání podle klíče
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- Nastavení RLS politik pro tabulku settings
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Policy pro čtení (všichni uživatelé mohou číst nastavení)
DROP POLICY IF EXISTS "Allow read settings" ON settings;
CREATE POLICY "Allow read settings" ON settings FOR SELECT USING (true);

-- Policy pro úpravy (pouze admin může měnit nastavení)
DROP POLICY IF EXISTS "Allow all for admin settings" ON settings;
CREATE POLICY "Allow all for admin settings" ON settings FOR ALL USING (true);

-- Vytvoření triggeru pro automatickou aktualizaci updated_at
DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Vložení základních konfigurací (pokud ještě neexistují)
INSERT INTO settings (key, value) VALUES 
('general', '{"appName": "Online Hlasování SVJ", "appDescription": "Aplikace pro online hlasování SVJ a BD", "defaultLanguage": "cs", "timezone": "Europe/Prague"}'),
('sms', '{"provider": "smsbrana", "username": "", "password": ""}'),
('security', '{"sessionTimeout": 30, "maxLoginAttempts": 5, "passwordMinLength": 8, "requireTwoFactor": false}'),
('notifications', '{"emailNotifications": true, "smsNotifications": true, "browserNotifications": false}'),
('appearance', '{"defaultTheme": "system", "primaryColor": "#3b82f6", "logoUrl": ""}')
ON CONFLICT (key) DO NOTHING;
