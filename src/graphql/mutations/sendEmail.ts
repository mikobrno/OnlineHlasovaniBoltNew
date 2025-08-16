import { gql } from '@apollo/client';

export const SEND_EMAIL_MUTATION = gql`
  mutation SendEmail($to: String!, $subject: String!, $text: String, $html: String) {
    sendEmail(to: $to, subject: $subject, text: $text, html: $html) {
      ok
      error
    }
  }
`;
