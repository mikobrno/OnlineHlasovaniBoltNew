// oauth-helper.js - Script pro získání Google OAuth refresh token
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  'YOUR_CLIENT_ID', // Client ID - nahraďte svým
  'YOUR_CLIENT_SECRET', // Client Secret - nahraďte svým
  'urn:ietf:wg:oauth:2.0:oob' // OOB redirect (out-of-band)
);

// Scopes potřebné pro Gmail API
const scopes = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.compose'
];

// Funkce pro generování authorization URL
function generateAuthUrl() {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });

  console.log('=== GOOGLE OAUTH SETUP ===');
  console.log('1. Otevřete tento URL v prohlížeči:');
  console.log(authUrl);
  console.log('\n2. Přihlaste se Google účtem, ze kterého chcete odesílat emaily');
  console.log('3. Po autorizaci zkopírujte authorization code z URL');
  console.log('4. Odkomentujte řádek níže a vložte kód:');
  console.log('// getToken("PASTE_AUTHORIZATION_CODE_HERE");');
}

// Funkce pro získání refresh token z authorization code
async function getToken(authorizationCode) {
  try {
    const { tokens } = await oauth2Client.getToken(authorizationCode);
    
    console.log('=== ÚSPĚCH! ===');
    console.log('Refresh Token:', tokens.refresh_token);
    console.log('Access Token:', tokens.access_token);
    console.log('\nPřidejte refresh token do .env souboru:');
    console.log(`VITE_GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    
  } catch (error) {
    console.error('Chyba při získávání tokenů:', error.message);
  }
}

// Spuštění
generateAuthUrl();

// ODKOMENTUJTE A VLOŽTE AUTHORIZATION CODE:
// getToken('PASTE_AUTHORIZATION_CODE_HERE');
