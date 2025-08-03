-- SQL schema pro Supabase databázi
-- Tento soubor obsahuje všechny potřebné tabulky a konfigurace

-- Zapnutí RLS (Row Level Security)
ALTER DATABASE postgres SET row_security = on;

-- Vytvoření tabulky buildings
CREATE TABLE IF NOT EXISTS buildings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  total_units INTEGER NOT NULL DEFAULT 0,
  variables JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vytvoření tabulky members
CREATE TABLE IF NOT EXISTS members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  unit TEXT NOT NULL,
  vote_weight DECIMAL(5,2) NOT NULL DEFAULT 1.00,
  representative_id UUID REFERENCES members(id),
  building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email, building_id),
  UNIQUE(unit, building_id)
);

-- Vytvoření tabulky votes
CREATE TABLE IF NOT EXISTS votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  attachments TEXT[],
  observers TEXT[]
);

-- Vytvoření tabulky questions
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vote_id UUID NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  quorum_type TEXT NOT NULL DEFAULT 'simple' CHECK (quorum_type IN ('simple', 'qualified', 'unanimous', 'custom')),
  custom_quorum_numerator INTEGER,
  custom_quorum_denominator INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vytvoření tabulky email_templates
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
  is_global BOOLEAN DEFAULT false,
  custom_variables JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vytvoření tabulky global_variables
CREATE TABLE IF NOT EXISTS global_variables (
  name TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  value TEXT NOT NULL,
  is_editable BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vytvoření tabulky building_variable_definitions
CREATE TABLE IF NOT EXISTS building_variable_definitions (
  name TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('text', 'select', 'number')),
  options TEXT[],
  required BOOLEAN DEFAULT false,
  placeholder TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vytvoření tabulky observers
CREATE TABLE IF NOT EXISTS observers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email, building_id)
);

-- Vytvoření tabulky voting_tokens
CREATE TABLE IF NOT EXISTS voting_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vote_id UUID NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  verification_code TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  is_used BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  used_at TIMESTAMPTZ,
  UNIQUE(vote_id, member_id)
);

-- Vytvoření tabulky member_votes
CREATE TABLE IF NOT EXISTS member_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vote_id UUID NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer TEXT NOT NULL CHECK (answer IN ('yes', 'no', 'abstain')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(vote_id, member_id, question_id)
);

-- Vytvoření tabulky manual_vote_attachments
CREATE TABLE IF NOT EXISTS manual_vote_attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vote_id UUID NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  attachment_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vytvoření tabulky manual_vote_notes
CREATE TABLE IF NOT EXISTS manual_vote_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vote_id UUID NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(vote_id, member_id)
);

-- Vytvoření indexů pro lepší výkon
CREATE INDEX IF NOT EXISTS idx_members_building_id ON members(building_id);
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_votes_building_id ON votes(building_id);
CREATE INDEX IF NOT EXISTS idx_votes_status ON votes(status);
CREATE INDEX IF NOT EXISTS idx_questions_vote_id ON questions(vote_id);
CREATE INDEX IF NOT EXISTS idx_voting_tokens_token ON voting_tokens(token);
CREATE INDEX IF NOT EXISTS idx_voting_tokens_vote_member ON voting_tokens(vote_id, member_id);
CREATE INDEX IF NOT EXISTS idx_member_votes_vote_member ON member_votes(vote_id, member_id);
CREATE INDEX IF NOT EXISTS idx_observers_building_id ON observers(building_id);

-- Vytvoření trigger funkcí pro automatické aktualizace
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Vytvoření triggerů
CREATE TRIGGER update_buildings_updated_at BEFORE UPDATE ON buildings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_global_variables_updated_at BEFORE UPDATE ON global_variables FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Povolení RLS na všech tabulkách
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_variables ENABLE ROW LEVEL SECURITY;
ALTER TABLE building_variable_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE observers ENABLE ROW LEVEL SECURITY;
ALTER TABLE voting_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_vote_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_vote_notes ENABLE ROW LEVEL SECURITY;

-- Základní RLS policies (pro začátek povolíme vše, později lze zpřísnit)
-- Pro anonymní přístup (veřejné hlasování)
CREATE POLICY "Allow anonymous read buildings" ON buildings FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read members" ON members FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read votes" ON votes FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read questions" ON questions FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read voting_tokens" ON voting_tokens FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read global_variables" ON global_variables FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read building_variable_definitions" ON building_variable_definitions FOR SELECT USING (true);

-- Pro hlasování
CREATE POLICY "Allow anonymous insert member_votes" ON member_votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update voting_tokens" ON voting_tokens FOR UPDATE USING (true);

-- Pro administrátory (později může být nahrazeno specifickými policies)
CREATE POLICY "Allow all for admin" ON buildings FOR ALL USING (true);
CREATE POLICY "Allow all for admin members" ON members FOR ALL USING (true);
CREATE POLICY "Allow all for admin votes" ON votes FOR ALL USING (true);
CREATE POLICY "Allow all for admin questions" ON questions FOR ALL USING (true);
CREATE POLICY "Allow all for admin email_templates" ON email_templates FOR ALL USING (true);
CREATE POLICY "Allow all for admin global_variables" ON global_variables FOR ALL USING (true);
CREATE POLICY "Allow all for admin building_variable_definitions" ON building_variable_definitions FOR ALL USING (true);
CREATE POLICY "Allow all for admin observers" ON observers FOR ALL USING (true);
CREATE POLICY "Allow all for admin voting_tokens" ON voting_tokens FOR ALL USING (true);
CREATE POLICY "Allow all for admin member_votes" ON member_votes FOR ALL USING (true);
CREATE POLICY "Allow all for admin manual_vote_attachments" ON manual_vote_attachments FOR ALL USING (true);
CREATE POLICY "Allow all for admin manual_vote_notes" ON manual_vote_notes FOR ALL USING (true);

-- Vložení základních globálních proměnných
INSERT INTO global_variables (name, description, value, is_editable) VALUES
('datum_dnes', 'Aktuální datum', '', false),
('cas_ted', 'Aktuální čas', '', false),
('system_nazev', 'Název systému', 'Online Hlasování SVJ', true),
('system_verze', 'Verze systému', '1.0', false),
('podpora_email', 'Email podpory', 'podpora@example.com', true),
('podpora_telefon', 'Telefon podpory', '+420 123 456 789', true)
ON CONFLICT (name) DO NOTHING;

-- Vložení základních definic proměnných budov
INSERT INTO building_variable_definitions (name, description, type, required, placeholder) VALUES
('nazev_budovy', 'Název budovy/SVJ', 'text', true, 'Např. Bytový dům Na Kopci 123'),
('zkraceny_nazev', 'Zkrácený název', 'text', true, 'Např. BD Na Kopci'),
('plny_nazev', 'Plný oficiální název', 'text', true, 'Např. Společenství vlastníků jednotek Bytový dům Na Kopci 123'),
('adresa', 'Adresa budovy', 'text', true, 'Včetně PSČ a města'),
('osloveni', 'Oslovení ve zprávách', 'text', true, 'Např. Vážení vlastníci'),
('ico', 'IČO', 'text', false, '12345678'),
('kontaktni_osoba', 'Kontaktní osoba', 'text', false, 'Jméno a příjmení'),
('predseda', 'Předseda SVJ', 'text', false, 'Jméno a příjmení'),
('telefon_predsedy', 'Telefon předsedy', 'text', false, '+420 xxx xxx xxx'),
('email_predsedy', 'Email předsedy', 'text', false, 'predseda@example.com'),
('banka', 'Název banky', 'text', false, 'Např. Česká spořitelna'),
('cislo_uctu', 'Číslo účtu', 'text', false, 'XXXXXXXXX/XXXX'),
('web', 'Webové stránky', 'text', false, 'www.example.com')
ON CONFLICT (name) DO NOTHING;

-- Vytvoření bucket pro přílohy (musí být spuštěno v Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('attachments', 'attachments', true);

-- Políticas pro storage (musí být spuštěno v Supabase dashboard)
-- CREATE POLICY "Allow public upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'attachments');
-- CREATE POLICY "Allow public read" ON storage.objects FOR SELECT USING (bucket_id = 'attachments');
-- CREATE POLICY "Allow public delete" ON storage.objects FOR DELETE USING (bucket_id = 'attachments');
