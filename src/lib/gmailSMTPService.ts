// Gmail SMTP Service - Alternativa k OAuth
interface SMTPConfig {
  user: string;
  pass: string; // App Password
  host: string;
  port: number;
  secure: boolean;
}

interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

class GmailSMTPService {
  private config: SMTPConfig;

  constructor() {
    this.config = {
      user: import.meta.env.VITE_GMAIL_USER || '',
      pass: import.meta.env.VITE_GMAIL_APP_PASSWORD || '',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false
    };
  }

  // Simulace SMTP odeslání (v browseru nejde přímo, ale můžeme použít backend service)
  async sendEmail(emailData: EmailData): Promise<{ success: boolean; error?: string }> {
    if (!this.config.user || !this.config.pass) {
      return { success: false, error: 'Gmail SMTP credentials not configured' };
    }

    try {
      // V produkci by toto šlo přes backend API endpoint
      console.log('Gmail SMTP - Sending email:', {
        from: emailData.from || this.config.user,
        to: emailData.to,
        subject: emailData.subject,
        // html: emailData.html (zkráceno pro log)
      });

      // Pro demonstraci - v reálné aplikaci by toto šlo přes backend
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: emailData.from || this.config.user,
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.html,
          smtp: this.config
        }),
      });

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: 'SMTP send failed' };
      }

    } catch (error) {
      console.error('Gmail SMTP error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Test spojení
  async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.config.user || !this.config.pass) {
      return { 
        success: false, 
        message: 'Gmail SMTP credentials not configured. Set VITE_GMAIL_USER and VITE_GMAIL_APP_PASSWORD in .env' 
      };
    }

    // Pro testování bez backend API
    return { 
      success: true, 
      message: `Gmail SMTP configured for ${this.config.user}. Backend API needed for actual sending.` 
    };
  }
}

export const gmailSMTPService = new GmailSMTPService();
