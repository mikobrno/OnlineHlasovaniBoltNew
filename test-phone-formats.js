// Test různých formátů telefonních čísel pro smsbrana.cz

const login = process.env.VITE_SMSBRANA_LOGIN || 'milankost_h1';
const password = process.env.VITE_SMSBRANA_PASSWORD || 'pwnEnx8GJtoVu7R7';
const message = 'Test SMS z OnlineSprava';

async function testPhoneFormats() {
  const phoneFormats = [
    '777338203',           // 9 číslic
    '420777338203',        // s předvolbou 420
    '+420777338203',       // s + a předvolbou
    '00420777338203',      // s 00 prefix
    '777 338 203',         // s mezerami
    '+420 777 338 203',    // úplný formát s mezerami
  ];

  for (const phone of phoneFormats) {
    console.log(`\n--- Testing phone format: "${phone}" ---`);
    
    const params = new URLSearchParams({
      action: 'send_sms',
      login,
      password,
      number: phone,
      message,
      unicode: '1',
      type: 'sms'
    });

    try {
      const response = await fetch('https://www.smsbrana.cz/smsconnect/http.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
      });

      const result = await response.text();
      console.log('HTTP Status:', response.status);
      console.log('Response:', result);

      if (result.includes('OK')) {
        console.log('✓ SUCCESS - This format works!');
        break; // Stop at first successful format
      } else if (result.includes('<err>')) {
        const match = result.match(/<err>(\d+)<\/err>/);
        if (match) {
          const errorCode = match[1];
          console.log('✗ Error code:', errorCode);
        }
      }
    } catch (error) {
      console.error('Network error:', error.message);
    }
    
    // Wait a bit between requests to be polite
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

testPhoneFormats();
