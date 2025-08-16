# Online Hlasování - Systém pro SVJ

Moderní webová aplikace pro správu hlasování ve společenstvích vlastníků jednotek (SVJ) s integrací Nhost a nasazením na Netlify.

## 🚀 Technologie

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Nhost (PostgreSQL + Hasura)
- **Authentication**: Nhost Auth
- **Hosting**: Netlify/Nhost
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
- Docker a Docker Compose
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
   # Nhost Configuration
   VITE_NHOST_SUBDOMAIN=your-subdomain
   VITE_NHOST_REGION=your-region

   # Google Gemini API
   VITE_GEMINI_API_KEY=your_gemini_api_key

   # SMSbrana.cz
   VITE_SMSBRANA_LOGIN=your_login
   VITE_SMSBRANA_PASSWORD=your_password
   ```

4. **Spuštění lokálního Nhost prostředí**
   ```bash
   ./scripts/start-nhost-local.sh
   ```

5. **Spuštění vývojového serveru**
   ```bash
   npm run dev
   ```

   Aplikace bude dostupná na `http://localhost:3000`
   Hasura Console bude dostupná na `http://localhost:1337/console`

## 🗄️ Databáze (Nhost)

### Nastavení Nhost

1. Vytvořte nový projekt na [nhost.io](https://nhost.io)
2. Spusťte inicializační SQL skripty (viz `database/nhost-schema.sql`)
3. Nakonfigurujte Hasura permissions a relationships
4. Nastavte Storage pro přílohy

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

### Nhost konfigurace

1. **Hasura Permissions**
   ```graphql
   # Example permission for buildings table
   {
     "role": "public",
     "permission": {
       "columns": ["id", "name", "address"],
       "filter": {},
       "allow_aggregations": true
     }
   }
   ```

2. **Storage Configuration**
   ```sql
   -- Create storage configuration in Hasura
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   CREATE TABLE "storage"."files" (
     "id" uuid DEFAULT uuid_generate_v4(),
     "name" text NOT NULL,
     "size" integer NOT NULL,
     "bucket_id" text NOT NULL,
     "created_at" timestamptz DEFAULT now(),
     "updated_at" timestamptz DEFAULT now(),
     "is_uploaded" boolean DEFAULT false,
     PRIMARY KEY ("id")
   );
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

### GraphQL API

- Všechny operace jsou prováděny přes Hasura GraphQL API
- Queries a mutace jsou definovány v `src/graphql/`
- Real-time subscriptions přes Hasura WebSocket

### REST Endpoints

- `GET /vote/:token` - Online hlasování
- `POST /api/verify` - Ověření hlasovacího tokenu

## 🧪 Testování

```bash
# Lint kód
npm run lint

# Type check
npx tsc --noEmit

# Testování buildu
npm run build && npm run preview

# GraphQL type generation
npm run codegen
```

## 📦 Produkční optimalizace

### Vite optimalizace

- Code splitting pro lepší loading
- Tree shaking pro menší bundle size
- Asset optimization
- Service Worker cache (optional)

### Nhost/Hasura optimalizace

- Query caching
- Prepared statements
- Connection pooling
- Selective field requests
- Indexy na často dotazované sloupce
- Rate limiting

## 🔒 Bezpečnost

### Frontend

- Environment proměnné pouze s `VITE_` prefixem
- XSS ochrana
- CSRF ochrana přes Nhost Auth
- GraphQL validace a sanitizace

### Backend (Nhost/Hasura)

- Role-based access control (RBAC)
- JWT autentizace
- Row level permissions
- Column level permissions
- Rate limiting
- Audit logy
- Připravené SQL dotazy

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
