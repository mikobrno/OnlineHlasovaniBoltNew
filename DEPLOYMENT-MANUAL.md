# 🚀 GitHub Pages Deployment - Návod k dokončení

## Aktuální stav ✅
- ✅ GitHub Actions workflow je vytvořen (`.github/workflows/deploy.yml`)
- ✅ Vite.config je nastaven pro GitHub Pages
- ✅ SPA routing je nakonfigurován (404.html, .nojekyll)
- ✅ Base path je správně nastaven na `/OnlineHlasovaniBoltNew/`
- ✅ Kód je pushnutý na branch `03-08-2025-po-nasazeni`

## 🔧 Co musíte udělat manuálně:

### 1. Nastavit GitHub Secrets
Přejděte na: **https://github.com/mikobrno/OnlineHlasovaniBoltNew/settings/secrets/actions**

Klikněte na **"New repository secret"** a přidejte tyto secrets:

```
VITE_SUPABASE_URL
Hodnota: https://nehlqaoqmhdvyncvizcc.supabase.co

VITE_SUPABASE_ANON_KEY  
Hodnota: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5laGxxYW9xbWhkdnluY3ZpemNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNzY1OTEsImV4cCI6MjA2OTY1MjU5MX0.poCWT_JCWnP5t0FvQjk3-VLKRE2o59EvBq7GoPcwRao

VITE_N8N_WEBHOOK_URL
Hodnota: https://n8n.srv882016.hstgr.cloud/webhook/ada15a58-b14f-4179-92a1-780b009669a4

VITE_SMSBRANA_LOGIN
Hodnota: milankost_h1

VITE_SMSBRANA_PASSWORD
Hodnota: pwnEnx8GJtoVu7R7

VITE_GEMINI_API_KEY
Hodnota: your_gemini_api_key_here (volitelné)
```

### 2. Povolit GitHub Pages
Přejděte na: **https://github.com/mikobrno/OnlineHlasovaniBoltNew/settings/pages**

- **Source**: Vyberte "GitHub Actions"
- Ostatní nastavení ponechte výchozí

### 3. Spustit Deployment
Po nastavení secrets a pages:

**Automaticky:**
- Každý push do branch `03-08-2025-po-nasazeni` spustí deployment

**Manuálně:**
- Přejděte na: **https://github.com/mikobrno/OnlineHlasovaniBoltNew/actions**
- Vyberte workflow "Build and Deploy to GitHub Pages"
- Klikněte "Run workflow"

### 4. Sledovat Progress
- V **Actions** tab můžete sledovat průběh
- Build trvá cca 2-3 minuty
- Po dokončení bude aplikace dostupná na: **https://mikobrno.github.io/OnlineHlasovaniBoltNew/**

## 🔍 Troubleshooting

### Pokud build selhává:
1. Zkontrolujte, že všechny secrets jsou správně nastavené
2. Ověřte, že secrets nemají přebytečné mezery
3. Zkontrolujte log v Actions tab

### Pokud se aplikace nenačítá:
1. Ověřte, že GitHub Pages source je nastaven na "GitHub Actions"
2. Zkontrolujte, že deploy job proběhl úspěšně
3. Počkejte 5-10 minut na propagaci DNS

### CORS chyby v produkci:
- Email služba bude fungovat v `no-cors` režimu
- SMS služba by měla fungovat bez problémů
- Pro plnou funkcionalitu emailů je potřeba nakonfigurovat CORS v N8N

## 📋 Kontrolní seznam
- [ ] Nastaveny všechny GitHub Secrets
- [ ] Povolen GitHub Pages s "GitHub Actions" source
- [ ] Spuštěn deployment (automaticky nebo manuálně)
- [ ] Sledován progress v Actions tab
- [ ] Ověřena funkcionalnost na https://mikobrno.github.io/OnlineHlasovaniBoltNew/

## 🎯 Výsledek
Po dokončení bude aplikace dostupná na:
**https://mikobrno.github.io/OnlineHlasovaniBoltNew/**

Všechny komunikační služby budou funkční, včetně testovacích rozhraní!
