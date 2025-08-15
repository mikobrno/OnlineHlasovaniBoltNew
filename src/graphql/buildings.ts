import { gql } from '@apollo/client';

// TypeScript interface pro Budovu, odpovídá schématu v databázi
export interface Building {
  id: string;
  name: string;
  address: string;
  created_at: string;
  updated_at: string;
  total_units?: number | null;
  variables?: Record<string, unknown> | null;
  // Zde mohou být v budoucnu další pole, např. vztahy
}

// GraphQL dotaz pro načtení všech budov (předpokládá se, že RLS na straně Hasury omezí na budovy daného uživatele)
export const GET_BUILDINGS = gql`
  query GetBuildings {
    buildings(order_by: { name: asc }) {
      id
      name
      address
      created_at
      updated_at
    }
  }
`;

// GraphQL mutace pro přidání nové budovy
export const CREATE_BUILDING = gql`
  mutation CreateBuilding($name: String!, $address: String!, $total_units: Int!, $variables: jsonb) {
    insert_buildings_one(object: {
      name: $name,
      address: $address,
      total_units: $total_units,
      variables: $variables
    }) {
      id
      name
      address
      total_units
      variables
    }
  }
`;

// GraphQL mutace pro aktualizaci existující budovy
export const UPDATE_BUILDING = gql`
  mutation UpdateBuilding($id: uuid!, $name: String!, $address: String!, $total_units: Int!, $variables: jsonb) {
    update_buildings_by_pk(
      pk_columns: { id: $id },
      _set: {
        name: $name,
        address: $address,
        total_units: $total_units,
        variables: $variables
      }
    ) {
      id
      name
      address
      total_units
      variables
    }
  }
`;

// GraphQL mutace pro smazání budovy
export const DELETE_BUILDING = gql`
  mutation DeleteBuilding($id: uuid!) {
    delete_buildings_by_pk(id: $id) {
      id
    }
  }
`;
