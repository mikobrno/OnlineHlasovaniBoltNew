import { gql } from '@apollo/client';
import { VOTE_FIELDS } from './fragments';

// Local TypeScript helper types for inserts (not generated)
export interface QuestionInput {
  text: string;
  quorum_type?: 'simple' | 'qualified' | 'unanimous' | 'custom';
  custom_quorum_numerator?: number;
  custom_quorum_denominator?: number;
}

export interface VoteInput {
  building_id: string;
  title: string;
  description: string;
  status?: 'draft' | 'active' | 'completed' | 'cancelled' | 'archived';
  start_date?: string;
  end_date?: string;
  observers?: string[];
  // Hasura nested insert wrapper
  questions?: { data: QuestionInput[] };
}

// Queries
export const GET_VOTES = gql`
  query GetVotes($buildingId: uuid!) {
    votes(
      where: { building_id: { _eq: $buildingId } }
      order_by: { created_at: desc }
    ) {
      id
      title
      description
      status
      start_date
      end_date
      created_at
      building_id
    }
    members_aggregate(where: { building_id: { _eq: $buildingId } }) {
      aggregate {
        count
      }
    }
  }
`;

// Mutations
export const ADD_VOTE = gql`
  mutation AddVote($vote: votes_insert_input!) {
    insert_votes_one(object: $vote) {
      id
    }
  }
`;

export const UPDATE_VOTE = gql`
  mutation UpdateVote($id: uuid!, $vote: votes_set_input!) {
    update_votes_by_pk(pk_columns: { id: $id }, _set: $vote) {
  id
  title
  description
  status
  start_date
  end_date
  building_id
  questions { id text quorum_type custom_quorum_numerator custom_quorum_denominator }
    }
  }
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
      id
    }
  }
`;

export const DELETE_VOTE = gql`
  mutation DeleteVote($id: uuid!) {
    delete_votes_by_pk(id: $id) {
      id
    }
  }
`;
