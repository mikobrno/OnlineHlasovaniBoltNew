export interface Variable {
  name: string;
  description: string;
  type: 'system' | 'custom';
}

export const availableVariables: Omit<Variable, 'type'>[] = [
  { name: 'jmeno_prijmeni', description: 'Celé jméno člena' },
  { name: 'email', description: 'E-mail člena' },
  { name: 'nazev_budovy', description: 'Název budovy' },
  { name: 'adresa_budovy', description: 'Adresa budovy' },
  { name: 'nazev_hlasovani', description: 'Název aktuálního hlasování' },
  { name: 'odkaz_hlasovani', description: 'Odkaz na stránku hlasování' },
  { name: 'datum_zacatku', description: 'Datum zahájení hlasování' },
  { name: 'datum_konce', description: 'Datum ukončení hlasování' },
];
