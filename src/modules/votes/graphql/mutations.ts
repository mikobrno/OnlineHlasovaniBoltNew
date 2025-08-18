// src/modules/votes/graphql/mutations.ts
import { gql } from '@apollo/client';

export const CREATE_VOTE = gql`
  mutation CreateVote($input: votes_insert_input!) {
    insert_votes_one(object: $input) {
      id
      title
      status
      created_at
    }
  }
`;

export const UPDATE_VOTE = gql`
  mutation UpdateVote($id: uuid!, $updates: votes_set_input!) {
    update_votes_by_pk(pk_columns: { id: $id }, _set: $updates) {
      id
      title
      status
      updated_at
    }
  }
`;

export const DELETE_VOTE = gql`
  mutation DeleteVote($id: uuid!) {
    delete_votes_by_pk(id: $id) {
      id
      title
    }
  }
`;

export const CAST_VOTE = gql`
  mutation CastVote($voteId: uuid!, $memberId: uuid!, $voteChoice: String!, $note: String) {
    insert_member_votes_one(
      object: { 
        vote_id: $voteId, 
        member_id: $memberId, 
        vote_choice: $voteChoice, 
        note: $note 
      },
      on_conflict: {
        constraint: member_votes_vote_id_member_id_key,
        update_columns: [vote_choice, note, updated_at]
      }
    ) {
      id
      vote_choice
      note
      created_at
      updated_at
    }
  }
`;
