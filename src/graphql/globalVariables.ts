import { gql } from '@apollo/client';

export const GLOBAL_VARIABLE_FIELDS = gql`
  fragment GlobalVariableFieldsV2 on global_variables {
    name
    value
    description
    is_editable
    created_at
    updated_at
  }
`;

export const GET_GLOBAL_VARIABLES = gql`
  query GetGlobalVariablesV2 {
    global_variables(order_by: { name: asc }) {
      ...GlobalVariableFieldsV2
    }
  }
  ${GLOBAL_VARIABLE_FIELDS}
`;

// Nový název dotazu dle požadavku uživatele (aby komponenta SettingsView byla nezávislá)
export const GET_GLOBAL_VARIABLES_QUERY = gql`
  query GetAllGlobalVariables {
    global_variables(order_by: { name: asc }) {
      ...GlobalVariableFieldsV2
    }
  }
  ${GLOBAL_VARIABLE_FIELDS}
`;

export const ADD_GLOBAL_VARIABLE = gql`
  mutation AddGlobalVariable($variable: global_variables_insert_input!) {
    insert_global_variables_one(object: $variable) {
      ...GlobalVariableFieldsV2
    }
  }
  ${GLOBAL_VARIABLE_FIELDS}
`;

export const UPDATE_GLOBAL_VARIABLE = gql`
  mutation UpdateGlobalVariableV2($name: String!, $variable: global_variables_set_input!) {
    update_global_variables_by_pk(pk_columns: { name: $name }, _set: $variable) {
      ...GlobalVariableFieldsV2
    }
  }
  ${GLOBAL_VARIABLE_FIELDS}
`;

// Bulk update / upsert více proměnných najednou
// Využíváme insert ... on_conflict (Hasura) – pokud proměnná existuje, update pouze value
export const UPDATE_GLOBAL_VARIABLES_MUTATION = gql`
  mutation UpdateGlobalVariables($updates: [global_variables_insert_input!]!) {
    insert_global_variables(
      objects: $updates,
      on_conflict: { constraint: global_variables_pkey, update_columns: [value] }
    ) {
      affected_rows
      returning {
        ...GlobalVariableFieldsV2
      }
    }
  }
  ${GLOBAL_VARIABLE_FIELDS}
`;

export const DELETE_GLOBAL_VARIABLE = gql`
  mutation DeleteGlobalVariable($name: String!) {
    delete_global_variables_by_pk(name: $name) {
      name
    }
  }
`;

export interface GlobalVariable {
  name: string;
  value: string;
  description?: string;
  is_editable?: boolean;
  created_at?: string;
  updated_at?: string;
}
