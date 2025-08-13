// Rychlý test e-mailové funkce na localhost:8888
const fetch = require('node-fetch');

async function testEmail() {
  console.log('Testing email function...');
  
  try {
    // Test GET endpoint (diagnostika)
    console.log('\n1. Testing GET (diagnostics)...');
    const getResponse = await fetch('http://localhost:8888/.netlify/functions/send-email');
    const getDiagnostics = await getResponse.json();
    console.log('GET Response:', JSON.stringify(getDiagnostics, null, 2));
    
    if (!getDiagnostics.configured) {
      console.log('❌ MAILJET není nakonfigurován!');
      console.log('Chybí:', getDiagnostics.missing);
      return;
    }
    
    console.log('✅ MAILJET je nakonfigurován');
    
    // Test POST (odeslání e-mailu)
    console.log('\n2. Testing POST (send email)...');
    const emailData = {
      to: 'test@example.com', // Bude přepsáno na DEBUG_EMAIL, pokud je nastavený
      subject: 'Test z lokálního Netlify Dev',
      html: '<h1>Ahoj!</h1><p>Toto je testovací e-mail z lokálního vývojového serveru.</p><p>Čas: ' + new Date().toLocaleString('cs-CZ') + '</p>'
    };
    
    const postResponse = await fetch('http://localhost:8888/.netlify/functions/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });
    
    const postResult = await postResponse.json();
    console.log('POST Response:', JSON.stringify(postResult, null, 2));
    
    if (postResult.success) {
      console.log('✅ E-mail byl úspěšně odeslán!');
    } else {
      console.log('❌ Chyba při odesílání:', postResult.error);
    }
    
  } catch (error) {
    console.error('❌ Chyba při testování:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Netlify Dev pravděpodobně neběží. Spusťte: netlify dev');
    }
  }
}

testEmail();
