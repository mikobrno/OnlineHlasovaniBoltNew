import { gql } from '@apollo/client';

export const BUILDING_VARIABLE_FIELDS = gql`
  fragment BuildingVariableFields on building_variables {
    id
    name
    description
    type
    required
    placeholder
    options
    created_at
    updated_at
  }
`;

export const GET_BUILDING_VARIABLES = gql`
  query GetBuildingVariables {
    building_variables(order_by: { description: asc }) {
      ...BuildingVariableFields
    }
  }
  ${BUILDING_VARIABLE_FIELDS}
`;

export const ADD_BUILDING_VARIABLE = gql`
  mutation AddBuildingVariable($variable: building_variables_insert_input!) {
    insert_building_variables_one(object: $variable) {
      ...BuildingVariableFields
    }
  }
  ${BUILDING_VARIABLE_FIELDS}
`;

export const UPDATE_BUILDING_VARIABLE = gql`
  mutation UpdateBuildingVariable($id: uuid!, $variable: building_variables_set_input!) {
    update_building_variables_by_pk(pk_columns: { id: $id }, _set: $variable) {
      ...BuildingVariableFields
    }
  }
  ${BUILDING_VARIABLE_FIELDS}
`;

export const DELETE_BUILDING_VARIABLE = gql`
  mutation DeleteBuildingVariable($id: uuid!) {
    delete_building_variables_by_pk(id: $id) {
      id
    }
  }
`;
