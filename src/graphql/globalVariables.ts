import { gql } from '@apollo/client';

export const GLOBAL_VARIABLE_FIELDS = gql`
  fragment GlobalVariableFields on global_variables {
    id
    name
    value
    description
  }
`;

export const GET_GLOBAL_VARIABLES = gql`
  query GetGlobalVariables {
    global_variables(order_by: { name: asc }) {
      ...GlobalVariableFields
    }
  }
  ${GLOBAL_VARIABLE_FIELDS}
`;

export const ADD_GLOBAL_VARIABLE = gql`
  mutation AddGlobalVariable($variable: global_variables_insert_input!) {
    insert_global_variables_one(object: $variable) {
      ...GlobalVariableFields
    }
  }
  ${GLOBAL_VARIABLE_FIELDS}
`;

export const UPDATE_GLOBAL_VARIABLE = gql`
  mutation UpdateGlobalVariable($id: uuid!, $variable: global_variables_set_input!) {
    update_global_variables_by_pk(pk_columns: { id: $id }, _set: $variable) {
      ...GlobalVariableFields
    }
  }
  ${GLOBAL_VARIABLE_FIELDS}
`;

export const DELETE_GLOBAL_VARIABLE = gql`
  mutation DeleteGlobalVariable($id: uuid!) {
    delete_global_variables_by_pk(id: $id) {
      id
    }
  }
`;

export interface GlobalVariable {
  id: string;
  name: string;
  value: string;
  description?: string;
}
