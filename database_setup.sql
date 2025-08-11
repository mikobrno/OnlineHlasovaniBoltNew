-- Supabase Database Setup Script
-- Spusťte tento skript v Supabase SQL editoru

-- Enable RLS (Row Level Security)
ALTER TABLE IF EXISTS buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS members ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS member_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS global_variables ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS building_variable_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS observers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS voting_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS manual_vote_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS manual_vote_notes ENABLE ROW LEVEL SECURITY;

-- Create tables
CREATE TABLE IF NOT EXISTS buildings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    total_units INTEGER NOT NULL DEFAULT 0,
    variables JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    unit TEXT NOT NULL,
    vote_weight DECIMAL NOT NULL DEFAULT 1.0,
    representative_id UUID REFERENCES members(id),
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    attachments TEXT[],
    observers TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vote_id UUID NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    quorum_type TEXT NOT NULL CHECK (quorum_type IN ('simple', 'qualified', 'unanimous', 'custom')),
    custom_quorum_numerator INTEGER,
    custom_quorum_denominator INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS member_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vote_id UUID NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    answer TEXT NOT NULL CHECK (answer IN ('yes', 'no', 'abstain')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(vote_id, member_id, question_id)
);

CREATE TABLE IF NOT EXISTS email_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
    is_global BOOLEAN NOT NULL DEFAULT false,
    custom_variables JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS global_variables (
    name TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    value TEXT NOT NULL,
    is_editable BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS building_variable_definitions (
    name TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('text', 'textarea', 'select')),
    options TEXT[],
    required BOOLEAN NOT NULL DEFAULT false,
    placeholder TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS observers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS voting_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vote_id UUID NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    verification_code TEXT NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    is_used BOOLEAN NOT NULL DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(vote_id, member_id)
);

CREATE TABLE IF NOT EXISTS manual_vote_attachments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vote_id UUID NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    attachment_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS manual_vote_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vote_id UUID NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(vote_id, member_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_members_building_id ON members(building_id);
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_votes_building_id ON votes(building_id);
CREATE INDEX IF NOT EXISTS idx_votes_status ON votes(status);
CREATE INDEX IF NOT EXISTS idx_questions_vote_id ON questions(vote_id);
CREATE INDEX IF NOT EXISTS idx_member_votes_vote_id ON member_votes(vote_id);
CREATE INDEX IF NOT EXISTS idx_member_votes_member_id ON member_votes(member_id);
CREATE INDEX IF NOT EXISTS idx_email_templates_building_id ON email_templates(building_id);
CREATE INDEX IF NOT EXISTS idx_email_templates_is_global ON email_templates(is_global);
CREATE INDEX IF NOT EXISTS idx_observers_building_id ON observers(building_id);
CREATE INDEX IF NOT EXISTS idx_voting_tokens_vote_id ON voting_tokens(vote_id);
CREATE INDEX IF NOT EXISTS idx_voting_tokens_token ON voting_tokens(token);

-- Insert default global variables
INSERT INTO global_variables (name, description, value, is_editable) VALUES
('nazev_spolecnosti', 'Název správcovské společnosti', 'OnlineSprava s.r.o.', true),
('kontaktni_email', 'Kontaktní e-mail společnosti', 'podpora@onlinesprava.cz', true),
('telefon_spolecnosti', 'Telefon společnosti', '+420 800 123 456', true),
('adresa_spolecnosti', 'Adresa sídla společnosti', 'Wenceslas Square 1, 110 00 Praha 1', true),
('web_spolecnosti', 'Webové stránky společnosti', 'www.onlinesprava.cz', true),
('podpis_spravce', 'Standardní podpis správce', 'S pozdravem,\nTým OnlineSprava\n{{nazev_spolecnosti}}', true),
('pravni_upozorneni', 'Právní upozornění v patičce', 'Tento e-mail je určen pouze pro adresáta. Pokud nejste zamýšleným příjemcem, informujte prosím odesílatele a e-mail smažte.', true),
('datum_dnes', 'Dnešní datum (automaticky generováno)', '', false),
('cas_ted', 'Aktuální čas (automaticky generováno)', '', false)
ON CONFLICT (name) DO NOTHING;

-- Insert default building variable definitions
INSERT INTO building_variable_definitions (name, description, type, options, required, placeholder) VALUES
('nazev_budovy', 'Název budovy/SVJ', 'text', NULL, true, 'např. Bytový dům Vinohradská 125'),
('zkraceny_nazev', 'Zkrácený název budovy', 'text', NULL, false, 'např. BD Vinohradská'),
('plny_nazev', 'Plný oficiální název SVJ/BD', 'text', NULL, false, 'např. Společenství vlastníků jednotek...'),
('adresa', 'Adresa budovy', 'text', NULL, true, 'např. Vinohradská 125, Praha 2'),
('osloveni', 'Způsob oslovení členů', 'select', ARRAY['Vážení vlastníci', 'Vážení družstevníci', 'Vážení členové', 'Vážené dámy a pánové'], false, NULL),
('ico', 'IČO', 'text', NULL, false, 'např. 12345678'),
('kontaktni_osoba', 'Kontaktní osoba pro budovu', 'text', NULL, false, NULL),
('predseda', 'Jméno předsedy', 'text', NULL, false, NULL),
('telefon_predsedy', 'Telefon předsedy', 'text', NULL, false, '+420 123 456 789'),
('email_predsedy', 'Email předsedy', 'text', NULL, false, 'predseda@example.cz'),
('banka', 'Název banky', 'text', NULL, false, 'např. Česká spořitelna'),
('cislo_uctu', 'Číslo účtu', 'text', NULL, false, 'např. 123456789/0800'),
('web', 'Webové stránky budovy', 'text', NULL, false, 'např. www.vase-budova.cz')
ON CONFLICT (name) DO NOTHING;

-- Insert sample buildings (můžete smazat po testování)
INSERT INTO buildings (id, name, address, total_units, variables) VALUES
('11111111-1111-1111-1111-111111111111', 'Bytový dům Vinohradská 125', 'Vinohradská 125, Praha 2', 24, '{
    "nazev_budovy": "Bytový dům Vinohradská 125",
    "zkraceny_nazev": "BD Vinohradská",
    "plny_nazev": "Společenství vlastníků jednotek Bytový dům Vinohradská 125",
    "adresa": "Vinohradská 125, Praha 2",
    "osloveni": "Vážení vlastníci",
    "ico": "12345678",
    "kontaktni_osoba": "Jan Novák",
    "predseda": "Jan Novák",
    "telefon_predsedy": "+420 123 456 789",
    "email_predsedy": "predseda@vinohradska125.cz",
    "banka": "Česká spořitelna",
    "cislo_uctu": "123456789/0800",
    "web": "www.vinohradska125.cz"
}'),
('22222222-2222-2222-2222-222222222222', 'SVJ Karlínské náměstí', 'Karlínské náměstí 12, Praha 8', 18, '{
    "nazev_budovy": "SVJ Karlínské náměstí",
    "zkraceny_nazev": "SVJ Karlín",
    "plny_nazev": "Společenství vlastníků jednotek Karlínské náměstí",
    "adresa": "Karlínské náměstí 12, Praha 8",
    "osloveni": "Vážení vlastníci",
    "ico": "87654321",
    "kontaktni_osoba": "Marie Svobodová",
    "predseda": "Marie Svobodová",
    "telefon_predsedy": "+420 987 654 321",
    "email_predsedy": "predseda@karlin.cz",
    "banka": "ČSOB",
    "cislo_uctu": "987654321/0300",
    "web": "www.svj-karlin.cz"
}')
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies (Row Level Security)
-- Pro veřejný přístup zatím povolíme vše (později můžete omezit podle potřeby)

-- Buildings policies
CREATE POLICY "Enable all access for buildings" ON buildings FOR ALL USING (true);

-- Members policies
CREATE POLICY "Enable all access for members" ON members FOR ALL USING (true);

-- Votes policies
CREATE POLICY "Enable all access for votes" ON votes FOR ALL USING (true);

-- Questions policies
CREATE POLICY "Enable all access for questions" ON questions FOR ALL USING (true);

-- Member votes policies
CREATE POLICY "Enable all access for member_votes" ON member_votes FOR ALL USING (true);

-- Email templates policies
CREATE POLICY "Enable all access for email_templates" ON email_templates FOR ALL USING (true);

-- Global variables policies
CREATE POLICY "Enable all access for global_variables" ON global_variables FOR ALL USING (true);

-- Building variable definitions policies
CREATE POLICY "Enable all access for building_variable_definitions" ON building_variable_definitions FOR ALL USING (true);

-- Observers policies
CREATE POLICY "Enable all access for observers" ON observers FOR ALL USING (true);

-- Voting tokens policies
CREATE POLICY "Enable all access for voting_tokens" ON voting_tokens FOR ALL USING (true);

-- Manual vote attachments policies
CREATE POLICY "Enable all access for manual_vote_attachments" ON manual_vote_attachments FOR ALL USING (true);

-- Manual vote notes policies
CREATE POLICY "Enable all access for manual_vote_notes" ON manual_vote_notes FOR ALL USING (true);

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_buildings_updated_at BEFORE UPDATE ON buildings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_votes_updated_at BEFORE UPDATE ON votes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_global_variables_updated_at BEFORE UPDATE ON global_variables FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_building_variable_definitions_updated_at BEFORE UPDATE ON building_variable_definitions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
