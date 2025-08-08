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
  private config: SMSbranaConfig;

  constructor() {
    this.config = {
      login: import.meta.env.VITE_SMSBRANA_LOGIN || '',
      password: import.meta.env.VITE_SMSBRANA_PASSWORD || '',
      apiUrl: 'https://api.smsbrana.cz/smsconnect/http.php'
    };
  }

  async sendSMS(phoneNumber: string, message: string): Promise<SMSResponse> {
    if (!this.config.login || !this.config.password) {
      console.warn('SMSbrana credentials not configured');
      return { success: false, message: 'SMS služba není nakonfigurována' };
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
    if (!this.config.login || !this.config.password) {
      return false;
    }

    try {
      const params = new URLSearchParams({
        action: 'check_credit',
        username: this.config.login,
        password: this.config.password
      });

      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params
      });

      const result = await response.text();
      return !result.includes('ERROR');
    } catch (error) {
      return false;
    }
  }

  async getCredit(): Promise<{ success: boolean; message: string; credit?: number }> {
    if (!this.config.login || !this.config.password) {
      return { success: false, message: 'SMS služba není nakonfigurována' };
    }

    try {
      const params = new URLSearchParams({
        action: 'check_credit',
        username: this.config.login,
        password: this.config.password
      });

      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params
      });

      const result = await response.text();
      
      if (result.includes('ERROR')) {
        return { success: false, message: `Chyba: ${result}` };
      } else {
        const credit = parseFloat(result.replace('CREDIT ', ''));
        return { 
          success: true, 
          message: `Dostupný kredit: ${credit} Kč`,
          credit: credit
        };
      }
    } catch (error) {
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