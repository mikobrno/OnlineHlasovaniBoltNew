import { gql } from '@apollo/client';

export const GET_USER_BUILDINGS = gql`
  query GetUserBuildings {
    buildings {
      id
      name
      address
      total_units
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_BUILDING = gql`
  mutation CreateBuilding($input: BuildingInput!) {
    createBuilding(input: $input) {
      id
      name
      address
      total_units
    }
  }
`;

export const UPDATE_BUILDING = gql`
  mutation UpdateBuilding($id: ID!, $input: BuildingInput!) {
    updateBuilding(id: $id, input: $input) {
      id
      name
      address
      total_units
    }
  }
`;
