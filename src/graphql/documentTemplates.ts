import { gql } from '@apollo/client';

// Fragment
export const DOCUMENT_TEMPLATE_FIELDS = gql`
  fragment DocumentTemplateFields on document_templates {
    id
    name
    body
    help_text
    is_global
    building_id
    created_at
    updated_at
  }
`;

// Queries
export const GET_DOCUMENT_TEMPLATES = gql`
  query GetDocumentTemplates($buildingId: uuid) {
    document_templates(
      where: { _or: [{ building_id: { _eq: $buildingId } }, { is_global: { _eq: true } }] }
      order_by: { name: asc }
    ) {
      ...DocumentTemplateFields
    }
  }
  ${DOCUMENT_TEMPLATE_FIELDS}
`;

// Mutations
export const ADD_DOCUMENT_TEMPLATE = gql`
  mutation AddDocumentTemplate($template: document_templates_insert_input!) {
    insert_document_templates_one(object: $template) {
      ...DocumentTemplateFields
    }
  }
  ${DOCUMENT_TEMPLATE_FIELDS}
`;

export const UPDATE_DOCUMENT_TEMPLATE = gql`
  mutation UpdateDocumentTemplate($id: uuid!, $template: document_templates_set_input!) {
    update_document_templates_by_pk(pk_columns: { id: $id }, _set: $template) {
      ...DocumentTemplateFields
    }
  }
  ${DOCUMENT_TEMPLATE_FIELDS}
`;

export const DELETE_DOCUMENT_TEMPLATE = gql`
  mutation DeleteDocumentTemplate($id: uuid!) {
    delete_document_templates_by_pk(id: $id) {
      id
    }
  }
`;
