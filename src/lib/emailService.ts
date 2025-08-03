interface EmailWebhookConfig {
  webhookUrl: string;
}

interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

interface EmailResponse {
  success: boolean;
  message: string;
  emailId?: string;
}

export class EmailService {
  private config: EmailWebhookConfig;

  constructor() {
    this.config = {
      webhookUrl: import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://n8n.srv882016.hstgr.cloud/webhook/ada15a58-b14f-4179-92a1-780b009669a4'
    };
  }

  async sendEmail(emailData: EmailData): Promise<EmailResponse> {
    if (!this.config.webhookUrl) {
      console.warn('N8N webhook URL not configured');
      return { success: false, message: 'Email služba není nakonfigurována' };
    }

    try {
      console.log('Odesílání emailu přes N8N webhook:', {
        url: this.config.webhookUrl,
        data: emailData
      });

      const response = await fetch(this.config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.html,
          from: emailData.from || 'noreply@onlinesprava.cz'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      console.log('N8N webhook response:', result);

      return {
        success: true,
        message: 'Email byl úspěšně odeslán',
        emailId: result.id || 'unknown'
      };

    } catch (error) {
      console.error('Chyba při odesílání emailu přes N8N:', error);
      return {
        success: false,
        message: `Chyba při odesílání emailu: ${error instanceof Error ? error.message : 'Neznámá chyba'}`
      };
    }
  }

  // Metoda pro hromadné odesílání emailů
  async sendBulkEmails(emails: EmailData[]): Promise<EmailResponse[]> {
    const results: EmailResponse[] = [];
    
    for (const email of emails) {
      const result = await this.sendEmail(email);
      results.push(result);
      
      // Malá pauza mezi emaily, aby nedošlo k přetížení
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return results;
  }

  // Metoda pro testování připojení
  async testConnection(): Promise<boolean> {
    try {
      const testEmail: EmailData = {
        to: 'test@test.cz',
        subject: 'Test připojení N8N webhook',
        html: '<p>Toto je testovací email pro ověření funkčnosti N8N webhook.</p>'
      };

      const result = await this.sendEmail(testEmail);
      return result.success;
    } catch (error) {
      console.error('Test připojení selhal:', error);
      return false;
    }
  }
}

// Singleton instance
export const emailService = new EmailService();
