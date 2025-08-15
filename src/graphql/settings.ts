import { gql } from '@apollo/client';

export const GET_SETTINGS = gql`
  query GetSettings {
    settings {
      key
      value
    }
  }
`;

export const UPDATE_SETTINGS = gql`
  mutation UpdateSettings($key: String!, $value: jsonb!) {
    update_settings_by_pk(pk_columns: { key: $key }, _set: { value: $value }) {
      key
      value
    }
  }
`;
