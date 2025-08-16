import { gql } from '@apollo/client';

export const GET_SETTINGS = gql`
  query GetSettings {
    settings {
      key
      value
      updated_at
    }
  }
`;

export const CREATE_SETTINGS = gql`
  mutation CreateSettings($key: String!, $value: jsonb!) {
    insert_settings_one(object: { key: $key, value: $value, updated_at: "now()" }) {
      key
      value
      updated_at
    }
  }
`;

export const UPDATE_SETTINGS = gql`
  mutation UpdateSettings($key: String!, $value: jsonb!) {
    update_settings_by_pk(pk_columns: { key: $key }, _set: { value: $value, updated_at: "now()" }) {
      key
      value
      updated_at
    }
  }
`;
