# CORS řešení pro N8N webhook

## Problém
N8N webhook nepovoluje CORS požadavky z localhost, což způsobuje chybu:
```
Access to fetch at 'https://n8n.srv882016.hstgr.cloud/webhook/...' from origin 'http://localhost:3008' has been blocked by CORS policy
```

## Řešení implementovaná v aplikaci

### 1. Development Proxy (Aktuální řešení)
V `vite.config.ts` je nakonfigurována proxy:
```typescript
proxy: {
  '/api/email': {
    target: 'https://n8n.srv882016.hstgr.cloud',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api\/email/, '/webhook/ada15a58-b14f-4179-92a1-780b009669a4'),
    secure: true
  }
}
```

**Výhody:**
- ✅ Funguje v development režimu
- ✅ Můžeme číst response z N8N
- ✅ Žádné bezpečnostní kompromisy

**Nevýhody:**
- ❌ Funguje pouze v development režimu
- ❌ Produkční build potřebuje jiné řešení

### 2. No-CORS režim (Fallback)
V produkci se používá `mode: 'no-cors'`:
```typescript
const fetchOptions: RequestInit = {
  method: 'POST',
  mode: 'no-cors', // Pro produkci
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(emailData)
};
```

**Výhody:**
- ✅ Funguje v produkci
- ✅ Požadavek se odešle

**Nevýhody:**
- ❌ Nemůžeme číst response
- ❌ Neznáme, zda email byl skutečně odeslán

## Doporučená řešení pro produkci

### Option A: Konfigurace CORS v N8N
V N8N workflow přidejte HTTP Response node s hlavičkami:
```json
{
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
}
```

### Option B: Proxy server v produkci
Nasaďte proxy server (např. Nginx) který přepošle požadavky:
```nginx
location /api/email {
    proxy_pass https://n8n.srv882016.hstgr.cloud/webhook/ada15a58-b14f-4179-92a1-780b009669a4;
    add_header Access-Control-Allow-Origin *;
}
```

### Option C: Backend endpoint
Vytvořte endpoint ve vašem backend API který volá N8N webhook server-to-server.

## Testování

1. **Development**: Proxy automaticky funguje na `http://localhost:3008`
2. **Produkce**: Používá se no-cors režim
3. **Test**: Použijte komponentu MessageTestView → tab "Komunikace"

## Status
- ✅ Development funguje s proxy
- ⚠️ Produkce používá no-cors (bez response feedback)
- 🔄 Doporučeno: Konfigurace CORS v N8N nebo produkční proxy
