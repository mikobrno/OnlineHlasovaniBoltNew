import { gql } from '@apollo/client';

// ...existing code...

export const ADD_MANUAL_VOTE = gql`
  mutation AddManualVote($vote_id: uuid!, $member_id: uuid!, $answers: jsonb!, $note: String, $attachments: jsonb) {
    insert_member_votes_one(object: {
      vote_id: $vote_id,
      member_id: $member_id,
      answers: $answers,
      note: $note,
      attachments: $attachments,
      is_manual: true
    }, on_conflict: {
      constraint: member_votes_pkey,
      update_columns: [answers, note, attachments, is_manual]
    }) {
      id
    }
  }
`;

export const SET_VOTE_REPRESENTATIVE = gql`
  mutation SetVoteRepresentative($vote_id: uuid!, $member_id: uuid!, $representative_id: uuid) {
    insert_vote_member_representatives_one(object: {
      vote_id: $vote_id,
      member_id: $member_id,
      representative_id: $representative_id
    }, on_conflict: {
      constraint: vote_member_representatives_vote_id_member_id_key,
      update_columns: [representative_id]
    }) {
      id
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
  mutation AddObserverToVote($vote_id: uuid!, $observer_id: uuid!) {
    insert_vote_observers_one(object: {vote_id: $vote_id, observer_id: $observer_id}) {
      vote_id
      observer_id
    }
  }
`;

export const REMOVE_OBSERVER_FROM_VOTE = gql`
  mutation RemoveObserverFromVote($vote_id: uuid!, $observer_id: uuid!) {
    delete_vote_observers_by_pk(vote_id: $vote_id, observer_id: $observer_id) {
      vote_id
      observer_id
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

export const SEND_OBSERVER_INVITATION = gql`
  mutation SendObserverInvitation($vote_id: uuid!, $observer_id: uuid!, $resend: Boolean) {
    sendObserverInvitation(vote_id: $vote_id, observer_id: $observer_id, resend: $resend) {
      success
      message
    }
  }
`;