import { gql } from '@apollo/client';

export const ADD_OBSERVER = gql`
  mutation AddObserver($voteId: uuid!, $email: String!, $role: String!) {
    insert_observers_one(object: {
      vote_id: $voteId,
      email: $email,
      role: $role
    }) {
      id
      email
      role
      status
      created_at
    }
  }
`;

export const UPDATE_OBSERVER = gql`
  mutation UpdateObserver($id: uuid!, $role: String!) {
    update_observers_by_pk(
      pk_columns: { id: $id }
      _set: { role: $role }
    ) {
      id
      role
      status
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

export const RESEND_INVITATION = gql`
  mutation ResendInvitation($id: uuid!) {
    resend_observer_invitation(id: $id) {
      id
      status
    }
  }
`;
