import { gql } from '@apollo/client';

export const CREATE_MEMBER = gql`
  mutation CreateMember($input: members_insert_input!) {
    insert_members_one(object: $input) {
      id
      email
      phone
      first_name
      last_name
      building_id
      unit_number
      is_owner
      is_committee_member
      is_active
      created_at
      updated_at
    }
  }
`;

export const UPDATE_MEMBER = gql`
  mutation UpdateMember($id: uuid!, $input: members_set_input!) {
    update_members_by_pk(pk_columns: { id: $id }, _set: $input) {
      id
      email
      phone
      first_name
      last_name
      building_id
      unit_number
      is_owner
      is_committee_member
      is_active
      updated_at
    }
  }
`;

export const DELETE_MEMBER = gql`
  mutation DeleteMember($id: uuid!) {
    delete_members_by_pk(id: $id) {
      id
    }
  }
`;

export const DEACTIVATE_MEMBER = gql`
  mutation DeactivateMember($id: uuid!) {
    update_members_by_pk(
      pk_columns: { id: $id }
      _set: { is_active: false }
    ) {
      id
      is_active
      updated_at
    }
  }
`;

export const REACTIVATE_MEMBER = gql`
  mutation ReactivateMember($id: uuid!) {
    update_members_by_pk(
      pk_columns: { id: $id }
      _set: { is_active: true }
    ) {
      id
      is_active
      updated_at
    }
  }
`;
