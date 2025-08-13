// Přímý test SMS bez Netlify serveru
// Test smsbrana.cz API přímo

const login = process.env.VITE_SMSBRANA_LOGIN || 'milankost_h1';
const password = process.env.VITE_SMSBRANA_PASSWORD || 'pwnEnx8GJtoVu7R7';
const phoneNumber = '777338203';
const message = 'Test SMS z OnlineSprava - přímý test';

async function testSMS() {
  console.log('Testing SMS directly to smsbrana.cz...');
  console.log('Login:', login);
  console.log('Phone:', phoneNumber);
  console.log('Message:', message);

  // Normalizace čísla
  let normalizedNumber = phoneNumber.replace(/[^0-9]/g, '');
  if (normalizedNumber.length === 9) {
    normalizedNumber = '420' + normalizedNumber;
  }
  console.log('Normalized number:', normalizedNumber);

  const params = new URLSearchParams({
    action: 'send_sms',
    login,
    password,
    number: normalizedNumber,
    message,
    unicode: '1',
    type: 'sms'
  });

  try {
    // Používáme GET metodu, kterou smsbrana.cz preferuje
    const url = `https://www.smsbrana.cz/smsconnect/http.php?${params.toString()}`;
    console.log('Request URL:', url.replace(password, '***'));
    
    const response = await fetch(url, {
      method: 'GET'
    });

    const result = await response.text();
    console.log('HTTP Status:', response.status);
    console.log('Response:', result);

    // Zkusíme parsovat odpověď
    if (result.includes('OK')) {
      console.log('✓ SMS was sent successfully!');
    } else if (result.includes('<err>')) {
      const match = result.match(/<err>(\d+)<\/err>/);
      if (match) {
        const errorCode = match[1];
        console.log('✗ SMS failed with error code:', errorCode);
        const errorMessages = {
          '1': 'Chybí povinný parametr',
          '2': 'Neplatný login',
          '3': 'Neplatné heslo',
          '4': 'Nedostatečný kredit',
          '5': 'Neplatný odesílatel',
          '6': 'Neplatné telefonní číslo'
        };
        console.log('Error description:', errorMessages[errorCode] || 'Neznámá chyba');
      }
    } else {
      console.log('✗ Unexpected response format');
    }

  } catch (error) {
    console.error('Network error:', error.message);
  }
}

testSMS();
