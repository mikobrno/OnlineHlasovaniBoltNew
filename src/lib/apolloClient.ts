/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { nhost } from './nhostClient';

const httpLink = createHttpLink({
  uri: nhost.graphql.getUrl(),
  credentials: 'include',
  fetchOptions: { mode: 'cors' }
});

// Auth link: only fetch token when a user session exists to avoid unnecessary /v1/token calls
const authLink = setContext(async (operation: any, { headers }: { headers?: Record<string, string> }) => {
  const ctx = (operation && operation.context) || {};
  if (ctx && ctx.skipAuth) return { headers: { ...headers } };

  let token = '';
  try {
    const authAny = (nhost as any).auth;
    if (authAny && typeof authAny.getUser === 'function') {
      const user = await authAny.getUser();
      if (user) {
        token = (await nhost.auth.getAccessToken()) || '';
      }
    }
  } catch {
    token = '';
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    console.error('[Apollo][GraphQLErrors]', graphQLErrors, { operationName: (operation as any)?.operationName, variables: (operation as any)?.variables });
  }
  if (networkError) {
    const ne: any = networkError;
    const status = ne.statusCode || ne.status || (ne.response && ne.response.status) || 'unknown';
    console.error('[Apollo][NetworkError] status=%s, message=%o, operation=%s, variables=%o', status, networkError, (operation as any)?.operationName, (operation as any)?.variables);
  }
});

const apolloClient = new ApolloClient({
  link: errorLink.concat(authLink).concat(httpLink),
  cache: new InMemoryCache()
});

export { nhost, apolloClient };
