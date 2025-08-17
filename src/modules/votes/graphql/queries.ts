// src/modules/votes/graphql/queries.ts
import { gql } from '@apollo/client';

export const GET_VOTES = gql`
  query GetVotes($buildingId: uuid!) {
    votes(where: { building_id: { _eq: $buildingId } }, order_by: { created_at: desc }) {
      id
      title
      status
      start_date
      end_date
      created_at
      vote_statistics {
        total_votes
        total_weight
      }
    }
  }
`;

export const GET_VOTE_DETAILS = gql`
  query GetVoteDetails($voteId: uuid!) {
    vote: votes_by_pk(id: $voteId) {
      id
      title
      description
      status
      created_at
      start_date
      end_date
  building_id
  # questions is stored as a JSON/jsonb scalar in the DB. Do not request subfields here
      # or GraphQL will raise "unexpected subselection". The component will read the
      # parsed JSON value at runtime (an array of question objects).
      questions
      manual_vote_attachments {
        id
        attachment_name
        created_at
        member {
          name
          unit
        }
      }
      member_votes {
        id
        member_id
        vote_choice
        note
        created_at
        attachments {
          id
          attachment_name
          created_at
        }
      }
      vote_statistics {
        total_votes
        total_weight
        yes_votes
        no_votes
        abstain_votes
        yes_weight
        no_weight
        abstain_weight
      }
    }
  }
`;
