# Google Gmail API Setup - Návod

## 🔧 Nastavení Google OAuth2 pro odesílání emailů

### 1. Vytvoření Google Cloud projektu

1. Přejděte na [Google Cloud Console](https://console.cloud.google.com/)
2. Vytvořte nový projekt nebo vyberte existující
3. Poznamenejte si **Project ID**

### 2. Povolení Gmail API

1. V Google Cloud Console přejděte na **APIs & Services** → **Library**
2. Vyhledejte "Gmail API"
3. Klikněte na **Enable**

### 3. Konfigurace OAuth Consent Screen

1. Přejděte na **APIs & Services** → **OAuth consent screen**
2. Vyberte **External** (pokud není organizace Google Workspace)
3. Vyplňte požadované informace:
   - **App name**: OnlineHlasování
   - **User support email**: váš email
   - **Developer contact information**: váš email
4. Přidejte scopes:
   - `https://www.googleapis.com/auth/gmail.send`
   - `https://www.googleapis.com/auth/gmail.compose`
5. Přidejte test users (včetně emailu, ze kterého budete odesílat)

### 4. Vytvoření OAuth2 credentials

1. Přejděte na **APIs & Services** → **Credentials**
2. Klikněte **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Vyberte **Web application**
4. Nastavte:
   - **Name**: OnlineHlasování Gmail
   - **Authorized redirect URIs**: 
     - `http://localhost:3000`
     - `https://yourdomain.com` (produkční doména)
5. Stáhněte si JSON soubor s credentials

### 5. Získání Refresh Token

Použijte tento skript pro získání refresh token:

```javascript
// oauth-helper.js
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  'YOUR_CLIENT_ID',
  'YOUR_CLIENT_SECRET',
  'http://localhost:3000' // Redirect URI
);

// Generate URL for consent
const scopes = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.compose'
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt: 'consent'
});

console.log('Otevřete tento URL v prohlížeči:');
console.log(authUrl);
console.log('\nPo autorizaci získáte kód, který vložte do getToken funkcí níže:');

// Po získání authorization code
async function getToken(authorizationCode) {
  try {
    const { tokens } = await oauth2Client.getToken(authorizationCode);
    console.log('Refresh Token:', tokens.refresh_token);
    console.log('Access Token:', tokens.access_token);
  } catch (error) {
    console.error('Error getting token:', error);
  }
}

// getToken('PASTE_AUTHORIZATION_CODE_HERE');
```

### 6. Spuštění OAuth flow

1. Nainstalujte googleapis: `npm install googleapis`
2. Nahraďte YOUR_CLIENT_ID a YOUR_CLIENT_SECRET ve skriptu
3. Spusťte skript: `node oauth-helper.js`
4. Otevřete URL v prohlížeči
5. Přihlaste se účtem, ze kterého chcete odesílat emaily
6. Povolte přístup k Gmail API
7. Zkopírujte authorization code z URL
8. Odkomentujte a spusťte `getToken('CODE')`
9. Uložte si **refresh_token**

### 7. Konfigurace .env souboru

```env
# Google Gmail API Configuration
VITE_GOOGLE_CLIENT_ID=vaš_client_id_zde
VITE_GOOGLE_CLIENT_SECRET=vaš_client_secret_zde  
VITE_GOOGLE_REDIRECT_URI=http://localhost:3000
VITE_GOOGLE_REFRESH_TOKEN=vaš_refresh_token_zde
```

### 8. Testování

1. Spusťte aplikaci: `npm run dev`
2. Přejděte do **Administrace** → **Nastavení**
3. Klikněte na **Test Gmail API**
4. Zkontrolujte, že se zobrazí "Gmail API connected successfully"

## 🔒 Bezpečnost

- **Refresh token** má dlouhodobou platnost - uchovávejte ho bezpečně
- **Client Secret** necommitujte do veřejného repositáře
- Používejte environment variables pro produkci
- Pro produkci požádejte o Google verification nebo nastavte internal app

## 🚨 Řešení problémů

### "The app is blocked"
- Aplikace není verifikovaná Googlem
- Klikněte na "Advanced" → "Go to OnlineHlasování (unsafe)"
- Nebo nastavte aplikaci jako Internal v Google Workspace

### "Refresh token expired"
- Refresh token může expirovat pokud není používán
- Zopakujte OAuth flow pro nový refresh token

### "Insufficient permissions"
- Zkontrolujte, že máte správné scopes
- Přidejte test users v OAuth consent screen

### "Rate limit exceeded"
- Gmail API má denní limit 1 miliardy requests
- Pro malé aplikace by to neměl být problém

## 📚 Další informace

- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [Google OAuth2 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Gmail API Quotas](https://developers.google.com/gmail/api/reference/quota)
