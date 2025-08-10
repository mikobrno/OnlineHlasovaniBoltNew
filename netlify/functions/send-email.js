import nodemailer from 'nodemailer';

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
    // Readiness probe without sending an email
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      body: JSON.stringify({ success: true, message: 'Email function ready (Mailjet)' }),
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

    // Prefer Mailjet when API key/secret is available
    const mjKey = process.env.MAILJET_API_KEY;
    const mjSecret = process.env.MAILJET_API_SECRET;
    if (mjKey && mjSecret) {
      const fromEmail = process.env.MAILJET_FROM_EMAIL || from || process.env.GMAIL_USER;
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

      if (res.ok) {
        // Mailjet returns Messages array with Status and To Sent/MessageUUID
        const msg = data?.Messages?.[0];
        const messageId = msg?.To?.[0]?.MessageUUID || msg?.CustomID || null;
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
          body: JSON.stringify({ success: true, messageId }),
        };
      }

      return {
        statusCode: res.status || 500,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, error: data?.Message || 'Mailjet API error' }),
      };
    }

    // Fallback to Gmail SMTP via App Password
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass) {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, error: 'No email provider configured (missing MAILERSEND_API_KEY or Gmail SMTP creds).' }),
      };
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
    });

    const info = await transporter.sendMail({
      from: from || user,
      to,
      subject,
      html,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      body: JSON.stringify({ success: true, messageId: info.messageId }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: error.message || 'Unknown error' }),
    };
  }
};
