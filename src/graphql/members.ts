import { gql } from '@apollo/client';

export interface Member {
    id: string;
    name: string;
    email: string;
    phone?: string;
    unit: string;
    vote_weight: number;
    representative_id?: string;
    building_id: string;
    created_at: string;
    updated_at: string;
}

// Dotazy
export const GET_MEMBERS = gql`
    query GetMembers($buildingId: uuid!) {
        members(
            where: { building_id: { _eq: $buildingId } }
            order_by: { name: asc }
        ) {
            id
            name
            email
            phone
            unit
            vote_weight
            representative_id
            building_id
            created_at
            updated_at
        }
    }
`;

// Mutace
export const ADD_MEMBER = gql`
    mutation AddMember($member: members_insert_input!) {
        insert_members_one(object: $member) {
            id
            name
            email
            phone
            unit
            vote_weight
            representative_id
            building_id
            created_at
            updated_at
        }
    }
`;

export const UPDATE_MEMBER = gql`
    mutation UpdateMember($id: uuid!, $updates: members_set_input!) {
        update_members_by_pk(
            pk_columns: { id: $id }
            _set: $updates
        ) {
            id
            name
            email
            phone
            unit
            vote_weight
            representative_id
            building_id
            created_at
            updated_at
        }
    }
`;

export const DELETE_MEMBER = gql`
    mutation DeleteMember($id: uuid!) {
        delete_members_by_pk(id: $id) {
            id
        }
    }
`;

// Fragmenty pro znovupoužití
export const MEMBER_FIELDS = gql`
    fragment MemberFields on members {
        id
        name
        email
        phone
        unit
        vote_weight
        representative_id
        building_id
        created_at
        updated_at
    }
`;
