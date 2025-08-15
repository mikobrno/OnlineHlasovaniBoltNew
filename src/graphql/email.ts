import { gql } from '@apollo/client';
import { EMAIL_TEMPLATE_FIELDS } from './templates';
import { GLOBAL_VARIABLE_FIELDS } from './globalVariables';

export const GET_EMAIL_GENERATOR_DATA = gql`
  query GetEmailGeneratorData($buildingId: uuid!) {
    email_templates(
      where: {
        _or: [{ building_id: { _eq: $buildingId } }, { is_global: { _eq: true } }]
      }
      order_by: { name: asc }
    ) {
      ...EmailTemplateFields
    }
    members(
      where: { building_id: { _eq: $buildingId } }
      order_by: { name: asc }
    ) {
      id
      name
      email
    }
    global_variables(order_by: { name: asc }) {
      ...GlobalVariableFields
    }
    buildings_by_pk(id: $buildingId) {
      id
      name
      address
    }
  }
  ${EMAIL_TEMPLATE_FIELDS}
  ${GLOBAL_VARIABLE_FIELDS}
`;

export const SEND_TEST_EMAIL_MUTATION = gql`
  mutation SendTestEmail($to: String!, $subject: String!, $body: String!) {
    sendEmail(to: $to, subject: $subject, body: $body) {
      success
      message
    }
  }
`;

// Fallback JS volání Netlify funkce pro lokální prostředí,
// pokud Hasura akce ještě není nasazena.
export async function sendTestEmailFallback(to: string, subject: string, body: string) {
  try {
    const res = await fetch('/.netlify/functions/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, html: body }),
    });
    const data = await res.json();
    return { success: !!data.success, message: data.error || data.message || 'OK' };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Neznámá chyba';
    return { success: false, message: msg };
  }
}

