import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
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
const authLink = setContext(async (operation, { headers }) => {
  // If an operation explicitly opts out of auth (operation.context.skipAuth === true),
  // don't call nhost.auth.getAccessToken() — this avoids network calls to /v1/token for public queries.
  const ctx = (operation && (operation as any).context) || {};
  if (ctx && ctx.skipAuth) {
    return { headers: { ...headers } };
  }

  const token = (await nhost.auth.getAccessToken()) || '';
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const apolloClient = new ApolloClient({
  link: onError(({ graphQLErrors, networkError, operation }) => {
    if (graphQLErrors) {
      console.error('[Apollo][GraphQLErrors]', graphQLErrors, { operationName: operation.operationName, variables: operation.variables });
    }

    if (networkError) {
      // networkError can be a ServerError with statusCode and result
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ne: any = networkError;
      const status = ne.statusCode || ne.status || (ne.response && ne.response.status) || 'unknown';
      console.error('[Apollo][NetworkError] status=%s, message=%o, operation=%s, variables=%o', status, networkError, operation.operationName, operation.variables);
    }
  }).concat(authLink).concat(httpLink),
  cache: new InMemoryCache(),
});

export { nhost, apolloClient };
