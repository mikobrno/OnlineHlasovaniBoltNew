import { NhostClient } from '@nhost/nhost-js';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Konfigurace Nhost klienta z env proměnných (nutné nastavit ve .env.local)
const nhost = new NhostClient({
  subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN!,
  region: import.meta.env.VITE_NHOST_REGION!,
});

// HTTP link na GraphQL endpoint (přes Nhost klient získáme URL)
const httpLink = createHttpLink({ uri: nhost.graphql.getUrl() });

// Auth link přidá JWT uživatele do každého požadavku
const authLink = setContext(async (_, { headers }) => {
  const token = (await nhost.auth.getAccessToken()) || '';
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export { nhost, apolloClient };
