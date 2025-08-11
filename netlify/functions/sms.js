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
    if (action === 'send_sms') {
      params.append('number', phoneNumber?.replace(/\s+/g, '').replace(/^\+/, '') || '');
      params.append('message', message || '');
      params.append('sender_id', 'OnlineSprava');
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
        const credit = parseFloat(result.replace('CREDIT ', ''));
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true, 
            message: `Dostupný kredit: ${credit} Kč`,
            credit: credit,
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
            rawResult: result
          })
        };
      } else {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: false, 
            message: `Chyba při odesílání SMS: ${result}`,
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
