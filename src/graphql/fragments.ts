import { gql } from '@apollo/client';

export const VOTE_FIELDS_BASIC = gql`
  fragment VoteFieldsBasic on votes {
    id
    title
    description
    status
    start_date
    end_date
    created_at
    buildings {
      id
      name
      address
    }
  }
`;
