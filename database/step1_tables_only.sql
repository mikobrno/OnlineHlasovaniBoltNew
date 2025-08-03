-- SAFE VERSION - nejdříve tabulky bez vazeb, pak vazby
-- SQL schema pro Supabase databázi - POSTUPNÉ VYTVÁŘENÍ

-- Zapnutí RLS (Row Level Security)
ALTER DATABASE postgres SET row_security = on;

-- ========================================
-- VŠECHNY TABULKY NEJDŘÍVE BEZ FOREIGN KEY VAZEB
-- ========================================

-- Tabulka buildings (bez vazeb)
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

-- Tabulka members (bez vazeb)
CREATE TABLE IF NOT EXISTS members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  unit TEXT NOT NULL,
  vote_weight DECIMAL(10,4) NOT NULL DEFAULT 1.0000,
  representative_id UUID, -- bez REFERENCES zatím
  building_id UUID NOT NULL, -- bez REFERENCES zatím
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin', 'observer', 'chairman')),
  is_active BOOLEAN DEFAULT true,
  voting_power DECIMAL(10,4) DEFAULT 1.0000,
  can_delegate BOOLEAN DEFAULT true,
  can_receive_delegation BOOLEAN DEFAULT true,
  notification_preferences JSONB DEFAULT '{"email": true, "sms": false}',
  last_activity TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabulka votes (bez vazeb)
CREATE TABLE IF NOT EXISTS votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  building_id UUID NOT NULL, -- bez REFERENCES zatím
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
  reminder_intervals INTEGER[] DEFAULT '{24, 6}',
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

-- Tabulka questions (bez vazeb)
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vote_id UUID NOT NULL, -- bez REFERENCES zatím
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

-- Tabulka email_templates (bez vazeb)
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  building_id UUID, -- bez REFERENCES zatím
  is_global BOOLEAN DEFAULT false,
  custom_variables JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabulka global_variables (bez vazeb)
CREATE TABLE IF NOT EXISTS global_variables (
  name TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  value TEXT NOT NULL,
  is_editable BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabulka building_variable_definitions (bez vazeb)
CREATE TABLE IF NOT EXISTS building_variable_definitions (
  name TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('text', 'select', 'number')),
  options TEXT[],
  required BOOLEAN DEFAULT false,
  placeholder TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabulka vote_delegations (bez vazeb)
CREATE TABLE IF NOT EXISTS vote_delegations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vote_id UUID NOT NULL, -- bez REFERENCES zatím
  delegator_id UUID NOT NULL, -- bez REFERENCES zatím
  delegate_id UUID NOT NULL, -- bez REFERENCES zatím
  delegation_type TEXT DEFAULT 'full' CHECK (delegation_type IN ('full', 'partial', 'question_specific')),
  specific_questions UUID[],
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ
);

-- Tabulka notifications (bez vazeb)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_id UUID NOT NULL, -- bez REFERENCES zatím
  building_id UUID NOT NULL, -- bez REFERENCES zatím
  vote_id UUID, -- bez REFERENCES zatím
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

-- Tabulka sms_verifications (bez vazeb)
CREATE TABLE IF NOT EXISTS sms_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL, -- bez REFERENCES zatím
  vote_id UUID NOT NULL, -- bez REFERENCES zatím
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabulka audit_log (bez vazeb)
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

-- Tabulka vote_analytics (bez vazeb)
CREATE TABLE IF NOT EXISTS vote_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vote_id UUID NOT NULL, -- bez REFERENCES zatím
  building_id UUID NOT NULL, -- bez REFERENCES zatím
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

-- Tabulka reports (bez vazeb)
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vote_id UUID NOT NULL, -- bez REFERENCES zatím
  building_id UUID NOT NULL, -- bez REFERENCES zatím
  report_type TEXT NOT NULL CHECK (report_type IN ('vote_results', 'participation', 'minutes', 'detailed_analysis', 'legal_document')),
  format TEXT NOT NULL CHECK (format IN ('pdf', 'excel', 'csv', 'json')),
  file_path TEXT,
  file_size INTEGER,
  generated_by UUID, -- bez REFERENCES zatím
  is_official BOOLEAN DEFAULT false,
  contains_personal_data BOOLEAN DEFAULT true,
  access_level TEXT DEFAULT 'admin' CHECK (access_level IN ('public', 'members', 'admin', 'chairman')),
  expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabulka proxy_votes (bez vazeb)
CREATE TABLE IF NOT EXISTS proxy_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vote_id UUID NOT NULL, -- bez REFERENCES zatím
  proxy_holder_id UUID NOT NULL, -- bez REFERENCES zatím
  represented_member_id UUID NOT NULL, -- bez REFERENCES zatím
  authorization_document TEXT,
  authorization_expires TIMESTAMPTZ,
  is_valid BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabulka attachments (bez vazeb)
CREATE TABLE IF NOT EXISTS attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('vote', 'question', 'member_vote', 'building', 'member')),
  entity_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by UUID, -- bez REFERENCES zatím
  is_public BOOLEAN DEFAULT false,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabulka observers (bez vazeb)
CREATE TABLE IF NOT EXISTS observers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  building_id UUID NOT NULL, -- bez REFERENCES zatím
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabulka voting_tokens (bez vazeb)
CREATE TABLE IF NOT EXISTS voting_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vote_id UUID NOT NULL, -- bez REFERENCES zatím
  member_id UUID NOT NULL, -- bez REFERENCES zatím
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
  metadata JSONB DEFAULT '{}'
);

-- Tabulka member_votes (bez vazeb)
CREATE TABLE IF NOT EXISTS member_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vote_id UUID NOT NULL, -- bez REFERENCES zatím
  member_id UUID NOT NULL, -- bez REFERENCES zatím
  question_id UUID NOT NULL, -- bez REFERENCES zatím
  answer TEXT CHECK (answer IN ('yes', 'no', 'abstain')),
  answer_data JSONB DEFAULT '{}',
  voting_power_used DECIMAL(10,4) DEFAULT 1.0000,
  is_delegated BOOLEAN DEFAULT false,
  delegated_by UUID, -- bez REFERENCES zatím
  is_proxy BOOLEAN DEFAULT false,
  proxy_for UUID, -- bez REFERENCES zatím
  confidence_level INTEGER CHECK (confidence_level BETWEEN 1 AND 5),
  comment TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabulka question_responses (bez vazeb)
CREATE TABLE IF NOT EXISTS question_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_vote_id UUID NOT NULL, -- bez REFERENCES zatím
  question_id UUID NOT NULL, -- bez REFERENCES zatím
  response_type TEXT NOT NULL CHECK (response_type IN ('yes_no', 'multiple_choice', 'ranking', 'text', 'numeric')),
  response_data JSONB NOT NULL,
  confidence_level INTEGER CHECK (confidence_level BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabulka manual_vote_attachments (bez vazeb)
CREATE TABLE IF NOT EXISTS manual_vote_attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vote_id UUID NOT NULL, -- bez REFERENCES zatím
  member_id UUID NOT NULL, -- bez REFERENCES zatím
  attachment_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabulka manual_vote_notes (bez vazeb)
CREATE TABLE IF NOT EXISTS manual_vote_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vote_id UUID NOT NULL, -- bez REFERENCES zatím
  member_id UUID NOT NULL, -- bez REFERENCES zatím
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Test - všechny tabulky vytvořeny
SELECT 'ÚSPĚCH! Všechny tabulky vytvořeny bez foreign key vazeb!' as status;
