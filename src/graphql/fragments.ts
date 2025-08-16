import { gql } from '@apollo/client';

export const VOTE_FIELDS = gql`
  fragment VoteFields on votes {
    id
    title
    description
    status
    start_date
    end_date
    created_at
    building_id
    manual_vote_attachments {
      id
      attachment_name
      member {
        id
        name
        unit
      }
      created_at
    }
    questions {
      id
      text
      quorum_type
      custom_quorum_numerator
      custom_quorum_denominator
    }
    observers
  }
`;
