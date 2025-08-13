// Test GET metody pro smsbrana.cz (někteří provideři preferují GET)

const login = process.env.VITE_SMSBRANA_LOGIN || 'milankost_h1';
const password = process.env.VITE_SMSBRANA_PASSWORD || 'pwnEnx8GJtoVu7R7';

async function testGetMethod() {
  console.log('Testing smsbrana.cz with GET method...');

  // Test GET metody pro credit
  const creditUrl = `https://www.smsbrana.cz/smsconnect/http.php?action=credit&login=${encodeURIComponent(login)}&password=${encodeURIComponent(password)}`;
  
  console.log('\n--- Testing credit check with GET ---');
  console.log('URL:', creditUrl.replace(password, '***'));

  try {
    const response = await fetch(creditUrl, {
      method: 'GET'
    });

    const result = await response.text();
    console.log('HTTP Status:', response.status);
    console.log('Response:', result);

    if (result.includes('<err>2</err>')) {
      console.log('✗ CHYBA: Neplatný login!');
    } else if (result.includes('<err>3</err>')) {
      console.log('✗ CHYBA: Neplatné heslo!');
    } else if (result.includes('<err>')) {
      const match = result.match(/<err>(\d+)<\/err>/);
      if (match) {
        console.log('✗ Jiná chyba, kód:', match[1]);
      }
    } else {
      console.log('✓ Úspěch s GET metodou!');
    }

  } catch (error) {
    console.error('Network error:', error.message);
  }

  // Test GET metody pro SMS
  const phoneNumber = '777338203';
  const message = 'Test SMS';
  const smsUrl = `https://www.smsbrana.cz/smsconnect/http.php?action=send_sms&login=${encodeURIComponent(login)}&password=${encodeURIComponent(password)}&number=420${phoneNumber}&message=${encodeURIComponent(message)}&unicode=1&type=sms`;
  
  console.log('\n--- Testing SMS send with GET ---');
  console.log('URL:', smsUrl.replace(password, '***'));

  try {
    const response = await fetch(smsUrl, {
      method: 'GET'
    });

    const result = await response.text();
    console.log('HTTP Status:', response.status);
    console.log('Response:', result);

    if (result.includes('OK')) {
      console.log('✓ SMS odeslána pomocí GET!');
    } else if (result.includes('<err>')) {
      const match = result.match(/<err>(\d+)<\/err>/);
      if (match) {
        console.log('✗ Chyba při odesílání SMS, kód:', match[1]);
      }
    }

  } catch (error) {
    console.error('Network error:', error.message);
  }
}

testGetMethod();
