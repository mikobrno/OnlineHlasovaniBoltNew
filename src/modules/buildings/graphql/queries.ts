// src/modules/buildings/graphql/queries.ts
import { gql } from '@apollo/client';

export const GET_BUILDINGS = gql`
  query GetBuildings {
    buildings {
      id
      name
      address
      total_units
      variables
    }
  }
`;

export const GET_BUILDING = gql`
  query GetBuilding($id: uuid!) {
    building: buildings_by_pk(id: $id) {
      id
      name
      address
      total_units
      variables
    }
  }
`;

export const GET_BUILDING_VARIABLES = gql`
  query GetBuildingVariables {
    building_variables {
      name
      description
      type
      required
      placeholder
      options
    }
  }
`;
