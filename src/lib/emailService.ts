interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

interface GmailConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  refreshToken: string;
  accessToken?: string;
}

interface VotingData {
  id: string;
  title: string;
  description?: string;
  end_date: string;
}

interface OwnerData {
  name: string;
  email: string;
  voting_token: string;
}

interface GmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Gmail API configuration
const getGmailConfig = (): GmailConfig => ({
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
  redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:3000',
  refreshToken: import.meta.env.VITE_GOOGLE_REFRESH_TOKEN || '',
});

// Function to refresh Google access token
const refreshAccessToken = async (): Promise<string | null> => {
  const config = getGmailConfig();
  
  if (!config.clientId || !config.clientSecret || !config.refreshToken) {
    console.error('Google OAuth credentials not configured');
    return null;
  }

  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        refresh_token: config.refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    const data = await response.json();
    
    if (data.access_token) {
      console.log('Access token refreshed successfully');
      return data.access_token;
    } else {
      console.error('Failed to refresh access token:', data);
      return null;
    }
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return null;
  }
};

// Function to create email message in RFC 2822 format
const createEmailMessage = (emailData: EmailData): string => {
  const from = emailData.from || 'noreply@onlinehlasovani.cz';
  const boundary = '----boundary_' + Date.now();
  
  const message = [
    `From: ${from}`,
    `To: ${emailData.to}`,
    `Subject: ${emailData.subject}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: quoted-printable',
    '',
    emailData.html,
    '',
    `--${boundary}--`
  ].join('\r\n');

  // Encode message in base64url format
  return btoa(message)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// Helper to send via Netlify Function (SMTP) when OAuth config chybí
const sendViaBackendSMTP = async (emailData: EmailData): Promise<GmailResponse> => {
  try {
  const base = import.meta.env.VITE_FUNCTIONS_BASE_URL || '';
  const url = base ? `${base}/.netlify/functions/send-email` : '/.netlify/functions/send-email';
  const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData),
    });
    const data = await res.json();
    if (res.ok && data.success) return { success: true, messageId: data.messageId };
    return { success: false, error: data.error || 'Backend SMTP error' };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Network error' };
  }
};

// Main function to send email via Gmail API (or SMTP fallback)
export const sendEmailViaGmail = async (emailData: EmailData): Promise<GmailResponse> => {
  try {
    const cfg = getGmailConfig();
    // Fallback: pokud není nakonfigurován OAuth, použij SMTP backend
    if (!cfg.clientId || !cfg.clientSecret || !cfg.refreshToken) {
      return await sendViaBackendSMTP(emailData);
    }

    const accessToken = await refreshAccessToken();
    
    if (!accessToken) {
      return { success: false, error: 'Failed to get access token' };
    }

    const emailMessage = createEmailMessage(emailData);
    
    console.log('Sending email via Gmail API:', { to: emailData.to, subject: emailData.subject });

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: emailMessage
      }),
    });

  const result = await response.json();
    
    if (response.ok && result.id) {
      console.log('Email sent successfully via Gmail API:', result.id);
      return { success: true, messageId: result.id };
    } else {
      console.error('Gmail API error:', result);
      return { success: false, error: result.error?.message || 'Gmail API error' };
    }

  } catch (error) {
  console.error('Error sending email via Gmail API:', error);
  // poslední fallback na SMTP backend (např. když je dočasný výpadek Google)
  return await sendViaBackendSMTP(emailData);
  }
};

// Funkce pro generování předmětů emailů
export const getEmailSubject = (type: 'start' | 'reminder' | 'end', voting: VotingData): string => {
  switch (type) {
    case 'start':
      return `📧 Začíná hlasování: ${voting.title}`;
    case 'reminder':
      return `⏰ Připomínka - Hlasování končí brzy: ${voting.title}`;
    case 'end':
      return `✅ Hlasování ukončeno: ${voting.title}`;
    default:
      return `📧 OnlineHlasování: ${voting.title}`;
  }
};

// Funkce pro generování HTML emailových šablon
export const getEmailTemplate = (type: 'start' | 'reminder' | 'end', voting: VotingData, owner: OwnerData): string => {
  const baseStyles = `
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
      .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
      .button { 
        display: inline-block; 
        background: #4F46E5; 
        color: white; 
        padding: 12px 30px; 
        text-decoration: none; 
        border-radius: 6px; 
        margin: 20px 0; 
        font-weight: bold;
      }
      .info-box { background: #E0E7FF; padding: 15px; border-radius: 6px; margin: 20px 0; }
      .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; }
    </style>
  `;

  const votingUrl = `${window.location.origin}/voting/${voting.id}?token=${owner.voting_token}`;
  const endDate = new Date(voting.end_date).toLocaleString('cs-CZ');

  switch (type) {
    case 'start':
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Hlasování začíná</title>
          ${baseStyles}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🗳️ Hlasování začíná!</h1>
            </div>
            <div class="content">
              <h2>Vážený/á ${owner.name},</h2>
              <p>bylo spuštěno nové hlasování, ve kterém můžete hlasovat:</p>
              
              <div class="info-box">
                <h3>${voting.title}</h3>
                ${voting.description ? `<p>${voting.description}</p>` : ''}
                <p><strong>Hlasování končí:</strong> ${endDate}</p>
              </div>

              <p>Pro hlasování klikněte na tlačítko níže:</p>
              <a href="${votingUrl}" class="button">🗳️ Hlasovat nyní</a>
              
              <p><strong>Důležité informace:</strong></p>
              <ul>
                <li>Váš hlas je anonymní a bezpečný</li>
                <li>Můžete hlasovat pouze jednou</li>
                <li>Po hlasování obdržíte potvrzení</li>
              </ul>
              
              <div class="footer">
                <p>Pokud máte problémy s hlasováním, kontaktujte správce systému.</p>
                <p>Tento email byl odeslán automaticky ze systému OnlineHlasování.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

    case 'reminder':
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Připomínka hlasování</title>
          ${baseStyles}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ Připomínka hlasování</h1>
            </div>
            <div class="content">
              <h2>Vážený/á ${owner.name},</h2>
              <p>připomínáme Vám, že brzy končí hlasování:</p>
              
              <div class="info-box">
                <h3>${voting.title}</h3>
                ${voting.description ? `<p>${voting.description}</p>` : ''}
                <p><strong>Hlasování končí:</strong> ${endDate}</p>
              </div>

              <p>Pokud jste ještě nehlasoval/a, máte stále možnost:</p>
              <a href="${votingUrl}" class="button">🗳️ Hlasovat nyní</a>
              
              <p><strong>Nezapomeňte:</strong></p>
              <ul>
                <li>Po ukončení hlasování nebude možné hlasovat</li>
                <li>Váš hlas je důležitý pro finální rozhodnutí</li>
                <li>Hlasování je rychlé a jednoduché</li>
              </ul>
              
              <div class="footer">
                <p>Pokud máte problémy s hlasováním, kontaktujte správce systému.</p>
                <p>Tento email byl odeslán automaticky ze systému OnlineHlasování.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

    case 'end':
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Hlasování ukončeno</title>
          ${baseStyles}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Hlasování ukončeno</h1>
            </div>
            <div class="content">
              <h2>Vážený/á ${owner.name},</h2>
              <p>hlasování bylo úspěšně ukončeno:</p>
              
              <div class="info-box">
                <h3>${voting.title}</h3>
                ${voting.description ? `<p>${voting.description}</p>` : ''}
                <p><strong>Hlasování ukončeno:</strong> ${endDate}</p>
              </div>

              <p>Děkujeme Vám za účast v hlasování. Výsledky budou zpracovány a zveřejněny v nejbližší době.</p>
              
              <a href="${window.location.origin}/results/${voting.id}" class="button">📊 Zobrazit výsledky</a>
              
              <p><strong>Co dál:</strong></p>
              <ul>
                <li>Výsledky budou dostupné na webu</li>
                <li>Všichni účastníci budou informováni</li>
                <li>Zápis z hlasování bude připraven</li>
              </ul>
              
              <div class="footer">
                <p>Děkujeme za využití systému OnlineHlasování.</p>
                <p>Tento email byl odeslán automaticky ze systému OnlineHlasování.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

    default:
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>OnlineHlasování</title>
          ${baseStyles}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 OnlineHlasování</h1>
            </div>
            <div class="content">
              <h2>Vážený/á ${owner.name},</h2>
              <p>Obdrželi jste email ze systému OnlineHlasování.</p>
              <div class="info-box">
                <h3>${voting.title}</h3>
                ${voting.description ? `<p>${voting.description}</p>` : ''}
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
  }
};

// Funkce pro odesílání různých typů emailů
export const sendVotingStartEmail = async (owner: OwnerData, voting: VotingData): Promise<boolean> => {
  const result = await sendEmailViaGmail({
    to: owner.email,
    subject: getEmailSubject('start', voting),
    html: getEmailTemplate('start', voting, owner),
  });
  return result.success;
};

export const sendVotingReminderEmail = async (owner: OwnerData, voting: VotingData): Promise<boolean> => {
  const result = await sendEmailViaGmail({
    to: owner.email,
    subject: getEmailSubject('reminder', voting),
    html: getEmailTemplate('reminder', voting, owner),
  });
  return result.success;
};

export const sendVotingEndEmail = async (owner: OwnerData, voting: VotingData): Promise<boolean> => {
  const result = await sendEmailViaGmail({
    to: owner.email,
    subject: getEmailSubject('end', voting),
    html: getEmailTemplate('end', voting, owner),
  });
  return result.success;
};

// Test funkce pro ověření Gmail API spojení
export const testEmailGmail = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const config = getGmailConfig();
    
    if (!config.clientId || !config.clientSecret || !config.refreshToken) {
      // otestuj dostupnost backendové SMTP funkce jako alternativu
      try {
        const base = import.meta.env.VITE_FUNCTIONS_BASE_URL || '';
        const url = base ? `${base}/.netlify/functions/send-email` : '/.netlify/functions/send-email';
        const ping = await fetch(url, { method: 'GET' });
        if (ping.ok) {
          return { success: true, message: 'Gmail OAuth není nastaven. SMTP backend je připraven.' };
        }
      } catch {}
      return { success: false, message: 'Google OAuth credentials not configured. Check environment variables.' };
    }

    // Test access token refresh
    const accessToken = await refreshAccessToken();
    
    if (!accessToken) {
      return { 
        success: false, 
        message: 'Failed to refresh access token. Check Google OAuth configuration.' 
      };
    }

    // Test Gmail API connection by checking profile
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const profile = await response.json();
      return { 
        success: true, 
        message: `Gmail API connected successfully. Email: ${profile.emailAddress}` 
      };
    } else {
      const error = await response.json();
      return { 
        success: false, 
        message: `Gmail API error: ${error.error?.message || 'Unknown error'}` 
      };
    }

  } catch (error) {
    console.error('Gmail API test failed:', error);
    return { 
      success: false, 
      message: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
};
