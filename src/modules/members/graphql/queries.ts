import { gql } from '@apollo/client';

export const GET_MEMBERS = gql`
  query GetMembers(
    $buildingId: uuid
    $isActive: Boolean
    $isOwner: Boolean
    $isCommitteeMember: Boolean
    $searchQuery: String
  ) {
    members(
      where: {
        _and: [
          { building_id: { _eq: $buildingId } }
          { is_active: { _eq: $isActive } }
          { is_owner: { _eq: $isOwner } }
          { is_committee_member: { _eq: $isCommitteeMember } }
          {
            _or: [
              { first_name: { _ilike: $searchQuery } }
              { last_name: { _ilike: $searchQuery } }
              { email: { _ilike: $searchQuery } }
              { unit_number: { _ilike: $searchQuery } }
            ]
          }
        ]
      }
      order_by: [
        { last_name: asc }
        { first_name: asc }
      ]
    ) {
      id
      email
      phone
      first_name
      last_name
      building_id
      unit_number
      is_owner
      is_committee_member
      is_active
      created_at
      updated_at
    }
  }
`;

export const GET_MEMBER = gql`
  query GetMember($id: uuid!) {
    members_by_pk(id: $id) {
      id
      email
      phone
      first_name
      last_name
      building_id
      unit_number
      is_owner
      is_committee_member
      is_active
      created_at
      updated_at
    }
  }
`;
