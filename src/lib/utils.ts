import { Building, Member, Vote, GlobalVariable } from '../data/mockData';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('cs-CZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('cs-CZ');
};

export const replaceVariables = (
  text: string,
  globalVariables?: GlobalVariable[],
  building?: Building,
  member?: Member,
  vote?: Vote,
  customVariables?: Record<string, string>
): string => {
  let result = text;

  // Global variables
  const now = new Date();
  result = result.replace(/{{datum_dnes}}/g, formatDateShort(now.toISOString()));
  result = result.replace(/{{cas_ted}}/g, now.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' }));

  // Custom global variables
  if (globalVariables) {
    globalVariables.forEach(variable => {
      const regex = new RegExp(`{{${variable.name}}}`, 'g');
      // First pass - replace with raw value (might contain other variables)
      result = result.replace(regex, variable.value);
    });
    
    // Second pass - resolve nested variables in global variables
    globalVariables.forEach(variable => {
      const regex = new RegExp(`{{${variable.name}}}`, 'g');
      let resolvedValue = variable.value;
      
      // Resolve nested global variables
      globalVariables.forEach(nestedVar => {
        const nestedRegex = new RegExp(`{{${nestedVar.name}}}`, 'g');
        resolvedValue = resolvedValue.replace(nestedRegex, nestedVar.value);
      });
      
      result = result.replace(regex, resolvedValue);
    });
  }

  // Building variables
  if (building) {
    Object.entries(building.variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value);
    });
  }

  // Member variables
  if (member) {
    result = result.replace(/{{jmeno_clena}}/g, member.name);
    result = result.replace(/{{email_clena}}/g, member.email);
    result = result.replace(/{{telefon_clena}}/g, member.phone);
    result = result.replace(/{{jednotka}}/g, member.unit);
    result = result.replace(/{{vaha_hlasu}}/g, member.voteWeight.toString());
  }

  // Vote variables
  if (vote) {
    result = result.replace(/{{nazev_hlasovani}}/g, vote.title);
    result = result.replace(/{{popis_hlasovani}}/g, vote.description);
    if (vote.startDate) {
      result = result.replace(/{{datum_zacatku}}/g, formatDate(vote.startDate));
    }
    if (vote.endDate) {
      result = result.replace(/{{datum_konce}}/g, formatDate(vote.endDate));
    }
    result = result.replace(/{{stav_hlasovani}}/g, getVoteStatusText(vote.status));
  }

  // Custom variables
  if (customVariables) {
    Object.entries(customVariables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value);
    });

    // Kompatibilita: podporuj i {{odkaz_s_hlasovanim}} jako alias k {{odkaz_na_hlasovani}}
    if (customVariables['odkaz_na_hlasovani'] || customVariables['odkaz_s_hlasovanim']) {
      const votingLink = customVariables['odkaz_na_hlasovani'] || customVariables['odkaz_s_hlasovanim'];
      result = result.replace(/{{odkaz_s_hlasovanim}}/g, votingLink);
      result = result.replace(/\[odkaz na hlasování\]/g, votingLink); // starší textová varianta v některých šablonách
    }

    // Alias pro jméno zástupce: {{zastupce_za_jednotku}} == {{jmeno_zastupce}}
    if (customVariables['jmeno_zastupce'] || customVariables['zastupce_za_jednotku']) {
      const repName = customVariables['jmeno_zastupce'] || customVariables['zastupce_za_jednotku'];
      result = result.replace(/{{zastupce_za_jednotku}}/g, repName);
      result = result.replace(/{{jmeno_zastupce}}/g, repName);
    }
  }

  return result;
};

export const getVoteStatusText = (status: string): string => {
  switch (status) {
    case 'draft': return 'Návrh';
    case 'active': return 'Aktivní';
    case 'completed': return 'Ukončeno';
    case 'cancelled': return 'Zrušeno';
    default: return status;
  }
};

export const getVoteStatusColor = (status: string): string => {
  switch (status) {
    case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    case 'active': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200';
    case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200';
    case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  }
};

export const calculateQuorum = (
  type: 'simple' | 'qualified' | 'unanimous' | 'custom',
  totalWeight: number,
  customQuorum?: { numerator: number; denominator: number }
): number => {
  switch (type) {
    case 'simple':
      return totalWeight / 2;
    case 'qualified':
      return (totalWeight * 2) / 3;
    case 'unanimous':
      return totalWeight;
    case 'custom':
      if (customQuorum) {
        return (totalWeight * customQuorum.numerator) / customQuorum.denominator;
      }
      return totalWeight / 2;
    default:
      return totalWeight / 2;
  }
};

export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};