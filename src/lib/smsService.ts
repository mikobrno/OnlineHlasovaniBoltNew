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
      const apiUrl = import.meta.env.DEV 
        ? 'http://localhost:8888/.netlify/functions/sms'
        : '/.netlify/functions/sms';

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

      const result = await response.json();
      return result;
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
      const apiUrl = import.meta.env.DEV 
        ? 'http://localhost:8888/.netlify/functions/sms'
        : '/.netlify/functions/sms';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check_credit' })
      });
      const result = await response.json();
      return Boolean(result?.success);
  } catch {
      return false;
    }
  }

  async getCredit(): Promise<{ success: boolean; message: string; credit?: number }> {
    try {
      const apiUrl = import.meta.env.DEV 
        ? 'http://localhost:8888/.netlify/functions/sms'
        : '/.netlify/functions/sms';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check_credit' })
      });
      const result = await response.json();
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