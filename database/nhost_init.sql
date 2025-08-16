-- Inicializační skript pro Nhost/Hasura databázi

-- Povolení potřebných rozšíření
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS uuid-ossp;

-- Vytvoření tabulek

-- Budovy
CREATE TABLE IF NOT EXISTS public.buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT,
    total_units INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Členové
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    unit TEXT NOT NULL,
    vote_weight DECIMAL(10,4) DEFAULT 1.0000,
    building_id UUID NOT NULL REFERENCES public.buildings(id) ON DELETE CASCADE,
    representative_id UUID REFERENCES public.members(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hlasování
CREATE TABLE IF NOT EXISTS public.votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    building_id UUID NOT NULL REFERENCES public.buildings(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'cancelled', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    observers TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_by UUID REFERENCES auth.users(id)
);

-- Otázky hlasování
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vote_id UUID NOT NULL REFERENCES public.votes(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    quorum_type TEXT DEFAULT 'simple' CHECK (quorum_type IN ('simple', 'qualified', 'unanimous', 'custom')),
    custom_quorum_numerator INTEGER,
    custom_quorum_denominator INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hlasy členů
CREATE TABLE IF NOT EXISTS public.member_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    vote_id UUID NOT NULL REFERENCES public.votes(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    answer TEXT CHECK (answer IN ('yes', 'no', 'abstain')),
    is_delegated BOOLEAN DEFAULT false,
    voting_power_used DECIMAL(10,4) DEFAULT 1.0000,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(member_id, question_id)
);

-- Přílohy k hlasování
CREATE TABLE IF NOT EXISTS public.manual_vote_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vote_id UUID NOT NULL REFERENCES public.votes(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES public.members(id),
    attachment_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Delegace hlasování
CREATE TABLE IF NOT EXISTS public.vote_delegations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vote_id UUID NOT NULL REFERENCES public.votes(id) ON DELETE CASCADE,
    delegator_id UUID NOT NULL REFERENCES public.members(id),
    delegate_id UUID NOT NULL REFERENCES public.members(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(vote_id, delegator_id)
);

-- Indexy pro optimalizaci
CREATE INDEX IF NOT EXISTS idx_members_building ON public.members(building_id);
CREATE INDEX IF NOT EXISTS idx_votes_building ON public.votes(building_id);
CREATE INDEX IF NOT EXISTS idx_questions_vote ON public.questions(vote_id);
CREATE INDEX IF NOT EXISTS idx_member_votes_composite ON public.member_votes(vote_id, member_id);
CREATE INDEX IF NOT EXISTS idx_attachments_vote ON public.manual_vote_attachments(vote_id);
CREATE INDEX IF NOT EXISTS idx_delegations_vote ON public.vote_delegations(vote_id);

-- Funkce pro automatickou aktualizaci updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggery pro aktualizaci updated_at
CREATE TRIGGER set_buildings_updated_at
    BEFORE UPDATE ON public.buildings
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_members_updated_at
    BEFORE UPDATE ON public.members
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- Row Level Security (RLS)

-- Povolení RLS
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manual_vote_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vote_delegations ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Buildings
CREATE POLICY "Enable read access for authenticated users" ON public.buildings
    FOR SELECT
    USING (auth.role() = 'user');

-- Members
CREATE POLICY "Enable read access for authenticated users" ON public.members
    FOR SELECT
    USING (auth.role() = 'user');

-- Votes
CREATE POLICY "Enable read access for authenticated users" ON public.votes
    FOR SELECT
    USING (auth.role() = 'user');

CREATE POLICY "Enable insert for authenticated users" ON public.votes
    FOR INSERT
    WITH CHECK (auth.role() = 'user');

CREATE POLICY "Enable update for vote creators" ON public.votes
    FOR UPDATE
    USING (auth.uid() = created_by);

-- Questions
CREATE POLICY "Enable read access for authenticated users" ON public.questions
    FOR SELECT
    USING (auth.role() = 'user');

-- Member Votes
CREATE POLICY "Enable read access for authenticated users" ON public.member_votes
    FOR SELECT
    USING (auth.role() = 'user');

CREATE POLICY "Enable vote insert/update for authenticated users" ON public.member_votes
    FOR ALL
    USING (auth.role() = 'user')
    WITH CHECK (auth.role() = 'user');

-- Attachments
CREATE POLICY "Enable read access for authenticated users" ON public.manual_vote_attachments
    FOR SELECT
    USING (auth.role() = 'user');

-- Delegations
CREATE POLICY "Enable read access for authenticated users" ON public.vote_delegations
    FOR SELECT
    USING (auth.role() = 'user');

-- Testovací data
INSERT INTO public.buildings (name, address, total_units) VALUES
    ('Zborovská 939', 'Zborovská 939/3, 614 00 Brno', 24);

-- Testovací uživatel (heslo: admin123456)
INSERT INTO auth.users (email, password_hash, email_verified, default_role)
VALUES (
    'admin@onlinesprava.cz',
    crypt('admin123456', gen_salt('bf')),
    true,
    'user'
);
