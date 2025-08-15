// Verze: DB-driven 2.0 - 12.8.2025
// netlify/functions/sms.js - Netlify Function pro SMS API s konfigurací z databáze

// Helper pro načtení konfigurace z databáze přes Hasura
const getSmsConfig = async () => {
  const HASURA_ENDPOINT = process.env.VITE_NHOST_HASURA_URL || process.env.HASURA_ENDPOINT;
  const HASURA_ADMIN_SECRET = process.env.NHOST_ADMIN_SECRET || process.env.HASURA_ADMIN_SECRET;

  if (!HASURA_ENDPOINT || !HASURA_ADMIN_SECRET) {
    return { 
      success: false, 
      message: 'Serverless funkce není nakonfigurována pro přístup k databázi (chybí Hasura proměnné).' 
    };
  }

  const query = `
    query GetSmsSettings {
      settings(where: {key: {_eq: "sms"}}) {
        value
      }
    }
  `;

  try {
    const response = await fetch(HASURA_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
      },
      body: JSON.stringify({ query }),
      signal: AbortSignal.timeout(8000) // 8s timeout
    });

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL Error:', result.errors);
      return { success: false, message: 'Chyba při dotazování na nastavení SMS.' };
    }

    const smsSettings = result.data?.settings?.[0]?.value;

    if (!smsSettings || !smsSettings.username || !smsSettings.password) {
      return { success: false, message: 'Nastavení SMS (uživatelské jméno a heslo) nebylo nalezeno nebo je neúplné v databázi.' };
    }

    return { 
      success: true, 
      login: smsSettings.username, 
      password: smsSettings.password 
    };

  } catch (error) {
    console.error('Error fetching SMS config:', error);
    return { success: false, message: 'Nepodařilo se načíst konfiguraci SMS z databáze.' };
  }
};


exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'X-Content-Type-Options': 'nosniff'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // Načtení konfigurace z DB
  const configResult = await getSmsConfig();
  if (!configResult.success) {
    return {
      statusCode: 200, // Vracíme 200, aby se v konzoli neobjevovaly chyby
      headers,
      body: JSON.stringify({ success: false, message: configResult.message, configured: false })
    };
  }

  const { login, password } = configResult;

  try {
    const { action, phoneNumber, message } = JSON.parse(event.body || '{}');
    
    const params = new URLSearchParams({
      action: action || 'send_sms',
      login,
      password,
    });

    if (action === 'send_sms') {
      let cleaned = (phoneNumber || '').toString().trim().replace(/[^0-9]/g, '');
      if (/^00\d+/.test(cleaned)) cleaned = cleaned.replace(/^00/, '');
      
      let normalizedNumber = cleaned;
      if (/^\d{9}$/.test(cleaned)) {
        normalizedNumber = '420' + cleaned;
      }

      const isValid = /^420\d{9}$/.test(normalizedNumber);
      if (!isValid) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: false,
            message: `Neplatné telefonní číslo po normalizaci: ${normalizedNumber}. Očekáván formát 420xxxxxxxxx.`,
          })
        };
      }

      params.append('number', normalizedNumber);
      params.append('message', message || '');
      params.append('unicode', '1');
    }

    const sendOnce = async (searchParams, method = 'POST', timeoutMs = 10000) => {
      const url = 'https://www.smsbrana.cz/smsconnect/http.php';
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const opts = {
            method,
            signal: controller.signal,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: searchParams,
        };
        const response = await fetch(url, opts);
        return await response.text();
      } catch (e) {
        return `ERROR: ${e?.message || String(e)}`;
      } finally { 
        clearTimeout(timeout); 
      }
    };

    let resultText = await sendOnce(params, 'POST');

    const parseXmlError = (text) => {
      const m = /<err>(\d+)<\/err>/i.exec(text);
      if (!m) return null;
      const code = Number(m[1]);
      const map = {
        1: 'Chybí povinný parametr.', 2: 'Neplatné přihlašovací údaje (login).',
        3: 'Neplatné přihlašovací údaje (password).', 4: 'Nedostatečný kredit.',
        5: 'Nepovolený odesílatel (sender_id).', 6: 'Neplatné telefonní číslo.',
      };
      return { code, message: map[code] || `Chyba poskytovatele (kód ${code}).` };
    };

    if (action === 'check_credit') {
        const creditParams = new URLSearchParams({ action: 'credit', login, password });
        const creditResult = await sendOnce(creditParams, 'POST');
        const creditMatch = creditResult.match(/<credit>([\d\s\.,]+)<\/credit>/i);
        if (creditMatch && creditMatch[1]) {
            const creditValue = parseFloat(creditMatch[1].replace(/\s/g, '').replace(',', '.'));
            return {
                statusCode: 200, headers,
                body: JSON.stringify({ success: true, message: `Dostupný kredit: ${creditValue.toFixed(2)} Kč`, credit: creditValue })
            };
        }
        const creditErr = parseXmlError(creditResult);
        return {
            statusCode: 200, headers,
            body: JSON.stringify({ success: false, message: creditErr ? creditErr.message : 'Nepodařilo se zjistit kredit.' })
        };
    }

    const sendError = parseXmlError(resultText);
    if (sendError) {
        return {
            statusCode: 200, headers,
            body: JSON.stringify({ success: false, message: sendError.message, errorCode: sendError.code })
        };
    }

    if (/\bOK\b/i.test(resultText) || /queued|accepted/i.test(resultText)) {
        const smsId = (resultText.split(' ')[1] || '').trim();
        return {
            statusCode: 200, headers,
            body: JSON.stringify({ success: true, message: 'SMS byla odeslána', smsId })
        };
    }

    return {
        statusCode: 200, headers,
        body: JSON.stringify({ success: false, message: `Neznámá odpověď od SMS brány: ${resultText}` })
    };

  } catch (error) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: 'Interní chyba ve funkci.',
        error: error?.message || String(error)
      })
    };
  }
};
