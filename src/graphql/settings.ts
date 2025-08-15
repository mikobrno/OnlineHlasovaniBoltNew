import { gql } from '@apollo/client';

export const GET_SETTINGS = gql`
  query GetSettings {
    settings {
      key
      value
    }
  }
`;

// Náhradní řešení pro případ, že tabulka settings neexistuje
export const GET_DEFAULT_SETTINGS = gql`
  query GetDefaultSettings {
    app_settings {
      id
    }
  }
`;

export const UPDATE_SETTINGS = gql`
  mutation UpdateSettings($key: String!, $value: jsonb!) {
    update_settings_by_pk(pk_columns: { key: $key }, _set: { value: $value, updated_at: "now()" }) {
      key
      value
    }
  }
`;
