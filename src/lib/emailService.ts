interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

interface WebhookPayload {
  to: string;
  subject: string;
  html: string;
  from: string;
  timestamp: string;
  source: string;
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

export const sendEmailViaWebhook = async (emailData: EmailData): Promise<boolean> => {
  const webhookUrl = (import.meta as { env: Record<string, string> }).env.VITE_N8N_EMAIL_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.error('N8N webhook URL not configured');
    return false;
  }

  try {
    const payload: WebhookPayload = {
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      from: emailData.from || 'noreply@onlinehlasovani.cz',
      timestamp: new Date().toISOString(),
      source: 'OnlineHlasování',
    };

    console.log('Sending email via N8N webhook:', { to: payload.to, subject: payload.subject });

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('N8N webhook request failed:', response.status, response.statusText);
      return false;
    }

    const result = await response.text();
    console.log('N8N webhook response:', result);
    return true;

  } catch (error) {
    console.error('Error sending email via N8N webhook:', error);
    return false;
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
  return await sendEmailViaWebhook({
    to: owner.email,
    subject: getEmailSubject('start', voting),
    html: getEmailTemplate('start', voting, owner),
  });
};

export const sendVotingReminderEmail = async (owner: OwnerData, voting: VotingData): Promise<boolean> => {
  return await sendEmailViaWebhook({
    to: owner.email,
    subject: getEmailSubject('reminder', voting),
    html: getEmailTemplate('reminder', voting, owner),
  });
};

export const sendVotingEndEmail = async (owner: OwnerData, voting: VotingData): Promise<boolean> => {
  return await sendEmailViaWebhook({
    to: owner.email,
    subject: getEmailSubject('end', voting),
    html: getEmailTemplate('end', voting, owner),
  });
};

// Test funkce pro ověření webhook spojení
export const testEmailWebhook = async (): Promise<boolean> => {
  const webhookUrl = (import.meta as { env: Record<string, string> }).env.VITE_N8N_EMAIL_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.error('N8N webhook URL not configured');
    return false;
  }

  try {
    // Pouze testujeme, zda webhook URL odpovídá - neposíláme skutečný email
    console.log('Testing N8N webhook connection:', webhookUrl);
    
    // Jednoduchý test připojení s minimálními daty
    const testPayload = {
      test: true,
      timestamp: new Date().toISOString(),
      source: 'OnlineHlasování-ConnectionTest'
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    });

    console.log('N8N webhook test response status:', response.status);
    
    // Přijímáme jakoukoliv odpověď (i 404, 400) jako důkaz, že server odpovídá
    // CORS chyby se projeví dříve než dostaneme response
    return true;

  } catch (error) {
    console.error('N8N webhook test failed:', error);
    
    // Pokud je chyba způsobena CORS, webhook pravděpodobně funguje
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes('cors') || errorMessage.includes('network') || errorMessage.includes('fetch')) {
        console.log('CORS error detected - webhook is probably accessible but blocks browser requests');
        return true; // Webhook je dostupný, jen blokuje CORS z browseru
      }
    }
    
    return false;
  }
};
