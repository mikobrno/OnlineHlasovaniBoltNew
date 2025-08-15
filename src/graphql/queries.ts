import { gql } from '@apollo/client';

export const GET_BUILDINGS_QUERY = gql`
  query GetBuildings {
    buildings {
      id
      name
      address
      total_units
      created_at
      updated_at
    }
  }
`;
