import { gql } from '@apollo/client';

// Fragments
export const EMAIL_TEMPLATE_FIELDS = gql`
  fragment EmailTemplateFields on email_templates {
    id
    name
    subject
    body
    variables
    is_global
    building_id
    created_at
    updated_at
  }
`;

// Queries
export const GET_EMAIL_TEMPLATES = gql`
  query GetEmailTemplates($buildingId: uuid) {
    email_templates(
      where: { _or: [{ building_id: { _eq: $buildingId } }, { is_global: { _eq: true } }] }
    ) {
      ...EmailTemplateFields
    }
  }
  ${EMAIL_TEMPLATE_FIELDS}
`;

// Mutations
export const ADD_EMAIL_TEMPLATE = gql`
  mutation AddEmailTemplate($template: email_templates_insert_input!) {
    insert_email_templates_one(object: $template) {
      ...EmailTemplateFields
    }
  }
  ${EMAIL_TEMPLATE_FIELDS}
`;

export const UPDATE_EMAIL_TEMPLATE = gql`
  mutation UpdateEmailTemplate($id: uuid!, $template: email_templates_set_input!) {
    update_email_templates_by_pk(pk_columns: { id: $id }, _set: $template) {
      ...EmailTemplateFields
    }
  }
  ${EMAIL_TEMPLATE_FIELDS}
`;

export const DELETE_EMAIL_TEMPLATE = gql`
  mutation DeleteEmailTemplate($id: uuid!) {
    delete_email_templates_by_pk(id: $id) {
      id
    }
  }
`;

// Types
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: Record<string, string>;
  is_global: boolean;
  building_id?: string;
  created_at: string;
  updated_at: string;
}

export interface EmailTemplateInput {
  name: string;
  subject: string;
  body: string;
  variables?: Record<string, string>;
  is_global: boolean;
  building_id?: string;
}
