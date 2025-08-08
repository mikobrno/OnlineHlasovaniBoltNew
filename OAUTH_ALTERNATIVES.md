# 🔧 Google Gmail API - Alternativní způsoby nastavení

## Možnost 1: Google OAuth 2.0 Playground (NEJJEDNODUŠŠÍ)

1. **Přejděte na OAuth Playground:**
   → https://developers.google.com/oauthplayground/

2. **Konfigurace:**
   - Klikněte na ⚙️ (nastavení) vpravo nahoře
   - Zaškrtněte "Use your own OAuth credentials"
   - OAuth Client ID: `YOUR_CLIENT_ID` (z Google Cloud Console)
   - OAuth Client secret: `YOUR_CLIENT_SECRET` (z Google Cloud Console)

3. **Vyberte scopes:**
   - V levém panelu najděte "Gmail API v1"
   - Zaškrtněte:
     - `https://www.googleapis.com/auth/gmail.send`
     - `https://www.googleapis.com/auth/gmail.compose`

4. **Autorizace:**
   - Klikněte "Authorize APIs"
   - Přihlaste se Google účtem
   - Povolte přístup

5. **Získání Refresh Token:**
   - Klikněte "Exchange authorization code for tokens"
   - Zkopírujte **Refresh token**

## Možnost 2: Manuální konfigurace Google Cloud Console

1. **Otevřete Google Cloud Console:**
   → https://console.cloud.google.com/

2. **Přejděte na OAuth Credentials:**
   - APIs & Services → Credentials
   - Najděte Client ID: `321841020562-u4jsuhnfkra9njptm7c9boad9jf2khfb...`

3. **Přidejte Redirect URIs:**
   ```
   http://localhost:3000
   http://localhost:3000/
   http://localhost:8080
   http://localhost:8080/
   urn:ietf:wg:oauth:2.0:oob
   https://developers.google.com/oauthplayground
   ```

4. **Povolte Gmail API:**
   - APIs & Services → Library
   - Vyhledejte "Gmail API"
   - Klikněte "Enable"

5. **OAuth Consent Screen:**
   - APIs & Services → OAuth consent screen
   - Přidejte email `kost@onlinesprava.cz` jako test user

## Možnost 3: Použití veřejného testovacího Client ID

Pokud chcete rychle testovat, můžeme použít veřejný Google OAuth client:

```javascript
// Pro testování použijte tento Client ID:
const CLIENT_ID = "407408718192.apps.googleusercontent.com";
// Bez client secret (veřejný client)
```

## 🎯 Doporučený postup:

**NEJRYCHLEJŠÍ:** Použijte Google OAuth Playground (Možnost 1)
- Žádná konfigurace redirect URI
- Okamžitě dostanete refresh token
- Stačí vložit váš Client ID a Secret

Po získání refresh token aktualizujte .env:
```
VITE_GOOGLE_REFRESH_TOKEN=vaš_refresh_token_zde
```
