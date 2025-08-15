import { gql } from '@apollo/client';

// Fragmenty
export const VOTE_FIELDS = gql`
  fragment VoteFields on votes {
    id
    title
    description
    status
    start_date
    end_date
    questions
    member_votes
    observers
    created_at
    updated_at
  }
`;

// Queries
export const GET_VOTES = gql`
  query GetVotes($buildingId: uuid!) {
    votes(where: { building_id: { _eq: $buildingId } }, order_by: { created_at: desc }) {
      ...VoteFields
    }
    # Přidáváme počet členů pro progress bar
    members_aggregate(where: { building_id: { _eq: $buildingId } }) {
      aggregate {
        count
      }
    }
  }
  ${VOTE_FIELDS}
`;

export const GET_VOTE = gql`
  query GetVote($id: uuid!) {
    votes_by_pk(id: $id) {
      ...VoteFields
      building {
        id
        name
      }
    }
  }
  ${VOTE_FIELDS}
`;

// Mutations
export const ADD_VOTE = gql`
  mutation AddVote($vote: votes_insert_input!) {
    insert_votes_one(object: $vote) {
      ...VoteFields
    }
  }
  ${VOTE_FIELDS}
`;

export const UPDATE_VOTE = gql`
  mutation UpdateVote($id: uuid!, $vote: votes_set_input!) {
    update_votes_by_pk(pk_columns: { id: $id }, _set: $vote) {
      ...VoteFields
    }
  }
  ${VOTE_FIELDS}
`;

export const START_VOTE = gql`
  mutation StartVote($id: uuid!) {
    update_votes_by_pk(
      pk_columns: { id: $id }
      _set: { 
        status: "active",
        start_date: "now()"
      }
    ) {
      ...VoteFields
    }
  }
  ${VOTE_FIELDS}
`;

export const CANCEL_VOTE = gql`
  mutation CancelVote($id: uuid!) {
    update_votes_by_pk(
      pk_columns: { id: $id }
      _set: { 
        status: "cancelled",
        end_date: "now()"
      }
    ) {
      ...VoteFields
    }
  }
  ${VOTE_FIELDS}
`;

export const DELETE_VOTE = gql`
  mutation DeleteVote($id: uuid!) {
    delete_votes_by_pk(id: $id) {
      id
    }
  }
`;

// Typy pro hlasování
export interface Question {
  id: string;
  text: string;
  quorumType: 'simple' | 'qualified' | 'unanimous' | 'custom';
  customQuorum?: {
    numerator: number;
    denominator: number;
  };
}

export interface VoteMemberVote {
  vote: 'for' | 'against' | 'abstain';
  votedAt: string;
  representative?: string; // ID zástupce, který hlasoval
}

// Typy pro hlasování
export interface VoteQuestionAnswer {
  vote: 'yes' | 'no' | 'abstain';
  votedAt: string;
  representative_id?: string;
}

export interface Vote {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  questions: Question[];
  member_votes: Record<string, Record<string, VoteQuestionAnswer>>;
  observers: string[];
  created_at: string;
  updated_at: string;
  building?: {
    id: string;
    name: string;
  };
}

export interface VoteInput {
  building_id: string;
  title: string;
  description: string;
  status?: 'draft' | 'active' | 'completed' | 'cancelled';
  start_date?: string;
  end_date?: string;
  questions: Question[];
  member_votes?: Record<string, VoteMemberVote>;
  observers?: string[];
}
