// smsbrana-test.js
// Testovací skript pro odeslání SMS přes smsbrana.cz
// Spusť: node smsbrana-test.js

import 'dotenv/config';
import fetch from 'node-fetch';
import querystring from 'querystring';

const {
  VITE_SMSBRANA_LOGIN,
  VITE_SMSBRANA_PASSWORD
} = process.env;

const recipient = '777338203';
const message = 'Testovací SMS přes smsbrana.cz z projektu OnlineHlasovaniBoltNew.';

if (!VITE_SMSBRANA_LOGIN || !VITE_SMSBRANA_PASSWORD) {
  console.error('Chybí přihlašovací údaje pro smsbrana.cz v .env souboru.');
  process.exit(1);
}

const url = 'https://api.smsbrana.cz/smsconnect/http.php?' + querystring.stringify({
  action: 'send_sms',
  login: VITE_SMSBRANA_LOGIN,
  password: VITE_SMSBRANA_PASSWORD,
  number: recipient,
  message: message
});

fetch(url, {
  method: 'GET',
  headers: {
    'User-Agent': 'smsbrana-test/1.0'
  }
})
  .then(res => res.text())
  .then(text => {
    console.log('Odpověď smsbrana.cz:', text);
    if (text.includes('OK')) {
      console.log('SMS byla úspěšně odeslána.');
    } else {
      console.error('Chyba při odesílání SMS nebo odpověď není OK.');
    }
  })
  .catch(err => {
    console.error('Chyba při komunikaci se smsbrana.cz:', err);
  });
