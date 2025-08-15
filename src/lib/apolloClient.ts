import { NhostApolloProvider } from '@nhost/react-apollo';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import nhost from './nhostClient';

const NHOST_ADMIN_SECRET = import.meta.env.VITE_NHOST_ADMIN_SECRET || '';

const apolloClient = new ApolloClient({
  uri: `https://zrgbhrxnkjggssfhjqwp.eu-central-1.nhost.run/v1/graphql`,
  cache: new InMemoryCache(),
  headers: {
    'x-hasura-admin-secret': NHOST_ADMIN_SECRET
  }
});

export { apolloClient, NhostApolloProvider };
