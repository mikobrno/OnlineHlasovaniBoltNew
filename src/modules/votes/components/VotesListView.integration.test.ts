import { describe, it, expect } from 'vitest';
import { ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client';

// Spustí se pouze pokud nastavíte NHOST_INTEGRATION=1
const runIntegration = process.env.NHOST_INTEGRATION === '1';

const GET_VOTES = gql`
  query GetVotes($buildingId: uuid!) {
    votes(where: { building_id: { _eq: $buildingId } }, order_by: { created_at: desc }) {
      id
      title
      status
      created_at
      start_date
      end_date
    }
  }
`;

(runIntegration ? describe : describe.skip)('VotesListView integration (Nhost)', () => {
  it('queries votes from Nhost GraphQL', async () => {
    const url = process.env.VITE_NHOST_BACKEND_URL || process.env.NHOST_BACKEND_URL;
    if (!url) throw new Error('Set VITE_NHOST_BACKEND_URL or NHOST_BACKEND_URL to your Nhost GraphQL endpoint');

    const buildingId = process.env.TEST_BUILDING_ID;
    if (!buildingId) throw new Error('Set TEST_BUILDING_ID to a valid building UUID in your Nhost project');

    const client = new ApolloClient({
      link: createHttpLink({ uri: url }),
      cache: new InMemoryCache(),
    });

    const res = await client.query({ query: GET_VOTES, variables: { buildingId } });

    expect(res.data).toHaveProperty('votes');
    expect(Array.isArray(res.data.votes)).toBe(true);
  });
});
