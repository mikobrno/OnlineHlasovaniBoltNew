import { NhostClient } from '@nhost/nhost-js';

// Disable automatic refresh attempts on client initialization to avoid unauthenticated
// background /v1/token requests that return 401 when no valid refresh token exists.
export const nhost = new NhostClient({
  subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN || 'zrgbhrxnkjggssfhjqwp',
  region: import.meta.env.VITE_NHOST_REGION || 'eu-central-1',
  autoSignIn: false,
  autoRefreshToken: false,
});