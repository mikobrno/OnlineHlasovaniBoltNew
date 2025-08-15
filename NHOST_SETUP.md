# Nhost Database Setup

Abys mohl používat databázi s touto aplikací, musíš:

## 1. Vytvořit schéma v Nhost

1. Přihlaš se do [Nhost Console](https://app.nhost.io/)
2. Vyber svůj projekt `zrgbhrxnkjggssfhjqwp`
3. Jdi do sekce **SQL Editor**
4. Zkopíruj obsah souboru `nhost-schema.sql` a spusť jej
5. Ověř, že se vytvořily tabulky: `buildings`, `members`, `votes`, atd.

## 2. Nastavit permissions v Hasura

1. V Nhost Console jdi na **GraphQL**
2. Pro každou tabulku nastav permissions:

### Buildings (budovy)
- **Select**: Allow users to read buildings they have access to
- **Insert**: Allow authenticated users to create buildings
- **Update**: Allow building admins to update
- **Delete**: Allow building admins to delete

### Members (členové)
- **Select**: Allow users to read members of their buildings
- **Insert**: Allow building admins to add members
- **Update**: Allow building admins to update members
- **Delete**: Allow building admins to delete members

### Votes (hlasování)
- **Select**: Allow members to see votes for their buildings
- **Insert**: Allow building admins to create votes
- **Update**: Allow building admins to update votes
- **Delete**: Allow building admins to delete votes

### Email Templates, Global Variables, Building Variables, Observers
- Podobně nastav permissions podle potřeby

## 3. Test připojení

Po nastavení schématu a permissions:
1. Restartuj aplikaci (`npm run dev`)
2. Zkus přidat novou budovu
3. Ověř, že se data ukládají do databáze

## 4. Troubleshooting

Pokud máš problémy:
- Zkontroluj konzoli prohlížeče pro GraphQL chyby
- Ověř, že Nhost credentials v `src/lib/nhostClient.ts` jsou správné
- Zkontroluj permissions v Hasura konzoli
