// Email odesílací funkce
// Logika pořadí providerů:
// 1) Pokud je k dispozici MAILERSEND_API_KEY => pošle přes MailerSend
// 2) Jinak pokud jsou k dispozici MAILJET_API_KEY + MAILJET_API_SECRET => Mailjet
// 3) Jinak vrátí chybu že není nakonfigurován provider
// Odpověď je vždy jednotná: { success: boolean, provider?: string, message?: string, error?: string, meta?: any }

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'X-Content-Type-Options': 'nosniff',
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
    body: JSON.stringify(body),
  };
}

function isWindowsEnv() {
  const osEnv = process.env.OS || '';
  return process.platform === 'win32' || osEnv.toLowerCase().includes('windows');
}

function requireKeys(obj, keys) {
  // Pouze kontrola přítomnosti klíče (nevyžadujeme neprázdné hodnoty, kvůli kompatibilitě)
  const missing = keys.filter((k) => !(k in obj));
  return { ok: missing.length === 0, missing };
}

// Pomocná funkce: hrubý text z HTML (pro poskytovatele, kteří vyžadují text část)
function htmlToText(html) {
  if (!html) return '';
  return String(html)
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 8000);
}

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod === 'GET') {
    // Health check shrne oba providery
    const mailerSendConfigured = !!process.env.MAILERSEND_API_KEY && !!process.env.MAILERSEND_FROM;
    const mailjetConfigured = !!process.env.MAILJET_API_KEY && !!process.env.MAILJET_API_SECRET && !!process.env.MAILJET_FROM_EMAIL;
    return json(200, {
      success: true,
      providers: {
        mailersend: {
          configured: mailerSendConfigured,
          from: process.env.MAILERSEND_FROM || null,
          name: process.env.MAILERSEND_FROM_NAME || null,
        },
        mailjet: {
          configured: mailjetConfigured,
          from: process.env.MAILJET_FROM_EMAIL || null,
          name: process.env.MAILJET_FROM_NAME || null,
        }
      },
      active: mailerSendConfigured ? 'mailersend' : (mailjetConfigured ? 'mailjet' : null),
      message: mailerSendConfigured
        ? 'Email function ready (MailerSend)'
        : (mailjetConfigured ? 'Email function ready (Mailjet)' : 'No provider configured')
    });
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { success: false, error: 'Method Not Allowed' });
  }

  try {
    const raw = JSON.parse(event.body || '{}');

    // Backward kompatibilita: podpora starého tvaru { to, subject, html, from }
    let params = raw;
    const looksLikeOldShape = !!raw?.to && !!raw?.subject && !!raw?.html;
    if (looksLikeOldShape) {
      params = {
        fromEmail: raw.from || process.env.MAILJET_FROM_EMAIL,
        fromName: process.env.MAILJET_FROM_NAME || 'Online Hlasování',
        toEmail: raw.to,
        toName: raw.toName || '',
        ccEmail: raw.ccEmail || undefined,
        subject: raw.subject,
        htmlBody: raw.html,
        attachments: raw.attachments,
      };
    }

    // Vyžadované klíče (ccEmail je volitelný v produkci)
    const requiredKeys = ['fromEmail', 'fromName', 'toEmail', 'toName', 'subject', 'htmlBody'];
    const { ok, missing } = requireKeys(params, requiredKeys);
    if (!ok) {
      return json(400, { success: false, error: `Chybí povinné parametry: ${missing.join(', ')}` });
    }

    // --- Provider výběr ---
    const mailerSendKey = process.env.MAILERSEND_API_KEY;
    const mailjetKey = process.env.MAILJET_API_KEY;
    const mailjetSecret = process.env.MAILJET_API_SECRET;

    if (!mailerSendKey && !(mailjetKey && mailjetSecret)) {
      return json(500, { success: false, error: 'No email provider configured (MailerSend or Mailjet).' });
    }

    // Normalizace parametrů
    let { fromEmail, fromName } = params;
    let { toEmail, toName } = params;
    const { ccEmail, subject, htmlBody } = params;
    if (!toName) {
      try { toName = String(toEmail).split('@')[0]; } catch { toName = 'Recipient'; }
    }
    const attachments = Array.isArray(params.attachments) ? params.attachments : [];

    // Dev debug redirect
    const host = (event.headers && (event.headers.host || event.headers.Host)) || '';
    const isLocalHost = /localhost|127\.0\.0\.1/i.test(host);
    const debugEmail = process.env.DEBUG_EMAIL;
    if (isWindowsEnv() && isLocalHost && debugEmail) {
      toEmail = debugEmail;
    }

    // 1) MailerSend
    if (mailerSendKey) {
      const msFrom = fromEmail || process.env.MAILERSEND_FROM;
      const msFromName = fromName || process.env.MAILERSEND_FROM_NAME || 'Online Hlasování';
      if (!msFrom) {
        return json(500, { success: false, provider: 'mailersend', error: 'MAILERSEND_FROM not set' });
      }

      const payload = {
        from: { email: msFrom, name: msFromName },
        to: [{ email: toEmail, name: toName }],
        subject,
        html: htmlBody,
        text: htmlToText(htmlBody)
      };

      // (Jednoduché přílohy nejsou zatím implementovány pro MailerSend)

      const msRes = await fetch('https://api.mailersend.com/v1/email', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${mailerSendKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const msData = await msRes.json().catch(() => null);
      if (msRes.ok) {
        return json(200, { success: true, provider: 'mailersend', message: 'Email odeslán (MailerSend)', meta: msData });
      }
      return json(msRes.status || 500, { success: false, provider: 'mailersend', error: msData?.message || 'MailerSend API error', meta: msData });
    }

    // 2) Mailjet fallback
    const mjFrom = fromEmail || process.env.MAILJET_FROM_EMAIL;
    const mjFromName = fromName || process.env.MAILJET_FROM_NAME || 'Online Hlasování';
    if (!mjFrom) {
      return json(500, { success: false, provider: 'mailjet', error: 'MAILJET_FROM_EMAIL not set' });
    }

    const toArray = Array.isArray(toEmail)
      ? toEmail.map((e) => ({ Email: e, Name: toName }))
      : [{ Email: toEmail, Name: toName }];
    const payload = {
      Messages: [
        {
          From: { Email: mjFrom, Name: mjFromName },
          To: toArray,
          Subject: subject,
          HTMLPart: htmlBody,
          TextPart: htmlToText(htmlBody)
        }
      ]
    };
    if (ccEmail) {
      const ccArray = Array.isArray(ccEmail) ? ccEmail : [ccEmail];
      payload.Messages[0].CC = ccArray.filter(Boolean).map(e => ({ Email: e }));
    }
    if (attachments.length > 0) {
      payload.Messages[0].Attachments = [];
      for (const att of attachments) {
        try {
          const name = att.attachment_name || att.filename || 'attachment';
          const type = att.attachment_type || att.content_type || 'application/octet-stream';
          const base64Content = att.base64 || att.Base64Content;
          if (typeof base64Content === 'string' && base64Content.trim()) {
            payload.Messages[0].Attachments.push({ ContentType: type, Filename: name, Base64Content: base64Content });
          }
        } catch {/* ignore single attachment errors */}
      }
      if (payload.Messages[0].Attachments.length === 0) delete payload.Messages[0].Attachments;
    }
    const auth = Buffer.from(`${mailjetKey}:${mailjetSecret}`).toString('base64');
    const res = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    let data = null; try { data = await res.json(); } catch {}
    const msg = data?.Messages?.[0];
    const mjStatus = msg?.Status;
    if (res.ok && mjStatus === 'success') {
      return json(200, { success: true, provider: 'mailjet', message: 'Email odeslán (Mailjet)', meta: data });
    }
    const errors = msg?.Errors || data?.Errors || data?.ErrorMessage || data;
    const errText = Array.isArray(errors) ? errors.map(e => e?.ErrorMessage || e?.Message || String(e)).join('; ') : (errors?.Message || errors?.ErrorMessage || 'Mailjet API error');
    return json(res.status || 500, { success: false, provider: 'mailjet', error: errText, meta: data });
  } catch (error) {
    return json(500, { success: false, error: error?.message || 'Unknown error' });
  }
};
