// src/lib/nhostClient.ts
import { NhostClient } from '@nhost/nextjs';

export const nhost = new NhostClient({
    // TODO: Doplňte skutečné údaje nebo použijte env proměnné
    subdomain: 'your-nhost-subdomain',
    region: 'your-nhost-region'
});

export default nhost;