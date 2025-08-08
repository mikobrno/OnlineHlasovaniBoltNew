# GitHub Deployment Setup

## 1. Nastavení GitHub Pages

1. Jděte do GitHub repository → **Settings** → **Pages**
2. Nastavte Source na **GitHub Actions**
3. Repository bude dostupné na: `https://mikobrno.github.io/OnlineHlasovaniBoltNew/`

## 2. Konfigurace GitHub Secrets

Přejděte do **Settings** → **Secrets and variables** → **Actions** a přidejte tyto secrets:

### Environment Variables (povinné):
```
VITE_SUPABASE_URL=https://nehlqaoqmhdvyncvizcc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5laGxxYW9xbWhkdnluY3ZpemNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNzY1OTEsImV4cCI6MjA2OTY1MjU5MX0.poCWT_JCWnP5t0FvQjk3-VLKRE2o59EvBq7GoPcwRao
VITE_N8N_WEBHOOK_URL=https://n8n.srv882016.hstgr.cloud/webhook/ada15a58-b14f-4179-92a1-780b009669a4
VITE_SMSBRANA_LOGIN=milankost_h1
VITE_SMSBRANA_PASSWORD=pwnEnx8GJtoVu7R7
```

### Environment Variables (volitelné):
```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## 3. Spuštění Deployment

### Automatické spuštění:
- Každý push do branch `03-08-2025-po-nasazeni` spustí deployment
- Každý push do `main` nebo `master` branch spustí deployment

### Manuální spuštění:
1. Jděte do **Actions** tab
2. Vyberte "Build and Deploy to GitHub Pages" workflow
3. Klikněte na **Run workflow**

## 4. Sledování Deployment

1. V **Actions** tab můžete sledovat průběh build a deployment
2. Po dokončení bude aplikace dostupná na GitHub Pages URL
3. Změny se projeví do několika minut

## 5. Produkční konfigurace

### CORS pro N8N webhook:
V produkci je potřeba nakonfigurovat CORS v N8N nebo použít backend proxy, protože GitHub Pages nepovoluje server-side proxy.

### Base URL:
Aplikace automaticky detekuje produkční prostředí a používá správný base path: `/OnlineHlasovaniBoltNew/`

## 6. Troubleshooting

### Build selhává:
- Zkontrolujte, že všechny povinné secrets jsou nastavené
- Ověřte syntax v workflow souboru

### Aplikace se nenačítá:
- Zkontrolujte GitHub Pages nastavení
- Ověřte, že base path je správně nakonfigurovaný

### CORS chyby v produkci:
- V produkci se použije `no-cors` režim pro email službu
- Pro plnou funkcionalitu je potřeba nakonfigurovat CORS v N8N
