// KOMPLETNÍ TypeScript typy pro rozšířenou funkcionalitu
// Všechny původní typy zachovány + nové rozšířené funkce

// ========================================
// ZÁKLADNÍ ROZŠÍŘENÉ TYPY
// ========================================

export interface ExtendedBuilding {
  id: string;
  name: string;
  address: string;
  total_units: number;
  variables: Record<string, string>;
  settings: BuildingSettings;
  statistics: BuildingStatistics;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BuildingSettings {
  require_sms_verification?: boolean;
  allow_delegation?: boolean;
  default_vote_duration_days?: number;
  notification_preferences?: NotificationSettings;
  [key: string]: unknown;
}

export interface BuildingStatistics {
  total_votes_conducted?: number;
  average_participation_rate?: number;
  last_vote_date?: string;
  active_members_count?: number;
  [key: string]: unknown;
}

export interface NotificationSettings {
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled?: boolean;
}

export interface ExtendedMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  unit: string;
  vote_weight: number;
  representative_id?: string;
  building_id: string;
  role: 'member' | 'admin' | 'observer' | 'chairman';
  is_active: boolean;
  voting_power: number;
  can_delegate: boolean;
  can_receive_delegation: boolean;
  notification_preferences: {
    email: boolean;
    sms: boolean;
    push?: boolean;
  };
  last_activity?: string;
  metadata: MemberMetadata;
  created_at: string;
  updated_at: string;
}

export interface MemberMetadata {
  import_source?: string;
  last_login?: string;
  preferences?: Record<string, string | number | boolean>;
  notes?: string;
  [key: string]: unknown;
}

export interface ExtendedVote {
  id: string;
  title: string;
  description: string;
  building_id: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled' | 'archived';
  voting_type: 'standard' | 'secret' | 'weighted' | 'ranked';
  requires_quorum: boolean;
  quorum_percentage: number;
  allow_delegation: boolean;
  allow_proxy_voting: boolean;
  anonymous_voting: boolean;
  multiple_questions: boolean;
  auto_close: boolean;
  send_reminders: boolean;
  reminder_intervals: number[]; // hours before end
  results: VoteResults;
  member_votes: Record<string, Record<string, string>>;
  member_representatives: Record<string, string>;
  manual_vote_attachments: Record<string, string[]>;
  manual_vote_notes: Record<string, string>;
  observers: string[];
  attachments: string[];
  vote_statistics: VoteStatistics;
  metadata: VoteMetadata;
  created_at: string;
  start_date?: string;
  end_date?: string;
  completed_at?: string;
  archived_at?: string;
}

export interface VoteMetadata {
  created_by?: string;
  import_source?: string;
  template_used?: string;
  external_id?: string;
  legal_requirements?: string[];
  [key: string]: unknown;
}

export interface ExtendedQuestion {
  id: string;
  vote_id: string;
  text: string;
  question_type: 'yes_no' | 'multiple_choice' | 'ranking' | 'text' | 'numeric';
  quorum_type: 'simple' | 'qualified' | 'unanimous' | 'custom';
  custom_quorum_numerator?: number;
  custom_quorum_denominator?: number;
  options: string[];
  allow_multiple: boolean;
  required: boolean;
  min_value?: number;
  max_value?: number;
  order_index: number;
  results: QuestionResults;
  created_at: string;
}

// ========================================
// NOVÉ POKROČILÉ TYPY
// ========================================

export interface VoteDelegation {
  id: string;
  vote_id: string;
  delegator_id: string;
  delegate_id: string;
  delegation_type: 'full' | 'partial' | 'question_specific';
  specific_questions?: string[];
  is_active: boolean;
  notes?: string;
  created_at: string;
  revoked_at?: string;
}

export interface Notification {
  id: string;
  recipient_id: string;
  building_id: string;
  vote_id?: string;
  type: 'vote_created' | 'vote_reminder' | 'vote_ending' | 'vote_completed' | 
        'delegation_received' | 'delegation_revoked' | 'manual_vote_added' | 'general';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  title: string;
  message: string;
  channels: ('email' | 'sms' | 'push')[];
  is_read: boolean;
  is_sent: boolean;
  sent_at?: string;
  read_at?: string;
  data: NotificationData;
  created_at: string;
}

export interface NotificationData {
  vote_title?: string;
  deadline?: string;
  action_url?: string;
  additional_info?: Record<string, string | number>;
  [key: string]: unknown;
}

export interface SmsVerification {
  id: string;
  member_id: string;
  vote_id: string;
  phone_number: string;
  verification_code: string;
  token_hash: string;
  is_verified: boolean;
  is_used: boolean;
  attempts: number;
  max_attempts: number;
  expires_at: string;
  verified_at?: string;
  used_at?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface AuditLogEntry {
  id: string;
  entity_type: string;
  entity_id: string;
  action: 'create' | 'update' | 'delete' | 'vote_cast' | 'delegation_created' | 
          'delegation_revoked' | 'login' | 'sms_sent' | 'verification_attempt';
  actor_type: 'member' | 'admin' | 'system';
  actor_id?: string;
  actor_name?: string;
  old_data?: Record<string, unknown>;
  new_data?: Record<string, unknown>;
  changes?: AuditChanges;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  created_at: string;
}

export interface AuditChanges {
  old?: Record<string, unknown>;
  new?: Record<string, unknown>;
  fields_changed?: string[];
  [key: string]: unknown;
}

export interface VoteAnalytics {
  id: string;
  vote_id: string;
  building_id: string;
  total_eligible_voters: number;
  total_votes_cast: number;
  total_delegations: number;
  total_voting_power: number;
  participation_rate: number;
  completion_rate: number;
  question_results: Record<string, QuestionAnalytics>;
  demographic_breakdown: DemographicBreakdown;
  timeline_data: TimelineData;
  reminders_sent: number;
  last_updated: string;
  created_at: string;
}

export interface Report {
  id: string;
  vote_id: string;
  building_id: string;
  report_type: 'vote_results' | 'participation' | 'minutes' | 'detailed_analysis' | 'legal_document';
  format: 'pdf' | 'excel' | 'csv' | 'json';
  file_path?: string;
  file_size?: number;
  generated_by?: string;
  is_official: boolean;
  contains_personal_data: boolean;
  access_level: 'public' | 'members' | 'admin' | 'chairman';
  expires_at?: string;
  metadata: ReportMetadata;
  created_at: string;
}

export interface ReportMetadata {
  template_used?: string;
  generation_time_ms?: number;
  filters_applied?: Record<string, unknown>;
  total_pages?: number;
  [key: string]: unknown;
}

export interface QuestionResponse {
  id: string;
  member_vote_id: string;
  question_id: string;
  response_type: 'yes_no' | 'multiple_choice' | 'ranking' | 'text' | 'numeric';
  response_data: QuestionResponseData;
  confidence_level?: number;
  comment?: string;
  created_at: string;
}

export interface QuestionResponseData {
  yes_no?: 'yes' | 'no' | 'abstain';
  multiple_choice?: string[];
  ranking?: Array<{ option: string; rank: number; }>;
  text?: string;
  numeric?: number;
  [key: string]: unknown;
}

export interface ProxyVote {
  id: string;
  vote_id: string;
  proxy_holder_id: string;
  represented_member_id: string;
  authorization_document?: string;
  authorization_expires?: string;
  is_valid: boolean;
  created_at: string;
}

export interface Attachment {
  id: string;
  entity_type: 'vote' | 'question' | 'member_vote' | 'building' | 'member';
  entity_id: string;
  file_name: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  uploaded_by?: string;
  is_public: boolean;
  description?: string;
  metadata: AttachmentMetadata;
  created_at: string;
}

export interface AttachmentMetadata {
  original_name?: string;
  virus_scan_result?: 'clean' | 'infected' | 'pending';
  thumbnail_path?: string;
  checksum?: string;
  [key: string]: unknown;
}

export interface ExtendedMemberVote {
  id: string;
  vote_id: string;
  member_id: string;
  question_id: string;
  answer?: 'yes' | 'no' | 'abstain'; // Pro zpětnou kompatibilitu
  answer_data: QuestionResponseData; // Pro pokročilé odpovědi
  voting_power_used: number;
  is_delegated: boolean;
  delegated_by?: string;
  is_proxy: boolean;
  proxy_for?: string;
  confidence_level?: number;
  comment?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface ExtendedVotingToken {
  id: string;
  vote_id: string;
  member_id: string;
  token: string;
  verification_code: string;
  token_type: 'sms' | 'email' | 'app' | 'manual';
  is_verified: boolean;
  is_used: boolean;
  verification_attempts: number;
  max_verification_attempts: number;
  usage_attempts: number;
  max_usage_attempts: number;
  expires_at: string;
  created_at: string;
  verified_at?: string;
  used_at?: string;
  ip_address?: string;
  user_agent?: string;
  metadata: VotingTokenMetadata;
}

export interface VotingTokenMetadata {
  sms_provider?: string;
  delivery_status?: 'pending' | 'delivered' | 'failed';
  cost?: number;
  [key: string]: unknown;
}

// ========================================
// HELPER TYPY PRO STATISTIKY
// ========================================

export interface VoteResults {
  total_eligible_voters: number;
  total_votes_cast: number;
  total_voting_power: number;
  participation_rate: number;
  completion_rate: number;
  questions: QuestionResults[];
  delegations_count: number;
  proxy_votes_count: number;
}

export interface QuestionResults {
  question_id: string;
  question_text: string;
  question_type: string;
  results: {
    yes?: number;
    no?: number;
    abstain?: number;
    options?: Record<string, number>;
    ranking?: Array<{ option: string; average_rank: number; }>;
    text_responses?: string[];
    numeric_average?: number;
    numeric_responses?: number[];
  };
  voting_power_results: {
    yes_power?: number;
    no_power?: number;
    abstain_power?: number;
    option_power?: Record<string, number>;
  };
  quorum_met: boolean;
  passed: boolean;
  participation_rate: number;
}

export interface VoteStatistics {
  total_votes: number;
  total_voting_power: number;
  last_vote_cast?: string;
  questions_answered: Record<string, number>;
  demographic_breakdown: DemographicBreakdown;
}

export interface QuestionAnalytics {
  responses_count: number;
  response_rate: number;
  average_confidence?: number;
  response_distribution: Record<string, number>;
  voting_power_distribution: Record<string, number>;
}

export interface DemographicBreakdown {
  by_unit_type?: Record<string, number>;
  by_voting_power?: Record<string, number>;
  by_role?: Record<string, number>;
  delegated_vs_direct?: {
    direct: number;
    delegated: number;
    proxy: number;
  };
}

export interface TimelineData {
  votes_by_hour: Record<string, number>;
  votes_by_day: Record<string, number>;
  delegations_timeline: Array<{
    timestamp: string;
    delegations_count: number;
  }>;
  reminders_timeline: Array<{
    timestamp: string;
    reminder_type: string;
    recipients_count: number;
  }>;
}

// ========================================
// QUERY HELPER TYPY
// ========================================

export interface VoteFilters {
  building_id?: string;
  status?: ExtendedVote['status'][];
  voting_type?: ExtendedVote['voting_type'][];
  date_from?: string;
  date_to?: string;
  created_by?: string;
  has_delegations?: boolean;
}

export interface MemberFilters {
  building_id?: string;
  role?: ExtendedMember['role'][];
  is_active?: boolean;
  can_delegate?: boolean;
  search?: string;
}

export interface NotificationFilters {
  recipient_id?: string;
  type?: Notification['type'][];
  priority?: Notification['priority'][];
  is_read?: boolean;
  date_from?: string;
  date_to?: string;
}

// ========================================
// API RESPONSE TYPY
// ========================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export interface VoteWithDetails extends ExtendedVote {
  questions: ExtendedQuestion[];
  building: ExtendedBuilding;
  analytics?: VoteAnalytics;
  delegations?: VoteDelegation[];
  member_votes_detail?: ExtendedMemberVote[];
}

export interface MemberWithDetails extends ExtendedMember {
  building: ExtendedBuilding;
  active_delegations?: VoteDelegation[];
  received_delegations?: VoteDelegation[];
  unread_notifications_count?: number;
  vote_history_count?: number;
}

// ========================================
// FORM DATA TYPY
// ========================================

export interface CreateVoteData {
  title: string;
  description: string;
  building_id: string;
  voting_type: ExtendedVote['voting_type'];
  requires_quorum: boolean;
  quorum_percentage: number;
  allow_delegation: boolean;
  allow_proxy_voting: boolean;
  anonymous_voting: boolean;
  send_reminders: boolean;
  reminder_intervals: number[];
  start_date?: string;
  end_date?: string;
  questions: Omit<ExtendedQuestion, 'id' | 'vote_id' | 'created_at' | 'results'>[];
}

export interface CreateDelegationData {
  vote_id: string;
  delegator_id: string;
  delegate_id: string;
  delegation_type: VoteDelegation['delegation_type'];
  specific_questions?: string[];
  notes?: string;
}

export interface CastVoteData {
  vote_id: string;
  member_id: string;
  responses: Array<{
    question_id: string;
    response_data: QuestionResponseData;
    confidence_level?: number;
    comment?: string;
  }>;
  voting_token?: string;
}

// ========================================
// PŮVODNÍ TYPY PRO ZPĚTNOU KOMPATIBILITU
// ========================================

export interface Member extends Omit<ExtendedMember, 'role' | 'voting_power' | 'can_delegate' | 'notification_preferences' | 'metadata'> {
  voteWeight: number; // Alias pro vote_weight
}

export interface Building extends Omit<ExtendedBuilding, 'settings' | 'statistics' | 'is_active'> {
  totalUnits: number; // Alias pro total_units
}

export interface Vote extends Omit<ExtendedVote, 'voting_type' | 'requires_quorum' | 'allow_delegation' | 'vote_statistics' | 'metadata'> {
  questions: Question[];
  memberVotes: Record<string, Record<string, 'yes' | 'no' | 'abstain'>>;
  memberRepresentatives?: Record<string, string>;
  manualVoteAttachments?: Record<string, string[]>;
  manualVoteNotes?: Record<string, string>;
}

export interface Question extends Omit<ExtendedQuestion, 'question_type' | 'options' | 'allow_multiple' | 'required' | 'min_value' | 'max_value' | 'order_index' | 'results'> {
  customQuorum?: { numerator: number; denominator: number };
}
