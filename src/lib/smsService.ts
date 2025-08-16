// ============== Typy konfigurace a odezev ==============
interface SMSbranaConfig {
  login: string;
  password: string;
  apiUrl: string;
}

export interface SMSResponse {
  success: boolean;
  message: string;         // Původní / shrnutá zpráva
  smsId?: string;          // Identifikátor odeslané SMS (pokud lze detekovat)
  code?: string;           // Volitelný kód (OK, ERROR_XX, atd.)
  raw?: string;            // Celá surová odpověď z API
}

interface CreditAttempt { label: string; credit: number | null; sample: string }
export interface SMSCreditResponse {
  success: boolean;
  message: string;
  credit?: number;
  attempts?: CreditAttempt[];
  raw?: string;            // Poslední / první nalezená odpověď
}

// ============== Pomocné funkce parsování ==============
export class SMSParser {
  /**
   * Parsuje odpověď pro odeslání SMS.
   * Příklady akceptovaných variant (heuristiky):
   *  - "OK"
   *  - "OK:123456"
   *  - "OK 123456"
   *  - "ID=123456 OK"
   *  - "ERROR 23 Wrong password"
   *  - "ERROR: message"
   */
  static parseSend(raw: string): SMSResponse {
    const trimmed = raw.trim();
    const upper = trimmed.toUpperCase();
    let smsId: string | undefined;
    let success = false;
    let code: string | undefined;

    // Najdi řádek s potenciálním kódem (první řádek je mnohdy dostatečný)
    const firstLine = trimmed.split(/\r?\n/)[0];

    // Detekce úspěchu
    if (/\bOK\b/i.test(firstLine) && !/ERROR|CHYBA/i.test(upper)) {
      success = true;
      code = 'OK';
    }

    // Detekce chybového kódu (ERROR, CHYBA, FAIL, ERR_XX)
    if (!success) {
      const errorMatch = firstLine.match(/^(ERROR|CHYBA|FAIL|ERR[_A-Z0-9]*)/i);
      if (errorMatch) {
        code = errorMatch[1].toUpperCase();
      }
    }

    // Pokusy o identifikaci ID
    // 1) Varianty po OK
    const okIdMatch = firstLine.match(/\bOK[:\s-]*([A-Za-z0-9_-]{3,})/i);
    if (okIdMatch) {
      smsId = okIdMatch[1];
    }
    // 2) Explicitní ID= nebo ID:
    if (!smsId) {
      const idMatch = firstLine.match(/\bID\s*[:=]\s*([A-Za-z0-9_-]{3,})/i);
      if (idMatch) smsId = idMatch[1];
    }
    // 3) Jakákoli token po OK (fallback) pokud vypadající jako ID a není jen "OK"
    if (!smsId && success) {
      const tokens = firstLine.split(/\s+/).filter(Boolean);
      const okIndex = tokens.findIndex(t => /^OK$/i.test(t));
      if (okIndex > -1 && tokens[okIndex + 1]) {
        const candidate = tokens[okIndex + 1];
        if (/^[A-Za-z0-9_-]{3,}$/.test(candidate)) smsId = candidate;
      }
    }

  return { success, message: trimmed, smsId, code, raw };
  }

  /**
   * Parsuje odpověď s kreditem.
   * Heuristiky:
   *  - Hledá výraz (credit|kredit) = číslo
   *  - Pokud nic, všechny samostatné číselné tokeny; vybere poslední nebo největší dle kontextu
   */
  static parseCredit(raw: string): { credit: number | null; attempts: CreditAttempt[] } {
    const attempts: CreditAttempt[] = [];
    const text = raw.trim();

    // 1) Explicitní klíčové slovo CREDIT/KREDIT
    const kwMatch = text.match(/(credit|kredit)[:=\s]+(\d+(?:[.,]\d+)?)/i);
    if (kwMatch) {
      const val = parseFloat(kwMatch[2].replace(',', '.'));
      attempts.push({ label: 'keyword', credit: val, sample: text.slice(0, 120) });
      return { credit: val, attempts };
    }
    attempts.push({ label: 'keyword', credit: null, sample: text.slice(0, 120) });

    // 2) Celý řetězec pouze číslo
    if (/^\d+(?:[.,]\d+)?$/.test(text)) {
      const val = parseFloat(text.replace(',', '.'));
      attempts.push({ label: 'whole_line', credit: val, sample: text.slice(0, 120) });
      return { credit: val, attempts };
    }
    attempts.push({ label: 'whole_line', credit: null, sample: text.slice(0, 120) });

    // 3) Všechna čísla – vybereme poslední (často bývá relevantní) a zároveň největší jako fallback
    const numbers = text.match(/\b\d+(?:[.,]\d+)?\b/g);
    if (numbers) {
      const parsed = numbers.map(n => parseFloat(n.replace(',', '.'))).filter(n => !Number.isNaN(n));
      if (parsed.length > 0) {
        const last = parsed[parsed.length - 1];
        const max = Math.max(...parsed);
        attempts.push({ label: 'numbers_last', credit: last, sample: text.slice(0, 120) });
        attempts.push({ label: 'numbers_max', credit: max, sample: text.slice(0, 120) });
        return { credit: last, attempts };
      }
    }
    attempts.push({ label: 'numbers_scan', credit: null, sample: text.slice(0, 120) });

    // 4) Nic nenalezeno
    return { credit: null, attempts };
  }
}

export class SMSService {
  // Informativní konfigurace (runtime odeslání jde přes serverless funkci)
  private config: SMSbranaConfig;
  private locale: 'cs' | 'en' = 'cs';
  private debug = false;
  private defaultCountryCode = '+420'; // Předpoklad CZ, lze změnit metodou setDefaultCountryCode

  constructor() {
    this.config = {
      // Tyto hodnoty používáme jen informačně; vlastní odeslání probíhá přes serverless funkci,
      // která má přístup k runtime proměnným prostředí na Netlify.
      login: import.meta.env.VITE_SMSBRANA_LOGIN || '',
      password: import.meta.env.VITE_SMSBRANA_PASSWORD || '',
      apiUrl: 'https://api.smsbrana.cz/smsconnect/http.php',
    };
  }

  setLocale(locale: 'cs' | 'en') {
    this.locale = locale;
  }

  setDebug(enabled: boolean) { this.debug = enabled; }
  setDefaultCountryCode(code: string) { this.defaultCountryCode = code.startsWith('+') ? code : `+${code}`; }

  private log(...args: unknown[]) {
    if (this.debug) console.log('[SMS]', ...args);
  }

  /** Normalizuje telefonní číslo na mezinárodní formát.
   * Heuristiky:
   *  - odstraní nečíselné znaky kromě +
   *  - pokud začíná '00', nahradí za '+' (00 420 ... -> +420...)
   *  - pokud začíná '+', ponechá
   *  - pokud začíná jednou nulou a má délku odpovídající národnímu formátu (např. 9 číslic po nule), přidá defaultCountryCode a odstraní počáteční 0
   *  - jinak pokud nemá prefix + a neobsahuje kód země, přidá defaultCountryCode
   */
  normalizePhoneNumber(input: string): string {
    const raw = input.trim();
    // povol pouze číslice a +
    let cleaned = raw.replace(/[^+\d]/g, '');
    if (cleaned.startsWith('00')) cleaned = `+${cleaned.slice(2)}`;
    if (cleaned.startsWith('+')) return cleaned;
    if (/^0\d{8,}$/.test(cleaned)) {
      return this.defaultCountryCode + cleaned.slice(1);
    }
    if (!/^\+/.test(cleaned)) {
      return this.defaultCountryCode + cleaned;
    }
    return cleaned;
  }

  private async fetchWithRetry(url: string, attempts = 3, delayMs = 200): Promise<Response> {
    let lastErr: unknown;
    for (let i = 0; i < attempts; i++) {
      try {
        const res = await fetch(url);
        if (res.ok) return res;
        if (![429, 500, 502, 503, 504].includes(res.status) || i === attempts - 1) return res;
        this.log(`Retry ${i + 1}/${attempts} after HTTP ${res.status}`);
      } catch (e) {
        lastErr = e;
        if (i === attempts - 1) throw e;
        this.log(`Retry ${i + 1}/${attempts} after network error`, e);
      }
      await new Promise(r => setTimeout(r, delayMs * Math.pow(2, i))); // expo backoff
    }
    throw lastErr ?? new Error('Unknown fetch error');
  }

  async sendSMS(phoneNumber: string, message: string): Promise<SMSResponse> {
    // Nově: přímé volání SMSbrana API metodou GET s parametry v URL
    if (!this.config.login || !this.config.password) {
      console.warn('[SMS] Chybí přihlašovací údaje SMSbrana (login/password).');
    }
    try {
      const normalized = this.normalizePhoneNumber(phoneNumber);
      const url = `${this.config.apiUrl}?` +
        `action=send_sms` +
        `&username=${encodeURIComponent(this.config.login)}` +
        `&password=${encodeURIComponent(this.config.password)}` +
        `&recipient=${encodeURIComponent(normalized)}` +
        `&message=${encodeURIComponent(message)}`;

      const response = await this.fetchWithRetry(url); // implicitně GET (s retry)
      const text = await response.text();
      this.log('send raw response', { url, status: response.status, text });

      const parsed = SMSParser.parseSend(text);
      // Lokalizované mapy chybových kódů
      const errorMaps: Record<'cs' | 'en', Record<string, string>> = {
        cs: {
          'ERROR': 'Obecná chyba brány',
          'CHYBA': 'Chyba při zpracování požadavku',
          'FAIL': 'Odeslání selhalo',
          'ERR_AUTH': 'Neplatné přihlašovací údaje',
          'ERR_CREDIT': 'Nedostatečný kredit',
          'ERR_RECIPIENT': 'Neplatné číslo příjemce',
          'ERR_MESSAGE': 'Neplatný nebo prázdný text zprávy',
        },
        en: {
          'ERROR': 'Generic gateway error',
          'CHYBA': 'Processing error',
          'FAIL': 'Send failed',
          'ERR_AUTH': 'Invalid credentials',
          'ERR_CREDIT': 'Insufficient credit',
          'ERR_RECIPIENT': 'Invalid recipient number',
          'ERR_MESSAGE': 'Invalid or empty message text',
        },
      };
      if (!parsed.success) {
        const map = errorMaps[this.locale];
        const friendly = parsed.code && map[parsed.code] ? `${map[parsed.code]} (code: ${parsed.code})` : parsed.message;
        parsed.message = friendly;
      } else if (parsed.success && this.locale === 'cs') {
        // Volitelně přívětivější success zpráva pokud odpověď je jen OK
        if (/^OK\b/i.test(parsed.raw || '') && parsed.message === 'OK') {
          parsed.message = 'SMS odeslána';
        }
      } else if (parsed.success && this.locale === 'en') {
        if (/^OK\b/i.test(parsed.raw || '') && parsed.message === 'OK') {
          parsed.message = 'SMS sent';
        }
      }
      // Pokud HTTP status není 200, považuj za neúspěch i kdyby text obsahoval OK.
      if (!response.ok) {
        return { ...parsed, success: false, message: `${parsed.message} (HTTP ${response.status})`, raw: text };
      }
      return parsed;
    } catch (error) {
  this.log('send error', error);
      return { success: false, message: 'Chyba při odesílání SMS' };
    }
  }

  async sendVerificationCode(phoneNumber: string, code: string): Promise<SMSResponse> {
    const message = `OnlineSprava - Váš ověřovací kód pro hlasování: ${code}. Kód je platný 10 minut.`;
    return this.sendSMS(phoneNumber, message);
  }

  async testConnection(): Promise<boolean> {
    try {
      const envBase = (import.meta as unknown as { env: { VITE_FUNCTIONS_BASE_URL?: string; DEV: boolean } }).env?.VITE_FUNCTIONS_BASE_URL;
      const isDev = (import.meta as unknown as { env: { VITE_FUNCTIONS_BASE_URL?: string; DEV: boolean } }).env?.DEV;
      const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
      const isEnvLocalhost = !!envBase && /^https?:\/\/localhost(?::\d+)?/i.test(envBase);
      const base = envBase
        ? (isEnvLocalhost ? (isDev || hostname === 'localhost' ? envBase : '') : envBase)
        : (isDev ? 'http://localhost:8888' : '');
      const apiUrl = `${base || ''}/.netlify/functions/sms`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check_credit' }),
      });
      const data = await response.json();
      console.log('[SMS] credit test response', { url: apiUrl, status: response.status, data });
      return Boolean(data?.success);
    } catch {
      return false;
    }
  }

  async getCredit(): Promise<SMSCreditResponse> {
    try {
      // Poznámka: Akce pro zjištění kreditu může být podle API "credit" nebo "get_credit" – ponecháme primární variantu a případně doplníme fallback.
      const attemptUrls = [
        `${this.config.apiUrl}?action=credit&username=${encodeURIComponent(this.config.login)}&password=${encodeURIComponent(this.config.password)}`,
        `${this.config.apiUrl}?action=get_credit&username=${encodeURIComponent(this.config.login)}&password=${encodeURIComponent(this.config.password)}`,
      ];
      const combinedAttempts: CreditAttempt[] = [];
      let lastRaw: string | undefined;
      for (const url of attemptUrls) {
        try {
          const res = await this.fetchWithRetry(url);
          const text = await res.text();
          lastRaw = text;
          this.log('credit raw response', { url, status: res.status, text });
          if (!res.ok) {
            combinedAttempts.push({ label: `${url} (http_${res.status})`, credit: null, sample: text.slice(0, 120) });
            continue;
          }
          const { credit, attempts } = SMSParser.parseCredit(text);
          // Prefix pokusů URL adresou (aby bylo jasné z jakého volání pochází)
          attempts.forEach(a => combinedAttempts.push({ ...a, label: `${url} :: ${a.label}` }));
          if (credit !== null) {
            // Cache do localStorage
            try {
              if (typeof localStorage !== 'undefined') {
                localStorage.setItem('sms_credit_cache', JSON.stringify({ credit, ts: Date.now() }));
              }
            } catch {
              /* ignore */
            }
            return { success: true, message: 'OK', credit, attempts: combinedAttempts, raw: text };
          }
        } catch (inner) {
      this.log('Chyba při pokusu o získání kreditu', inner);
          combinedAttempts.push({ label: `${url} (exception)`, credit: null, sample: String(inner).slice(0, 120) });
        }
      }
      return { success: false, message: 'Chyba při zjišťování kreditu', attempts: combinedAttempts, raw: lastRaw };
    } catch (e) {
    this.log('getCredit error', e);
      return { success: false, message: 'Chyba při zjišťování kreditu' };
    }
  }
  /**
   * Vrátí kredit z cache (localStorage) pokud je mladší než maxAgeMs (default 5 minut).
   * Pokud není cache nebo je expirovaná, vrací null.
   */
  getCachedCredit(maxAgeMs = 5 * 60 * 1000): number | null {
    try {
      if (typeof localStorage === 'undefined') return null;
      const raw = localStorage.getItem('sms_credit_cache');
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { credit: number; ts: number };
      if (typeof parsed.credit !== 'number' || typeof parsed.ts !== 'number') return null;
      if (Date.now() - parsed.ts > maxAgeMs) return null;
      return parsed.credit;
    } catch {
      return null;
    }
  }
}

export const smsService = new SMSService();

// Export funkce pro snadnější použití
export const sendSMS = async (phoneNumber: string, message: string): Promise<SMSResponse> => {
  return smsService.sendSMS(phoneNumber, message);
};

export const sendVerificationCode = async (phoneNumber: string, code: string): Promise<SMSResponse> => {
  return smsService.sendVerificationCode(phoneNumber, code);
};

export const getCredit = async () => smsService.getCredit();
export const getCachedCredit = (maxAgeMs?: number) => smsService.getCachedCredit(maxAgeMs);
export const normalizePhoneNumber = (value: string) => smsService.normalizePhoneNumber(value);
