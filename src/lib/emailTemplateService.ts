// Odstraněn import mock dat – definujeme minimální struktury
export interface EmailTemplate { id: string; name: string; subject: string; body: string; isGlobal?: boolean; is_global?: boolean; customVariables?: unknown }
export interface GlobalVariable { name: string; value: string }
interface Building { id: string; name: string; variables?: Record<string,string> }
interface Member { id: string; name: string; email: string; phone?: string; unit?: string; vote_weight?: number; voteWeight?: number }
interface Vote { id: string; title: string; description?: string; status: string; start_date?: string; end_date?: string; startDate?: string; endDate?: string; questions: { id: string; text: string }[] }
interface Observer { id: string; name: string; email: string }

// Systém email šablon s podporou individuálních odkazů a proměnných

export interface EmailTemplateContext {
  globalVariables: GlobalVariable[];
  building?: Building;
  member?: Member;
  vote?: Vote;
  observer?: Observer;
  customVariables?: Record<string, string>;
}

export interface ProcessedEmailTemplate {
  subject: string;
  body: string;
  htmlBody: string;
}

export class EmailTemplateService {
  private static instance: EmailTemplateService;
  
  static getInstance(): EmailTemplateService {
    if (!EmailTemplateService.instance) {
      EmailTemplateService.instance = new EmailTemplateService();
    }
    return EmailTemplateService.instance;
  }

  /**
   * Zpracuje email šablonu s nahrazením všech proměnných
   */
  processTemplate(
    template: EmailTemplate,
    context: EmailTemplateContext
  ): ProcessedEmailTemplate {
    const processedSubject = this.replaceVariables(template.subject, context);
    const processedBody = this.replaceVariables(template.body, context);
    const htmlBody = this.convertToHtml(processedBody, processedSubject);

    return {
      subject: processedSubject,
      body: processedBody,
      htmlBody
    };
  }

  /**
   * Nahradí všechny proměnné v textu
   */
  private replaceVariables(text: string, context: EmailTemplateContext): string {
    let result = text;

    // Nahrazení globálních proměnných
    if (context.globalVariables) {
      context.globalVariables.forEach(variable => {
        const placeholder = `{{${variable.name}}}`;
        result = result.replace(new RegExp(placeholder, 'g'), variable.value);
      });
    }

    // Nahrazení proměnných budovy
    if (context.building && context.building.variables) {
      Object.entries(context.building.variables).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        result = result.replace(new RegExp(placeholder, 'g'), value);
      });
    }

    // Nahrazení proměnných člena
    if (context.member) {
      const memberVariables = this.getMemberVariables(context.member);
      Object.entries(memberVariables).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        result = result.replace(new RegExp(placeholder, 'g'), value);
      });
    }

    // Nahrazení proměnných hlasování
    if (context.vote) {
      const voteVariables = this.getVoteVariables(context.vote);
      Object.entries(voteVariables).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        result = result.replace(new RegExp(placeholder, 'g'), value);
      });
    }

    // Nahrazení custom proměnných (individuální odkazy atd.)
    if (context.customVariables) {
      Object.entries(context.customVariables).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        result = result.replace(new RegExp(placeholder, 'g'), value);
      });
    }

    // Nahrazení systémových proměnných
    const systemVariables = this.getSystemVariables();
    Object.entries(systemVariables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), value);
    });

    return result;
  }

  /**
   * Získá proměnné člena
   */
  private getMemberVariables(member: Member): Record<string, string> {
    return {
      jmeno_clena: member.name,
      email_clena: member.email,
  telefon_clena: member.phone || '',
  jednotka: member.unit || '',
  vaha_hlasu: String(("voteWeight" in member ? (member as { voteWeight?: number }).voteWeight : undefined) ?? member.vote_weight ?? ''),
      osloveni: `Vážený/á ${member.name}`
    };
  }

  /**
   * Získá proměnné hlasování
   */
  private getVoteVariables(vote: Vote): Record<string, string> {
    const startDate = vote.startDate ? new Date(vote.startDate).toLocaleString('cs-CZ') : '';
    const endDate = vote.endDate ? new Date(vote.endDate).toLocaleString('cs-CZ') : '';
    
    return {
      nazev_hlasovani: vote.title,
      popis_hlasovani: vote.description || '',
      datum_zacatku: startDate,
      datum_konce: endDate,
      stav_hlasovani: this.getVoteStatusText(vote.status),
      pocet_otazek: vote.questions.length.toString()
    };
  }

  /**
   * Získá systémové proměnné
   */
  private getSystemVariables(): Record<string, string> {
    const now = new Date();
    return {
      datum_dnes: now.toLocaleDateString('cs-CZ'),
      cas_ted: now.toLocaleTimeString('cs-CZ'),
      rok: now.getFullYear().toString(),
      mesic: (now.getMonth() + 1).toString(),
      den: now.getDate().toString()
    };
  }

  /**
   * Převede text hlasovacího stavu na čeština
   */
  private getVoteStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'draft': 'Koncept',
      'active': 'Aktivní',
      'completed': 'Dokončeno',
      'cancelled': 'Zrušeno'
    };
    return statusMap[status] || status;
  }

  /**
   * Převede textovou šablonu na HTML
   */
  private convertToHtml(body: string, subject: string): string {
    // Základní HTML struktura s responzivním designem
    const htmlBody = body
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');

    return `
<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .content {
            padding: 30px;
        }
        .content p {
            margin: 0 0 16px 0;
        }
        .highlight {
            background: #f8f9ff;
            border-left: 4px solid #667eea;
            padding: 16px;
            margin: 20px 0;
            border-radius: 0 6px 6px 0;
        }
        .button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            margin: 20px 0;
            text-align: center;
        }
        .button:hover {
            background: #5a6fd8;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
            border-top: 1px solid #e9ecef;
        }
        .warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 12px;
            border-radius: 6px;
            margin: 16px 0;
        }
        .info {
            background: #d1ecf1;
            border: 1px solid #bee5eb;
            color: #0c5460;
            padding: 12px;
            border-radius: 6px;
            margin: 16px 0;
        }
        @media (max-width: 600px) {
            .container {
                margin: 10px;
                border-radius: 6px;
            }
            .content {
                padding: 20px;
            }
            .header {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🗳️ ${subject}</h1>
        </div>
        <div class="content">
            <p>${htmlBody}</p>
        </div>
        <div class="footer">
            <p>Tento email byl odeslán automaticky ze systému OnlineHlasování.</p>
            <p>Pokud máte dotazy, kontaktujte správce budovy.</p>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Validuje šablonu před uložením
   */
  validateTemplate(template: EmailTemplate): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!template.name.trim()) {
      errors.push('Název šablony je povinný');
    }

    if (!template.subject.trim()) {
      errors.push('Předmět emailu je povinný');
    }

    if (!template.body.trim()) {
      errors.push('Obsah emailu je povinný');
    }

    // Kontrola platných proměnných
    const variables = this.extractVariables(template.subject + ' ' + template.body);
    const validVariables = this.getAvailableVariables();
    
    variables.forEach(variable => {
      if (!validVariables.includes(variable)) {
        errors.push(`Neplatná proměnná: {{${variable}}}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Extrahuje proměnné z textu
   */
  private extractVariables(text: string): string[] {
    const matches = text.match(/\{\{([^}]+)\}\}/g);
    if (!matches) return [];
    
    return matches.map(match => match.replace(/\{\{|\}\}/g, ''));
  }

  /**
   * Vrací seznam dostupných proměnných
   */
  getAvailableVariables(): string[] {
    return [
      // Globální
      'datum_dnes', 'cas_ted', 'rok', 'mesic', 'den',
      'nazev_spolecnosti', 'kontaktni_email', 'telefon_spolecnosti',
      'adresa_spolecnosti', 'web_spolecnosti', 'podpis_spravce', 'pravni_upozorneni',
      
      // Budova
      'nazev_budovy', 'zkraceny_nazev', 'plny_nazev', 'adresa',
      'email_predsedy', 'telefon_predsedy', 'kontaktni_osoba',
      
      // Člen
      'jmeno_clena', 'email_clena', 'telefon_clena', 'jednotka', 'vaha_hlasu', 'osloveni',
      
      // Hlasování
      'nazev_hlasovani', 'popis_hlasovani', 'datum_zacatku', 'datum_konce',
      'stav_hlasovani', 'pocet_otazek',
      
      // Custom (individuální odkazy)
      'odkaz_na_hlasovani', 'overovaci_kod', 'zapis_z_hlasovani',
      'jmeno_zastupce', 'individualni_token'
    ];
  }
}

// Předpřipravené šablony pro běžné případy použití
export const defaultEmailTemplates: EmailTemplate[] = [
  {
    id: 'voting-start-individual',
    name: 'Zahájení hlasování (s individuálním odkazem)',
    subject: '🗳️ Zahájení hlasování: {{nazev_hlasovani}} ({{zkraceny_nazev}})',
    body: `{{osloveni}},

tímto Vás informujeme o zahájení elektronického hlasování per rollam.

**TÉMA HLASOVÁNÍ:**
{{nazev_hlasovani}}

**POPIS:**
{{popis_hlasovani}}

**TERMÍN HLASOVÁNÍ:**
Od: {{datum_zacatku}}
Do: {{datum_konce}}

**VÁŠ INDIVIDUÁLNÍ ODKAZ NA HLASOVÁNÍ:**
{{odkaz_na_hlasovani}}

**DŮLEŽITÉ INFORMACE:**
• Tento odkaz je určen pouze pro Vás a nelze jej předávat dalším osobám
• Odkaz je platný po celou dobu hlasování
• Po kliknutí na odkaz obdržíte SMS s ověřovacím kódem
• Pro dokončení hlasování je nutné zadat ověřovací kód z SMS

**VAŠE ÚDAJE:**
Jednotka: {{jednotka}}
Váha hlasu: {{vaha_hlasu}}
Telefon pro SMS: {{telefon_clena}}

Budova: {{plny_nazev}}
Adresa: {{adresa}}

Děkujeme za Vaši účast v hlasování.

{{podpis_spravce}}

{{pravni_upozorneni}}`,
    isGlobal: true,
    customVariables: [
      { name: 'odkaz_na_hlasovani', description: 'Individuální odkaz na hlasování pro konkrétního člena', type: 'custom' },
      { name: 'overovaci_kod', description: 'Ověřovací kód pro SMS', type: 'custom' }
    ]
  },
  {
    id: 'voting-reminder-individual',
    name: 'Upomínka k hlasování (s individuálním odkazem)',
    subject: '⏰ UPOMÍNKA: Hlasování {{nazev_hlasovani}} končí brzy!',
    body: `{{osloveni}},

upozorňujeme Vás, že hlasování "{{nazev_hlasovani}}" končí již **{{datum_konce}}**.

Pokud jste ještě nehlasoval/a, prosíme učiňte tak co nejdříve.

**VÁŠ HLASOVACÍ ODKAZ:**
{{odkaz_na_hlasovani}}

**ZBÝVAJÍCÍ ČAS:** 
Hlasování končí {{datum_konce}}

**POSTUP HLASOVÁNÍ:**
1. Klikněte na Váš individuální odkaz výše
2. Vyžádejte si SMS kód na telefon {{telefon_clena}}
3. Zadejte ověřovací kód a dokončete hlasování

Vaše účast je důležitá pro rozhodování společenství.

{{podpis_spravce}}`,
    isGlobal: true,
    customVariables: [
      { name: 'odkaz_na_hlasovani', description: 'Individuální odkaz na hlasování', type: 'custom' }
    ]
  },
  {
    id: 'voting-results',
    name: 'Výsledky hlasování',
    subject: '📊 Výsledky hlasování: {{nazev_hlasovani}}',
    body: `{{osloveni}},

informujeme Vás o ukončení hlasování a výsledcích.

**HLASOVÁNÍ:**
{{nazev_hlasovani}}

**TERMÍN HLASOVÁNÍ:**
Od {{datum_zacatku}} do {{datum_konce}}

**VÝSLEDKY:**
{{zapis_z_hlasovani}}

Podrobné výsledky a zápis z hlasování naleznete v příloze tohoto emailu.

Děkujeme všem za účast v hlasování.

{{podpis_spravce}}

{{pravni_upozorneni}}`,
    isGlobal: true,
    customVariables: [
      { name: 'zapis_z_hlasovani', description: 'Kompletní zápis z hlasování s výsledky', type: 'custom' }
    ]
  }
];

export const emailTemplateService = EmailTemplateService.getInstance();
