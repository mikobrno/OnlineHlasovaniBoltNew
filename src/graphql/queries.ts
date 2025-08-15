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

export const GET_VOTE_DETAILS = gql`
  query GetVoteDetails($voteId: uuid!, $buildingId: uuid!) {
    votes_by_pk(id: $voteId) {
      id
      title
      description
      start_date
      end_date
      status
      created_at
      building_id
      questions {
        id
        text
        description
        quorum_type
        custom_quorum_numerator
        custom_quorum_denominator
      }
      observers
    }
    member_votes_rows: member_votes(where: {vote_id: {_eq: $voteId}}) {
      member_id
      question_id
      answer
    }
    members(where: {building_id: {_eq: $buildingId}}) {
      id
      name
      email
      phone
      unit
      vote_weight
      representative_id
    }
  }
`;

export const GET_BUILDINGS_FOR_TEMPLATES = gql`
  query GetBuildingsForTemplates {
    buildings {
      id
      name
    }
  }
`;

export const GET_DATA_FOR_INVITATION_MODAL = gql`
  query GetDataForInvitationModal($buildingId: uuid!) {
    building: buildings_by_pk(id: $buildingId) {
      id
      name
      address
      members(order_by: { name: asc }) {
        id
        name
        email
        share
        is_owner
      }
    }
    email_templates(
      where: { _or: [{ building_id: { _eq: $buildingId } }, { is_global: { _eq: true } }] }
      order_by: { name: asc }
    ) {
      id
      name
      subject
      body
      is_global
    }
    global_variables {
      name
      value
      description
      is_editable
    }
  }
`;

export const GET_MEMBERS_BY_BUILDING_ID = gql`
  query GetMembersByBuildingId($buildingId: uuid!) {
    members(where: {building_id: {_eq: $buildingId}}) {
      id
      name
      email
      phone
      unit
      vote_weight
      representative_id
    }
  }
`;

export const GET_OBSERVERS_BY_BUILDING_ID = gql`
  query GetObserversByBuildingId($buildingId: uuid!) {
    observers(where: {building_id: {_eq: $buildingId}}) {
      id
      name
      email
    }
  }
`;
