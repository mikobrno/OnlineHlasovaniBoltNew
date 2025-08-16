// src/lib/nhostClient.ts
import { NhostClient } from '@nhost/nhost-js';

export const nhost = new NhostClient({
  subdomain: 'zrgbhrxnkjggssfhjqwp',
  region: 'eu-central-1',
  adminSecret: import.meta.env.NHOST_ADMIN_SECRET
});