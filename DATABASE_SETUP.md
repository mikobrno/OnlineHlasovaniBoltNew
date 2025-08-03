# Nastavení Supabase databáze

## 🚨 DŮLEŽITÉ: Chyby 401 při přidávání budovy

Pokud vidíte chyby 401 v konzoli při pokusu o přidání budovy, znamená to, že databázové schéma ještě není vytvořeno v Supabase.

## Kroky pro nastavení databáze:

### 1. Přihlášení do Supabase
1. Otevřete [https://supabase.com](https://supabase.com)
2. Přihlaste se do svého účtu
3. Vyberte projekt s URL: `https://nehlqaoqmhdvyncvizcc.supabase.co`

### 2. Spuštění SQL schématu
1. V Supabase dashboard klikněte na **SQL Editor** v levém menu
2. Klikněte na **New query**
3. Zkopírujte celý obsah souboru `database/schema.sql`
4. Vložte ho do SQL editoru
5. Klikněte na **Run** (nebo Ctrl+Enter)

### 3. Ověření vytvoření tabulek
Po spuštění SQL by měly být vytvořeny tyto tabulky:
- `buildings`
- `members` 
- `votes`
- `questions`
- `email_templates`
- `global_variables`
- `building_variable_definitions`
- `observers`
- `voting_tokens`
- `member_votes`
- `manual_vote_attachments`
- `manual_vote_notes`

### 4. Konfigurace Storage (volitelné)
Pro ukládání příloh je potřeba vytvořit storage bucket:

1. V Supabase dashboard jděte na **Storage**
2. Klikněte **Create bucket**
3. Název: `attachments`
4. Public: **true**
5. Klikněte **Create bucket**

### 5. Testování připojení
Po vytvoření schématu restartujte vývojový server:

```bash
npm run dev
```

Chyby 401 by měly zmizet a přidávání budov by mělo fungovat.

## Řešení problémů

### Chyba: "permission denied for schema public"
Pokud vidíte tuto chybu, ujistěte se, že:
1. Jste přihlášeni jako správce projektu
2. RLS policies jsou správně nakonfigurovány (jsou v schema.sql)

### Chyba: "relation does not exist"
Znamená, že tabulky nebyly vytvořeny. Spusťte znovu schema.sql.

### Stále chyby 401
1. Zkontrolujte, že URL a klíč v `.env` odpovídají vašemu Supabase projektu
2. Ověřte, že projekt v Supabase není pozastaven
3. Zkontrolujte, že RLS policies byly vytvořeny

## Environment proměnné
Zkontrolujte, že máte správně nastavené v `.env`:

```
VITE_SUPABASE_URL=https://nehlqaoqmhdvyncvizcc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Po dokončení
Když databáze funguje, můžete:
1. ✅ Přidávat budovy
2. ✅ Spravovat členy SVJ
3. ✅ Vytvářet hlasování
4. ✅ Používat email šablony
5. ✅ Konfigurovat proměnné
