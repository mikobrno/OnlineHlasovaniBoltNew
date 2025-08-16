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
    questions {
      id
      text
      type
      options
      required
      order
    }
    observers
    manual_vote_attachments {
      id
      attachment_name
      created_at
      member {
        id
        name
        unit
      }
    }
  }
`;
