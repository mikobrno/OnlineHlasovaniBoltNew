import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { nhost } from './nhostClient';

// HTTP link na GraphQL endpoint (přes Nhost klient získáme URL)
const httpLink = createHttpLink({ 
  uri: nhost.graphql.getUrl(),
  credentials: 'include',
  fetchOptions: {
    mode: 'cors'
  }
});

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
