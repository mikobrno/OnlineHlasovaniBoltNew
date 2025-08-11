interface SMSbranaConfig {
  login: string;
  password: string;
  apiUrl: string;
}

interface SMSResponse {
  success: boolean;
  message: string;
  smsId?: string;
}

export class SMSService {
  // Informativní konfigurace (runtime odeslání jde přes serverless funkci)
  private config: SMSbranaConfig;

  constructor() {
    this.config = {
  // Tyto hodnoty používáme jen informačně; vlastní odeslání probíhá přes serverless funkci,
  // která má přístup k runtime proměnným prostředí na Netlify.
  login: import.meta.env.VITE_SMSBRANA_LOGIN || '',
  password: import.meta.env.VITE_SMSBRANA_PASSWORD || '',
      apiUrl: 'https://api.smsbrana.cz/smsconnect/http.php'
    };
  }

  async sendSMS(phoneNumber: string, message: string): Promise<SMSResponse> {
    // Pouhé informativní varování v dev, reálné přihlašovací údaje používá serverless funkce
    if (import.meta.env.DEV && (!this.config.login || !this.config.password)) {
      console.warn('SMSbrana credentials not found in client env; proceeding via serverless function.');
    }
    try {
      // Použijeme Netlify function místo přímého volání API
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'send_sms',
          phoneNumber,
          message
        })
      });

  const data = await response.json();
  console.debug('SMS send response', { url: apiUrl, status: response.status, data });
  return data;
    } catch (error) {
      console.error('SMS sending error:', error);
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
        body: JSON.stringify({ action: 'check_credit' })
      });
  const data = await response.json();
  console.debug('SMS credit test response', { url: apiUrl, status: response.status, data });
  return Boolean(data?.success);
  } catch {
      return false;
    }
  }

  async getCredit(): Promise<{ success: boolean; message: string; credit?: number }> {
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
        body: JSON.stringify({ action: 'check_credit' })
      });
  const result = await response.json();
  console.debug('SMS get credit response', { url: apiUrl, status: response.status, result });
  if (result?.success) {
        return {
          success: true,
          message: result?.message || 'OK',
          credit: result?.credit
        };
      }
      return { success: false, message: result?.message || 'Chyba při zjišťování kreditu' };
  } catch {
      return { success: false, message: 'Chyba při zjišťování kreditu' };
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