interface SMSbranaConfig {
  login: string;
  password: string;
  apiUrl: string;
}

interface SMSResponse {
  success: boolean;
  message: string;
  smsId?: string;
  credit?: number;
  details?: string;
}

interface SMSData {
  phoneNumber: string;
  message: string;
  senderId?: string;
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

  private formatPhoneNumber(phoneNumber: string): string {
    // Odstraníme mezery a speciální znaky
    let formatted = phoneNumber.replace(/[\s\-()]/g, '');
    
    // Pokud začíná +420, odebereme prefix
    if (formatted.startsWith('+420')) {
      formatted = formatted.substring(4);
    } else if (formatted.startsWith('420')) {
      formatted = formatted.substring(3);
    }
    
    // Ověříme, že číslo má správný formát (9 číslic pro CZ)
    if (!/^[1-9]\d{8}$/.test(formatted)) {
      throw new Error('Neplatný formát telefonního čísla. Očekávány 9 číslic.');
    }
    
    return formatted;
  }

  async sendSMS(smsData: SMSData): Promise<SMSResponse> {
    if (!this.config.login || !this.config.password) {
      console.warn('SMSbrana credentials not configured');
      return { 
        success: false, 
        message: 'SMS služba není nakonfigurována. Zkontrolujte přihlašovací údaje.',
        details: 'Chybí VITE_SMSBRANA_LOGIN nebo VITE_SMSBRANA_PASSWORD v .env souboru'
      };
    }

    try {
      console.log('Odesílání SMS přes SMSbrana:', {
        phoneNumber: smsData.phoneNumber,
        messageLength: smsData.message.length,
        senderId: smsData.senderId
      });

      const formattedPhone = this.formatPhoneNumber(smsData.phoneNumber);
      
      const params = new URLSearchParams({
        action: 'send_sms',
        username: this.config.login,
        password: this.config.password,
        recipient: formattedPhone,
        message: smsData.message,
        sender_id: smsData.senderId || 'OnlineSprava'
      });

      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();
      console.log('SMSbrana response:', result);
      
      // Parsování odpovědi od SMSbrany
      if (result.includes('OK')) {
        const parts = result.split(' ');
        const smsId = parts.length > 1 ? parts[1] : 'unknown';
        
        return { 
          success: true, 
          message: 'SMS byla úspěšně odeslána', 
          smsId,
          details: result
        };
      } else if (result.includes('ERROR')) {
        let errorMessage = 'Neznámá chyba';
        
        if (result.includes('ERROR 1')) errorMessage = 'Neplatné uživatelské jméno nebo heslo';
        else if (result.includes('ERROR 2')) errorMessage = 'Nedostatek kreditů';
        else if (result.includes('ERROR 3')) errorMessage = 'Neplatný formát čísla';
        else if (result.includes('ERROR 4')) errorMessage = 'Text zprávy je příliš dlouhý';
        else if (result.includes('ERROR 5')) errorMessage = 'Neplatný sender ID';
        
        return { 
          success: false, 
          message: errorMessage,
          details: result
        };
      } else {
        return { 
          success: false, 
          message: `Neočekávaná odpověď: ${result}`,
          details: result
        };
      }
    } catch (error) {
      console.error('SMS sending error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Neznámá chyba';
      return { 
        success: false, 
        message: `Chyba při odesílání SMS: ${errorMessage}`,
        details: errorMessage
      };
    }
  }

  // Jednoduchá metoda pro zpětnou kompatibilitu
  async sendSimpleSMS(phoneNumber: string, message: string): Promise<SMSResponse> {
    return this.sendSMS({ phoneNumber, message });
  }

  async sendVerificationCode(phoneNumber: string, code: string): Promise<SMSResponse> {
    const message = `OnlineSprava - Váš ověřovací kód pro hlasování: ${code}. Kód je platný 10 minut.`;
    return this.sendSMS({ phoneNumber, message });
  }

  async sendVotingNotification(phoneNumber: string, voteName: string, link: string): Promise<SMSResponse> {
    const message = `OnlineSprava - Nové hlasování: "${voteName}". Hlasujte na: ${link}`;
    return this.sendSMS({ phoneNumber, message });
  }

  async getCredit(): Promise<{ success: boolean; credit?: number; message: string }> {
    if (!this.config.login || !this.config.password) {
      return { success: false, message: 'SMS služba není nakonfigurována' };
    }

    try {
      const params = new URLSearchParams({
        action: 'credit_info',
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
      
      if (result.includes('OK')) {
        const credit = parseFloat(result.split(' ')[1]);
        return { success: true, credit, message: `Dostupný kredit: ${credit} Kč` };
      } else {
        return { success: false, message: `Chyba při zjišťování kreditu: ${result}` };
      }
    } catch (error) {
      return { success: false, message: 'Chyba při komunikaci se službou' };
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const creditInfo = await this.getCredit();
      return creditInfo.success;
    } catch (error) {
      console.error('Test připojení SMS selhal:', error);
      return false;
    }
  }
}

export const smsService = new SMSService();