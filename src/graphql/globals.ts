import { gql } from '@apollo/client';

// Fragments
export const GLOBAL_VARIABLE_FIELDS = gql`
  fragment GlobalVariableFields on global_variables {
    name
    description
    value
    is_editable
    created_at
    updated_at
  }
`;

// Queries
export const GET_GLOBAL_VARIABLES = gql`
  query GetGlobalVariables {
    global_variables {
      ...GlobalVariableFields
    }
  }
  ${GLOBAL_VARIABLE_FIELDS}
`;

// Mutations
export const UPDATE_GLOBAL_VARIABLE = gql`
  mutation UpdateGlobalVariable($name: String!, $value: String!) {
    update_global_variables_by_pk(pk_columns: { name: $name }, _set: { value: $value }) {
      ...GlobalVariableFields
    }
  }
  ${GLOBAL_VARIABLE_FIELDS}
`;

// Types
export interface GlobalVariable {
  name: string;
  description: string;
  value: string;
  is_editable: boolean;
  created_at: string;
  updated_at: string;
}

export interface GlobalVariableInput {
  name: string;
  description: string;
  value: string;
  is_editable?: boolean;
}
