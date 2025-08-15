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
  query GetGlobalVariables {
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
  mutation UpdateGlobalVariable($name: String!, $variable: global_variables_set_input!) {
    update_global_variables_by_pk(pk_columns: { name: $name }, _set: $variable) {
      ...GlobalVariableFieldsV2
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
