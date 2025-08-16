// Lokální vývojový server pro emulaci Netlify serverless funkce send-email
// Spuštění: npm run dev:email-func
// Nastav v .env: VITE_EMAIL_FUNCTION_URL=http://localhost:5051/.netlify/functions/send-email
// Běží paralelně vedle `npm run dev` bez potřeby `netlify dev`.

import http from 'http';
import fs from 'fs';
import path from 'path';
import { handler } from '../netlify/functions/send-email.js';

// Jednoduché načtení .env (bez externí dependency dotenv)
(() => {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const raw = fs.readFileSync(envPath, 'utf8');
      raw.split(/\r?\n/).forEach(line => {
        if (!line || line.trim().startsWith('#')) return;
        const eq = line.indexOf('=');
        if (eq === -1) return;
        const key = line.slice(0, eq).trim();
        const val = line.slice(eq + 1).trim();
        if (!(key in process.env)) {
          process.env[key] = val;
        }
      });
    }
  } catch (e) {
    console.warn('[email-func-dev] Nelze načíst .env:', e.message);
  }
})();

const PORT = process.env.EMAIL_FUNCTION_DEV_PORT || 5051;
console.log('[email-func-dev] MAILERSEND_API_KEY set:', !!process.env.MAILERSEND_API_KEY);
console.log('[email-func-dev] MAILJET_API_KEY set:', !!process.env.MAILJET_API_KEY);
console.log('[email-func-dev] FROM email preference (MailerSend > Mailjet):', process.env.MAILERSEND_FROM || process.env.MAILJET_FROM_EMAIL || 'N/A');

function buildEvent(req, body) {
  return {
    httpMethod: req.method,
    path: req.url,
    headers: req.headers,
    body: body && body.length ? body.toString('utf8') : undefined,
  };
}

const server = http.createServer(async (req, res) => {
  if (!req.url.startsWith('/.netlify/functions/send-email')) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('Not found');
  }

  const chunks = [];
  req.on('data', c => chunks.push(c));
  req.on('end', async () => {
    try {
      const body = Buffer.concat(chunks);
      const event = buildEvent(req, body);
      const result = await handler(event, {});
      res.writeHead(result.statusCode || 200, result.headers || { 'Content-Type': 'application/json' });
      res.end(result.body || '');
    } catch (e) {
      console.error('[email-func-dev] error:', e);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: e.message }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`[email-func-dev] listening on http://localhost:${PORT}/.netlify/functions/send-email`);
});
