import { NhostClient } from '@nhost/nhost-js';
import { ApolloClient, InMemoryCache } from '@apollo/client';

const nhost = new NhostClient({
  subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN,
  region: import.meta.env.VITE_NHOST_REGION,
});

const apolloClient = new ApolloClient({
  uri: nhost.graphql.getUrl(),
  cache: new InMemoryCache(),
  headers: {
    'x-hasura-admin-secret': import.meta.env.VITE_NHOST_ADMIN_SECRET as string,
  },
});

export { nhost, apolloClient };
