# 🚀 Nasazení Online Hlasování SVJ - Supabase + Netlify

Tento dokument obsahuje krok za krokem návod pro kompletní nasazení aplikace Online Hlasování SVJ na produkční prostředí.

## 📋 Přehled architektury

```
Frontend (Netlify) ←→ Backend API (Supabase) ←→ Database (PostgreSQL)
        ↓                      ↓                      ↓
    React App            Edge Functions           Row Level Security
   Vite Build               Real-time                 Backups
    CDN Cache                Storage                 Monitoring
```

## 🔧 1. Příprava Supabase

### 1.1 Vytvoření projektu

1. Přihlaste se na [supabase.com](https://supabase.com)
2. Klikněte na "New Project"
3. Vyplňte:
   - **Name**: `online-hlasovani-svj`
   - **Database Password**: Silné heslo (uložte si ho!)
   - **Region**: Europe (eu-central-1)
4. Klikněte "Create new project"

### 1.2 Konfigurace databáze

1. **Spuštění SQL schema**
   - V Supabase dashboard přejděte na SQL Editor
   - Otevřete soubor `database/schema.sql` z projektu
   - Zkopírujte obsah a spusťte v SQL editoru

2. **Ověření tabulek**
   ```sql
   -- Zkontrolujte, že všechny tabulky byly vytvořeny
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

3. **Migrace vzorových dat** (volitelné)
   ```bash
   # Ve složce projektu
   npm run migrate
   ```

### 1.3 Konfigurace Storage

1. V Supabase dashboard přejděte na Storage
2. Klikněte "Create bucket"
3. Vyplňte:
   - **Name**: `attachments`
   - **Public bucket**: ✅ Ano
4. Klikněte "Create bucket"

### 1.4 Získání API klíčů

1. V Supabase dashboard přejděte na Settings → API
2. Uložte si:
   - **Project URL**: `https://your-project.supabase.co`
   - **anon public**: `eyJ...` (pro frontend)

## 🌐 2. Příprava Netlify

### 2.1 Vytvoření Git repository

1. **Inicializace Git** (pokud není)
   ```bash
   git init
   git add .
   git commit -m "Initial commit with Supabase integration"
   ```

2. **Push na GitHub/GitLab**
   ```bash
   git remote add origin https://github.com/your-username/online-hlasovani-svj.git
   git push -u origin main
   ```

### 2.2 Napojení na Netlify

1. Přihlaste se na [netlify.com](https://netlify.com)
2. Klikněte "New site from Git"
3. Vyberte váš Git provider (GitHub/GitLab)
4. Vyberte repository `online-hlasovani-svj`
5. Nastavte:
   - **Branch to deploy**: `main`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

### 2.3 Environment proměnné

V Netlify dashboard → Site settings → Environment variables přidejte:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_SMSBRANA_LOGIN=your_smsbrana_login
VITE_SMSBRANA_PASSWORD=your_smsbrana_password
```

### 2.4 První deploy

1. Po nastavení environment proměnných klikněte "Deploy site"
2. Počkejte na dokončení buildu (2-5 minut)
3. Otestujte aplikaci na Netlify URL

## 🔐 3. Bezpečnostní konfigurace

### 3.1 Supabase RLS (Row Level Security)

RLS je již nakonfigurováno v `schema.sql`, ale pro produkci doporučujeme zpřísnit:

```sql
-- Zpřísnění pro administrátory
DROP POLICY IF EXISTS "Allow all for admin" ON buildings;
CREATE POLICY "Admin access buildings" ON buildings 
FOR ALL USING (
  auth.jwt() ->> 'email' IN (
    'admin@yourdomain.com',
    'supervisor@yourdomain.com'
  )
);
```

### 3.2 API Rate Limiting

V Supabase dashboard → Authentication → Rate Limits nastavte:
- **Requests per hour**: 100
- **Email confirmations per hour**: 10

### 3.3 Netlify Security Headers

Vytvořte `_headers` v `public/` složce:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## 📧 4. Konfigurace externích služeb

### 4.1 Google Gemini API

1. Přejděte na [Google Cloud Console](https://console.cloud.google.com)
2. Vytvořte nový projekt nebo vyberte existující
3. Povolte Generative AI API
4. Vytvořte API klíč
5. Přidejte klíč do Netlify environment proměnných

### 4.2 SMSbrana.cz

1. Zaregistrujte se na [smsbrana.cz](https://smsbrana.cz)
2. Nastavte tarif pro SMS
3. Získejte přihlašovací údaje
4. Přidejte je do Netlify environment proměnných

### 4.3 Email služba (volitelné)

Pro odesílání emailů můžete použít:
- **Supabase SMTP** (nastavení v dashboard)
- **SendGrid** (doporučeno pro větší objem)
- **Mailgun**

## 🔄 5. CI/CD Pipeline

### 5.1 Automatické deploymenty

Netlify automaticky deployuje při push do `main` branch. Pro kontrolu můžete nastavit:

**Branch deploys**:
- `develop` → Preview deploy
- `main` → Production deploy

### 5.2 Build optimalizace

V `netlify.toml` jsou již nastaveny optimalizace:
- Asset optimization
- Code splitting
- Bundle analysis

## 📊 6. Monitoring a Analýza

### 6.1 Supabase Monitoring

1. V Supabase dashboard → Reports sledujte:
   - Database performance
   - API usage
   - Error rates

### 6.2 Netlify Analytics

1. V Netlify dashboard povolte Analytics
2. Sledujte:
   - Traffic
   - Build times
   - Error rates

### 6.3 Google Analytics (volitelné)

Přidejte GA tracking do `index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
```

## 🧪 7. Testování produkce

### 7.1 Funkční testy

Otestujte na produkční URL:
- ✅ Registrace budovy
- ✅ Přidání členů
- ✅ Vytvoření hlasování
- ✅ Online hlasování
- ✅ Generování PDF
- ✅ Email notifikace
- ✅ SMS ověření

### 7.2 Performance testy

```bash
# Lighthouse audit
npx lighthouse https://your-app.netlify.app --view

# Bundle analyzer
npm run build
npx vite-bundle-analyzer dist
```

## 🚨 8. Troubleshooting

### 8.1 Časté problémy

**Build chyba na Netlify**:
```bash
# Zkontrolujte Node.js verzi v netlify.toml
[build.environment]
  NODE_VERSION = "18"
```

**Supabase connection error**:
- Ověřte URL a anon key
- Zkontrolujte RLS policies
- Sledujte logs v Supabase dashboard

**404 na SPA routách**:
- Ověřte `_redirects` soubor v `public/`
- Zkontrolujte redirect rules v `netlify.toml`

### 8.2 Logy a debugging

**Netlify logs**:
- Netlify dashboard → Deploys → Deploy log

**Supabase logs**:
- Supabase dashboard → Logs → API/Database

**Browser console**:
- F12 → Console/Network tab

## 📈 9. Škálování

### 9.1 Database optimalizace

Pro větší objem dat:
```sql
-- Indexy pro často používané dotazy
CREATE INDEX CONCURRENTLY idx_votes_status_date ON votes(status, created_at);
CREATE INDEX CONCURRENTLY idx_members_building_email ON members(building_id, email);
```

### 9.2 CDN optimalizace

Netlify automaticky poskytuje CDN, ale můžete přidat:
- Cloudflare pro dodatečnou cache
- AWS CloudFront pro globální distribuci

## ✅ 10. Kontrolní seznam nasazení

- [ ] Supabase projekt vytvořen a nakonfigurován
- [ ] Database schema spuštěno
- [ ] Storage bucket vytvořen
- [ ] Git repository připraven
- [ ] Netlify site nakonfigurováno
- [ ] Environment proměnné nastaveny
- [ ] První deploy úspěšný
- [ ] RLS policies zkontrolovány
- [ ] Externí služby nakonfigurovány
- [ ] Funkční testy provedeny
- [ ] Performance optimalizace ověřena
- [ ] Monitoring nastaveno
- [ ] Backup strategie definována

## 📞 Podpora

V případě problémů:
1. Zkontrolujte troubleshooting sekci
2. Sledujte logy v příslušných službách
3. Kontaktujte podporu služeb (Supabase/Netlify)

---

**Gratulujeme! 🎉 Vaše aplikace Online Hlasování SVJ je nyní nasazena v produkci.**
