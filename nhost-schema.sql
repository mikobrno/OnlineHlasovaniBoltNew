-- Nhost Database Schema pro OnlineHlasovani
-- Spusť tento SQL v Nhost SQL editoru

-- 1. Tabulka budov
CREATE TABLE IF NOT EXISTS buildings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    address text NOT NULL,
    total_units integer NOT NULL DEFAULT 0,
    variables jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 2. Tabulka členů
CREATE TABLE IF NOT EXISTS members (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    building_id uuid NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    unit text NOT NULL,
    vote_weight numeric(10,2) DEFAULT 1.0,
    representative_id uuid REFERENCES members(id) ON DELETE SET NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 3. Tabulka hlasování
CREATE TABLE IF NOT EXISTS votes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    building_id uuid NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
    start_date timestamptz,
    end_date timestamptz,
    questions jsonb DEFAULT '[]',
    member_votes jsonb DEFAULT '{}',
    observers text[] DEFAULT '{}',
    manual_vote_attachments jsonb DEFAULT '{}',
    manual_vote_notes jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 4. Tabulka email šablon
CREATE TABLE IF NOT EXISTS email_templates (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    building_id uuid REFERENCES buildings(id) ON DELETE CASCADE,
    name text NOT NULL,
    subject text NOT NULL,
    body text NOT NULL,
    variables jsonb DEFAULT '{}',
    is_global boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 5. Tabulka globálních proměnných
CREATE TABLE IF NOT EXISTS global_variables (
    name text PRIMARY KEY,
    description text NOT NULL,
    value text NOT NULL,
    is_editable boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 6. Tabulka proměnných budov
CREATE TABLE IF NOT EXISTS building_variables (
    name text NOT NULL,
    building_id uuid NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    description text NOT NULL,
    value text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    PRIMARY KEY (name, building_id)
);

-- 7. Tabulka pozorovatelů
CREATE TABLE IF NOT EXISTS observers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    building_id uuid NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Indexy pro optimalizaci
CREATE INDEX IF NOT EXISTS idx_members_building_id ON members(building_id);
CREATE INDEX IF NOT EXISTS idx_votes_building_id ON votes(building_id);
CREATE INDEX IF NOT EXISTS idx_email_templates_building_id ON email_templates(building_id);
CREATE INDEX IF NOT EXISTS idx_building_variables_building_id ON building_variables(building_id);
CREATE INDEX IF NOT EXISTS idx_observers_building_id ON observers(building_id);

-- Trigger pro aktualizaci updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Smazání starých triggerů (pokud existují) a vytvoření nových
DROP TRIGGER IF EXISTS update_buildings_updated_at ON buildings;
DROP TRIGGER IF EXISTS update_members_updated_at ON members;
DROP TRIGGER IF EXISTS update_votes_updated_at ON votes;
DROP TRIGGER IF EXISTS update_email_templates_updated_at ON email_templates;
DROP TRIGGER IF EXISTS update_global_variables_updated_at ON global_variables;
DROP TRIGGER IF EXISTS update_building_variables_updated_at ON building_variables;
DROP TRIGGER IF EXISTS update_observers_updated_at ON observers;

CREATE TRIGGER update_buildings_updated_at BEFORE UPDATE ON buildings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_votes_updated_at BEFORE UPDATE ON votes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_global_variables_updated_at BEFORE UPDATE ON global_variables FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_building_variables_updated_at BEFORE UPDATE ON building_variables FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_observers_updated_at BEFORE UPDATE ON observers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Vložení základních globálních proměnných
INSERT INTO global_variables (name, description, value, is_editable) VALUES
('nazev_spolecnosti', 'Název správcovské společnosti', 'Správa budov s.r.o.', true),
('adresa_spolecnosti', 'Adresa správcovské společnosti', 'Hlavní 123, Praha 1', true),
('telefon_spolecnosti', 'Telefon správcovské společnosti', '+420 123 456 789', true),
('email_spolecnosti', 'Email správcovské společnosti', 'info@sprava-budov.cz', true),
('datum_dnes', 'Dnešní datum', '{{CURRENT_DATE}}', false),
('podpis_spravce', 'Podpis správce', 'S pozdravem,\nTým správy budov', true),
('pravni_upozorneni', 'Právní upozornění', 'Tato zpráva je určena pouze adresátovi. Pokud nejste zamýšleným příjemcem, informujte prosím odesílatele a zprávu smažte.', true)
ON CONFLICT (name) DO NOTHING;
