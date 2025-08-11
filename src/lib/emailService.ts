interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

// Gmail/OAuth nepoužíváme – vše jde přes backend (Mailjet)

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

// Backend send is handled by Netlify function `send-email`, which prefers MailerSend (MAILERSEND_API_KEY)
// and falls back to Gmail SMTP if MailerSend isn't configured.
interface GmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Dummy config už nepotřebujeme

// Žádné tokeny neřešíme – vše přes backend

// Sestavování RFC 2822 není potřeba – backend řeší formát

// Odeslání přes Netlify Function (Mailjet / SMTP fallback podle serveru)
const sendViaBackendSMTP = async (emailData: EmailData): Promise<GmailResponse> => {
  try {
  const base = import.meta.env.VITE_FUNCTIONS_BASE_URL || (import.meta.env.DEV ? 'http://localhost:8888' : '');
  const url = `${base}/.netlify/functions/send-email`;
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

// Hlavní funkce: vždy použij backend (Mailjet)
export const sendEmailViaGmail = async (emailData: EmailData): Promise<GmailResponse> => {
  return await sendViaBackendSMTP(emailData);
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
  // Jednoduchý test dostupnosti backendu (Mailjet)
  try {
  const base = import.meta.env.VITE_FUNCTIONS_BASE_URL || (import.meta.env.DEV ? 'http://localhost:8888' : '');
  const url = `${base}/.netlify/functions/send-email`;
    const ping = await fetch(url, { method: 'GET' });
    if (ping.ok) {
      return { success: true, message: 'Backend e‑mailů je připraven (Mailjet).' };
    }
    return { success: false, message: `Backend není dostupný (HTTP ${ping.status}).` };
  } catch (error) {
    return { success: false, message: `Backend test selhal: ${error instanceof Error ? error.message : 'Neznámá chyba'}` };
  }
};
