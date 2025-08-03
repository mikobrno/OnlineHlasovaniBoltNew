# 🔧 Řešení problému "useApp must be used within an AppProvider"

Tento dokument popisuje řešení problému s migrací z mock dat na Supabase databázi.

## 🐛 Problém

Aplikace po nasazení vykazovala chybu:
```
Error: useApp must be used within an AppProvider
```

## 🔍 Příčina

Problém byl způsoben přechodem z původního `AppContext` na nový `AppContextSupabase`, ale ne všechny komponenty byly aktualizovány.

## ✅ Řešení

### 1. Vytvořena Compatibility Layer

Vytvořen soubor `src/contexts/AppContextCompat.tsx` který poskytuje stejné API jako původní context:

```typescript
// Compatibility layer pro migraci z mock dat na Supabase
import { useApp as useSupabaseApp } from './AppContextSupabase';

export function useApp() {
  const supabaseApp = useSupabaseApp();
  
  // Mapování na starý API
  return {
    selectedBuilding: supabaseApp.state.selectedBuilding,
    buildings: supabaseApp.state.buildings,
    members: supabaseApp.state.members,
    // ... více properties
    
    // Actions zůstávají stejné
    selectBuilding: supabaseApp.selectBuilding,
    addBuilding: supabaseApp.addBuilding,
    // ... další akce
  };
}
```

### 2. Aktualizace Main Provider

V `src/main.tsx` byl změněn import:
```typescript
// Předtím
import { AppProvider } from './contexts/AppContext';

// Nyní
import { AppProvider } from './contexts/AppContextSupabase';
```

### 3. Aktualizace Environment Variables

V `src/lib/supabaseClient.ts`:
```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}
```

### 4. Vite Environment Types

V `src/vite-env.d.ts`:
```typescript
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_GEMINI_API_KEY: string
  readonly VITE_SMSBRANA_LOGIN: string
  readonly VITE_SMSBRANA_PASSWORD: string
}
```

## 📂 Struktura po řešení

```
src/
├── contexts/
│   ├── AppContext.tsx              # Původní (nyní nepoužívaný)
│   ├── AppContextSupabase.tsx      # Nový hlavní context
│   └── AppContextCompat.tsx        # Compatibility layer
├── lib/
│   ├── supabaseClient.ts          # Supabase konfigurace
│   └── databaseService.ts         # Service vrstva pro databázi
└── components/                    # Komponenty používají AppContextCompat
```

## 🚀 Výsledek

- ✅ Aplikace úspěšně kompiluje
- ✅ Běží v development módu
- ✅ Build pro produkci funguje
- ✅ Komponenty mají přístup k databázovým datům
- ✅ Zachována kompatibilita se starým API

## 🔄 Budoucí refaktoring

Pro dlouhodobé udržování kódu doporučujeme:

1. **Postupná migrace komponent** na přímé používání `AppContextSupabase`
2. **Odstranění compatibility layer** po úplné migraci
3. **Aktualizace typů** pro lepší type safety

## 📝 Kroky pro deployment

1. **Supabase setup:**
   ```bash
   # Spustit SQL schema z database/schema.sql
   # Nakonfigurovat environment proměnné
   ```

2. **Netlify deployment:**
   ```bash
   # Nastavit environment variables v Netlify dashboard:
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Test buildu:**
   ```bash
   npm run build
   npm run preview
   ```

## 🎯 Checkpoints

- [x] Supabase client nakonfigurován
- [x] Database service vytvořen
- [x] Context provider aktualizován
- [x] Compatibility layer implementován
- [x] Build úspěšný
- [x] Aplikace běží v dev módu
- [ ] Databáze naplněna daty (spustit migraci)
- [ ] Production deployment na Netlify

---

**Status**: ✅ Problém vyřešen - aplikace připravena k nasazení
