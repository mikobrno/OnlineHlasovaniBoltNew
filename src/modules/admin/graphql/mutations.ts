import { gql } from '@apollo/client';

export const UPDATE_SYSTEM_SETTING = gql`
  mutation UpdateSystemSetting($id: uuid!, $input: settings_set_input!) {
    update_settings_by_pk(pk_columns: { id: $id }, _set: $input) {
      id
      key
      value
      description
      category
      is_public
      updated_at
    }
  }
`;

export const CREATE_SYSTEM_SETTING = gql`
  mutation CreateSystemSetting($input: settings_insert_input!) {
    insert_settings_one(object: $input) {
      id
      key
      value
      description
      category
      is_public
      created_at
      updated_at
    }
  }
`;

export const DELETE_SYSTEM_SETTING = gql`
  mutation DeleteSystemSetting($id: uuid!) {
    delete_settings_by_pk(id: $id) {
      id
    }
  }
`;
