-- MINIMÁLNÍ DATABÁZE PRO TESTOVÁNÍ
-- Vytvoří jen základní tabulky

-- Vytvoření funkcí
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

-- Vypnout RLS
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

-- Ověření
SELECT 'buildings' as table_name, COUNT(*) as rows FROM buildings
UNION ALL  
SELECT 'global_variables' as table_name, COUNT(*) as rows FROM global_variables;
