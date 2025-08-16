import { gql } from '@apollo/client';

export const GET_EMAIL_GENERATOR_DATA = gql`
  query GetEmailGeneratorData($buildingId: uuid!) {
    email_templates {
      id
      name
      subject
      body
      is_global
    }
    members(where: { building_id: { _eq: $buildingId } }) {
      id
      name
      email
    }
    buildings_by_pk(id: $buildingId) {
      id
      name
      address
    }
    global_variables {
      name
      value
    }
  }
`;

export const SEND_TEST_EMAIL_MUTATION = gql`
  mutation SendTestEmail($to: String!, $subject: String!, $body: String!) {
    sendEmail(input: { to: $to, subject: $subject, body: $body }) {
      success
      message
    }
  }
`;