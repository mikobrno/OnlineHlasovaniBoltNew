-- VYČIŠTĚNÍ A NOVÝ START
-- Smažeme všechny existující tabulky a vytvoříme je znovu

-- Smazat všechny tabulky (pokud existují)
DROP TABLE IF EXISTS manual_vote_notes CASCADE;
DROP TABLE IF EXISTS manual_vote_attachments CASCADE;
DROP TABLE IF EXISTS voting_tokens CASCADE;
DROP TABLE IF EXISTS observers CASCADE;
DROP TABLE IF EXISTS building_variable_definitions CASCADE;
DROP TABLE IF EXISTS global_variables CASCADE;
DROP TABLE IF EXISTS email_templates CASCADE;
DROP TABLE IF EXISTS member_votes CASCADE;
DROP TABLE IF EXISTS votes_questions CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS buildings CASCADE;

-- Vytvořit funkci pro updated_at triggery
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Hlavní tabulky
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

CREATE TABLE global_variables (
    name TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    value TEXT NOT NULL,
    is_editable BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vypnout RLS (Row Level Security)
ALTER TABLE buildings DISABLE ROW LEVEL SECURITY;
ALTER TABLE members DISABLE ROW LEVEL SECURITY;
ALTER TABLE votes DISABLE ROW LEVEL SECURITY;
ALTER TABLE global_variables DISABLE ROW LEVEL SECURITY;

-- Vložit testovací data
INSERT INTO buildings (id, name, address, total_units) VALUES
('11111111-1111-1111-1111-111111111111', 'Testovací budova', 'Praha 1', 10);

INSERT INTO global_variables (name, description, value) VALUES
('nazev_spolecnosti', 'Název společnosti', 'OnlineSprava s.r.o.'),
('kontaktni_email', 'Kontakt', 'podpora@onlinesprava.cz');

-- Ověření úspěchu
SELECT 'SUCCESS: Databáze je připravena!' as status;
SELECT 'buildings' as table_name, COUNT(*) as rows FROM buildings
UNION ALL  
SELECT 'global_variables' as table_name, COUNT(*) as rows FROM global_variables;
