import { gql } from '@apollo/client';

// This file is for the VOTES LIST feature.
// For vote details, see queries.ts and mutations.ts.

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

// Fragments
export const VOTE_LIST_ITEM_FIELDS = gql`
  fragment VoteListItemFields on votes {
    id
    title
    description
    status
    start_date
    end_date
    created_at
  vote_statistics # JSONB pole ve schématu - lze z něj číst agregace, pokud je trigger naplní
  }
`;

// Queries
export const GET_VOTES = gql`
  query GetVotes($buildingId: uuid!) {
    votes(where: { building_id: { _eq: $buildingId } }, order_by: { created_at: desc }) {
      ...VoteListItemFields
    }
    members_aggregate(where: { building_id: { _eq: $buildingId } }) {
      aggregate {
        count
      }
    }
  }
  ${VOTE_LIST_ITEM_FIELDS}
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
