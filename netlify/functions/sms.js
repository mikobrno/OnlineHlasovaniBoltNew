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
      // 1) Striktní normalizace: jen číslice
      normalizedNumber = (phoneNumber || '')
        .toString()
        .trim()
        .replace(/[^0-9]/g, ''); // ponech jen čísla

      // 2) Zahodit "00" prefix (např. 00420 -> 420)
      if (/^00\d+/.test(normalizedNumber)) {
        normalizedNumber = normalizedNumber.replace(/^00/, '');
      }

      // 3) Pokud 9 číslic (CZ mobil), přidej 420
      if (/^\d{9}$/.test(normalizedNumber)) {
        normalizedNumber = '420' + normalizedNumber;
      }

      // 4) Pokud začíná 420 a má méně/vice než 12 číslic, je to podezřelé
      if (/^420/.test(normalizedNumber) && normalizedNumber.length !== 12) {
        // Např. omylem dvojité 420 atd. Pokus se opravit běžný případ 42000...
        normalizedNumber = normalizedNumber.replace(/^4200/, '420');
      }

      // 5) Rychlá validace
      const isLikelyCzMobile = /^420\d{9}$/.test(normalizedNumber);
      if (!isLikelyCzMobile) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Neplatné telefonní číslo po normalizaci. Použijte 420xxxxxxxxx (9 číslic po 420).',
            normalizedNumber,
            debug: { original: phoneNumber, length: normalizedNumber.length }
          })
        };
      }

      params.append('number', normalizedNumber);
      params.append('message', message || '');
      // Optional custom sender (must be approved by provider)
      const senderId = process.env.SMSBRANA_SENDER_ID || process.env.VITE_SMSBRANA_SENDER_ID || '';
      if (senderId) params.append('sender_id', senderId);
      params.append('unicode', '1');
    }

    const sendOnce = async (searchParams) => {
      const response = await fetch('https://api.smsbrana.cz/smsconnect/http.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: searchParams
      });
      return response.text();
    };

    let result = await sendOnce(params);

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
        // Vyparsuj číslo z odpovědi (preferuj XML <credit> a "credit" vzory)
        let credit = NaN;
        // 1) XML <credit>123</credit>
        const xmlMatch = (result.match(/<credit>\s*([0-9]+(?:[.,][0-9]+)?)\s*<\/credit>/i) || [])[1];
        if (xmlMatch) {
          credit = parseFloat(xmlMatch.replace(',', '.'));
        }
        // 2) Text "credit ..."
        if (isNaN(credit)) {
          const credMatch = (result.match(/credit[^0-9-]*(-?\d+(?:[.,]\d+)?)/i) || [])[1];
          if (credMatch) credit = parseFloat(credMatch.replace(',', '.'));
        }
        // 3) Poslední číslo v řetězci (vyhne se XML verzi 1.0)
        if (isNaN(credit)) {
          const allNums = result.match(/-?\d+(?:[.,]\d+)?/g);
          if (allNums && allNums.length) {
            const last = allNums[allNums.length - 1];
            credit = parseFloat(last.replace(',', '.'));
          }
        }
    return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true, 
      message: isNaN(credit) ? 'Kredit zjištěn, ale nelze přečíst hodnotu (viz rawResult).' : `Dostupný kredit: ${credit}`,
            credit: isNaN(credit) ? undefined : credit,
            rawResult: result
          })
        };
      }
    } else {
      // send_sms
      const attempts = [];
      const okLike = (txt) => /\bOK\b/i.test(txt) || /<result>\s*OK\s*<\/result>/i.test(txt);

      if (okLike(result)) {
        const smsId = (result.split(' ')[1] || '').trim();
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
      }

      // První pokus selhal – zkusit diagnostiku a případný fallback
      let parsedErr = parseXmlError(result);
      attempts.push({ attempt: 1, param: 'number', result, errorCode: parsedErr?.code });

      if (parsedErr?.code === 6) {
        // Fallback: některé integrace vyžadují parametr "numbers"
        const alt = new URLSearchParams();
        alt.append('action', 'send_sms');
        alt.append('login', (process.env.SMSBRANA_LOGIN || process.env.VITE_SMSBRANA_LOGIN || ''));
        alt.append('password', (process.env.SMSBRANA_PASSWORD || process.env.VITE_SMSBRANA_PASSWORD || ''));
        alt.append('numbers', normalizedNumber); // změna zde
        alt.append('message', message || '');
        const senderId = process.env.SMSBRANA_SENDER_ID || process.env.VITE_SMSBRANA_SENDER_ID || '';
        if (senderId) alt.append('sender_id', senderId);
        alt.append('unicode', '1');

        const altResult = await sendOnce(alt);
        if (okLike(altResult)) {
          const smsId = (altResult.split(' ')[1] || '').trim();
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
              success: true, 
              message: 'SMS byla odeslána', 
              smsId,
              normalizedNumber,
              rawResult: altResult,
              attempts
            })
          };
        }
        const altErr = parseXmlError(altResult);
        attempts.push({ attempt: 2, param: 'numbers', result: altResult, errorCode: altErr?.code });
        // Navrať detailní chybu po fallbacku
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: false,
            message: (altErr ? altErr.message : `Chyba při odesílání SMS: ${altResult}`),
            errorCode: altErr?.code,
            normalizedNumber,
            rawResult: altResult,
            attempts,
            payloadSummary: { length: (message || '').length }
          })
        };
      }

      // Nejedná se o err=6 – vrať první chybu
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: parsedErr ? parsedErr.message : `Chyba při odesílání SMS: ${result}`,
          errorCode: parsedErr?.code,
          normalizedNumber,
          rawResult: result,
          attempts,
          payloadSummary: { length: (message || '').length }
        })
      };
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
