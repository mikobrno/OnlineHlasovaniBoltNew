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
  if (senderId) params.append('sender_id', senderId);
  params.append('unicode', '1');
  // Pro jistotu specifikujme typ
  params.append('type', 'sms');
    }

    const sendOnce = async (searchParams, method = 'POST', timeoutMs = 10000) => {
      const url = 'https://api.smsbrana.cz/smsconnect/http.php';
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const opts = method === 'GET'
          ? { method: 'GET', signal: controller.signal }
          : {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: searchParams,
              signal: controller.signal,
            };
        const response = await fetch(method === 'GET' ? `${url}?${searchParams.toString()}` : url, opts);
        const result = await response.text();

        const redacted = Object.fromEntries(searchParams.entries());
        if (redacted.password) redacted.password = '***';
        // Debug logging do konzole
        console.log('SMSbrana request:', {
          url,
          method,
          params: redacted,
          response: result,
          httpStatus: response.status
        });
        return result;
      } catch (e) {
        console.log('SMSbrana network error:', e?.message || String(e));
        return `ERROR: ${e?.message || String(e)}`;
      } finally { clearTimeout(timeout); }
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
      // Pro některé účty může být akce jiná; zkusíme více variant a vybereme nejlepší
      const attempts = [];

      const run = async (label, overrideAction) => {
        const sp = new URLSearchParams();
        sp.append('action', overrideAction);
        sp.append('login', login);
        sp.append('password', password);
        const txt = await sendOnce(sp);
        // Hrubý parser kreditu
        let credit = NaN;
        const notes = [];
        const m1 = txt.match(/<credit>\s*([0-9]+(?:[.,][0-9]+)?)\s*<\/credit>/i);
        if (m1) { credit = parseFloat(m1[1].replace(',', '.')); notes.push(`XML:${m1[1]}`); }
        if (isNaN(credit)) {
          const m2 = txt.match(/(?:credit|kredit)[\s:]*([0-9]+(?:[.,][0-9]+)?)/i);
          if (m2) { credit = parseFloat(m2[1].replace(',', '.')); notes.push(`TEXT:${m2[0]}`); }
        }
        if (isNaN(credit)) {
          const m3 = txt.match(/([0-9]+(?:[.,][0-9]+)?)\s*Kč/i);
          if (m3) { credit = parseFloat(m3[1].replace(',', '.')); notes.push(`CZK:${m3[0]}`); }
        }
        attempts.push({ label, credit: isNaN(credit) ? null : credit, sample: txt.slice(0, 200) });
        return { txt, credit };
      };

      // Pořadí variant (podle zkušenosti): credit, get_credit, account
      // Nejprve POST, pokud nelze přečíst, zkus GET (některé implementace preferují GET)
      const v1 = await run('action=credit (POST)', 'credit');
      let chosen = v1;
      if (isNaN(v1.credit)) {
        const v2 = await run('action=get_credit (POST)', 'get_credit');
        chosen = isNaN(v2.credit) ? chosen : v2;
        if (isNaN(chosen.credit)) {
          const v3 = await run('action=account (POST)', 'account');
          chosen = isNaN(v3.credit) ? chosen : v3;
        }
      }
      if (isNaN(chosen.credit)) {
        // GET fallbacky
        const runGet = async (label, overrideAction) => {
          const sp = new URLSearchParams();
          sp.append('action', overrideAction);
          sp.append('login', login);
          sp.append('password', password);
          const txt = await sendOnce(sp, 'GET');
          let credit = NaN;
          const m1 = txt.match(/<credit>\s*([0-9]+(?:[.,][0-9]+)?)\s*<\/credit>/i);
          if (m1) credit = parseFloat(m1[1].replace(',', '.'));
          else {
            const m2 = txt.match(/(?:credit|kredit)[\s:]*([0-9]+(?:[.,][0-9]+)?)/i);
            if (m2) credit = parseFloat(m2[1].replace(',', '.'));
          }
          attempts.push({ label: `${label} (GET)`, credit: isNaN(credit) ? null : credit, sample: txt.slice(0, 200) });
          return { txt, credit };
        };
        const g1 = await runGet('action=credit', 'credit');
        chosen = isNaN(g1.credit) ? chosen : g1;
        if (isNaN(chosen.credit)) {
          const g2 = await runGet('action=get_credit', 'get_credit');
          chosen = isNaN(g2.credit) ? chosen : g2;
        }
      }

      const ok = !isNaN(chosen.credit);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: ok,
          message: ok ? `Dostupný kredit: ${chosen.credit} Kč` : 'Kredit zjištěn, ale nelze přečíst hodnotu (viz attempts).',
          credit: ok ? chosen.credit : undefined,
          attempts
        })
      };
    } else {
      // send_sms
      const classifyResult = (txt) => {
        const t = (txt || '').trim();
        const hasError = /ERROR|<err>\s*\d+\s*<\/err>/i.test(t);
        const okExplicit = /\bOK\b/i.test(t) || /<result>\s*OK\s*<\/result>/i.test(t) || /queued|accepted/i.test(t);
        const looksLikeId = /\b(id|smsid|msgid)\b\s*[:=]?\s*\d+/i.test(t) || /<id>\s*\d+\s*<\/id>/i.test(t);
        const emptyOk = t.length === 0; // někteří provideré vrací prázdné tělo při přijetí do fronty
        const ok = (okExplicit || looksLikeId || emptyOk) && !hasError;
        const status = okExplicit ? 'accepted' : (looksLikeId ? 'accepted(id)' : (emptyOk ? 'accepted(empty)' : 'unknown'));
        return { ok, hasError, raw: t, status };
      };

      // První výsledek
      console.log('SMS send - first result:', result);

      const firstClass = classifyResult(result);
      if (!firstClass.ok) {
        // Zkus jednoduchý fallback: parametr "numbers" a bez sender_id/route/type
        const firstErr = parseXmlError(result);
        if (firstErr?.code === 6) {
          // Postupně zkoušíme několik kombinací parametrů/formatů čísla
          const attempts = [];

          const trySend = async (label, buildParams) => {
            const p = buildParams();
            const r = await sendOnce(p);
            const cls = classifyResult(r);
            attempts.push({ label, ok: cls.ok, status: cls.status, raw: r?.slice(0, 200) });
            return { r, cls };
          };

          // 1) numbers=420xxxxxxxxx
          const r1 = await trySend('numbers=420', () => {
            const sp = new URLSearchParams();
            sp.append('action', 'send_sms');
            sp.append('login', (process.env.SMSBRANA_LOGIN || process.env.VITE_SMSBRANA_LOGIN || ''));
            sp.append('password', (process.env.SMSBRANA_PASSWORD || process.env.VITE_SMSBRANA_PASSWORD || ''));
            sp.append('numbers', normalizedNumber);
            sp.append('message', message || '');
            sp.append('unicode', '1');
            sp.append('type', 'sms');
            return sp;
          });
          if (r1.cls.ok) {
            const smsId = (r1.r.split(' ')[1] || '').trim();
            return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: 'SMS byla odeslána', smsId, normalizedNumber, rawResult: r1.r, providerStatus: r1.cls.status || 'accepted(fallback:numbers)', attempts }) };
          }

          // Připrav odvozené formáty
          const with00420 = normalizedNumber.startsWith('420') ? `00${normalizedNumber}` : (normalizedNumber.startsWith('00') ? normalizedNumber : `00${normalizedNumber}`);
          const withPlus420 = normalizedNumber.startsWith('420') ? `+${normalizedNumber}` : (normalizedNumber.startsWith('+') ? normalizedNumber : `+${normalizedNumber}`);

          // 2) number=00420...
          const r2 = await trySend('number=00420', () => {
            const sp = new URLSearchParams();
            sp.append('action', 'send_sms');
            sp.append('login', (process.env.SMSBRANA_LOGIN || process.env.VITE_SMSBRANA_LOGIN || ''));
            sp.append('password', (process.env.SMSBRANA_PASSWORD || process.env.VITE_SMSBRANA_PASSWORD || ''));
            sp.append('number', with00420);
            sp.append('message', message || '');
            sp.append('unicode', '1');
            sp.append('type', 'sms');
            return sp;
          });
          if (r2.cls.ok) {
            const smsId = (r2.r.split(' ')[1] || '').trim();
            return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: 'SMS byla odeslána', smsId, normalizedNumber: with00420, rawResult: r2.r, providerStatus: r2.cls.status || 'accepted(fallback:00420)', attempts }) };
          }

          // 3) number=+420...
          const r3 = await trySend('number=+420', () => {
            const sp = new URLSearchParams();
            sp.append('action', 'send_sms');
            sp.append('login', (process.env.SMSBRANA_LOGIN || process.env.VITE_SMSBRANA_LOGIN || ''));
            sp.append('password', (process.env.SMSBRANA_PASSWORD || process.env.VITE_SMSBRANA_PASSWORD || ''));
            sp.append('number', withPlus420);
            sp.append('message', message || '');
            sp.append('unicode', '1');
            sp.append('type', 'sms');
            return sp;
          });
          if (r3.cls.ok) {
            const smsId = (r3.r.split(' ')[1] || '').trim();
            return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: 'SMS byla odeslána', smsId, normalizedNumber: withPlus420, rawResult: r3.r, providerStatus: r3.cls.status || 'accepted(fallback:+420)', attempts }) };
          }

          // Přepiš result posledním pokusem, aby se vrátila poslední odpověď + přilož pokusy
          result = r3.r;
          // Dejte uživateli detail pokusů v odpovědi (bude v rawResult a attempts)
          console.log('SMS send - attempts summary:', attempts);
          // spadne do společného error return níže
        }
      }

  const finalClass = classifyResult(result);
  if (finalClass.ok) {
        const smsId = (result.split(' ')[1] || '').trim();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true, 
            message: 'SMS byla odeslána', 
            smsId,
            normalizedNumber,
    rawResult: result,
    providerStatus: finalClass.status || 'accepted'
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
      message: parsedErr ? parsedErr.message : `Chyba při odesílání SMS: ${result || 'prázdná odpověď'}`,
          errorCode: parsedErr?.code,
          normalizedNumber,
          rawResult: result,
      providerStatus: 'rejected',
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
