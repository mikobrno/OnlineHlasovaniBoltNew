import { Request, Response } from 'express';
import Mailjet from 'node-mailjet';

// Inicializace Mailjet klienta
const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY || '',
  process.env.MAILJET_API_SECRET || ''
);

export default async function handler(req: Request, res: Response) {
  try {
    // Validace vstupu
    const { to, subject, text, html } = req.body.input;
    
    if (!to || !subject || (!text && !html)) {
      return res.status(400).json({
        ok: false,
        error: 'Chybí povinné parametry (to, subject, text/html)'
      });
    }

    // Kontrola konfigurace
    if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_API_SECRET) {
      throw new Error('Chybí Mailjet konfigurace (API klíče)');
    }

    if (!process.env.MAILJET_FROM_EMAIL || !process.env.MAILJET_FROM_NAME) {
      throw new Error('Chybí Mailjet konfigurace (odesílatel)');
    }

    // Odeslání e-mailu přes Mailjet
    const data = await mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: process.env.MAILJET_FROM_EMAIL,
              Name: process.env.MAILJET_FROM_NAME
            },
            To: [
              {
                Email: to,
                Name: to.split('@')[0] // Použijeme část před @ jako jméno
              }
            ],
            Subject: subject,
            TextPart: text,
            HTMLPart: html || text // Pokud není HTML, použijeme text
          }
        ]
      });

    console.log('Mailjet odpověď:', JSON.stringify(data.body, null, 2));

    if (data.response.status === 200) {
      return res.json({
        ok: true
      });
    } else {
      throw new Error('Mailjet API vrátilo neočekávaný status: ' + data.response.status);
    }

  } catch (error) {
    console.error('Chyba při odesílání e-mailu:', error);
    return res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Neznámá chyba při odesílání'
    });
  }
}
