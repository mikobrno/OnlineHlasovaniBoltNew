# NASAZENÍ ROZŠÍŘENÉ DATABÁZE A FUNKCIONALITY

## 🚀 KROKY PRO NASAZENÍ

### 1. NASAZENÍ DATABÁZE DO SUPABASE

**DŮLEŽITÉ:** Spusťte tento SQL kód v Supabase SQL Editor:

```sql
-- Otevřete Supabase Dashboard → SQL Editor → New Query
-- Zkopírujte CELÝ obsah souboru database/schema.sql
-- Spusťte dotaz (může trvat několik minut)
```

**Soubor k nasazení:** `database/schema.sql`

**Co se nasadí:**
- ✅ 20+ databázových tabulek
- ✅ RLS (Row Level Security) politiky
- ✅ Triggers pro audit log
- ✅ Views pro analytics
- ✅ Stored procedures
- ✅ Enterprise funkce (delegace, SMS, notifikace)

### 2. KONTROLA NASAZENÍ

Po spuštění SQL kódu ověřte v Supabase Dashboard:

#### Table Editor:
Měli byste vidět tyto tabulky:
- `buildings` - Správa budov
- `members` - Členové SVJ
- `votes` - Hlasování
- `questions` - Otázky k hlasování
- `vote_responses` - Odpovědi na hlasování
- `vote_delegations` - Delegace hlasů
- `notifications` - Notifikace
- `sms_verifications` - SMS ověření
- `audit_log` - Audit log
- `vote_analytics` - Analytika
- `reports` - Reporty
- `proxy_votes` - Zastupitelská hlasování
- `attachments` - Přílohy
- `email_templates` - E-mail šablony
- `global_variables` - Globální proměnné
- `building_variables` - Proměnné budov

#### Authentication:
- RLS politiky jsou automaticky aplikovány
- Veřejný přístup je řízen pomocí politik

### 3. TESTOVÁNÍ FUNKCIONALITY

Po nasazení databáze:

1. **Spusťte aplikaci:**
   ```bash
   npm run dev
   ```

2. **Testujte základní funkce:**
   - ✅ Přidání nové budovy
   - ✅ Import členů
   - ✅ Vytvoření hlasování
   - ✅ Spuštění hlasování

3. **Testujte nové pokročilé funkce:**
   - ✅ Delegace hlasů
   - ✅ Notifikace
   - ✅ Analytics hlasování
   - ✅ Export reportů

## 🔧 NOVÁ FUNKCIONALITA

### Delegace hlasů
```typescript
// Vytvoření delegace
await createDelegation({
  delegator_id: 'user1',
  delegate_id: 'user2', 
  vote_id: 'vote1',
  delegation_type: 'full'
});
```

### Notifikace
```typescript
// Vytvoření notifikace
await createNotification({
  recipient_id: 'user1',
  title: 'Nové hlasování',
  message: 'Spuštěno nové hlasování...',
  type: 'vote_started'
});
```

### Analytics
```typescript
// Získání analytiky hlasování
const analytics = await getVoteAnalytics('vote1');
console.log(analytics.participation_rate);
```

### Reporty
```typescript
// Generování reportu
const report = await generateReport('vote1', 'detailed', 'pdf');
```

## 📊 NOVÉ TYPY A INTERFACES

Všechny nové typy jsou definovány v `src/types/extended.ts`:

- `ExtendedBuilding` - Rozšířené budovy
- `ExtendedMember` - Rozšířené členy  
- `ExtendedVote` - Rozšířené hlasování
- `VoteDelegation` - Delegace hlasů
- `Notification` - Notifikace
- `VoteAnalytics` - Analytika
- `Report` - Reporty
- `ProxyVote` - Zastupitelské hlasování
- `Attachment` - Přílohy

## ⚡ CONTEXT API

Aplikace nyní používá `CompleteAppContext` s všemi původními funkcemi + nové:

```typescript
import { useApp } from './contexts/AppContextNew';

const {
  // Původní funkce (zachováno)
  addBuilding,
  addMember, 
  addVote,
  
  // Nové pokročilé funkce
  createDelegation,
  createNotification,
  generateReport,
  getVoteAnalytics
} = useApp();
```

## 🛡️ ZPĚTNÁ KOMPATIBILITA

**DŮLEŽITÉ:** Všechny původní funkce jsou zachovány!

- ✅ Původní API metody fungují beze změn
- ✅ Stávající komponenty nepotřebují úpravy
- ✅ Mock data systém funguje paralelně
- ✅ Postupný přechod na nové funkce

## 🔍 TROUBLESHOOTING

### Pokud databáze nefunguje:
1. Zkontrolujte Supabase URL a klíče v `.env`
2. Ověřte, že SQL script se spustil bez chyb
3. Zkontrolujte RLS politiky v Table Editor

### Pokud TypeScript hlásí chyby:
1. Restartujte TypeScript server (`Ctrl+Shift+P` → "TypeScript: Restart TS Server")
2. Zkontrolujte import cesty v souborech

### Pokud komponenty nefungují:
1. Ujistěte se, že používáte `AppContextNew` 
2. Zkontrolujte, že `CompleteAppProvider` je v `main.tsx`

## 📈 DALŠÍ KROKY

Po úspěšném nasazení můžete:

1. **Konfigurovat SMS službu** (Twilio/nexmo)
2. **Nastavit e-mail šablony** 
3. **Vytvořit první delegace**
4. **Otestovat notifikace**
5. **Exportovat první reporty**

---

**🎉 GRATULUJEME!** 

Máte nyní kompletní enterprise hlasovací systém s všemi původními funkcemi + pokročilé features jako delegace, analytics, notifikace a reporty!

Všechno je navrženo tak, aby rozšířilo původní funkcionalita bez ztráty jakýchkoliv stávajících možností.
