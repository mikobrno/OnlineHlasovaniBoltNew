// src/modules/votes/types/index.ts

export interface Vote {
  id: string;
  title: string;
  description: string;
  building_id: string;
  status: VoteStatus;
  type: VoteType;
  start_date: string;
  end_date: string;
  quorum_type: QuorumType;
  quorum_value: number;
  majority_type: MajorityType;
  majority_value: number;
  created_at?: string;
  updated_at?: string;
  questions: VoteQuestion[];
  votes_summary?: VoteSummary;
  member_votes?: MemberVote[];
  attachments?: VoteAttachment[];
}

export interface VoteQuestion {
  id: string;
  vote_id: string;
  title: string;
  description?: string;
  options: VoteOption[];
  order: number;
}

export interface VoteOption {
  id: string;
  question_id: string;
  title: string;
  description?: string;
  order: number;
}

export interface VoteSummary {
  total_voters: number;
  total_votes: number;
  quorum_reached: boolean;
  quorum_percentage: number;
  questions: VoteQuestionSummary[];
}

export interface VoteQuestionSummary {
  question_id: string;
  total_votes: number;
  options: VoteOptionSummary[];
  majority_reached: boolean;
  winning_option_id?: string;
}

export interface VoteOptionSummary {
  option_id: string;
  votes: number;
  percentage: number;
}

export interface MemberVote {
  id: string;
  member_id: string;
  vote_id: string;
  question_id: string;
  option_id: string;
  created_at: string;
  note?: string;
  attachments?: VoteAttachment[];
}

export interface VoteAttachment {
  id: string;
  vote_id: string;
  member_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export interface VoteFormData {
  title: string;
  description: string;
  buildingId: string;
  type: VoteType;
  startDate: string;
  endDate: string;
  quorumType: QuorumType;
  quorumValue: number;
  majorityType: MajorityType;
  majorityValue: number;
  questions: VoteQuestionFormData[];
}

export interface VoteQuestionFormData {
  title: string;
  description?: string;
  options: VoteOptionFormData[];
  order: number;
}

export interface VoteOptionFormData {
  title: string;
  description?: string;
  order: number;
}

export interface VoteFilters {
  buildingId?: string;
  status?: VoteStatus;
  type?: VoteType;
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
}

export type VoteStatus = 'draft' | 'scheduled' | 'active' | 'completed' | 'cancelled';
export type VoteType = 'standard' | 'per_unit' | 'per_ownership';
export type QuorumType = 'none' | 'percentage' | 'absolute';
export type MajorityType = 'simple' | 'absolute' | 'percentage';

export const VoteStatusLabels: Record<VoteStatus, string> = {
  draft: 'Koncept',
  scheduled: 'Naplánováno',
  active: 'Probíhá',
  completed: 'Dokončeno',
  cancelled: 'Zrušeno',
};

export const VoteTypeLabels: Record<VoteType, string> = {
  standard: 'Standardní (1 hlas / člen)',
  per_unit: 'Podle jednotek',
  per_ownership: 'Podle podílu vlastnictví',
};

export const QuorumTypeLabels: Record<QuorumType, string> = {
  none: 'Bez kvóra',
  percentage: 'Procento účasti',
  absolute: 'Absolutní počet',
};

export const MajorityTypeLabels: Record<MajorityType, string> = {
  simple: 'Prostá většina',
  absolute: 'Absolutní většina',
  percentage: 'Procentuální většina',
};
