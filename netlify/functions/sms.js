// netlify/functions/sms.js - Netlify Function pro SMS API
// Uses native fetch in Node 18 (no node-fetch required)

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    let parsed = {};
    try { parsed = JSON.parse(event.body || '{}'); } catch (_) { parsed = {}; }
  const { action, phoneNumber, message } = parsed;
    
    // Env config: prefer SMSBRANA_* for functions, fallback to VITE_*
    const login = process.env.SMSBRANA_LOGIN || process.env.VITE_SMSBRANA_LOGIN || '';
    const password = process.env.SMSBRANA_PASSWORD || process.env.VITE_SMSBRANA_PASSWORD || '';
    
    // If not configured, return structured info (avoid 500 to keep console clean)
    if (!login || !password) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: false,
          message: 'SMS brána není nakonfigurována. Nastavte SMSBRANA_LOGIN a SMSBRANA_PASSWORD (nebo VITE_SMSBRANA_*).',
          configured: false
        })
      };
    }
    
  const params = new URLSearchParams({
      action: action || 'send_sms',
      login,
      password,
    });

    // Přidáme parametry podle akce
    let normalizedNumber = '';
    if (action === 'send_sms') {
      normalizedNumber = (phoneNumber || '')
        .toString()
        .trim()
        .replace(/\s+/g, '')
        .replace(/^\+/, '')
        .replace(/^00/, '');
      // Pokud je to 9 číslic (CZ mobil), přidej 420 prefix
      if (/^\d{9}$/.test(normalizedNumber)) {
        normalizedNumber = '420' + normalizedNumber;
      }
      // Normalizuj 00420... na 420...
      if (/^00420/.test(normalizedNumber)) {
        normalizedNumber = normalizedNumber.replace(/^00/, '');
      }
      params.append('number', normalizedNumber || '');
      params.append('message', message || '');
      // Optional custom sender (must be approved by provider)
      const senderId = process.env.SMSBRANA_SENDER_ID || process.env.VITE_SMSBRANA_SENDER_ID || '';
      if (senderId) params.append('sender_id', senderId);
      params.append('unicode', '1');
    }

    const response = await fetch('https://api.smsbrana.cz/smsconnect/http.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params
    });

    const result = await response.text();

    // Helper: parse XML error code like <result><err>6</err></result>
    const parseXmlError = (text) => {
      try {
        const m = /<err>(\d+)<\/err>/i.exec(text);
        if (!m) return null;
        const code = Number(m[1]);
        const map = {
          1: 'Chybí povinný parametr (login, password, number nebo message).',
          2: 'Neplatné přihlašovací údaje (login).',
          3: 'Neplatné přihlašovací údaje (password).',
          4: 'Nedostatečný kredit na účtu.',
          5: 'Nepovolený nebo neplatný odesílatel (sender_id).',
          6: 'Neplatné telefonní číslo nebo nepovolený formát. Zkuste 420xxxxxxxxx bez + a mezer.',
        };
        return { code, message: map[code] || `Chyba poskytovatele (kód ${code}).` };
      } catch { return null; }
    };
    
    if (action === 'check_credit') {
      if (result.includes('ERROR')) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: false, 
            message: `Chyba: ${result}`,
            rawResult: result
          })
        };
      } else {
        // Vyparsuj číslo z odpovědi (podpora "CREDIT 123", "CREDIT: 123", příp. XML)
        let credit = NaN;
        // 1) Text s číslem
        const numMatch = (result.match(/(-?\d+[\.,]?\d*)/) || [])[1];
        if (numMatch) {
          credit = parseFloat(numMatch.replace(',', '.'));
        }
        // 2) XML <credit>123</credit>
        const xmlMatch = (result.match(/<credit>([^<]+)<\/credit>/i) || [])[1];
        if (isNaN(credit) && xmlMatch) {
          credit = parseFloat(xmlMatch.replace(',', '.'));
        }
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true, 
            message: isNaN(credit) ? 'Kredit zjištěn, ale nelze přečíst hodnotu (viz rawResult).' : `Dostupný kredit: ${credit} Kč`,
            credit: isNaN(credit) ? undefined : credit,
            rawResult: result
          })
        };
      }
    } else {
      // send_sms
      if (result.includes('OK')) {
        const smsId = result.split(' ')[1];
    return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true, 
            message: 'SMS byla odeslána', 
            smsId,
      normalizedNumber,
            rawResult: result
          })
        };
      } else {
        const parsedErr = parseXmlError(result);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: false, 
            message: parsedErr ? parsedErr.message : `Chyba při odesílání SMS: ${result}`,
            errorCode: parsedErr?.code,
      normalizedNumber,
            rawResult: result
          })
        };
      }
    }
  } catch (error) {
    // Avoid 500 to prevent noisy console errors; return structured failure
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: 'Chyba při odesílání SMS',
        error: error?.message || String(error)
      })
    };
  }
};
