// src/lib/nhostClient.ts
import { NhostClient } from '@nhost/nextjs';

// Vložte sem své údaje z Nhost projektu
const nhost = new NhostClient({
  subdomain: 'zrgbhrxnkjggssfhjqwp', // např. 'abcdef123456'
  region: 'eu-central-1' // např. 'eu-central-1'
});

export { nhost };