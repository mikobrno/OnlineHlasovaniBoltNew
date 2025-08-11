// Posíláme výhradně přes Mailjet – žádný SMTP fallback

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

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
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      body: JSON.stringify({ 
        success: true,
        provider: 'mailjet',
        configured,
        fromEmail,
        fromName,
        missing,
        message: configured ? 'Email function ready (Mailjet)' : 'Mailjet is not fully configured'
      }),
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: 'Method Not Allowed' }),
    };
  }

  try {
    const { to, subject, html, from } = JSON.parse(event.body || '{}');

    if (!to || !subject || !html) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, error: 'Missing required fields: to, subject, html' }),
      };
    }

  // Mailjet je povinný provider
  const mjKey = process.env.MAILJET_API_KEY;
  const mjSecret = process.env.MAILJET_API_SECRET;
  if (mjKey && mjSecret) {
  const fromEmail = process.env.MAILJET_FROM_EMAIL || from;
      const fromName = process.env.MAILJET_FROM_NAME || 'Online Hlasování';

      const payload = {
        Messages: [
          {
            From: { Email: fromEmail, Name: fromName },
            To: [{ Email: to }],
            Subject: subject,
            HTMLPart: html,
          },
        ],
      };

      const auth = Buffer.from(`${mjKey}:${mjSecret}`).toString('base64');
      const res = await fetch('https://api.mailjet.com/v3.1/send', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      let data = null;
      try { data = await res.json(); } catch (e) { /* ignore parse errors */ }

      // Mailjet vrací vždy HTTP 200, skutečný stav je v Messages[0].Status
      const msg = data?.Messages?.[0];
      const mjStatus = msg?.Status; // 'success' | 'error'

      if (res.ok && mjStatus === 'success') {
        const messageId = msg?.To?.[0]?.MessageUUID || msg?.CustomID || null;
        const messageIdNumeric = msg?.To?.[0]?.MessageID || null;
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
          body: JSON.stringify({ 
            success: true, 
            provider: 'mailjet',
            status: res.status,
            mailjetStatus: mjStatus,
            messageId,
            messageIdNumeric,
            from: { email: fromEmail, name: fromName },
            to,
            subject,
            providerResponse: msg
          }),
        };
      }

      // Shromáždíme detaily chyb (často v poli Errors)
      const errors = msg?.Errors || data?.Errors || data?.ErrorMessage || data;
      return {
        statusCode: res.status || 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        body: JSON.stringify({ 
          success: false, 
          provider: 'mailjet',
          status: res.status || 500,
          mailjetStatus: mjStatus || 'error',
          error: Array.isArray(errors) ? errors.map(e => e?.ErrorMessage || e?.Message || String(e)).join('; ') : (errors?.Message || errors?.ErrorMessage || 'Mailjet API error'),
          providerResponse: data
        }),
      };
    }

    // Pokud Mailjet není nakonfigurován, vrať jasnou chybu
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: 'Mailjet není nakonfigurován. Nastavte MAILJET_API_KEY, MAILJET_API_SECRET, MAILJET_FROM_EMAIL a MAILJET_FROM_NAME.' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: error.message || 'Unknown error' }),
    };
  }
};
