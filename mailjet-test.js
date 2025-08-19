// mailjet-test.js
// Testovací skript pro odeslání e-mailu přes Mailjet
// Spusť: node mailjet-test.js

import 'dotenv/config';
import Mailjet from 'node-mailjet';

const {
  MAILJET_API_KEY,
  MAILJET_API_SECRET,
  MAILJET_FROM_EMAIL,
  MAILJET_FROM_NAME
} = process.env;

const recipient = 'milan.kost@email.cz';

if (!MAILJET_API_KEY || !MAILJET_API_SECRET || !MAILJET_FROM_EMAIL || !MAILJET_FROM_NAME) {
  console.error('Chybí některá z potřebných proměnných v .env souboru.');
  process.exit(1);
}

const mj = new Mailjet({
  apiKey: MAILJET_API_KEY,
  apiSecret: MAILJET_API_SECRET
});

mj.post('send', { version: 'v3.1' })
  .request({
    Messages: [
      {
        From: {
          Email: MAILJET_FROM_EMAIL,
          Name: MAILJET_FROM_NAME
        },
        To: [
          {
            Email: recipient,
            Name: 'Testovací příjemce'
          }
        ],
        Subject: 'Testovací e-mail přes Mailjet',
        TextPart: 'Toto je testovací e-mail odeslaný přes Mailjet API.',
        HTMLPart: '<h3>Toto je <b>testovací e-mail</b> odeslaný přes Mailjet API.</h3>'
      }
    ]
  })
  .then(result => {
    console.log('Kompletní odpověď Mailjet API:');
    console.dir(result.body, { depth: null });
  })
  .catch(err => {
    console.error('Chyba při odesílání e-mailu:', err.statusCode, err.message);
    if (err.response && err.response.res && err.response.res.statusMessage) {
      console.error('Status:', err.response.res.statusMessage);
    }
    if (err.response && err.response.body) {
      console.error('Mailjet response body:', err.response.body);
    }
  });
