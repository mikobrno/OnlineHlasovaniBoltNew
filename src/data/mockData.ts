export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  unit: string;
  voteWeight: number;
  representativeId?: string;
  buildingId: string;
}

export interface Building {
  id: string;
  name: string;
  address: string;
  totalUnits: number;
  variables: Record<string, string>;
}

export interface Question {
  id: string;
  text: string;
  quorumType: 'simple' | 'qualified' | 'unanimous' | 'custom';
  customQuorum?: { numerator: number; denominator: number };
}

export interface Vote {
  id: string;
  title: string;
  description: string;
  buildingId: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  questions: Question[];
  createdAt: string;
  startDate?: string;
  endDate?: string;
  attachments?: string[];
  memberVotes: Record<string, Record<string, 'yes' | 'no' | 'abstain'>>;
  memberRepresentatives?: Record<string, string>;
  observers?: string[]; // Array of observer IDs
  manualVoteAttachments?: Record<string, string[]>; // memberId -> array of attachment names
  manualVoteNotes?: Record<string, string>; // memberId -> note about manual vote
}

export interface Observer {
  id: string;
  name: string;
  email: string;
  buildingId: string;
  createdAt: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  buildingId?: string;
  isGlobal: boolean;
  customVariables?: Variable[];
}

export interface Variable {
  name: string;
  description: string;
  type: 'global' | 'building' | 'member' | 'vote' | 'custom';
}

export interface GlobalVariable {
  name: string;
  description: string;
  value: string;
  isEditable?: boolean;
}

export interface BuildingVariable {
  name: string;
  description: string;
  type: 'text' | 'textarea' | 'select';
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

export const mockBuildings: Building[] = [
  {
    id: '1',
    name: 'Bytový dům Vinohradská 125',
    address: 'Vinohradská 125, Praha 2',
    totalUnits: 24,
    variables: {
      'nazev_budovy': 'Bytový dům Vinohradská 125',
      'zkraceny_nazev': 'BD Vinohradská',
      'plny_nazev': 'Společenství vlastníků jednotek Bytový dům Vinohradská 125',
      'adresa': 'Vinohradská 125, Praha 2',
      'osloveni': 'Vážení vlastníci',
      'ico': '12345678',
      'kontaktni_osoba': 'Jan Novák',
      'predseda': 'Jan Novák',
      'telefon_predsedy': '+420 123 456 789',
      'email_predsedy': 'predseda@vinohradska125.cz',
      'banka': 'Česká spořitelna',
      'cislo_uctu': '123456789/0800',
      'web': 'www.vinohradska125.cz'
    }
  },
  {
    id: '2',
    name: 'SVJ Karlínské náměstí',
    address: 'Karlínské náměstí 12, Praha 8',
    totalUnits: 18,
    variables: {
      'nazev_budovy': 'SVJ Karlínské náměstí',
      'zkraceny_nazev': 'SVJ Karlín',
      'plny_nazev': 'Společenství vlastníků jednotek Karlínské náměstí',
      'adresa': 'Karlínské náměstí 12, Praha 8',
      'osloveni': 'Vážení vlastníci',
      'ico': '87654321',
      'kontaktni_osoba': 'Marie Svobodová',
      'predseda': 'Marie Svobodová',
      'telefon_predsedy': '+420 987 654 321',
      'email_predsedy': 'predseda@karlin.cz',
      'banka': 'ČSOB',
      'cislo_uctu': '987654321/0300',
      'web': 'www.svj-karlin.cz'
    }
  }
];

export const mockGlobalVariables: GlobalVariable[] = [
  {
    name: 'nazev_spolecnosti',
    description: 'Název správcovské společnosti',
    value: 'OnlineHlasování s.r.o.',
    isEditable: true
  },
  {
    name: 'kontaktni_email',
    description: 'Kontaktní e-mail společnosti',
    value: 'podpora@onlinehlasovani.cz',
    isEditable: true
  },
  {
    name: 'telefon_spolecnosti',
    description: 'Telefon společnosti',
    value: '+420 800 123 456',
    isEditable: true
  },
  {
    name: 'adresa_spolecnosti',
    description: 'Adresa sídla společnosti',
    value: 'Wenceslas Square 1, 110 00 Praha 1',
    isEditable: true
  },
  {
    name: 'web_spolecnosti',
    description: 'Webové stránky společnosti',
    value: 'www.onlinehlasovani.cz',
    isEditable: true
  },
  {
    name: 'podpis_spravce',
    description: 'Standardní podpis správce',
    value: 'S pozdravem,\nTým OnlineHlasování\n{{nazev_spolecnosti}}',
    isEditable: true
  },
  {
    name: 'pravni_upozorneni',
    description: 'Právní upozornění v patičce',
    value: 'Tento e-mail je určen pouze pro adresáta. Pokud nejste zamýšleným příjemcem, informujte prosím odesílatele a e-mail smažte.',
    isEditable: true
  },
  {
    name: 'datum_dnes',
    description: 'Dnešní datum (automaticky generováno)',
    value: '',
    isEditable: false
  },
  {
    name: 'cas_ted',
    description: 'Aktuální čas (automaticky generováno)',
    value: '',
    isEditable: false
  }
];

export const defaultBuildingVariables: BuildingVariable[] = [
  {
    name: 'nazev_budovy',
    description: 'Název budovy/SVJ',
    type: 'text',
    required: true,
    placeholder: 'např. Bytový dům Vinohradská 125'
  },
  {
    name: 'zkraceny_nazev',
    description: 'Zkrácený název budovy',
    type: 'text',
    required: false,
    placeholder: 'např. BD Vinohradská'
  },
  {
    name: 'plny_nazev',
    description: 'Plný oficiální název SVJ/BD',
    type: 'text',
    required: false,
    placeholder: 'např. Společenství vlastníků jednotek...'
  },
  {
    name: 'adresa',
    description: 'Adresa budovy',
    type: 'text',
    required: true,
    placeholder: 'např. Vinohradská 125, Praha 2'
  },
  {
    name: 'osloveni',
    description: 'Způsob oslovení členů',
    type: 'select',
    required: false,
    options: ['Vážení vlastníci', 'Vážení družstevníci', 'Vážení členové', 'Vážené dámy a pánové']
  },
  {
    name: 'ico',
    description: 'IČO',
    type: 'text',
    required: false,
    placeholder: 'např. 12345678'
  },
  {
    name: 'kontaktni_osoba',
    description: 'Kontaktní osoba pro budovu',
    type: 'text',
    required: false
  },
  {
    name: 'predseda',
    description: 'Jméno předsedy',
    type: 'text',
    required: false
  },
  {
    name: 'telefon_predsedy',
    description: 'Telefon předsedy',
    type: 'text',
    required: false,
    placeholder: '+420 123 456 789'
  },
  {
    name: 'email_predsedy',
    description: 'Email předsedy',
    type: 'text',
    required: false,
    placeholder: 'predseda@example.cz'
  },
  {
    name: 'banka',
    description: 'Název banky',
    type: 'text',
    required: false,
    placeholder: 'např. Česká spořitelna'
  },
  {
    name: 'cislo_uctu',
    description: 'Číslo účtu',
    type: 'text',
    required: false,
    placeholder: 'např. 123456789/0800'
  },
  {
    name: 'web',
    description: 'Webové stránky budovy',
    type: 'text',
    required: false,
    placeholder: 'např. www.vase-budova.cz'
  }
];
export const mockMembers: Member[] = [
  {
    id: '1',
    name: 'Pavel Dvořák',
    email: 'pavel.dvorak@email.cz',
    phone: '+420 123 456 789',
    unit: '1.01',
    voteWeight: 1.5,
    buildingId: '1'
  },
  {
    id: '2',
    name: 'Jana Nováková',
    email: 'jana.novakova@email.cz',
    phone: '+420 234 567 890',
    unit: '1.02',
    voteWeight: 1.2,
    buildingId: '1'
  },
  {
    id: '3',
    name: 'Tomáš Procházka',
    email: 'tomas.prochazka@email.cz',
    phone: '+420 345 678 901',
    unit: '2.01',
    voteWeight: 2.0,
    buildingId: '1'
  },
  {
    id: '4',
    name: 'Věra Horáková',
    email: 'vera.horakova@email.cz',
    phone: '+420 456 789 012',
    unit: '1.01',
    voteWeight: 1.8,
    buildingId: '2'
  },
  {
    id: '5',
    name: 'Martin Krejčí',
    email: 'martin.krejci@email.cz',
    phone: '+420 567 890 123',
    unit: '1.02',
    voteWeight: 1.0,
    buildingId: '2'
  }
];

export const mockVotes: Vote[] = [
  {
    id: '1',
    title: 'Schválení ročního rozpočtu na rok 2024',
    description: 'Hlasování o schválení rozpočtu společenství vlastníků na kalendářní rok 2024, včetně příspěvků na správu a rezervní fond.',
    buildingId: '1',
    status: 'active',
    questions: [
      {
        id: '1',
        text: 'Schvalujete navržený rozpočet na rok 2024?',
        quorumType: 'qualified'
      },
      {
        id: '2',
        text: 'Schvalujete zvýšení měsíčních příspěvků o 5%?',
        quorumType: 'simple'
      }
    ],
    createdAt: '2024-01-15T10:00:00Z',
    startDate: '2024-01-15T10:00:00Z',
    endDate: '2024-01-25T23:59:59Z',
    memberVotes: {
      '1': { '1': 'yes', '2': 'no' },
      '2': { '1': 'yes', '2': 'yes' }
    },
    observers: []
  },
  {
    id: '2',
    title: 'Výměna výtahu',
    description: 'Rozhodování o kompletní výměně starého výtahu za nový, modernější model.',
    buildingId: '1',
    status: 'completed',
    questions: [
      {
        id: '1',
        text: 'Souhlasíte s výměnou výtahu?',
        quorumType: 'qualified'
      },
      {
        id: '2',
        text: 'Souhlasíte s navrhovaným rozpočtem 800 000 Kč?',
        quorumType: 'qualified'
      }
    ],
    createdAt: '2024-01-01T10:00:00Z',
    startDate: '2024-01-01T10:00:00Z',
    endDate: '2024-01-10T23:59:59Z',
    memberVotes: {
      '1': { '1': 'yes', '2': 'yes' },
      '2': { '1': 'yes', '2': 'yes' },
      '3': { '1': 'no', '2': 'no' }
    },
    observers: []
  }
];

export const mockObservers: Observer[] = [
  {
    id: '1',
    name: 'Ing. Pavel Správce',
    email: 'spravce@onlinehlasovani.cz',
    buildingId: '1',
    createdAt: '2024-01-01T10:00:00Z'
  }
];

export const mockTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Pozvánka na hlasování',
    subject: 'Pozvánka k hlasování - {{nazev_hlasovani}} ({{zkraceny_nazev}})',
    body: `{{osloveni}},

tímto Vás zveme k účasti na hlasování per rollam na téma: {{nazev_hlasovani}}.

Popis hlasování:
{{popis_hlasovani}}

Hlasování probíhá od {{datum_zacatku}} do {{datum_konce}}.

Budova: {{plny_nazev}}
Adresa: {{adresa}}

Pro hlasování použijte následující odkaz: [odkaz na hlasování]

{{podpis_spravce}}

{{pravni_upozorneni}}`,
    buildingId: '1',
    isGlobal: false
  },
  {
    id: '2',
    name: 'Upomínka k hlasování',
    subject: 'UPOMÍNKA - hlasování {{nazev_hlasovani}} končí brzy ({{zkraceny_nazev}})',
    body: `{{osloveni}},

konkrétně Vás, {{jmeno_clena}},

upozorňujeme Vás, že hlasování "{{nazev_hlasovani}}" končí již {{datum_konce}}.

Pokud jste ještě nehlasoval/a, prosíme učiňte tak co nejdříve na následujícím odkazu:
{{odkaz_na_hlasovani}}

Pro přístup k hlasování budete potřebovat ověřovací kód z SMS: {{overovaci_kod}}

Budova: {{plny_nazev}}
Jednotka: {{jednotka}}
Váha Vašeho hlasu: {{vaha_hlasu}}

Děkujeme za Vaši účast.

{{podpis_spravce}}`,
    isGlobal: true
  },
  {
    id: '3',
    name: 'Pozvánka k hlasování s SMS ověřením',
    subject: 'Pozvánka k hlasování - {{nazev_hlasovani}} ({{zkraceny_nazev}})',
    body: `{{osloveni}},

tímto Vás zveme k účasti na hlasování per rollam na téma: {{nazev_hlasovani}}.

Popis hlasování:
{{popis_hlasovani}}

Hlasování probíhá od {{datum_zacatku}} do {{datum_konce}}.

🔐 BEZPEČNÉ HLASOVÁNÍ:
Pro hlasování použijte následující odkaz: {{odkaz_na_hlasovani}}

Po kliknutí na odkaz si můžete vyžádat SMS s ověřovacím kódem na váš telefon: {{telefon_clena}}

Budova: {{plny_nazev}}
Adresa: {{adresa}}
Jednotka: {{jednotka}}
Váha vašeho hlasu: {{vaha_hlasu}}

DŮLEŽITÉ:
- Každý odkaz lze použít pouze jednou
- Odkaz je platný 24 hodin
- SMS s kódem se odešle až po kliknutí na odkaz
- Pro hlasování je nutné SMS ověření

{{podpis_spravce}}

{{pravni_upozorneni}}`,
    isGlobal: true
  },
  {
    id: '5',
    name: 'Oznámení o zastoupení při hlasování',
    subject: 'Hlasování {{nazev_hlasovani}} - jste zastoupen/a ({{zkraceny_nazev}})',
    body: `{{osloveni}},

informujeme Vás, že bylo zahájeno hlasování per rollam na téma: {{nazev_hlasovani}}.

Popis hlasování:
{{popis_hlasovani}}

Hlasování probíhá od {{datum_zacatku}} do {{datum_konce}}.

DŮLEŽITÉ OZNÁMENÍ:
Pro toto hlasování jste zastoupen/a členem: {{jmeno_zastupce}}

Váš zástupce obdržel hlasovací odkaz a bude hlasovat vaším jménem za jednotku {{jednotka}} s vahou hlasu {{vaha_hlasu}}.

Pokud si nepřejete být zastoupen/a nebo máte jakékoli dotazy, kontaktujte prosím správce budovy co nejdříve.

Budova: {{plny_nazev}}
Adresa: {{adresa}}

{{podpis_spravce}}

{{pravni_upozorneni}}`,
    isGlobal: true
  },
  {
    id: '4',
    name: 'Oznámení o odečtech',
    subject: 'Oznámení o odečtech měřidel - {{zkraceny_nazev}}',
    body: `{{osloveni}},

dovolujeme si Vás informovat o plánovaných odečtech měřidel v budově {{nazev_budovy}}.

Termín odečtů: [DOPLŇTE DATUM]
Čas: [DOPLŇTE ČAS]

Prosíme zajistěte přístup k měřidlům ve Vaší jednotce.

Budova: {{plny_nazev}}
Adresa: {{adresa}}

V případě dotazů kontaktujte:
{{kontaktni_osoba}}
E-mail: {{email_predsedy}}
Telefon: {{telefon_predsedy}}

{{podpis_spravce}}

{{pravni_upozorneni}}`,
    isGlobal: true
  }
];

export const availableVariables: Variable[] = [
  // Globální proměnné
  { name: 'datum_dnes', description: 'Dnešní datum', type: 'global' },
  { name: 'cas_ted', description: 'Aktuální čas', type: 'global' },
  { name: 'nazev_spolecnosti', description: 'Název správcovské společnosti', type: 'global' },
  { name: 'kontaktni_email', description: 'Kontaktní e-mail společnosti', type: 'global' },
  { name: 'telefon_spolecnosti', description: 'Telefon společnosti', type: 'global' },
  { name: 'adresa_spolecnosti', description: 'Adresa sídla společnosti', type: 'global' },
  { name: 'web_spolecnosti', description: 'Webové stránky společnosti', type: 'global' },
  { name: 'podpis_spravce', description: 'Standardní podpis správce', type: 'global' },
  { name: 'pravni_upozorneni', description: 'Právní upozornění v patičce', type: 'global' },
  
  // Proměnné budovy
  { name: 'nazev_budovy', description: 'Název budovy/SVJ', type: 'building' },
  { name: 'zkraceny_nazev', description: 'Zkrácený název budovy', type: 'building' },
  { name: 'plny_nazev', description: 'Plný oficiální název SVJ/BD', type: 'building' },
  { name: 'adresa', description: 'Adresa budovy', type: 'building' },
  { name: 'osloveni', description: 'Způsob oslovení členů', type: 'building' },
  { name: 'ico', description: 'IČO', type: 'building' },
  { name: 'kontaktni_osoba', description: 'Kontaktní osoba pro budovu', type: 'building' },
  { name: 'predseda', description: 'Jméno předsedy', type: 'building' },
  { name: 'telefon_predsedy', description: 'Telefon předsedy', type: 'building' },
  { name: 'email_predsedy', description: 'Email předsedy', type: 'building' },
  { name: 'banka', description: 'Název banky', type: 'building' },
  { name: 'cislo_uctu', description: 'Číslo účtu', type: 'building' },
  { name: 'web', description: 'Webové stránky budovy', type: 'building' },
  
  // Proměnné člena
  { name: 'jmeno_clena', description: 'Jméno člena', type: 'member' },
  { name: 'email_clena', description: 'Email člena', type: 'member' },
  { name: 'telefon_clena', description: 'Telefon člena', type: 'member' },
  { name: 'jednotka', description: 'Číslo jednotky', type: 'member' },
  { name: 'vaha_hlasu', description: 'Váha hlasu člena', type: 'member' },
  
  // Proměnné hlasování
  { name: 'nazev_hlasovani', description: 'Název hlasování', type: 'vote' },
  { name: 'popis_hlasovani', description: 'Popis hlasování', type: 'vote' },
  { name: 'datum_zacatku', description: 'Datum začátku hlasování', type: 'vote' },
  { name: 'datum_konce', description: 'Datum konce hlasování', type: 'vote' },
  { name: 'stav_hlasovani', description: 'Aktuální stav hlasování', type: 'vote' },
  
  // Proměnné pro hlasování s SMS
  { name: 'odkaz_na_hlasovani', description: 'Unikátní odkaz na hlasování', type: 'custom' },
  
  // Proměnné pro zastupování
  { name: 'jmeno_zastupce', description: 'Jméno zástupce při hlasování', type: 'custom' },
  { name: 'zastoupeny_clen', description: 'Jméno zastoupeného člena', type: 'custom' },
  
  // Proměnné pro zápisy
  { name: 'zapis_z_hlasovani', description: 'Vygenerovaný zápis z hlasování', type: 'custom' },
];