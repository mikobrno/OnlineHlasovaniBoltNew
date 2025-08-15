import { gql } from '@apollo/client';

// Definice TypeScript interfacu pro člena, odpovídá struktuře v databázi
export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  unit: string;
  vote_weight: number;
  building_id: string;
  representative_id?: string | null;
  created_at: string;
  updated_at: string;
}

// GraphQL dotaz pro načtení všech členů pro danou budovu
export const GET_MEMBERS = gql`
  query GetMembers($buildingId: uuid!) {
    members(where: { building_id: { _eq: $buildingId } }, order_by: { name: asc }) {
      id
      name
      email
      phone
      unit
      vote_weight
      representative_id
      created_at
      updated_at
    }
  }
`;

// GraphQL mutace pro přidání nového člena
export const ADD_MEMBER = gql`
  mutation AddMember($member: members_insert_input!) {
    insert_members_one(object: $member) {
      id
    }
  }
`;

// GraphQL mutace pro aktualizaci existujícího člena
export const UPDATE_MEMBER = gql`
  mutation UpdateMember($id: uuid!, $changes: members_set_input!) {
    update_members_by_pk(pk_columns: { id: $id }, _set: $changes) {
      id
    }
  }
`;

// GraphQL mutace pro smazání člena
export const DELETE_MEMBER = gql`
  mutation DeleteMember($id: uuid!) {
    delete_members_by_pk(id: $id) {
      id
    }
  }
`;
