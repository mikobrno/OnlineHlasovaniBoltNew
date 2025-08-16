import { NhostClient } from '@nhost/nhost-js';

const subdomain = 'zrgbhrxnkjggssfhjqwp';
const region = 'eu-central-1';

export const nhost = new NhostClient({
  subdomain,
  region,
  clientStorageType: 'localStorage',
  clientStorage: globalThis?.localStorage,
  refreshIntervalTime: 600000 // 10 minutes
});