import { NhostClient } from '@nhost/react';

const nhost = new NhostClient({
    subdomain: 'zrgbhrxnkjggssfhjqwp',
    region: 'eu-central-1',
    start: true // Automaticky naváže spojení při inicializaci
});

export default nhost;