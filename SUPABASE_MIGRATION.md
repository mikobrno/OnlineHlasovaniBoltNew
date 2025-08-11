# 🗄️ Supabase Database Migration

## Přehled
Vaše aplikace byla připravena pro napojení na Supabase databázi. Aktuálně stále používá mock data, ale můžete snadno přepnout na skutečnou databázi.

## 🚀 Nastavení Supabase

### 1. Vytvoření Supabase projektu
1. Přejděte na [supabase.com](https://supabase.com)
2. Vytvořte nový projekt
3. Poznamenejte si URL a Anon Key z Settings > API

### 2. Nastavení environment variables
Vytvořte `.env` soubor v root adresáři s:
```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Inicializace databáze
1. V Supabase dashboardu přejděte do SQL editoru
2. Spusťte obsah souboru `database_setup.sql`
3. Tím se vytvoří všechny potřebné tabulky a ukázková data

### 4. Aktivace databáze
V souboru `src/contexts/AppContextCompat.tsx` změňte:
```typescript
const USE_SUPABASE = true; // Změňte z false na true
```

## 📊 Struktura databáze

### Hlavní tabulky:
- **buildings** - Budovy/SVJ
- **members** - Členové jednotlivých budov
- **votes** - Hlasování
- **questions** - Otázky v hlasování
- **member_votes** - Hlasy členů
- **email_templates** - E-mailové šablony
- **global_variables** - Globální proměnné
- **building_variable_definitions** - Definice proměnných budov
- **observers** - Pozorovatelé hlasování

### Pomocné tabulky:
- **voting_tokens** - Tokeny pro SMS ověření
- **manual_vote_attachments** - Přílohy k manuálním hlasům
- **manual_vote_notes** - Poznámky k manuálním hlasům

## 🔄 Migrace dat

### Z mock dat do databáze:
1. Aktivujte Supabase (krok 4 výše)
2. Všechna mock data jsou už přednastavena v `database_setup.sql`
3. Existující data v aplikaci se automaticky nahradí daty z databáze

### Zpět na mock data:
1. V `src/contexts/AppContextCompat.tsx` změňte `USE_SUPABASE = false`
2. Aplikace se vrátí k používání mock dat

## 🎯 Výhody Supabase

### ✅ Co získáte:
- **Persistentní data** - Data zůstávají po refresh/redeploy
- **Real-time synchronizace** - Změny viditelné okamžitě
- **Škálování** - Databáze roste s aplikací
- **Zálohování** - Automatické zálohy dat
- **Multi-user** - Více uživatelů sdílí data

### 🔒 Bezpečnost:
- Row Level Security (RLS) aktivována
- Zatím povolený plný přístup (můžete později omezit)
- HTTPS šifrování komunikace

## 🛠️ Řešení problémů

### Chyba připojení:
1. Zkontrolujte URL a Anon Key v `.env`
2. Ověřte, že projekt v Supabase běží
3. Zkontrolujte network connectivity

### Data se nenačítají:
1. Otevřete browser console
2. Zkontrolujte chybové zprávy
3. Ověřte, že databáze byla správně inicializována

### Fallback na mock data:
Kdykoliv můžete rychle přepnout zpět na mock data změnou `USE_SUPABASE = false`

## 📝 Co dál?

1. **Testování** - Vyzkoušejte všechny funkce s databází
2. **Autentifikace** - Přidejte user management
3. **Oprávnění** - Nastavte RLS polícy podle potřeb
4. **Backup** - Nastavte pravidelné zálohy
5. **Monitoring** - Sledujte výkon databáze

---

**Tip:** Pro začátek doporučuji nechat `USE_SUPABASE = false` a otestovat aplikaci s mock daty. Poté postupně přejít na databázi.
