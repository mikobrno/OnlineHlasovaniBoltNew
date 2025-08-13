// Test přihlašovacích údajů a kreditu smsbrana.cz

const login = process.env.VITE_SMSBRANA_LOGIN || 'milankost_h1';
const password = process.env.VITE_SMSBRANA_PASSWORD || 'pwnEnx8GJtoVu7R7';

async function testAccount() {
  console.log('Testing smsbrana.cz account credentials...');
  console.log('Login:', login);
  console.log('Password:', password ? '***' : 'MISSING');

  // Test 1: Zkusíme akci "credit" pro ověření kreditu
  console.log('\n--- Testing credit check ---');
  const creditParams = new URLSearchParams({
    action: 'credit',
    login,
    password
  });

  try {
    const response = await fetch('https://www.smsbrana.cz/smsconnect/http.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: creditParams
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
      console.log('✓ Přihlašovací údaje vypadají v pořádku');
      console.log('Odpověď:', result);
    }

  } catch (error) {
    console.error('Network error:', error.message);
  }

  // Test 2: Zkusíme jiné akce pro ověření účtu
  console.log('\n--- Testing account info ---');
  const accountParams = new URLSearchParams({
    action: 'account',
    login,
    password
  });

  try {
    const response = await fetch('https://www.smsbrana.cz/smsconnect/http.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: accountParams
    });

    const result = await response.text();
    console.log('HTTP Status:', response.status);
    console.log('Response:', result);

  } catch (error) {
    console.error('Network error:', error.message);
  }
}

testAccount();
