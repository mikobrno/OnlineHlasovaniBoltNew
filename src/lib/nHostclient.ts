// src/lib/nhostClient.ts
import { NhostClient } from '@nhost/nextjs';

export const nhost = new NhostClient({
  // Vložte sem vaše skutečné údaje z Nhost dashboardu
  subdomain: 'your-nhost-subdomain',
  region: 'your-nhost-region'
});