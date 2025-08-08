# 📧 N8N Email Webhook Integrace

Úspěšně integrovaná N8N webhook služba pro odesílání emailů v OnlineSpráva aplikaci.

## 🔧 Konfigurace

### Environment proměnné (.env):
```env
VITE_N8N_WEBHOOK_URL=https://n8n.srv882016.hstgr.cloud/webhook/ada15a58-b14f-4179-92a1-780b009669a4
```

### N8N Workflow struktura:
1. **Webhook trigger** - přijímá POST požadavky s email daty
2. **Edit Fields** - zpracování příchozích dat (to, subject, html)
3. **Gmail connector** - odesílání emailů přes Gmail

## 📂 Implementované soubory

### 1. Email Service (`src/lib/emailService.ts`)
- Třída `EmailService` pro komunikaci s N8N webhook
- Metody: `sendEmail()`, `sendBulkEmails()`, `testConnection()`
- Singleton instance: `emailService`

### 2. Aktualizované komponenty
- **VotingInvitationModal** - odesílání pozvánek k hlasování
- **SendMinutesModal** - odesílání zápisů z hlasování
- **EmailTestView** - testování N8N webhook připojení

### 3. Test rozhraní
- Nová komponenta `EmailTestView` v sekci "E-maily"
- Test připojení k N8N webhook
- Odesílání test emailů
- Zobrazení konfigurace

## 🚀 Funkcionalita

### Automatické odesílání emailů:
1. **Pozvánky k hlasování** - automatické generování hlasovacích odkazů a kódů
2. **Zápisy z hlasování** - odesílání výsledků členům a pozorovatelům
3. **Hromadné odesílání** - s ochranou proti přetížení (100ms pauza)

### Email template systém:
- Podpora HTML templátů
- Nahrazování proměnných (členové, budovy, hlasování)
- Globální a lokální šablony

### Chybové zpracování:
- Retry mechanismus
- Detailní error reporting
- Toast notifikace o stavu odesílání

## 📧 Použití

### Programmatické použití:
```typescript
import { emailService } from '../lib/emailService';

// Jednoduchý email
const result = await emailService.sendEmail({
  to: 'prijemce@email.cz',
  subject: 'Předmět emailu',
  html: '<h1>HTML obsah</h1>'
});

// Hromadné odesílání
const emails = [
  { to: 'user1@email.cz', subject: 'Test 1', html: '<p>Email 1</p>' },
  { to: 'user2@email.cz', subject: 'Test 2', html: '<p>Email 2</p>' }
];
const results = await emailService.sendBulkEmails(emails);
```

### UI testování:
1. Přihlaste se do aplikace
2. Přejděte na sekci "E-maily"
3. Otestujte připojení tlačítkem "Test připojení"
4. Odešlete test email vyplněním formuláře

## 🔍 Monitoring

### Logy v browser konzoli:
- Detailní výstup o odesílaných emailech
- N8N webhook response data
- Error informace při selhání

### N8N Dashboard:
- Sledování úspěšných/neúspěšných požadavků
- Analýza workflow výkonu
- Debug problémů s odesíláním

## 🛠️ Troubleshooting

### Časté problémy:

1. **"Email služba není nakonfigurována"**
   - Zkontrolujte .env soubor
   - Ověřte VITE_N8N_WEBHOOK_URL

2. **HTTP 404/500 chyby**
   - Ověřte dostupnost N8N serveru
   - Zkontrolujte webhook URL

3. **Gmail authentication chyby**
   - Zkontrolujte Gmail credentials v N8N
   - Ověřte App Password nastavení

### Debug kroky:
1. Otevřte Developer Tools (F12)
2. Přejděte na Network tab
3. Pošlete test email
4. Zkontrolujte HTTP požadavky na webhook URL

## 🎯 Výhody této integrace

✅ **Decentralizované** - Email služba běží nezávisle na hlavní aplikaci
✅ **Škálovatelné** - N8N zvládne vysoký objem emailů
✅ **Flexibilní** - Snadné přidání nových email providerů
✅ **Monitorovatelné** - Kompletní přehled přes N8N dashboard
✅ **Bezpečné** - Credentials uloženy v N8N, ne v aplikaci

## 📱 Aplikace URLs

Aplikace nyní běží na: **http://localhost:3006**

Pro testování webhook integrace přejděte na sekci "E-maily" po přihlášení.
