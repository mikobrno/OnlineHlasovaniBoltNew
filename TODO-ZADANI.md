# TODO: Priority implementace podle zadání

## Vysoká priorita (kritické chybějící funkce)

### 1. Správa Proměnných Systém
- [ ] **Globální proměnné:** CRUD pro proměnné jako {{nazev_spravcovske_firmy}}
- [ ] **Schéma proměnných pro budovy:** Definice "šablony" proměnných pro budovy
- [ ] **Dynamické formuláře:** Generování formulářů na základě schématu
- **Soubory:** `src/modules/admin/variables/` (nový modul)

### 2. Šablonový Systém s AI
- [ ] **Duální šablony:** Pro e-maily i rychlé vytvoření hlasování
- [ ] **AI Gemini integrace:** Generování obsahu šablon
- [ ] **Proměnné v šablonách:** Podpora {{jmeno_clena}} apod.
- **Soubory:** `src/modules/admin/templates/`, `src/lib/gemini.ts`

### 3. Bezpečnostní Systém
- [ ] **Unikátní hlasovací odkazy:** Generování a správa
- [ ] **SMS 2FA:** Integrace s smsbrana.cz
- [ ] **Token-based autentizace:** Pro hlasovací odkazy
- **Soubory:** `src/lib/security/`, `src/lib/sms.ts`

## Střední priorita (rozšiřující funkce)

### 4. Export a PDF Systém
- [ ] **jsPDF integrace:** Kompletní PDF export
- [ ] **Hlasovací lístky:** Generování PDF lístků
- [ ] **Protokoly:** Export finálních protokolů
- **Soubory:** `src/lib/pdf/`, rozšíření voting modulů

### 5. Import/Export Dat
- [ ] **CSV import členů:** S detekcí oddělovačů
- [ ] **Hromadné operace:** Bulk operace pro členy
- **Soubory:** `src/lib/import/`, rozšíření members modulu

### 6. UI/UX Vylepšení
- [ ] **Toast notifikace:** Globální systém zpráv
- [ ] **Modální dialogy:** Univerzální modal systém
- [ ] **Tmavý režim:** Theme switching
- **Soubory:** `src/components/ui/`, `src/contexts/ThemeContext.tsx`

## Nízká priorita (dokončovací práce)

### 7. Technické Optimalizace
- [ ] **Error boundaries:** Lepší error handling
- [ ] **Loading states:** Konzistentní loading UI
- [ ] **Responsive design:** Dokončení mobile view
- **Soubory:** Celá aplikace

### 8. Deployment a DevOps
- [ ] **Netlify CI/CD:** Automatické deploymenty
- [ ] **Environment config:** Správa .env proměnných
- [ ] **Performance monitoring:** Monitoring a optimalizace
- **Soubory:** `netlify.toml`, `.github/workflows/`

## Aktuálně rozpracováno
- ✅ **VoteProgressView:** Detailní průběh s member breakdown
- ✅ **VoteMembersView:** Správa členů s proxy voting  
- ✅ **VoteObserversView:** Správa pozorovatelů
- 🔄 **VotesListView:** Vylepšený přehled (právě dokončujeme)

## Poznámky k implementaci

### Architektura změny
- **Aktuálně:** Nhost backend
- **Podle zadání:** Supabase backend
- **Doporučení:** Dokončit s Nhost, později migrovat na Supabase

### Prioritizace
1. Nejdříve dokončit aktuální voting modul
2. Poté implementovat proměnné systém (základ pro vše ostatní)
3. Následně AI a šablony
4. Nakonec bezpečnost a export funkce

### Odhad času
- **Proměnné systém:** 2-3 dny
- **AI integrace:** 1-2 dny  
- **SMS + odkazy:** 2-3 dny
- **PDF export:** 1-2 dny
- **UI vylepšení:** 1-2 dny
- **Celkem:** ~10 dní práce
