// src/modules/buildings/graphql/mutations.ts
import { gql } from '@apollo/client';

export const CREATE_BUILDING = gql`
  mutation CreateBuilding($name: String!, $address: String!, $total_units: Int!, $variables: jsonb!) {
    insert_buildings_one(object: {
      name: $name,
      address: $address,
      total_units: $total_units,
      variables: $variables
    }) {
      id
      name
      address
      total_units
      variables
    }
  }
`;

export const UPDATE_BUILDING = gql`
  mutation UpdateBuilding($id: uuid!, $name: String!, $address: String!, $total_units: Int!, $variables: jsonb!) {
    update_buildings_by_pk(
      pk_columns: { id: $id },
      _set: {
        name: $name,
        address: $address,
        total_units: $total_units,
        variables: $variables
      }
    ) {
      id
      name
      address
      total_units
      variables
    }
  }
`;

export const DELETE_BUILDING = gql`
  mutation DeleteBuilding($id: uuid!) {
    delete_buildings_by_pk(id: $id) {
      id
    }
  }
`;
