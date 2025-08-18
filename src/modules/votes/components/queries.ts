import { gql } from '@apollo/client';

export const GET_VOTES_QUERY = gql`
  query GetVotes($buildingId: uuid!) {
    votes(where: { building_id: { _eq: $buildingId } }, order_by: { created_at: desc }) {
      id
      title
      status
      created_at
      start_date
      end_date
    }
  }
`;
