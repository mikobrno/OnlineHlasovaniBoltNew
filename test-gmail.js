// Rychlý test Gmail API
import { emailService } from './src/lib/emailService.js';

async function testGmail() {
  console.log('🧪 Testování Gmail API...');
  
  try {
    const result = await emailService.testEmailGmail({
      to: 'milankost@email.cz', // váš email
      subject: 'Test Gmail API - OnlineHlasovaniBolt',
      body: 'Tento email byl odeslán přes Gmail API! 🎉'
    });
    
    console.log('✅ Email úspěšně odeslán:', result);
  } catch (error) {
    console.error('❌ Chyba při odesílání:', error.message);
  }
}

testGmail();
