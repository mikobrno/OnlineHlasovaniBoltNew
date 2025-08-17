// src/modules/buildings/utils/logger.ts
const LOG_PREFIX = '[BUILDINGS MODULE]';

type LogData = Record<string, unknown>;

interface GraphQLError {
  graphQLErrors?: Error[];
  networkError?: Error;
  stack?: string;
  message: string;
}

export const buildingsLogger = {
  info: (message: string, data?: LogData) => {
    console.log(`${LOG_PREFIX} INFO:`, message, data ? JSON.stringify(data) : '');
  },
  error: (message: string, error: Error | GraphQLError) => {
    console.error(`${LOG_PREFIX} ERROR:`, message, '\nDetails:', error);
    if ('graphQLErrors' in error && error.graphQLErrors) {
      console.error(`${LOG_PREFIX} GraphQL Errors:`, error.graphQLErrors);
    }
    if ('networkError' in error && error.networkError) {
      console.error(`${LOG_PREFIX} Network Error:`, error.networkError);
    }
    if (error.stack) {
      console.error(`${LOG_PREFIX} Stack Trace:`, error.stack);
    }
  },
  warn: (message: string, data?: LogData) => {
    console.warn(`${LOG_PREFIX} WARNING:`, message, data ? JSON.stringify(data) : '');
  },
  debug: (message: string, data?: LogData) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`${LOG_PREFIX} DEBUG:`, message, data ? JSON.stringify(data) : '');
    }
  }
};
