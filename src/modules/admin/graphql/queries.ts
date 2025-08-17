import { gql } from '@apollo/client';

export const GET_SYSTEM_SETTINGS = gql`
  query GetSystemSettings {
    settings(order_by: { category: asc, key: asc }) {
      id
      key
      value
      description
      category
      is_public
      created_at
      updated_at
    }
  }
`;

export const GET_SYSTEM_SETTING = gql`
  query GetSystemSetting($id: uuid!) {
    settings_by_pk(id: $id) {
      id
      key
      value
      description
      category
      is_public
      created_at
      updated_at
    }
  }
`;

export const GET_AUDIT_LOG = gql`
  query GetAuditLog(
    $tableName: String
    $action: String
    $userId: uuid
    $startDate: timestamptz
    $endDate: timestamptz
    $searchQuery: String
    $limit: Int
    $offset: Int
  ) {
    audit_log(
      where: {
        _and: [
          { table_name: { _eq: $tableName } }
          { action: { _eq: $action } }
          { user_id: { _eq: $userId } }
          { created_at: { _gte: $startDate } }
          { created_at: { _lte: $endDate } }
          {
            _or: [
              { table_name: { _ilike: $searchQuery } }
              { record_id: { _ilike: $searchQuery } }
              { old_data: { _cast: { String: { _ilike: $searchQuery } } } }
              { new_data: { _cast: { String: { _ilike: $searchQuery } } } }
            ]
          }
        ]
      }
      order_by: { created_at: desc }
      limit: $limit
      offset: $offset
    ) {
      id
      table_name
      record_id
      action
      old_data
      new_data
      user_id
      created_at
    }
    audit_log_aggregate(
      where: {
        _and: [
          { table_name: { _eq: $tableName } }
          { action: { _eq: $action } }
          { user_id: { _eq: $userId } }
          { created_at: { _gte: $startDate } }
          { created_at: { _lte: $endDate } }
        ]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

export const GET_SYSTEM_STATS = gql`
  query GetSystemStats {
    buildings_aggregate {
      aggregate {
        count
      }
    }
    buildings_aggregate(where: { is_active: { _eq: true } }) {
      aggregate {
        count
      }
    }
    members_aggregate {
      aggregate {
        count
      }
    }
    members_aggregate(where: { is_active: { _eq: true } }) {
      aggregate {
        count
      }
    }
    members_aggregate(where: { is_owner: { _eq: true } }) {
      aggregate {
        count
      }
    }
    members_aggregate(where: { is_committee_member: { _eq: true } }) {
      aggregate {
        count
      }
    }
    votes_aggregate {
      aggregate {
        count
      }
    }
    votes_aggregate(where: { status: { _eq: "active" } }) {
      aggregate {
        count
      }
    }
    votes_aggregate(where: { status: { _eq: "completed" } }) {
      aggregate {
        count
      }
    }
  }
`;
