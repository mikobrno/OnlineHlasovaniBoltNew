// Posíláme výhradně přes Mailjet – žádný SMTP fallback
import fs from 'fs';

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

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod === 'GET') {
    // Readiness probe without sending an email (Mailjet status)
    const mjKey = process.env.MAILJET_API_KEY;
    const mjSecret = process.env.MAILJET_API_SECRET;
    const fromEmail = process.env.MAILJET_FROM_EMAIL || null;
    const fromName = process.env.MAILJET_FROM_NAME || 'Online Hlasování';
    const missing = [];
    if (!mjKey) missing.push('MAILJET_API_KEY');
    if (!mjSecret) missing.push('MAILJET_API_SECRET');
    if (!fromEmail) missing.push('MAILJET_FROM_EMAIL');
    if (!fromName) missing.push('MAILJET_FROM_NAME');

    const configured = missing.length === 0;

    // Volitelná rychlá diagnostika účtu (bezpečný výřez informací)
    let accountInfo = null;
    if (configured) {
      try {
        const auth = Buffer.from(`${mjKey}:${mjSecret}`).toString('base64');
        const resp = await fetch('https://api.mailjet.com/v3/REST/user', {
          method: 'GET',
          headers: { 'Authorization': `Basic ${auth}` },
        });
        const info = await resp.json().catch(() => null);
        const user = Array.isArray(info?.Data) ? info.Data[0] : null;
        if (user) {
          const username = typeof user?.Username === 'string' ? user.Username : null;
          const userId = user?.ID ?? null;
          // Některé účty vrací pole "IsMaster" nebo "ACL"; spolehlivě jen naznačíme typ
          const accountType = user?.IsMaster ? 'primary' : 'subaccount_or_primary';
          accountInfo = { 
            ok: resp.ok,
            httpStatus: resp.status,
            userId,
            username,
            accountType,
          };
        } else {
          accountInfo = { ok: resp.ok, httpStatus: resp.status };
        }
      } catch { /* ignore diag errors */ }
    }
    return json(200, {
      success: true,
      provider: 'mailjet',
      configured,
      fromEmail,
      fromName,
      missing,
      accountInfo,
      message: configured ? 'Email function ready (Mailjet)' : 'Mailjet is not fully configured',
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

    // Konfigurace Mailjetu
    const mjKey = process.env.MAILJET_API_KEY;
    const mjSecret = process.env.MAILJET_API_SECRET;
    if (!mjKey || !mjSecret) {
      return json(500, { success: false, error: 'Mailjet není nakonfigurován. Nastavte MAILJET_API_KEY a MAILJET_API_SECRET.' });
    }

    // Převzetí parametrů
    let { fromEmail, fromName } = params;
    let { toEmail, toName } = params;
    const { ccEmail, subject, htmlBody } = params;
    // Fallbacky pro produkci
    fromEmail = fromEmail || process.env.MAILJET_FROM_EMAIL;
    fromName = fromName || process.env.MAILJET_FROM_NAME || 'Online Hlasování';
    if (!toName || toName === '') {
      try { toName = String(toEmail).split('@')[0]; } catch { toName = 'Recipient'; }
    }
    const attachments = Array.isArray(params.attachments) ? params.attachments : [];

    // V prostředí Windows případně přesměrujeme na debug adresu POUZE lokálně a pokud je nastavena DEBUG_EMAIL
    const host = (event.headers && (event.headers.host || event.headers.Host)) || '';
    const isLocalHost = /localhost|127\.0\.0\.1/i.test(host);
    const debugEmail = process.env.DEBUG_EMAIL;
    if (isWindowsEnv() && isLocalHost && debugEmail) {
      toEmail = debugEmail;
      toName = toName || 'Debug';
    }

    // Sestavení Mailjet payloadu
    const toArray = Array.isArray(toEmail)
      ? toEmail.map((e) => ({ Email: e, Name: toName }))
      : [{ Email: toEmail, Name: toName }];

    const payload = {
      Messages: [
        {
          From: { Email: fromEmail, Name: fromName },
          To: toArray,
          Subject: subject,
          HTMLPart: htmlBody,
        },
      ],
    };

    if (ccEmail) {
      const ccArray = Array.isArray(ccEmail) ? ccEmail : [ccEmail];
      payload.Messages[0].CC = ccArray.filter(Boolean).map((e) => ({ Email: e }));
    }

    // Zpracování příloh dle PHP (attachment_name, attachment_path, attachment_type)
    if (attachments.length > 0) {
      payload.Messages[0].Attachments = [];
      for (const att of attachments) {
        try {
          const name = att.attachment_name || att.filename || 'attachment';
          const type = att.attachment_type || att.content_type || 'application/octet-stream';
          let base64Content = att.base64 || att.Base64Content;
          const filePath = att.attachment_path || att.path;
          if (!base64Content && filePath && fs.existsSync(filePath)) {
            const buf = fs.readFileSync(filePath);
            base64Content = buf.toString('base64');
          }
          if (base64Content) {
            payload.Messages[0].Attachments.push({
              ContentType: type,
              Filename: name,
              Base64Content: base64Content,
            });
          }
        } catch {
          // ignorujeme neplatné přílohy
        }
      }
      if (payload.Messages[0].Attachments.length === 0) {
        delete payload.Messages[0].Attachments;
      }
    }

    const auth = Buffer.from(`${mjKey}:${mjSecret}`).toString('base64');
    const res = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    let data = null;
    try { data = await res.json(); } catch {}

    const msg = data?.Messages?.[0];
    const mjStatus = msg?.Status;
    const success = res.ok && mjStatus === 'success';

    if (success) {
      return json(200, {
        success: true,
        provider: 'mailjet',
        mailjetStatus: mjStatus,
        response: data,
      });
    }

    const errors = msg?.Errors || data?.Errors || data?.ErrorMessage || data;
    const errText = Array.isArray(errors)
      ? errors.map((e) => e?.ErrorMessage || e?.Message || String(e)).join('; ')
      : (errors?.Message || errors?.ErrorMessage || 'Mailjet API error');
    return json(res.status || 500, {
      success: false,
      provider: 'mailjet',
      mailjetStatus: mjStatus || 'error',
      error: errText,
      response: data,
    });
  } catch (error) {
    return json(500, { success: false, error: error.message || 'Unknown error' });
  }
};
