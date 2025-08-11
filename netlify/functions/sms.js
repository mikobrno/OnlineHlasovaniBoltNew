// Verze: Final Clean 11.8.2025
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
      let cleaned = (phoneNumber || '')
        .toString()
        .trim()
        .replace(/[^0-9]/g, ''); // ponech jen čísla

      console.log('Phone normalization step 1 - cleaned:', cleaned);

      // 2) Zahodit "00" prefix (např. 00420 -> 420)
      if (/^00\d+/.test(cleaned)) {
        cleaned = cleaned.replace(/^00/, '');
        console.log('Phone normalization step 2 - removed 00:', cleaned);
      }

      // 3) Pokud začíná 420, ověř délku
      if (/^420/.test(cleaned)) {
        if (cleaned.length === 12) {
          normalizedNumber = cleaned; // 420xxxxxxxxx je OK
        } else if (cleaned.length > 12) {
          // Možná duplicitní 420 - zkus odstranit první
          normalizedNumber = cleaned.substring(3);
          console.log('Phone normalization step 3a - removed duplicate 420:', normalizedNumber);
        } else {
          normalizedNumber = cleaned; // nech to být, možná je to OK
        }
      } else if (/^\d{9}$/.test(cleaned)) {
        // 4) Pokud 9 číslic (CZ mobil), přidej 420
        normalizedNumber = '420' + cleaned;
        console.log('Phone normalization step 4 - added 420:', normalizedNumber);
      } else {
        normalizedNumber = cleaned;
      }

      console.log('Final normalized number:', normalizedNumber);

      // 5) Rychlá validace - musí být přesně 12 číslic začínajících 420
      const isValid = /^420\d{9}$/.test(normalizedNumber);
      if (!isValid) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: false,
            message: `Neplatné telefonní číslo po normalizaci. Musí být 420xxxxxxxxx (celkem 12 číslic). Aktuální: ${normalizedNumber}`,
            normalizedNumber,
            debug: { 
              original: phoneNumber, 
              cleaned, 
              length: normalizedNumber.length,
              isValid
            }
          })
        };
      }

      // Dle dokumentace posíláme formát 420... (bez +)
      params.append('number', normalizedNumber);
      params.append('message', message || '');
      // Odesílatel je klíčový. Posíláme ho vždy, i když je prázdný, aby se použil default.
      const senderId = process.env.SMSBRANA_SENDER_ID || process.env.VITE_SMSBRANA_SENDER_ID || '';
      params.append('sender_id', senderId);
      params.append('unicode', '1');
      // Přidáme standardní parametry pro SMSbrana
      params.append('route', 'economy');
      params.append('type', 'sms');
    }

    const sendOnce = async (searchParams) => {
      const response = await fetch('https://api.smsbrana.cz/smsconnect/http.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: searchParams
      });
      const result = await response.text();
      
      // Debug logging do konzole
      console.log('SMSbrana request:', {
        url: 'https://api.smsbrana.cz/smsconnect/http.php',
        params: Object.fromEntries(searchParams.entries()),
        response: result,
        httpStatus: response.status
      });
      
      return result;
    };

    const result = await sendOnce(params);

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
      console.log('Credit check - raw result:', result);
      
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
        // Robustní parsing kreditu s debug informacemi
        let credit = NaN;
        const debugInfo = { patterns: [] };
        
        // 1) XML <credit>123</credit> nebo <credit>123.45</credit>
        const xmlMatch = result.match(/<credit>\s*([0-9]+(?:[.,][0-9]+)?)\s*<\/credit>/i);
        if (xmlMatch) {
          credit = parseFloat(xmlMatch[1].replace(',', '.'));
          debugInfo.patterns.push(`XML: ${xmlMatch[1]} → ${credit}`);
        }
        
        // 2) Vzor "credit: 200" nebo "kredit 200 Kč" (case insensitive)
        if (isNaN(credit)) {
          const credMatch = result.match(/(?:credit|kredit)[\s:]*([0-9]+(?:[.,][0-9]+)?)/i);
          if (credMatch) {
            credit = parseFloat(credMatch[1].replace(',', '.'));
            debugInfo.patterns.push(`Text: ${credMatch[0]} → ${credit}`);
          }
        }
        
        // 3) Vzor "200 Kč" nebo "200Kč"
        if (isNaN(credit)) {
          const czMatch = result.match(/([0-9]+(?:[.,][0-9]+)?)\s*Kč/i);
          if (czMatch) {
            credit = parseFloat(czMatch[1].replace(',', '.'));
            debugInfo.patterns.push(`CZK: ${czMatch[0]} → ${credit}`);
          }
        }
        
        // 4) Hledáme "200" jako standalone číslo (ne součást XML verze)
        if (isNaN(credit)) {
          const standalone = result.match(/\b([0-9]+(?:[.,][0-9]+)?)\b/g);
          if (standalone) {
            // Vyfiltruj "1.0" a jiná podezřelá čísla
            const filtered = standalone.filter(n => !['1.0', '0', '1'].includes(n) && parseFloat(n.replace(',', '.')) >= 5);
            if (filtered.length > 0) {
              credit = parseFloat(filtered[0].replace(',', '.'));
              debugInfo.patterns.push(`Standalone: ${filtered[0]} → ${credit}`);
            }
          }
        }
        
        console.log('Credit parsing result:', { credit, debugInfo, rawResult: result });
        
    return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true, 
      message: isNaN(credit) ? 'Kredit zjištěn, ale nelze přečíst hodnotu (viz rawResult).' : `Dostupný kredit: ${credit} Kč`,
            credit: isNaN(credit) ? undefined : credit,
            rawResult: result,
            debugInfo
          })
        };
      }
    } else {
      // send_sms
      const okLike = (txt) => /\bOK\b/i.test(txt) || /<result>\s*OK\s*<\/result>/i.test(txt);

      console.log('SMS send - final attempt result:', result);

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

      // Chyba
      const parsedErr = parseXmlError(result);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: parsedErr ? parsedErr.message : `Chyba při odesílání SMS: ${result}`,
          errorCode: parsedErr?.code,
          normalizedNumber,
          rawResult: result,
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
