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
      const params = new URLSearchParams({
        action: 'send_sms',
        username: this.config.login,
        password: this.config.password,
        recipient: phoneNumber.replace(/\s+/g, '').replace(/^\+/, ''),
        message: message,
        sender_id: 'OnlineSprava'
      });

      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params
      });

      const result = await response.text();
      
      if (result.includes('OK')) {
        const smsId = result.split(' ')[1];
        return { success: true, message: 'SMS byla odeslána', smsId };
      } else {
        return { success: false, message: `Chyba při odesílání SMS: ${result}` };
      }
    } catch (error) {
      console.error('SMS sending error:', error);
      return { success: false, message: 'Chyba při odesílání SMS' };
    }
  }

  async sendVerificationCode(phoneNumber: string, code: string): Promise<SMSResponse> {
    const message = `OnlineSprava - Váš ověřovací kód pro hlasování: ${code}. Kód je platný 10 minut.`;
    return this.sendSMS(phoneNumber, message);
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