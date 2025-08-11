-- Seed ostrých e-mailových šablon (bez mocků v UI)
-- Spusťte proti Supabase (SQL editor) nebo použijte váš pipeline skript

INSERT INTO email_templates (name, subject, body, is_global, custom_variables)
VALUES
(
  'Zahájení hlasování (s individuálním odkazem)',
  '🗳️ Zahájení hlasování: {{nazev_hlasovani}} ({{zkraceny_nazev}})',
  $$
{{osloveni}},

tímto Vás informujeme o zahájení elektronického hlasování per rollam.

TÉMA HLASOVÁNÍ:
{{nazev_hlasovani}}

POPIS:
{{popis_hlasovani}}

TERMÍN HLASOVÁNÍ:
Od: {{datum_zacatku}}
Do: {{datum_konce}}

VÁŠ INDIVIDUÁLNÍ ODKAZ NA HLASOVÁNÍ:
{{odkaz_na_hlasovani}}

DŮLEŽITÉ INFORMACE:
• Odkaz je určen pouze pro Vás a nelze jej sdílet
• Odkaz je platný po celou dobu hlasování
• Po kliknutí na odkaz obdržíte SMS s ověřovacím kódem
• Pro dokončení je nutné zadat ověřovací kód z SMS

VAŠE ÚDAJE:
Jednotka: {{jednotka}}
Váha hlasu: {{vaha_hlasu}}
Telefon pro SMS: {{telefon_clena}}

Budova: {{plny_nazev}}
Adresa: {{adresa}}

Děkujeme za Vaši účast v hlasování.

{{podpis_spravce}}

{{pravni_upozorneni}}
$$,
  true,
  '{"odkaz_na_hlasovani":"String","overovaci_kod":"String"}'::jsonb
),
(
  'Upomínka k hlasování (s individuálním odkazem)',
  '⏰ UPOMÍNKA: Hlasování {{nazev_hlasovani}} končí brzy!',
  $$
{{osloveni}},

upozorňujeme Vás, že hlasování "{{nazev_hlasovani}}" končí již {{datum_konce}}.

Pokud jste ještě nehlasoval/a, prosíme učiňte tak co nejdříve.

VÁŠ HLASOVACÍ ODKAZ:
{{odkaz_na_hlasovani}}

POSTUP HLASOVÁNÍ:
1) Klikněte na individuální odkaz výše
2) Vyžádejte si SMS kód na telefon {{telefon_clena}}
3) Zadejte ověřovací kód a dokončete hlasování

{{podpis_spravce}}
$$,
  true,
  '{"odkaz_na_hlasovani":"String"}'::jsonb
),
(
  'Výsledky hlasování',
  '📊 Výsledky hlasování: {{nazev_hlasovani}}',
  $$
{{osloveni}},

informujeme Vás o ukončení hlasování a výsledcích.

HLASOVÁNÍ:
{{nazev_hlasovani}}

TERMÍN HLASOVÁNÍ:
Od {{datum_zacatku}} do {{datum_konce}}

VÝSLEDKY:
{{zapis_z_hlasovani}}

{{podpis_spravce}}

{{pravni_upozorneni}}
$$,
  true,
  '{"zapis_z_hlasovani":"Text"}'::jsonb
),
(
  'Zahájení hlasování – oznámení zastoupenému',
  '🗳️ Zahájení hlasování: {{nazev_hlasovani}} – za jednotku hlasuje zástupce',
  $$
{{osloveni}},

informujeme Vás, že bylo zahájeno elektronické hlasování per rollam: "{{nazev_hlasovani}}".

U této jednotky Vás v hlasování zastupuje:
ZÁSTUPCE: {{zastupce_za_jednotku}}

Hlasování probíhá v termínu:
Od: {{datum_zacatku}}
Do: {{datum_konce}}

Toto je informační zpráva. Pokud máte k zastoupení dotaz, kontaktujte správce.

Budova: {{plny_nazev}}
Adresa: {{adresa}}

{{podpis_spravce}}

{{pravni_upozorneni}}
$$,
  true,
  '{"zastupce_za_jednotku":"String","jmeno_zastupce":"String"}'::jsonb
),
(
  'Zahájení hlasování – oznámení pozorovatelům',
  '👁️ Zahájení hlasování: {{nazev_hlasovani}} – odkaz pro náhled',
  $$
Vážený/á pozorovateli/ko,

bylo zahájeno hlasování: {{nazev_hlasovani}}.

Pro náhled průběhu použijte tento odkaz:
{{odkaz_na_hlasovani}}

Po prokliku je vyžadováno ověření pomocí SMS.

Termín:
Od: {{datum_zacatku}}
Do: {{datum_konce}}

Budova: {{plny_nazev}}
Adresa: {{adresa}}

{{podpis_spravce}}
$$,
  true,
  '{"odkaz_na_hlasovani":"String"}'::jsonb
);
