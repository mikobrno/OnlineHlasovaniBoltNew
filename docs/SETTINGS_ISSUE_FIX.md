# Oprava problému s nastavením aplikace

Pokud se ve všech sekcích nastavení (Obecné, SMS, Bezpečnost, atd.) zobrazuje chybová zpráva "Chyba při načítání nastavení" a "Vyskytl se problém při načítání nastavení aplikace. Zobrazujeme výchozí hodnoty.", je možné, že v databázi chybí tabulka `settings`.

## Řešení problému

1. Ve většině případů by aplikace měla být schopna automaticky vytvořit nastavení při prvním pokusu o uložení. Stačí v sekci nastavení provést změny a kliknout na tlačítko "Uložit".

2. Pokud automatické vytvoření selže, je potřeba spustit SQL skript, který vytvoří potřebnou tabulku a základní nastavení:

```bash
# Pro spuštění skriptu pomocí Supabase CLI
supabase db execute -f ./database/create_settings_table.sql

# Pro spuštění skriptu v Supabase Dashboard
# Otevřete SQL Editor a spusťte obsah souboru database/create_settings_table.sql
```

3. Pro Nhost:
   - Přihlaste se do Nhost dashboard
   - Otevřete sekci "Database"
   - Vyberte "SQL Editor" 
   - Vložte obsah souboru `database/create_settings_table.sql`
   - Klikněte na "Run"

Po spuštění skriptu by měla být vytvořena tabulka `settings` a aplikace by měla být schopna načíst a ukládat nastavení.

## Technické detaily

Skript `create_settings_table.sql` provádí následující operace:

- Vytváří tabulku `settings` (pokud ještě neexistuje)
- Nastavuje Row Level Security (RLS) na tabulku
- Vytváří potřebné indexy pro optimalizaci výkonu
- Vkládá základní nastavení do tabulky (pouze pokud ještě neexistují)

V aplikaci bylo také upraveno načítání nastavení, aby při selhání používala výchozí hodnoty a umožnila uživateli vytvořit nová nastavení při ukládání.
