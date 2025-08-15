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
    # Tuto mutaci bude potřeba implementovat na straně Hasura/Nhost
    # pomocí serverless funkce, která zavolá emailovou službu.
    # Prozatím zde může být placeholder, pokud funkce ještě neexistuje.
    # Příklad názvu funkce v Hasura: send_test_email
    # Zde předpokládáme, že taková akce existuje a vrací jednoduchý výsledek.
    # V reálném scénáři by název 'sendEmail' odpovídal názvu akce v Hasura.
    sendEmail(to: $to, subject: $subject, body: $body) {
      success
      message
    }
  }
`;

