import { gql } from '@apollo/client';

// This file is for the VOTES LIST feature.
// For vote details, see queries.ts and mutations.ts.

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
    member_votes_aggregate {
      aggregate {
        count
      }
    }
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
