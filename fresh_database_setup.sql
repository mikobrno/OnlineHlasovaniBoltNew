-- ČISTÁ INSTALACE DATABÁZE
-- Spusťte po vyčištění databáze pomocí clean_database.sql

-- Vytvořit funkci pro updated_at triggery
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Vytvořit tabulky v správném pořadí
CREATE TABLE buildings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    total_units INTEGER NOT NULL DEFAULT 0,
    variables JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE members (
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

CREATE TABLE votes (
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

CREATE TABLE questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vote_id UUID NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    quorum_type TEXT NOT NULL CHECK (quorum_type IN ('simple', 'qualified', 'unanimous', 'custom')),
    custom_quorum_numerator INTEGER,
    custom_quorum_denominator INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE votes_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vote_id UUID NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(vote_id, question_id)
);

CREATE TABLE member_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vote_id UUID NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    answer TEXT NOT NULL CHECK (answer IN ('yes', 'no', 'abstain')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(vote_id, member_id, question_id)
);

CREATE TABLE email_templates (
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

CREATE TABLE global_variables (
    name TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    value TEXT NOT NULL,
    is_editable BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE building_variable_definitions (
    name TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('text', 'textarea', 'select')),
    options TEXT[],
    required BOOLEAN NOT NULL DEFAULT false,
    placeholder TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE observers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE voting_tokens (
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

CREATE TABLE manual_vote_attachments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vote_id UUID NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    attachment_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE manual_vote_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vote_id UUID NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(vote_id, member_id)
);

-- Vytvořit indexy
CREATE INDEX idx_members_building_id ON members(building_id);
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_votes_building_id ON votes(building_id);
CREATE INDEX idx_votes_status ON votes(status);
CREATE INDEX idx_questions_vote_id ON questions(vote_id);
CREATE INDEX idx_votes_questions_vote_id ON votes_questions(vote_id);
CREATE INDEX idx_votes_questions_question_id ON votes_questions(question_id);
CREATE INDEX idx_member_votes_vote_id ON member_votes(vote_id);
CREATE INDEX idx_member_votes_member_id ON member_votes(member_id);
CREATE INDEX idx_email_templates_building_id ON email_templates(building_id);
CREATE INDEX idx_email_templates_is_global ON email_templates(is_global);
CREATE INDEX idx_observers_building_id ON observers(building_id);
CREATE INDEX idx_voting_tokens_vote_id ON voting_tokens(vote_id);
CREATE INDEX idx_voting_tokens_token ON voting_tokens(token);

-- Vytvořit triggery pro updated_at
CREATE TRIGGER update_buildings_updated_at BEFORE UPDATE ON buildings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_votes_updated_at BEFORE UPDATE ON votes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_votes_questions_updated_at BEFORE UPDATE ON votes_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_global_variables_updated_at BEFORE UPDATE ON global_variables FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_building_variable_definitions_updated_at BEFORE UPDATE ON building_variable_definitions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- VYPNOUT RLS na všech tabulkách (aby nám to fungovalo)
ALTER TABLE buildings DISABLE ROW LEVEL SECURITY;
ALTER TABLE members DISABLE ROW LEVEL SECURITY;
ALTER TABLE votes DISABLE ROW LEVEL SECURITY;
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE votes_questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE member_votes DISABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE global_variables DISABLE ROW LEVEL SECURITY;
ALTER TABLE building_variable_definitions DISABLE ROW LEVEL SECURITY;
ALTER TABLE observers DISABLE ROW LEVEL SECURITY;
ALTER TABLE voting_tokens DISABLE ROW LEVEL SECURITY;
ALTER TABLE manual_vote_attachments DISABLE ROW LEVEL SECURITY;
ALTER TABLE manual_vote_notes DISABLE ROW LEVEL SECURITY;

-- Vložit základní data
INSERT INTO global_variables (name, description, value, is_editable) VALUES
('nazev_spolecnosti', 'Název správcovské společnosti', 'OnlineSprava s.r.o.', true),
('kontaktni_email', 'Kontaktní e-mail společnosti', 'podpora@onlinesprava.cz', true),
('telefon_spolecnosti', 'Telefon společnosti', '+420 800 123 456', true);

INSERT INTO building_variable_definitions (name, description, type, required, placeholder) VALUES
('nazev_budovy', 'Název budovy/SVJ', 'text', true, 'např. Bytový dům Vinohradská 125'),
('adresa', 'Adresa budovy', 'text', true, 'např. Vinohradská 125, Praha 2');

INSERT INTO buildings (id, name, address, total_units, variables) VALUES
('11111111-1111-1111-1111-111111111111', 'Testovací budova', 'Praha 1', 10, '{}');

-- Zkontrolovat výsledek
SELECT 'buildings' as table_name, COUNT(*) as rows FROM buildings
UNION ALL
SELECT 'global_variables' as table_name, COUNT(*) as rows FROM global_variables
UNION ALL
SELECT 'building_variable_definitions' as table_name, COUNT(*) as rows FROM building_variable_definitions;
