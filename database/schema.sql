-- SQL schema pro Supabase databázi - KOMPLETNÍ FUNKCIONALITA
-- Tento soubor obsahuje všechny potřebné tabulky a konfigurace pro plnou funkcionalnost aplikace

-- Zapnutí RLS (Row Level Security)
ALTER DATABASE postgres SET row_security = on;

-- ========================================
-- ZÁKLADNÍ TABULKY
-- ========================================

-- Vytvoření tabulky buildings s rozšířenými funkcemi
CREATE TABLE IF NOT EXISTS buildings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  total_units INTEGER NOT NULL DEFAULT 0,
  variables JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  statistics JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vytvoření tabulky members s kompletní funkcionalitou
CREATE TABLE IF NOT EXISTS members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  unit TEXT NOT NULL,
  vote_weight DECIMAL(10,4) NOT NULL DEFAULT 1.0000,
  representative_id UUID REFERENCES members(id),
  building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin', 'observer', 'chairman')),
  is_active BOOLEAN DEFAULT true,
  voting_power DECIMAL(10,4) DEFAULT 1.0000,
  can_delegate BOOLEAN DEFAULT true,
  can_receive_delegation BOOLEAN DEFAULT true,
  notification_preferences JSONB DEFAULT '{"email": true, "sms": false}',
  last_activity TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email, building_id),
  UNIQUE(unit, building_id)
);

-- Vytvoření tabulky votes s rozšířenou funkcionalitou
CREATE TABLE IF NOT EXISTS votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'cancelled', 'archived')),
  voting_type TEXT DEFAULT 'standard' CHECK (voting_type IN ('standard', 'secret', 'weighted', 'ranked')),
  requires_quorum BOOLEAN DEFAULT true,
  quorum_percentage DECIMAL(5,2) DEFAULT 50.00,
  allow_delegation BOOLEAN DEFAULT true,
  allow_proxy_voting BOOLEAN DEFAULT false,
  anonymous_voting BOOLEAN DEFAULT false,
  multiple_questions BOOLEAN DEFAULT true,
  auto_close BOOLEAN DEFAULT false,
  send_reminders BOOLEAN DEFAULT true,
  reminder_intervals INTEGER[] DEFAULT '{24, 6}', -- hours before end
  results JSONB DEFAULT '{}',
  member_votes JSONB DEFAULT '{}',
  member_representatives JSONB DEFAULT '{}',
  manual_vote_attachments JSONB DEFAULT '{}',
  manual_vote_notes JSONB DEFAULT '{}',
  observers TEXT[],
  attachments TEXT[],
  vote_statistics JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ
);

-- Vytvoření tabulky questions s rozšířenou funkcionalitou
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vote_id UUID NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  question_type TEXT DEFAULT 'yes_no' CHECK (question_type IN ('yes_no', 'multiple_choice', 'ranking', 'text', 'numeric')),
  quorum_type TEXT NOT NULL DEFAULT 'simple' CHECK (quorum_type IN ('simple', 'qualified', 'unanimous', 'custom')),
  custom_quorum_numerator INTEGER,
  custom_quorum_denominator INTEGER,
  options JSONB DEFAULT '[]',
  allow_multiple BOOLEAN DEFAULT false,
  required BOOLEAN DEFAULT true,
  min_value DECIMAL(10,4),
  max_value DECIMAL(10,4),
  order_index INTEGER DEFAULT 0,
  results JSONB DEFAULT '{}',
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

-- ========================================
-- POKROČILÉ TABULKY PRO DELEGOVÁNÍ A NOTIFIKACE
-- ========================================

-- Tabulka pro delegování hlasů
CREATE TABLE IF NOT EXISTS vote_delegations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vote_id UUID NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
  delegator_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  delegate_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  delegation_type TEXT DEFAULT 'full' CHECK (delegation_type IN ('full', 'partial', 'question_specific')),
  specific_questions UUID[],
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  UNIQUE(vote_id, delegator_id)
);

-- Tabulka pro notifikace a komunikaci
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  vote_id UUID REFERENCES votes(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('vote_created', 'vote_reminder', 'vote_ending', 'vote_completed', 'delegation_received', 'delegation_revoked', 'manual_vote_added', 'general')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  channels TEXT[] DEFAULT '{"email"}' CHECK (channels <@ '{"email", "sms", "push"}'),
  is_read BOOLEAN DEFAULT false,
  is_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabulka pro SMS ověřování a bezpečnost
CREATE TABLE IF NOT EXISTS sms_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  vote_id UUID NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  verification_code TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  is_used BOOLEAN DEFAULT false,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  used_at TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(vote_id, member_id)
);

-- Tabulka pro audit log a bezpečnost
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'vote_cast', 'delegation_created', 'delegation_revoked', 'login', 'sms_sent', 'verification_attempt')),
  actor_type TEXT DEFAULT 'member' CHECK (actor_type IN ('member', 'admin', 'system')),
  actor_id UUID,
  actor_name TEXT,
  old_data JSONB,
  new_data JSONB,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabulka pro reporting a analytics
CREATE TABLE IF NOT EXISTS vote_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vote_id UUID NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
  building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  total_eligible_voters INTEGER NOT NULL,
  total_votes_cast INTEGER DEFAULT 0,
  total_delegations INTEGER DEFAULT 0,
  total_voting_power DECIMAL(15,4) DEFAULT 0,
  participation_rate DECIMAL(5,2) DEFAULT 0,
  completion_rate DECIMAL(5,2) DEFAULT 0,
  question_results JSONB DEFAULT '{}',
  demographic_breakdown JSONB DEFAULT '{}',
  timeline_data JSONB DEFAULT '{}',
  reminders_sent INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabulka pro exporty a reporty
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vote_id UUID NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
  building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('vote_results', 'participation', 'minutes', 'detailed_analysis', 'legal_document')),
  format TEXT NOT NULL CHECK (format IN ('pdf', 'excel', 'csv', 'json')),
  file_path TEXT,
  file_size INTEGER,
  generated_by UUID REFERENCES members(id),
  is_official BOOLEAN DEFAULT false,
  contains_personal_data BOOLEAN DEFAULT true,
  access_level TEXT DEFAULT 'admin' CHECK (access_level IN ('public', 'members', 'admin', 'chairman')),
  expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- ROZŠÍŘENÉ TABULKY PRO KOMPLEXNÍ HLASOVÁNÍ
-- ========================================

-- Tabulka pro proxy hlasování (hlasování za jiného)
CREATE TABLE IF NOT EXISTS proxy_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vote_id UUID NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
  proxy_holder_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  represented_member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  authorization_document TEXT,
  authorization_expires TIMESTAMPTZ,
  is_valid BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(vote_id, represented_member_id)
);

-- Tabulka pro attachment management
CREATE TABLE IF NOT EXISTS attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('vote', 'question', 'member_vote', 'building', 'member')),
  entity_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by UUID REFERENCES members(id),
  is_public BOOLEAN DEFAULT false,
  description TEXT,
  metadata JSONB DEFAULT '{}',
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

-- Rozšířená tabulka voting_tokens pro pokročilou bezpečnost
CREATE TABLE IF NOT EXISTS voting_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vote_id UUID NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  verification_code TEXT NOT NULL,
  token_type TEXT DEFAULT 'sms' CHECK (token_type IN ('sms', 'email', 'app', 'manual')),
  is_verified BOOLEAN DEFAULT false,
  is_used BOOLEAN DEFAULT false,
  verification_attempts INTEGER DEFAULT 0,
  max_verification_attempts INTEGER DEFAULT 3,
  usage_attempts INTEGER DEFAULT 0,
  max_usage_attempts INTEGER DEFAULT 1,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  used_at TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  UNIQUE(vote_id, member_id)
);

-- Rozšířená tabulka member_votes pro pokročilé hlasování
CREATE TABLE IF NOT EXISTS member_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vote_id UUID NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer TEXT CHECK (answer IN ('yes', 'no', 'abstain')), -- Pro zpětnou kompatibilitu
  answer_data JSONB DEFAULT '{}', -- Pro pokročilé odpovědi
  voting_power_used DECIMAL(10,4) DEFAULT 1.0000,
  is_delegated BOOLEAN DEFAULT false,
  delegated_by UUID REFERENCES members(id),
  is_proxy BOOLEAN DEFAULT false,
  proxy_for UUID REFERENCES members(id),
  confidence_level INTEGER CHECK (confidence_level BETWEEN 1 AND 5),
  comment TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(vote_id, member_id, question_id)
);

-- Tabulka pro pokročilé odpovědi na otázky
CREATE TABLE IF NOT EXISTS question_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_vote_id UUID NOT NULL REFERENCES member_votes(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  response_type TEXT NOT NULL CHECK (response_type IN ('yes_no', 'multiple_choice', 'ranking', 'text', 'numeric')),
  response_data JSONB NOT NULL,
  confidence_level INTEGER CHECK (confidence_level BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
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

-- Pojistky: doplnění sloupců, které mohou chybět ve starších instancích (idempotentně)
ALTER TABLE IF EXISTS members ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE IF EXISTS members ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin', 'observer', 'chairman'));
ALTER TABLE IF EXISTS vote_delegations ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE IF EXISTS attachments ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS questions ADD COLUMN IF NOT EXISTS question_type TEXT DEFAULT 'yes_no';
ALTER TABLE IF EXISTS questions ADD COLUMN IF NOT EXISTS quorum_type TEXT DEFAULT 'simple';
ALTER TABLE IF EXISTS member_votes ADD COLUMN IF NOT EXISTS is_delegated BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS member_votes ADD COLUMN IF NOT EXISTS voting_power_used DECIMAL(10,4) DEFAULT 1.0000;

-- Pojistka: sjednocení CHECK constraintu pro building_variable_definitions.type (některé starší DB nemusí povolovat 'number')
ALTER TABLE IF EXISTS building_variable_definitions DROP CONSTRAINT IF EXISTS building_variable_definitions_type_check;
ALTER TABLE IF EXISTS building_variable_definitions
  ADD CONSTRAINT building_variable_definitions_type_check
  CHECK (type IN ('text', 'select', 'number'));

-- Vytvoření indexů pro lepší výkon
CREATE INDEX IF NOT EXISTS idx_members_building_id ON members(building_id);
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_active ON members(is_active);
CREATE INDEX IF NOT EXISTS idx_members_role ON members(role);
CREATE INDEX IF NOT EXISTS idx_votes_building_id ON votes(building_id);
CREATE INDEX IF NOT EXISTS idx_votes_status ON votes(status);
CREATE INDEX IF NOT EXISTS idx_votes_active ON votes(status, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_questions_vote_id ON questions(vote_id);
CREATE INDEX IF NOT EXISTS idx_questions_type ON questions(question_type);
CREATE INDEX IF NOT EXISTS idx_voting_tokens_token ON voting_tokens(token);
CREATE INDEX IF NOT EXISTS idx_voting_tokens_vote_member ON voting_tokens(vote_id, member_id);
CREATE INDEX IF NOT EXISTS idx_voting_tokens_active ON voting_tokens(is_verified, is_used, expires_at);
CREATE INDEX IF NOT EXISTS idx_member_votes_vote_member ON member_votes(vote_id, member_id);
CREATE INDEX IF NOT EXISTS idx_member_votes_question ON member_votes(question_id);
CREATE INDEX IF NOT EXISTS idx_member_votes_delegated ON member_votes(is_delegated);
CREATE INDEX IF NOT EXISTS idx_observers_building_id ON observers(building_id);
CREATE INDEX IF NOT EXISTS idx_vote_delegations_vote ON vote_delegations(vote_id);
CREATE INDEX IF NOT EXISTS idx_vote_delegations_delegator ON vote_delegations(delegator_id);
CREATE INDEX IF NOT EXISTS idx_vote_delegations_delegate ON vote_delegations(delegate_id);
CREATE INDEX IF NOT EXISTS idx_vote_delegations_active ON vote_delegations(vote_id, is_active);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(recipient_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_vote ON notifications(vote_id);
CREATE INDEX IF NOT EXISTS idx_sms_verifications_member_vote ON sms_verifications(member_id, vote_id);
CREATE INDEX IF NOT EXISTS idx_sms_verifications_token ON sms_verifications(token_hash);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor ON audit_log(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_time ON audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_vote_analytics_vote ON vote_analytics(vote_id);
CREATE INDEX IF NOT EXISTS idx_vote_analytics_building ON vote_analytics(building_id);
CREATE INDEX IF NOT EXISTS idx_reports_vote ON reports(vote_id);
CREATE INDEX IF NOT EXISTS idx_reports_building ON reports(building_id);
CREATE INDEX IF NOT EXISTS idx_question_responses_member_vote ON question_responses(member_vote_id);
CREATE INDEX IF NOT EXISTS idx_proxy_votes_vote ON proxy_votes(vote_id);
CREATE INDEX IF NOT EXISTS idx_proxy_votes_holder ON proxy_votes(proxy_holder_id);
CREATE INDEX IF NOT EXISTS idx_proxy_votes_represented ON proxy_votes(represented_member_id);
CREATE INDEX IF NOT EXISTS idx_attachments_entity ON attachments(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_attachments_public ON attachments(is_public);

-- Vytvoření trigger funkcí pro automatické aktualizace
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Funkce pro automatické přepočítání statistik hlasování
CREATE OR REPLACE FUNCTION update_vote_statistics()
RETURNS TRIGGER AS $$
DECLARE
    vote_record_id UUID;
BEGIN
    -- Získání vote_id z NEW nebo OLD záznamu
    vote_record_id := COALESCE(NEW.vote_id, OLD.vote_id);
    
    -- Aktualizace základních statistik hlasování
    UPDATE votes SET 
        vote_statistics = jsonb_build_object(
            'total_votes', (SELECT COUNT(*) FROM member_votes WHERE vote_id = vote_record_id),
            'total_voting_power', (SELECT COALESCE(SUM(voting_power_used), 0) FROM member_votes WHERE vote_id = vote_record_id),
            'last_vote_cast', NOW()
        )
    WHERE id = vote_record_id;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Funkce pro audit log
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log (
        entity_type, 
        entity_id, 
        action, 
        actor_type, 
        old_data, 
        new_data,
        changes
    ) VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        CASE TG_OP 
            WHEN 'INSERT' THEN 'create'
            WHEN 'UPDATE' THEN 'update'
            WHEN 'DELETE' THEN 'delete'
        END,
        'system',
        CASE TG_OP WHEN 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
        CASE TG_OP WHEN 'INSERT' THEN row_to_json(NEW) ELSE row_to_json(NEW) END,
        CASE TG_OP WHEN 'UPDATE' THEN 
            jsonb_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW))
        ELSE NULL END
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Vytvoření triggerů pro updated_at (idempotentně)
DROP TRIGGER IF EXISTS update_buildings_updated_at ON buildings;
CREATE TRIGGER update_buildings_updated_at BEFORE UPDATE ON buildings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_members_updated_at ON members;
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_email_templates_updated_at ON email_templates;
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_global_variables_updated_at ON global_variables;
CREATE TRIGGER update_global_variables_updated_at BEFORE UPDATE ON global_variables FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggery pro audit log (na vybraných tabulkách) – idempotentně
DROP TRIGGER IF EXISTS audit_buildings ON buildings;
CREATE TRIGGER audit_buildings AFTER INSERT OR UPDATE OR DELETE ON buildings FOR EACH ROW EXECUTE FUNCTION create_audit_log();
DROP TRIGGER IF EXISTS audit_members ON members;
CREATE TRIGGER audit_members AFTER INSERT OR UPDATE OR DELETE ON members FOR EACH ROW EXECUTE FUNCTION create_audit_log();
DROP TRIGGER IF EXISTS audit_votes ON votes;
CREATE TRIGGER audit_votes AFTER INSERT OR UPDATE OR DELETE ON votes FOR EACH ROW EXECUTE FUNCTION create_audit_log();
DROP TRIGGER IF EXISTS audit_member_votes ON member_votes;
CREATE TRIGGER audit_member_votes AFTER INSERT OR UPDATE OR DELETE ON member_votes FOR EACH ROW EXECUTE FUNCTION create_audit_log();
DROP TRIGGER IF EXISTS audit_vote_delegations ON vote_delegations;
CREATE TRIGGER audit_vote_delegations AFTER INSERT OR UPDATE OR DELETE ON vote_delegations FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- Trigger pro aktualizaci statistik hlasování – idempotentně
DROP TRIGGER IF EXISTS update_vote_stats ON member_votes;
CREATE TRIGGER update_vote_stats AFTER INSERT OR UPDATE OR DELETE ON member_votes FOR EACH ROW EXECUTE FUNCTION update_vote_statistics();

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
ALTER TABLE vote_delegations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE vote_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE proxy_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

-- Základní RLS policies (pro začátek povolíme vše, později lze zpřísnit)
-- Pro anonymní přístup (veřejné hlasování)
DROP POLICY IF EXISTS "Allow anonymous read buildings" ON buildings;
CREATE POLICY "Allow anonymous read buildings" ON buildings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow anonymous read members" ON members;
CREATE POLICY "Allow anonymous read members" ON members FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow anonymous read votes" ON votes;
CREATE POLICY "Allow anonymous read votes" ON votes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow anonymous read questions" ON questions;
CREATE POLICY "Allow anonymous read questions" ON questions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow anonymous read voting_tokens" ON voting_tokens;
CREATE POLICY "Allow anonymous read voting_tokens" ON voting_tokens FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow anonymous read global_variables" ON global_variables;
CREATE POLICY "Allow anonymous read global_variables" ON global_variables FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow anonymous read building_variable_definitions" ON building_variable_definitions;
CREATE POLICY "Allow anonymous read building_variable_definitions" ON building_variable_definitions FOR SELECT USING (true);

-- Pro hlasování
DROP POLICY IF EXISTS "Allow anonymous insert member_votes" ON member_votes;
CREATE POLICY "Allow anonymous insert member_votes" ON member_votes FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow anonymous update voting_tokens" ON voting_tokens;
CREATE POLICY "Allow anonymous update voting_tokens" ON voting_tokens FOR UPDATE USING (true);

-- Pro administrátory (později může být nahrazeno specifickými policies)
DROP POLICY IF EXISTS "Allow all for admin" ON buildings;
CREATE POLICY "Allow all for admin" ON buildings FOR ALL USING (true);
DROP POLICY IF EXISTS "Allow all for admin members" ON members;
CREATE POLICY "Allow all for admin members" ON members FOR ALL USING (true);
DROP POLICY IF EXISTS "Allow all for admin votes" ON votes;
CREATE POLICY "Allow all for admin votes" ON votes FOR ALL USING (true);
DROP POLICY IF EXISTS "Allow all for admin questions" ON questions;
CREATE POLICY "Allow all for admin questions" ON questions FOR ALL USING (true);
DROP POLICY IF EXISTS "Allow all for admin email_templates" ON email_templates;
CREATE POLICY "Allow all for admin email_templates" ON email_templates FOR ALL USING (true);
DROP POLICY IF EXISTS "Allow all for admin global_variables" ON global_variables;
CREATE POLICY "Allow all for admin global_variables" ON global_variables FOR ALL USING (true);
DROP POLICY IF EXISTS "Allow all for admin building_variable_definitions" ON building_variable_definitions;
CREATE POLICY "Allow all for admin building_variable_definitions" ON building_variable_definitions FOR ALL USING (true);
DROP POLICY IF EXISTS "Allow all for admin observers" ON observers;
CREATE POLICY "Allow all for admin observers" ON observers FOR ALL USING (true);
DROP POLICY IF EXISTS "Allow all for admin voting_tokens" ON voting_tokens;
CREATE POLICY "Allow all for admin voting_tokens" ON voting_tokens FOR ALL USING (true);
DROP POLICY IF EXISTS "Allow all for admin member_votes" ON member_votes;
CREATE POLICY "Allow all for admin member_votes" ON member_votes FOR ALL USING (true);
DROP POLICY IF EXISTS "Allow all for admin manual_vote_attachments" ON manual_vote_attachments;
CREATE POLICY "Allow all for admin manual_vote_attachments" ON manual_vote_attachments FOR ALL USING (true);
DROP POLICY IF EXISTS "Allow all for admin manual_vote_notes" ON manual_vote_notes;
CREATE POLICY "Allow all for admin manual_vote_notes" ON manual_vote_notes FOR ALL USING (true);

-- Policies pro nové tabulky
DROP POLICY IF EXISTS "Allow all for admin vote_delegations" ON vote_delegations;
CREATE POLICY "Allow all for admin vote_delegations" ON vote_delegations FOR ALL USING (true);
DROP POLICY IF EXISTS "Allow all for admin notifications" ON notifications;
CREATE POLICY "Allow all for admin notifications" ON notifications FOR ALL USING (true);
DROP POLICY IF EXISTS "Allow all for admin sms_verifications" ON sms_verifications;
CREATE POLICY "Allow all for admin sms_verifications" ON sms_verifications FOR ALL USING (true);
DROP POLICY IF EXISTS "Allow read audit_log" ON audit_log;
CREATE POLICY "Allow read audit_log" ON audit_log FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow all for admin vote_analytics" ON vote_analytics;
CREATE POLICY "Allow all for admin vote_analytics" ON vote_analytics FOR ALL USING (true);
DROP POLICY IF EXISTS "Allow all for admin reports" ON reports;
CREATE POLICY "Allow all for admin reports" ON reports FOR ALL USING (true);
DROP POLICY IF EXISTS "Allow all for admin question_responses" ON question_responses;
CREATE POLICY "Allow all for admin question_responses" ON question_responses FOR ALL USING (true);
DROP POLICY IF EXISTS "Allow all for admin proxy_votes" ON proxy_votes;
CREATE POLICY "Allow all for admin proxy_votes" ON proxy_votes FOR ALL USING (true);
DROP POLICY IF EXISTS "Allow all for admin attachments" ON attachments;
CREATE POLICY "Allow all for admin attachments" ON attachments FOR ALL USING (true);

-- Specifické policies pro hlasování a delegování
DROP POLICY IF EXISTS "Allow delegation read for participants" ON vote_delegations;
CREATE POLICY "Allow delegation read for participants" ON vote_delegations FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow delegation create for members" ON vote_delegations;
CREATE POLICY "Allow delegation create for members" ON vote_delegations FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow delegation update for delegator" ON vote_delegations;
CREATE POLICY "Allow delegation update for delegator" ON vote_delegations FOR UPDATE USING (true);

-- Policies pro notifikace
DROP POLICY IF EXISTS "Allow notification read for recipient" ON notifications;
CREATE POLICY "Allow notification read for recipient" ON notifications FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow notification update for recipient" ON notifications;
CREATE POLICY "Allow notification update for recipient" ON notifications FOR UPDATE USING (true);

-- Policies pro SMS ověřování  
DROP POLICY IF EXISTS "Allow SMS verification for voting" ON sms_verifications;
CREATE POLICY "Allow SMS verification for voting" ON sms_verifications FOR ALL USING (true);

-- Policies pro veřejné attachmenty
DROP POLICY IF EXISTS "Allow public attachment read" ON attachments;
CREATE POLICY "Allow public attachment read" ON attachments FOR SELECT USING (is_public = true);
DROP POLICY IF EXISTS "Allow attachment management" ON attachments;
CREATE POLICY "Allow attachment management" ON attachments FOR ALL USING (true);

-- Vložení rozšířených globálních proměnných
INSERT INTO global_variables (name, description, value, is_editable) VALUES
('nazev_spolecnosti', 'Název správcovské společnosti', 'OnlineSprava s.r.o.', true),
('kontaktni_email', 'Kontaktní e-mail společnosti', 'podpora@onlinesprava.cz', true),
('telefon_spolecnosti', 'Telefon společnosti', '+420 800 123 456', true),
('adresa_spolecnosti', 'Adresa sídla společnosti', 'Wenceslas Square 1, 110 00 Praha 1', true),
('web_spolecnosti', 'Webové stránky společnosti', 'www.onlinesprava.cz', true),
('podpis_spravce', 'Standardní podpis správce', 'S pozdravem,\nTým OnlineSprava\n{{nazev_spolecnosti}}', true),
('pravni_upozorneni', 'Právní upozornění v patičce', 'Tento e-mail je určen pouze pro adresáta. Pokud nejste zamýšleným příjemcem, informujte prosím odesílatele a e-mail smažte.', true),
('datum_dnes', 'Aktuální datum', '', false),
('cas_ted', 'Aktuální čas', '', false),
('system_nazev', 'Název systému', 'Online Hlasování SVJ', true),
('system_verze', 'Verze systému', '2.0', false),
('podpora_email', 'Email podpory', 'podpora@example.com', true),
('podpora_telefon', 'Telefon podpory', '+420 123 456 789', true),
('max_file_size', 'Maximální velikost souboru (MB)', '10', true),
('allowed_file_types', 'Povolené typy souborů', 'pdf,doc,docx,jpg,png', true),
('vote_reminder_hours', 'Hodiny před koncem pro upomínky', '24,6', true),
('default_vote_duration', 'Výchozí délka hlasování (dny)', '7', true),
('require_sms_verification', 'Vyžadovat SMS ověření', 'true', true),
('enable_delegation', 'Povolit delegování hlasů', 'true', true),
('enable_proxy_voting', 'Povolit zastupování', 'false', true),
('auto_generate_reports', 'Automaticky generovat reporty', 'true', true)
ON CONFLICT (name) DO NOTHING;

-- Vložení rozšířených definic proměnných budov
INSERT INTO building_variable_definitions (name, description, type, required, placeholder) VALUES
('nazev_budovy', 'Název budovy/SVJ', 'text', true, 'Např. Bytový dům Na Kopci 123'),
('zkraceny_nazev', 'Zkrácený název', 'text', true, 'Např. BD Na Kopci'),
('plny_nazev', 'Plný oficiální název', 'text', true, 'Např. Společenství vlastníků jednotek Bytový dům Na Kopci 123'),
('adresa', 'Adresa budovy', 'text', true, 'Včetně PSČ a města'),
('osloveni', 'Oslovení ve zprávách', 'select', true, NULL),
('ico', 'IČO', 'text', false, '12345678'),
('dic', 'DIČ', 'text', false, 'CZ12345678'),
('kontaktni_osoba', 'Kontaktní osoba', 'text', false, 'Jméno a příjmení'),
('predseda', 'Předseda SVJ', 'text', false, 'Jméno a příjmení'),
('telefon_predsedy', 'Telefon předsedy', 'text', false, '+420 xxx xxx xxx'),
('email_predsedy', 'Email předsedy', 'text', false, 'predseda@example.com'),
('banka', 'Název banky', 'text', false, 'Např. Česká spořitelna'),
('cislo_uctu', 'Číslo účtu', 'text', false, 'XXXXXXXXX/XXXX'),
('iban', 'IBAN', 'text', false, 'CZ65 0800 0000 1920 0014 5399'),
('web', 'Webové stránky', 'text', false, 'www.example.com'),
('facebook', 'Facebook stránka', 'text', false, 'https://facebook.com/vase-svj'),
('instagram', 'Instagram profil', 'text', false, '@vase_svj'),
('spravce_nazev', 'Název správcovské společnosti', 'text', false, 'OnlineSprava s.r.o.'),
('spravce_adresa', 'Adresa správce', 'text', false, 'Václavské náměstí 1, Praha 1'),
('spravce_telefon', 'Telefon správce', 'text', false, '+420 800 123 456'),
('spravce_email', 'Email správce', 'text', false, 'sprava@example.com'),
('rezervni_fond', 'Stav rezervního fondu', 'number', false, '0'),
('opravny_fond', 'Stav opravného fondu', 'number', false, '0'),
('pojistovna', 'Pojišťovna budovy', 'text', false, 'Česká pojišťovna'),
('cislo_pojistky', 'Číslo pojistky', 'text', false, '1234567890'),
('pocet_jednotek', 'Celkový počet jednotek', 'number', true, '24'),
('pocet_parkovacich_mist', 'Počet parkovacích míst', 'number', false, '12'),
('pocet_sklep', 'Počet sklepů', 'number', false, '24'),
('rok_vystavby', 'Rok výstavby', 'number', false, '1985'),
('posledni_rekonstrukce', 'Rok poslední rekonstrukce', 'number', false, '2020')
ON CONFLICT (name) DO NOTHING;

-- Aktualizace options pro select pole
UPDATE building_variable_definitions 
SET options = '{"Vážení vlastníci", "Vážení družstevníci", "Vážení členové", "Vážené dámy a pánové"}'
WHERE name = 'osloveni';

-- ========================================
-- POKROČILÉ VIEWS PRO REPORTING
-- ========================================

-- View pro statistiky hlasování
CREATE OR REPLACE VIEW vote_statistics_view AS
SELECT 
    v.id,
    v.title,
    v.status,
    v.building_id,
    b.name as building_name,
    COUNT(DISTINCT m.id) as total_eligible_voters,
    COUNT(DISTINCT mv.member_id) as voted_members,
    COALESCE(SUM(mv.voting_power_used), 0) as total_voting_power_used,
    COUNT(DISTINCT vd.delegator_id) as delegated_votes,
    ROUND(
        (COUNT(DISTINCT mv.member_id)::decimal / NULLIF(COUNT(DISTINCT m.id), 0)) * 100, 
        2
    ) as participation_rate
FROM votes v
JOIN buildings b ON v.building_id = b.id
LEFT JOIN members m ON m.building_id = v.building_id
LEFT JOIN member_votes mv ON mv.vote_id = v.id
LEFT JOIN vote_delegations vd ON vd.vote_id = v.id
GROUP BY v.id, v.title, v.status, v.building_id, b.name;

-- View pro delegování a zastupování
CREATE OR REPLACE VIEW delegation_overview AS
SELECT 
    vd.vote_id,
    v.title as vote_title,
    delegator.name as delegator_name,
    delegator.unit as delegator_unit,
    delegate.name as delegate_name,
    delegate.unit as delegate_unit,
    delegator.vote_weight as delegated_voting_power,
    vd.created_at as delegation_created,
    vd.is_active
FROM vote_delegations vd
JOIN votes v ON vd.vote_id = v.id
JOIN members delegator ON vd.delegator_id = delegator.id
JOIN members delegate ON vd.delegate_id = delegate.id;

-- View pro audit trail
CREATE OR REPLACE VIEW audit_summary AS
SELECT 
    al.*,
    CASE 
        WHEN al.actor_id IS NOT NULL THEN m.name
        ELSE al.actor_name
    END as actor_display_name
FROM audit_log al
LEFT JOIN members m ON al.actor_id = m.id
ORDER BY al.created_at DESC;

-- ========================================
-- STORED PROCEDURES PRO POKROČILÉ OPERACE
-- ========================================

-- Funkce pro výpočet kvóra
CREATE OR REPLACE FUNCTION calculate_quorum(
    vote_id_param UUID,
    question_id_param UUID
) RETURNS TABLE (
    required_votes DECIMAL,
    current_votes DECIMAL,
    quorum_met BOOLEAN
) AS $$
DECLARE
    question_record RECORD;
    total_eligible_power DECIMAL;
    current_voting_power DECIMAL;
    required_power DECIMAL;
BEGIN
    -- Získání informací o otázce
    SELECT * INTO question_record FROM questions WHERE id = question_id_param;
    
    -- Výpočet celkové oprávněné hlasovací síly
    SELECT COALESCE(SUM(m.vote_weight), 0) INTO total_eligible_power
    FROM members m
    JOIN votes v ON m.building_id = v.building_id
    WHERE v.id = vote_id_param;
    
    -- Výpočet aktuální hlasovací síly
    SELECT COALESCE(SUM(voting_power_used), 0) INTO current_voting_power
    FROM member_votes mv
    WHERE mv.vote_id = vote_id_param AND mv.question_id = question_id_param;
    
    -- Výpočet požadované hlasovací síly podle typu kvóra
    CASE question_record.quorum_type
        WHEN 'simple' THEN 
            required_power := total_eligible_power * 0.5;
        WHEN 'qualified' THEN 
            required_power := total_eligible_power * 0.67;
        WHEN 'unanimous' THEN 
            required_power := total_eligible_power;
        WHEN 'custom' THEN 
            required_power := total_eligible_power * 
                (question_record.custom_quorum_numerator::decimal / question_record.custom_quorum_denominator::decimal);
        ELSE 
            required_power := total_eligible_power * 0.5;
    END CASE;
    
    RETURN QUERY SELECT 
        required_power,
        current_voting_power,
        current_voting_power >= required_power;
END;
$$ LANGUAGE plpgsql;

-- Funkce pro automatické dokončení hlasování
CREATE OR REPLACE FUNCTION auto_complete_vote(vote_id_param UUID) 
RETURNS BOOLEAN AS $$
DECLARE
    vote_record RECORD;
    all_quorums_met BOOLEAN := true;
    question_record RECORD;
    quorum_result RECORD;
BEGIN
    -- Získání informací o hlasování
    SELECT * INTO vote_record FROM votes WHERE id = vote_id_param;
    
    -- Kontrola, zda hlasování může být dokončeno
    IF vote_record.status != 'active' OR vote_record.end_date > NOW() THEN
        RETURN false;
    END IF;
    
    -- Kontrola kvóra pro všechny otázky
    FOR question_record IN SELECT * FROM questions WHERE vote_id = vote_id_param LOOP
        SELECT * INTO quorum_result FROM calculate_quorum(vote_id_param, question_record.id);
        
        IF NOT quorum_result.quorum_met THEN
            all_quorums_met := false;
            EXIT;
        END IF;
    END LOOP;
    
    -- Dokončení hlasování pokud jsou splněny podmínky
    IF all_quorums_met OR vote_record.end_date <= NOW() THEN
        UPDATE votes SET 
            status = 'completed',
            completed_at = NOW()
        WHERE id = vote_id_param;
        
        -- Vytvoření analytics záznamu
        INSERT INTO vote_analytics (vote_id, building_id, total_eligible_voters, total_votes_cast)
        SELECT 
            vote_id_param,
            vote_record.building_id,
            COUNT(DISTINCT m.id),
            COUNT(DISTINCT mv.member_id)
        FROM members m
        LEFT JOIN member_votes mv ON mv.vote_id = vote_id_param
        WHERE m.building_id = vote_record.building_id;
        
        RETURN true;
    END IF;
    
    RETURN false;
END;
$$ LANGUAGE plpgsql;

-- Vytvoření bucket pro přílohy (musí být spuštěno v Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('attachments', 'attachments', true);

-- Políticas pro storage (musí být spuštěno v Supabase dashboard)
-- CREATE POLICY "Allow public upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'attachments');
-- CREATE POLICY "Allow public read" ON storage.objects FOR SELECT USING (bucket_id = 'attachments');
-- CREATE POLICY "Allow public delete" ON storage.objects FOR DELETE USING (bucket_id = 'attachments');
