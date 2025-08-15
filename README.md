# Online Hlasování - Systém pro SVJ

Moderní webová aplikace pro správu hlasování ve společenstvích vlastníků jednotek (SVJ) s integrací Supabase a nasazením na Netlify.

## 🚀 Technologie

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Hosting**: Netlify
- **AI**: Google Gemini API
- **SMS**: SMSbrana.cz

## 📋 Funkce

- ✅ Správa budov a vlastníků
- ✅ Vytváření a správa hlasování
- ✅ Online hlasování s tokenovou autentizací
- ✅ Email a SMS notifikace
- ✅ Generování protokolů v PDF
- ✅ AI asistovaná tvorba obsahu
- ✅ Správa pozoroval a zástupců
- ✅ Import/export dat
- ✅ Responzivní design
- ✅ Dark mode

## 🛠️ Lokální vývoj

### ❌ Žádná MOCK data

V aktuální verzi jsou veškeré zbytky původních `mockData` odstraněny. Aplikace musí vždy číst a zapisovat pouze do skutečné databáze (Supabase / Nhost).

Zásady:
- Nikdy nepřidávat zpět soubor `mockData.ts` ani podobné statické kolekce.
- Helper funkce (`replaceVariables`, renderer dokumentů, e‑mail šablony) používají nyní minimalistické rozhraní a očekávají data přivezená z GraphQL / REST.
- Při potřebě „seed“ dat používejte SQL skripty v `database/seeds` nebo oficiální migrační skripty.
- Pokud komponenta potřebuje data, vždy je načtěte přes GraphQL dotaz / REST volání – neimportujte statické objekty.

Audit: Pokud narazíte na import `../data/mockData`, jde o relikt – odstraňte jej a nahraďte typy z `src/types` nebo lokálními minimalistickými typy.


### Předpoklady

- Node.js 18+
- npm nebo yarn
- Supabase account
- Google Cloud account (pro Gemini API)
- SMSbrana.cz account

### Instalace

1. **Klonování repository**
   ```bash
   git clone <repository-url>
   cd OnlineHlasovaniBoltNew
   ```

2. **Instalace závislostí**
   ```bash
   npm install
   ```

3. **Konfigurace prostředí**
   
   Zkopírujte `.env.example` do `.env` a vyplňte hodnoty:
   ```bash
   cp .env.example .env
   ```

   Upravte `.env` soubor:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Google Gemini API
   VITE_GEMINI_API_KEY=your_gemini_api_key

   # SMSbrana.cz
   VITE_SMSBRANA_LOGIN=your_login
   VITE_SMSBRANA_PASSWORD=your_password
   ```

4. **Spuštění vývojového serveru**
   ```bash
   npm run dev
   ```

   Aplikace bude dostupná na `http://localhost:3000`

## 🗄️ Databáze (Supabase)

### Nastavení Supabase

1. Vytvořte nový projekt na [supabase.com](https://supabase.com)
2. Spusťte migrace databáze (viz `migrateData.js`)
3. Nastavte Row Level Security (RLS) políticas
4. Nakonfigurujte Storage pro přílohy

### Migrace dat

Pro migraci vzorových dat do Supabase:

```bash
npm run migrate
```

### Struktura databáze

Klíčové tabulky:
- `buildings` - Informace o budovách/SVJ
- `members` - Vlastníci jednotek
- `votes` - Hlasování
- `questions` - Otázky v hlasování
- `voting_tokens` - Tokeny pro online hlasování
- `member_votes` - Odevzdané hlasy
- `email_templates` - Email šablony
- `global_variables` - Globální proměnné
- `observers` - Pozorovatelé hlasování

## 🚀 Nasazení na Netlify

### Automatické nasazení

1. **Připojte Git repository**
   - Přihlaste se na [netlify.com](https://netlify.com)
   - Klikněte na "New site from Git"
   - Vyberte váš repository

2. **Nastavení build**
   
   Netlify automaticky detekuje `netlify.toml` konfiguraci:
   ```toml
   [build]
     publish = "dist"
     command = "npm run build"
   ```

3. **Environment proměnné**
   
   V Netlify dashboard → Site settings → Environment variables přidejte:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_SMSBRANA_LOGIN=your_smsbrana_login
   VITE_SMSBRANA_PASSWORD=your_smsbrana_password
   ```

4. **Deploy**
   
   Po nastavení environment proměnných spusťte deploy:
   - Netlify automaticky builds při každém push do main branch
   - Můžete také manuálně spustit deploy v dashboard

### Manuální nasazení

```bash
# Build pro produkci
npm run build

# Deploy na Netlify CLI
npx netlify deploy --prod --dir=dist
```

## 🔧 Konfigurace

### Supabase konfigurace

1. **RLS Policy**
   ```sql
   -- Example policy for buildings table
   CREATE POLICY "Allow public read" ON buildings FOR SELECT USING (true);
   CREATE POLICY "Allow authenticated write" ON buildings FOR ALL USING (auth.role() = 'authenticated');
   ```

2. **Storage Bucket**
   ```sql
   -- Create bucket for attachments
   INSERT INTO storage.buckets (id, name, public) VALUES ('attachments', 'attachments', true);
   ```

### Email konfigurace

Preferovaný způsob v této app je serverless funkce `/.netlify/functions/send-email`:

- Pokud jsou nastaveny proměnné `MAILJET_API_KEY` a `MAILJET_API_SECRET`, maily se posílají přes Mailjet API v3.1.
- Pokud Mailjet není nastaven, funkce spadne na Gmail SMTP (GMAIL_USER + GMAIL_APP_PASSWORD).

Nastavení (Netlify → Site settings → Environment variables):

```
MAILJET_API_KEY=xxxxxxxxxxxxxxxx
MAILJET_API_SECRET=xxxxxxxxxxxxxxxx
MAILJET_FROM_EMAIL=notify@vas-domena.cz
MAILJET_FROM_NAME=Online Hlasování
# Volitelný fallback:
GMAIL_USER=you@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

Lokálně můžete spustit Netlify Dev a směrovat požadavky přes `VITE_FUNCTIONS_BASE_URL=http://localhost:8888`.

### SMS konfigurace

SMS notifikace jsou implementovány přes SMSbrana.cz API. Nastavte credentials v environment proměnných.

## 📱 API Endpoints

### Veřejné endpoints

- `GET /vote/:token` - Online hlasování
- `POST /api/verify` - Ověření hlasovacího tokenu

### Administrátorské endpoints

- Všechny CRUD operace přes Supabase client
- Real-time aktualizace přes Supabase subscriptions

## 🧪 Testování

```bash
# Lint kód
npm run lint

# Type check
npx tsc --noEmit

# Testování buildu
npm run build && npm run preview
```

## 📦 Produkční optimalizace

### Vite optimalizace

- Code splitting pro lepší loading
- Tree shaking pro menší bundle size
- Asset optimization
- Service Worker cache (optional)

### Supabase optimalizace

- Connection pooling
- Query optimalizace
- Indexy na frequently queried columns
- RLS pro security

## 🔒 Bezpečnost

### Frontend

- Environment proměnné pouze s `VITE_` prefixem
- XSS ochrana
- CSRF ochrana přes Supabase

### Backend (Supabase)

- Row Level Security (RLS)
- Secure API keys
- Rate limiting
- Audit logs

## 🐛 Troubleshooting

### Časté problémy

1. **Build chyby**
   ```bash
   # Vyčistit node_modules a reinstalovat
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Supabase connection issues**
   - Ověřte URL a anon key
   - Zkontrolujte RLS policies
   - Ověřte network firewall

3. **Netlify deploy chyby**
   - Zkontrolujte environment proměnné
   - Ověřte build logs
   - Zkontrolujte file permissions

### Logy

- Netlify deploy logs: Netlify dashboard → Deploys
- Supabase logs: Supabase dashboard → Logs
- Frontend errors: Browser developer tools

## 👥 Přispívání

1. Fork repository
2. Vytvořte feature branch (`git checkout -b feature/amazing-feature`)
3. Commit změny (`git commit -m 'Add amazing feature'`)
4. Push do branch (`git push origin feature/amazing-feature`)
5. Otevřete Pull Request

## 📄 Licence

Tento projekt je licencován pod MIT licencí.

## 📞 Podpora

Pro podporu kontaktujte:
- Email: support@example.com
- Issues: GitHub Issues
- Dokumentace: [Wiki](link-to-wiki)

---

**Vytvořeno s ❤️ pro české SVJ komunity**
