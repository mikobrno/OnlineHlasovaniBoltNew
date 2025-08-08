# MessageTestView Komponenta

## Popis
Kombinovaná testovací komponenta pro všechny komunikační služby aplikace OnlineSpráva.

## Funkce

### Email služba (N8N webhook)
- **Test připojení**: Ověří dostupnost N8N webhook endpointu
- **Odeslání test emailu**: Umožňuje odeslat testovací email na libovolnou adresu
- **Konfigurace**: Zobrazuje aktuální webhook URL z environment proměnných

### SMS služba (SMSbrana.cz)
- **Test připojení**: Ověří připojení k SMSbrana.cz API a zobrazí kredit
- **Odeslání test SMS**: Umožňuje odeslat testovací SMS na české telefonní číslo
- **Formátování čísel**: Automatické formátování českých telefonních čísel (+420 prefix)
- **Konfigurace**: Zobrazuje přihlašovací údaje a API endpoint

## Použití

1. **Spusťte aplikaci**: `npm run dev`
2. **Přejděte na tab "Komunikace"** v navigaci
3. **Vyberte službu**: Email nebo SMS pomocí přepínačů nahoře
4. **Test připojení**: Klikněte na "Test připojení" pro ověření funkčnosti
5. **Odeslání testovací zprávy**: Vyplňte formulář a odešlete test

## Environment proměnné

### Pro N8N Email webhook:
```env
VITE_N8N_WEBHOOK_URL=https://n8n.srv882016.hstgr.cloud/webhook/ada15a58-b14f-4179-92a1-780b009669a4
```

### Pro SMSbrana.cz:
```env
VITE_SMSBRANA_LOGIN=your_login
VITE_SMSBRANA_PASSWORD=your_password
```

## Testování

### Email test:
- Zadejte platnou emailovou adresu
- Upravte předmět a HTML obsah podle potřeby
- Klikněte "Odeslat test email"
- Zkontrolujte výsledek v sekci "Výsledek email testu"

### SMS test:
- Zadejte české telefonní číslo (formát se upraví automaticky)
- Napište zprávu (max 160 znaků pro standardní SMS)
- Klikněte "Odeslat test SMS"
- Zkontrolujte výsledek v sekci "Výsledek SMS testu"

## Integrace

Komponenta je plně integrována s:
- `emailService.ts` - N8N webhook email služba
- `smsService.ts` - SMSbrana.cz SMS API
- `ToastContext` - Uživatelské notifikace
- Existing design system (Card, Button, Input komponenty)

## Navigace

Tab "Komunikace" v hlavní navigaci používá ikonu MessageSquare a nahrazuje původní "E-maily" tab pro lepší reprezentaci kombinované funkcionalitky.
