export interface Vote {
  id: string;
  title: string;
  description: string;
  building_id: string;
  status: VoteStatus;
  type: VoteType;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  quorum_type: QuorumType;
  quorum_value: number;
  approval_type: ApprovalType;
  approval_value: number;
  is_secret: boolean;
  attachments?: VoteAttachment[];
  members?: VoteMember[];
}

export interface VoteAttachment {
  id: string;
  vote_id: string;
  file_url: string;
  file_name: string;
  content_type: string;
  created_at: string;
}

export interface VoteMember {
  id: string;
  vote_id: string;
  member_id: string;
  vote_weight: number;
  vote_option?: VoteOption;
  vote_date?: string;
  comment?: string;
  member: Member;
}

export interface Member {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  unit_number: string;
  vote_weight: number;
}

export enum VoteStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED'
}

export enum VoteType {
  SIMPLE = 'SIMPLE',
  MULTI = 'MULTI',
  ELECTION = 'ELECTION'
}

export enum QuorumType {
  PERCENTAGE = 'PERCENTAGE',
  ABSOLUTE = 'ABSOLUTE'
}

export enum ApprovalType {
  PERCENTAGE = 'PERCENTAGE',
  ABSOLUTE = 'ABSOLUTE'
}

export enum VoteOption {
  FOR = 'FOR',
  AGAINST = 'AGAINST',
  ABSTAIN = 'ABSTAIN'
}
