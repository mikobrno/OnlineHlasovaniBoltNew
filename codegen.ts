import type { CodegenConfig } from '@graphql-codegen/cli';
import * as dotenv from 'dotenv';

// Načtení .env souborů
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const graphqlUrl = process.env.NHOST_GRAPHQL_URL || 
  (process.env.VITE_NHOST_BACKEND_URL ? `${process.env.VITE_NHOST_BACKEND_URL}/v1/graphql` : undefined);

if (!graphqlUrl) {
  throw new Error('NHOST_GRAPHQL_URL nebo VITE_NHOST_BACKEND_URL musí být nastaveny');
}

const config: CodegenConfig = {
  schema: {
    [graphqlUrl]: {
      headers: {
        'x-hasura-admin-secret': process.env.NHOST_ADMIN_SECRET || '',
      },
    },
  },
  documents: ['src/**/*.{ts,tsx}'],
  generates: {
    './src/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
      config: {
        withHooks: true,
        withComponent: false,
        withHOC: false,
        scalars: {
          uuid: 'string',
          timestamptz: 'string',
          jsonb: 'any',
        },
        skipTypename: true,
      },
    },
  },
};

export default config;
