import { gql } from '@apollo/client';

// Fragments
export const ATTACHMENT_FIELDS = gql`
  fragment AttachmentFields on vote_attachments {
    id
    vote_id
    member_id
    file_name
    file_size
    note
    created_at
    updated_at
  }
`;

// Queries
export const GET_VOTE_ATTACHMENTS = gql`
  query GetVoteAttachments($voteId: uuid!) {
    vote_attachments(where: { vote_id: { _eq: $voteId } }) {
      ...AttachmentFields
      member {
        id
        name
        unit
      }
    }
  }
  ${ATTACHMENT_FIELDS}
`;

// Mutations
export const ADD_VOTE_ATTACHMENT = gql`
  mutation AddVoteAttachment($attachment: vote_attachments_insert_input!) {
    insert_vote_attachments_one(object: $attachment) {
      ...AttachmentFields
    }
  }
  ${ATTACHMENT_FIELDS}
`;

export const REMOVE_VOTE_ATTACHMENT = gql`
  mutation RemoveVoteAttachment($id: uuid!) {
    delete_vote_attachments_by_pk(id: $id) {
      id
    }
  }
`;

// Types
export interface VoteAttachment {
  id: string;
  vote_id: string;
  member_id: string;
  file_name: string;
  file_size: number;
  note?: string;
  created_at: string;
  updated_at: string;
  member?: {
    id: string;
    name: string;
    unit: string;
  };
}

export interface VoteAttachmentInput {
  vote_id: string;
  member_id: string;
  file_name: string;
  file_size: number;
  note?: string;
}
