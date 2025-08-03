// migrateData.js - Script to migrate mock data to Supabase
// Run this script with: node migrateData.js

import { createClient } from '@supabase/supabase-js';

// --- Supabase Configuration ---
const supabaseUrl = 'https://nehlqaoqmhdvyncvizcc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5laGxxYW9xbWhkdnluY3ZpemNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA3NjU5MSwiZXhwIjoyMDY5NjUyNTkxfQ.EzInyS2uYhu-4jl9Yay8K8H_cLh2d1gEG4zPx9EofnM'; // SERVICE_ROLE KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Mock Data (copied from src/data/mockData.ts) ---
const mockBuildings = [
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

const mockMembers = [
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

const mockVotes = [
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
        id: '3',
        text: 'Souhlasíte s výměnou výtahu?',
        quorumType: 'qualified'
      },
      {
        id: '4',
        text: 'Souhlasíte s navrhovaným rozpočtem 800 000 Kč?',
        quorumType: 'qualified'
      }
    ],
    createdAt: '2024-01-01T10:00:00Z',
    startDate: '2024-01-01T10:00:00Z',
    endDate: '2024-01-10T23:59:59Z',
    memberVotes: {
      '1': { '3': 'yes', '4': 'yes' },
      '2': { '3': 'yes', '4': 'yes' },
      '3': { '3': 'no', '4': 'no' }
    },
    observers: []
  }
];

const mockObservers = [
  {
    id: '1',
    name: 'Ing. Pavel Správce',
    email: 'spravce@onlinesprava.cz',
    buildingId: '1',
    createdAt: '2024-01-01T10:00:00Z'
  }
];

const mockTemplates = [
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

const mockGlobalVariables = [
  {
    name: 'nazev_spolecnosti',
    description: 'Název správcovské společnosti',
    value: 'OnlineSprava s.r.o.',
    isEditable: true
  },
  {
    name: 'kontaktni_email',
    description: 'Kontaktní e-mail společnosti',
    value: 'podpora@onlinesprava.cz',
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
    value: 'www.onlinesprava.cz',
    isEditable: true
  },
  {
    name: 'podpis_spravce',
    description: 'Standardní podpis správce',
    value: 'S pozdravem,\nTým OnlineSprava\n{{nazev_spolecnosti}}',
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

const defaultBuildingVariables = [
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

// --- ID Mapping ---
// Supabase generates UUIDs, so we need to map old mock IDs to new Supabase UUIDs
const idMap = {
  buildings: {},
  members: {},
  votes: {},
  questions: {},
  observers: {},
  email_templates: {}
};

async function migrateData() {
  console.log('🚀 Starting data migration to Supabase...');

  try {
    // 1. Migrate Buildings
    console.log('📦 Migrating buildings...');
    for (const b of mockBuildings) {
      const { data, error } = await supabase
        .from('buildings')
        .insert({
          name: b.name,
          address: b.address,
          total_units: b.totalUnits,
          variables: b.variables
        })
        .select();
      if (error) {
        console.error('❌ Error inserting building:', b.name, error);
        return;
      }
      idMap.buildings[b.id] = data[0].id;
      console.log(`  ✅ Inserted building: ${b.name} (Old ID: ${b.id} -> New ID: ${data[0].id})`);
    }

    // 2. Migrate Members (first pass without representative_id)
    console.log('👥 Migrating members...');
    for (const m of mockMembers) {
      const { data, error } = await supabase
        .from('members')
        .insert({
          name: m.name,
          email: m.email,
          phone: m.phone,
          unit: m.unit,
          vote_weight: m.voteWeight,
          building_id: idMap.buildings[m.buildingId],
          representative_id: null // Will update in second pass
        })
        .select();
      if (error) {
        console.error('❌ Error inserting member:', m.name, error);
        return;
      }
      idMap.members[m.id] = data[0].id;
      console.log(`  ✅ Inserted member: ${m.name} (Old ID: ${m.id} -> New ID: ${data[0].id})`);
    }

    // Update representative_id for members if they reference other members
    console.log('🔄 Updating member representatives...');
    for (const m of mockMembers) {
      if (m.representativeId) {
        const { error } = await supabase
          .from('members')
          .update({ representative_id: idMap.members[m.representativeId] })
          .eq('id', idMap.members[m.id]);
        if (error) {
          console.error('❌ Error updating representative_id for member:', m.name, error);
          return;
        }
        console.log(`  ✅ Updated representative for ${m.name}`);
      }
    }

    // 3. Migrate Observers
    console.log('👁️ Migrating observers...');
    for (const o of mockObservers) {
      const { data, error } = await supabase
        .from('observers')
        .insert({
          name: o.name,
          email: o.email,
          building_id: idMap.buildings[o.buildingId],
          created_at: o.createdAt
        })
        .select();
      if (error) {
        console.error('❌ Error inserting observer:', o.name, error);
        return;
      }
      idMap.observers[o.id] = data[0].id;
      console.log(`  ✅ Inserted observer: ${o.name} (Old ID: ${o.id} -> New ID: ${data[0].id})`);
    }

    // 4. Migrate Global Variables
    console.log('🌐 Migrating global variables...');
    for (const gv of mockGlobalVariables) {
      const { error } = await supabase
        .from('global_variables')
        .insert({
          name: gv.name,
          description: gv.description,
          value: gv.value,
          is_editable: gv.isEditable
        });
      if (error) {
        console.error('❌ Error inserting global variable:', gv.name, error);
        return;
      }
      console.log(`  ✅ Inserted global variable: ${gv.name}`);
    }

    // 5. Migrate Building Variable Definitions
    console.log('🏢 Migrating building variable definitions...');
    for (const bvd of defaultBuildingVariables) {
      const { error } = await supabase
        .from('building_variable_definitions')
        .insert({
          name: bvd.name,
          description: bvd.description,
          type: bvd.type,
          options: bvd.options || null,
          required: bvd.required || false,
          placeholder: bvd.placeholder || null
        });
      if (error) {
        console.error('❌ Error inserting building variable definition:', bvd.name, error);
        return;
      }
      console.log(`  ✅ Inserted building variable definition: ${bvd.name}`);
    }

    // 6. Migrate Email Templates
    console.log('📧 Migrating email templates...');
    for (const et of mockTemplates) {
      const { data, error } = await supabase
        .from('email_templates')
        .insert({
          name: et.name,
          subject: et.subject,
          body: et.body,
          building_id: et.buildingId ? idMap.buildings[et.buildingId] : null,
          is_global: et.isGlobal,
          custom_variables: et.customVariables || null
        })
        .select();
      if (error) {
        console.error('❌ Error inserting email template:', et.name, error);
        return;
      }
      idMap.email_templates[et.id] = data[0].id;
      console.log(`  ✅ Inserted email template: ${et.name} (Old ID: ${et.id} -> New ID: ${data[0].id})`);
    }

    // 7. Migrate Votes
    console.log('🗳️ Migrating votes...');
    for (const v of mockVotes) {
      const newObserverIds = v.observers ? v.observers.map(oldId => idMap.observers[oldId]) : null;
      const { data, error } = await supabase
        .from('votes')
        .insert({
          title: v.title,
          description: v.description,
          building_id: idMap.buildings[v.buildingId],
          status: v.status,
          created_at: v.createdAt,
          start_date: v.startDate || null,
          end_date: v.endDate || null,
          attachments: v.attachments || null,
          observers: newObserverIds
        })
        .select();
      if (error) {
        console.error('❌ Error inserting vote:', v.title, error);
        return;
      }
      idMap.votes[v.id] = data[0].id;
      console.log(`  ✅ Inserted vote: ${v.title} (Old ID: ${v.id} -> New ID: ${data[0].id})`);

      // Migrate Questions for this vote
      console.log(`  📝 Migrating questions for vote: ${v.title}`);
      for (const q of v.questions) {
        const { data: qData, error: qError } = await supabase
          .from('questions')
          .insert({
            vote_id: idMap.votes[v.id],
            text: q.text,
            quorum_type: q.quorumType,
            custom_quorum_numerator: q.customQuorum ? q.customQuorum.numerator : null,
            custom_quorum_denominator: q.customQuorum ? q.customQuorum.denominator : null
          })
          .select();
        if (qError) {
          console.error('❌ Error inserting question for vote:', v.title, qError);
          return;
        }
        idMap.questions[q.id] = qData[0].id;
        console.log(`    ✅ Inserted question: ${q.text} (Old ID: ${q.id} -> New ID: ${qData[0].id})`);
      }

      // Migrate Member Votes (if any)
      if (v.memberVotes) {
        console.log(`  🗳️ Migrating member votes for vote: ${v.title}`);
        for (const memberOldId in v.memberVotes) {
          const memberNewId = idMap.members[memberOldId];
          if (!memberNewId) {
            console.warn(`  ⚠️ Member with old ID ${memberOldId} not found in map for vote ${v.title}. Skipping member votes.`);
            continue;
          }
          const answers = v.memberVotes[memberOldId];
          for (const questionOldId in answers) {
            const questionNewId = idMap.questions[questionOldId];
            if (!questionNewId) {
              console.warn(`  ⚠️ Question with old ID ${questionOldId} not found in map for vote ${v.title}. Skipping member vote.`);
              continue;
            }
            const answer = answers[questionOldId];
            const { error: mvError } = await supabase
              .from('member_votes')
              .insert({
                vote_id: idMap.votes[v.id],
                member_id: memberNewId,
                question_id: questionNewId,
                answer: answer
              });
            if (mvError) {
              console.error('❌ Error inserting member vote:', mvError);
              return;
            }
            console.log(`    ✅ Inserted member vote for ${memberOldId} on question ${questionOldId}: ${answer}`);
          }
        }
      }

      // Migrate Manual Vote Attachments (if any)
      if (v.manualVoteAttachments) {
        console.log(`  📎 Migrating manual vote attachments for vote: ${v.title}`);
        for (const memberOldId in v.manualVoteAttachments) {
          const memberNewId = idMap.members[memberOldId];
          if (!memberNewId) {
            console.warn(`  ⚠️ Member with old ID ${memberOldId} not found in map for vote ${v.title}. Skipping manual attachments.`);
            continue;
          }
          const attachments = v.manualVoteAttachments[memberOldId];
          for (const attachmentName of attachments) {
            const { error: mvaError } = await supabase
              .from('manual_vote_attachments')
              .insert({
                vote_id: idMap.votes[v.id],
                member_id: memberNewId,
                attachment_name: attachmentName
              });
            if (mvaError) {
              console.error('❌ Error inserting manual vote attachment:', mvaError);
              return;
            }
            console.log(`    ✅ Inserted manual attachment for ${memberOldId}: ${attachmentName}`);
          }
        }
      }

      // Migrate Manual Vote Notes (if any)
      if (v.manualVoteNotes) {
        console.log(`  📝 Migrating manual vote notes for vote: ${v.title}`);
        for (const memberOldId in v.manualVoteNotes) {
          const memberNewId = idMap.members[memberOldId];
          if (!memberNewId) {
            console.warn(`  ⚠️ Member with old ID ${memberOldId} not found in map for vote ${v.title}. Skipping manual notes.`);
            continue;
          }
          const note = v.manualVoteNotes[memberOldId];
          const { error: mvnError } = await supabase
            .from('manual_vote_notes')
            .insert({
              vote_id: idMap.votes[v.id],
              member_id: memberNewId,
              note: note
            });
          if (mvnError) {
            console.error('❌ Error inserting manual vote note:', mvnError);
            return;
          }
          console.log(`    ✅ Inserted manual note for ${memberOldId}`);
        }
      }
    }

    console.log('🎉 Data migration completed successfully!');
    console.log('📊 Migration Summary:');
    console.log(`  - Buildings: ${Object.keys(idMap.buildings).length}`);
    console.log(`  - Members: ${Object.keys(idMap.members).length}`);
    console.log(`  - Observers: ${Object.keys(idMap.observers).length}`);
    console.log(`  - Email Templates: ${Object.keys(idMap.email_templates).length}`);
    console.log(`  - Votes: ${Object.keys(idMap.votes).length}`);
    console.log(`  - Questions: ${Object.keys(idMap.questions).length}`);
    console.log(`  - Global Variables: ${mockGlobalVariables.length}`);
    console.log(`  - Building Variable Definitions: ${defaultBuildingVariables.length}`);

  } catch (error) {
    console.error('💥 Migration failed with error:', error);
  }
}

// Run the migration
migrateData();