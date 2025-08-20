import { gql } from '@apollo/client';

export const GET_VOTES = gql`
  query GetVotes($buildingId: ID!) {
    votes(where: { building_id: { _eq: $buildingId } }) {
      id
      title
      description
      status
      type
      start_date
      end_date
      created_at
      updated_at
      quorum_type
      quorum_value
      approval_type
      approval_value
      is_secret
      _vote_members_aggregate {
        aggregate {
          count
          sum {
            vote_weight
          }
        }
      }
      _vote_members_voted_aggregate: _vote_members_aggregate(where: { vote_date: { _is_null: false } }) {
        aggregate {
          count
          sum {
            vote_weight
          }
        }
      }
    }
  }
`;

export const GET_VOTE_DETAIL = gql`
  query GetVoteDetail($voteId: ID!) {
    vote(id: $voteId) {
      id
      title
      description
      status
      type
      start_date
      end_date
      created_at
      updated_at
      quorum_type
      quorum_value
      approval_type
      approval_value
      is_secret
      attachments {
        id
        file_url
        file_name
        content_type
        created_at
      }
      members {
        id
        member_id
        vote_weight
        vote_option
        vote_date
        comment
        member {
          id
          name
          email
          phone
          unit_number
          vote_weight
        }
      }
    }
  }
`;
