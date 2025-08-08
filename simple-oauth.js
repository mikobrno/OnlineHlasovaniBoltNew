// simple-oauth.js - Zjednodušený OAuth helper pro Desktop aplikace
import { google } from 'googleapis';

// Pro desktop aplikace můžeme použít Google's public OAuth client
const oauth2Client = new google.auth.OAuth2(
  'YOUR_CLIENT_ID', // Nahraďte svým Client ID
  'YOUR_CLIENT_SECRET', // Nahraďte svým Client Secret
  'http://localhost:8080' // Změníme port
);

const scopes = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.labels',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events'
];

// Generujeme URL pro autorizaci
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt: 'consent'
});

console.log('📧 GOOGLE GMAIL API SETUP');
console.log('═══════════════════════════');
console.log('\n1. KROK: Nakonfigurujte Google Cloud Console');
console.log('   → Přejděte na: https://console.cloud.google.com/');
console.log('   → APIs & Services → Credentials');
console.log('   → Najděte vaše OAuth 2.0 Client ID');
console.log('   → V "Authorized redirect URIs" přidejte:');
console.log('     http://localhost:8080');
console.log('     http://localhost:8080/');
console.log('     urn:ietf:wg:oauth:2.0:oob');

console.log('\n2. KROK: Po konfiguraci Console otevřete tento URL:');
console.log(authUrl);

console.log('\n3. KROK: Po autorizaci zkopírujte kód a spusťte:');
console.log('   node simple-oauth.js YOUR_AUTHORIZATION_CODE');

// Pokud je poskytnut authorization code jako argument
if (process.argv[2]) {
  const authCode = process.argv[2];
  console.log('\n⏳ Získávám refresh token...');
  
  try {
    const { tokens } = await oauth2Client.getToken(authCode);
    
    console.log('\n✅ ÚSPĚCH!');
    console.log('═══════════');
    console.log('Refresh Token:', tokens.refresh_token);
    console.log('\nPřidejte do .env souboru:');
    console.log(`VITE_GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    
  } catch (error) {
    console.error('\n❌ CHYBA při získávání tokenů:', error.message);
    console.log('\nMožné řešení:');
    console.log('1. Zkontrolujte redirect URI v Google Cloud Console');
    console.log('2. Zkuste nový authorization code');
    console.log('3. Ujistěte se, že je Gmail API povoleno');
  }
}
