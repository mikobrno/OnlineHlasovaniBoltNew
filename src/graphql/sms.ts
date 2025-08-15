import { gql } from '@apollo/client';

export const SEND_TEST_SMS_MUTATION = gql`
  mutation SendTestSms($to: String!, $message: String!) {
    sendTestSms(to: $to, message: $message) {
      success
      message
    }
  }
`;

export const GET_SMS_CREDIT_QUERY = gql`
  query GetSmsCredit {
    getSmsCredit {
      success
      credit
      message
    }
  }
`;

export const TEST_SMS_CONNECTION_QUERY = gql`
  query TestSmsConnection {
    testSmsConnection {
      success
      message
    }
  }
`;
