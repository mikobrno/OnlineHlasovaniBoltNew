import { gql } from '@apollo/client';

// ...existing code...

export const ADD_MANUAL_VOTE = gql`
  mutation AddManualVote($vote_id: uuid!, $member_id: uuid!, $answer: String!) {
    insert_member_votes_one(object: {
      vote_id: $vote_id,
      member_id: $member_id,
      answer: $answer
    }, on_conflict: {
      constraint: member_votes_pkey,
      update_columns: [answer]
    }) {
      id
    }
  }
`;

export const SET_VOTE_REPRESENTATIVE = gql`
  mutation SetVoteRepresentative($vote_id: uuid!, $representative_id: uuid) {
    update_members_by_pk(pk_columns: {id: $vote_id}, _set: {representative_id: $representative_id}) {
      id
      representative_id
    }
  }
`;

export const START_VOTE = gql`
  mutation StartVote($id: uuid!) {
    update_votes_by_pk(pk_columns: {id: $id}, _set: {status: "active"}) {
      id
      status
    }
  }
`;

export const ADD_OBSERVER_TO_VOTE = gql`
  mutation AddObserverToVote($vote_id: uuid!, $observers: [String!]!) {
    update_votes_by_pk(
      pk_columns: {id: $vote_id},
      _set: {observers: $observers}
    ) {
      id
      observers
    }
  }
`;

export const REMOVE_OBSERVER_FROM_VOTE = gql`
  mutation RemoveObserverFromVote($vote_id: uuid!, $observers: [String!]!) {
    update_votes_by_pk(
      pk_columns: {id: $vote_id},
      _set: {observers: $observers}
    ) {
      id
      observers
    }
  }
`;

export const CREATE_OBSERVER = gql`
  mutation CreateObserver($name: String!, $email: String!, $building_id: uuid!) {
    insert_observers_one(object: {name: $name, email: $email, building_id: $building_id}) {
      id
      name
      email
    }
  }
`;

export const DELETE_OBSERVER = gql`
    mutation DeleteObserver($id: uuid!) {
        delete_observers_by_pk(id: $id) {
            id
        }
    }
`;