# Finální Zadání Projektu: Aplikace "OnlineSprava"

## 1. Úvod a Cíl Projektu

**Název Projektu:** OnlineSprava

**Účel:** OnlineSprava je komplexní webová aplikace (SPA) navržená pro zjednodušení a automatizaci administrativních úkolů spojených se správou společenství vlastníků jednotek (SVJ) a bytových družstev (BD). Hlavním cílem je minimalizovat manuální práci, snížit chybovost, zlepšit komunikaci a zajistit právně průkazný a bezpečný proces pro online hlasování.

**Cílová skupina:** Správci nemovitostí, předsedové SVJ/BD, členové výborů a další osoby zodpovědné za administrativu bytových domů.

## 2. Architektura a Technologie

### Frontend:
- **Framework:** React (v19 nebo novější) s TypeScriptem
- **Stavová správa:** React Context API, ideálně s useReducer pro komplexní globální stavy
- **Stylování:** Tailwind CSS pro rychlý a responzivní design
- **Ikony:** Preferovaná knihovna Lucide React
- **PDF generace:** jspdf a jspdf-autotable pro export protokolů a hlasovacích lístků
- **Build Tool:** Vite

### Backend & Databáze: Supabase
- **Databáze:** PostgreSQL pro ukládání veškerých dat
- **Autentizace:** Správa administrátorských účtů přes Supabase Auth
- **Storage:** Ukládání příloh přes Supabase Storage
- **Bezpečnost:** Důsledné využití Row Level Security (RLS) pro vynucení oprávnění

### Deployment:
- **Netlify** s nastaveným CI/CD

### AI Integrace:
- **Model:** Google Gemini API (konkrétně gemini-pro)
- **API Klíč:** Konfigurovatelný přes proměnné prostředí (.env)

### Externí Služby:
- **SMS Brána** (např. smsbrana.cz) pro 2FA

### Uživatelské rozhraní:
- Moderní, čistý a intuitivní design
- Plně responzivní
- Přepínání mezi světlým a tmavým tématem
- Toast notifikace pro zpětnou vazbu uživateli (např. "Uloženo!", "Chyba!")
- Modální okna pro formuláře a potvrzovací dialogy

## 3. Klíčové Koncepty a Systémy

### 3.1. Správa Hlasovacích Práv a Zastupování
Základní pilíř aplikace zajišťující řád a právní čistotu.

**Úroveň 1: Princip "Jeden Hlas za Jednu Jednotku" (Zástupce za jednotku):**
- Řeší spoluvlastnictví tím, že za každou jednotku může hlasovat vždy jen jedna, předem určená osoba
- Ostatní spoluvlastníci jsou pasivně informováni

**Úroveň 2: Delegování Hlasovacího Práva (Individuální Plné Moci):**
- Umožňuje "Zástupci za jednotku" (nebo běžnému členovi) delegovat své hlasovací právo na jinou osobu
- Buď globálně (trvale), nebo dočasně (pro jedno hlasování)

### 3.2. Systém Rolí a Oprávnění
Definuje tři role: **Administrátor (admin)**, **Člen (member)** a **Pozorovatel (observer)**, které řídí přístup k funkcím a datům.

### 3.3. Zabezpečení Hlasování: Unikátní Odkazy a SMS Ověření (2FA)
Kombinovaný systém, který zajišťuje jednoduchost, bezpečnost a průkaznost hlasování pomocí unikátních odkazů pro identifikaci a ověření identity přes SMS kód.

## 4. Specifikace Funkčních Modulů

### A. Modul: Rozsáhlá Administrace (pouze pro Admina)
Centrální mozek aplikace pro konfiguraci celého systému.

#### 1. Správa Budov:
- CRUD rozhraní pro budovy
- Při smazání budovy dojde ke smazání všech souvisejících dat (členové, hlasování atd.)
- Při editaci budovy se dynamicky zobrazí formulář pro vyplnění hodnot všech dynamických proměnných budovy

#### 2. Správa Proměnných:
- **Globální Proměnné:** CRUD rozhraní pro proměnné platné napříč aplikací (např. {{nazev_spravcovske_firmy}})
- **Schéma Proměnných pro Budovy:** Klíčový nástroj pro definici, jaké informace se budou u budov sledovat. Administrátor zde definuje "šablonu" proměnných a pro každou nastavuje:
  - **Název proměnné:** např. ico, predseda
  - **Typ pole:** Text, Dlouhý text (textarea), Výběr z možností (select)
  - **Povinnost:** Zda je pole povinné
  - **Placeholder:** Nápovědný text v poli
  - **Možnosti (pro Select):** Definice položek pro výběr

#### 3. Správa Šablon (Duální Využití):
- **Účel:** Šablony slouží jak pro e-maily, tak pro rychlé vytvoření hlasování
- **Typ Šablony:** Každá šablona může být buď Globální (dostupná pro všechny budovy) nebo Specifická pro budovu
- **Editor Šablon:**
  - CRUD rozhraní pro šablony (název, předmět, tělo)
  - Možnost vkládat globální, budovou specifické a kontextové proměnné ({{jmeno_clena}})
  - Možnost definovat vlastní proměnné přímo v šabloně
  - **AI Generátor Obsahu:** Tlačítko pro vygenerování textu na základě zadání
  - **Duplikace a Náhled:** Funkce pro rychlé kopírování a náhled šablony s ukázkovými daty

### B. Modul: Správa Členů (v kontextu budovy, pouze pro Admina)
- CRUD rozhraní pro členy
- **Atributy Člena:** Jméno, e-mail, telefon, číslo jednotky, váha hlasu (%)
- **Správa Zástupců:** Možnost nastavit "Zástupce za jednotku" a individuální plné moci
- **Hromadný Import:** Import členů z CSV s robustní detekcí oddělovačů

### C. Modul: Hlasování (v kontextu budovy)

#### Tvorba/Úprava Hlasování:
- Možnost načíst název a popis z šablony
- Dynamické přidávání otázek
- Pro každou otázku se nastavuje typ kvóra (včetně vlastního s čitatelem a jmenovatelem)
- Automatický výpočet konce hlasování na základě zadané délky v dnech

#### Detail Hlasování (pro Admina):
- **Správa Členů:** Přehled stavu hlasování, odesílání a znovuodesílání pozvánek (se stejným unikátním odkazem), dočasná změna zástupce
- **Ruční zadání hlasu:** Možnost manuálně zaznamenat hlas (např. pro listinné hlasování)
- **Exporty:** Generování PDF hlasovacích lístků a finálních protokolů
- **Průběh a Výsledky:** Zobrazení průběžných a finálních výsledků s grafy
- **AI Generátor Zápisu:** Automatické vygenerování formálního zápisu ze shromáždění na základě výsledků

## Aktuální Stav Implementace

### ✅ Implementováno:
- Základní React + TypeScript + Vite struktura
- Tailwind CSS styling
- Lucide React ikony
- Nhost integrace (místo Supabase)
- Základní moduly hlasování s detailním view
- Context API pro stavovou správu
- Správa členů s proxy voting
- Pozorovatelé a observers
- Progress tracking hlasování

### 🚧 Částečně implementováno:
- Administrace budov (základní struktura)
- Správa šablon (chybí AI integrace)
- Export PDF (připraveno pro jspdf)

### ❌ Chybí implementovat:
- Správa globálních proměnných
- Schéma proměnných pro budovy
- AI Gemini integrace
- SMS 2FA ověření
- Unikátní hlasovací odkazy
- CSV import členů
- Kompletní PDF export systém
- Toast notifikace systém
- Tmavý režim
- Modální dialogy systém

### 🔧 Technické úpravy potřebné:
- Převod z Nhost zpět na Supabase (podle zadání)
- Implementace Row Level Security
- CI/CD setup pro Netlify
- Environment variables setup
