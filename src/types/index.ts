// src/types/index.ts
// Základní centralizované typy podle nového návrhu

// Základní typ pro Budovu
export interface Building {
  id: string;
  name: string;
  address: string;
  total_units: number;
}

// Základní typ pro Člena
export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  unit: string;
  vote_weight: number;
  building_id: string;
  representative_id?: string;
}

// Základní typ pro Otázku
export interface Question {
  id: string;
  text: string;
  quorum_type: string;
  custom_quorum_numerator?: number;
  custom_quorum_denominator?: number;
}

// Základní typ pro Hlasování
export interface Vote {
  id: string;
  title: string;
  description: string;
  building_id: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled' | 'archived';
  questions: Question[];
  created_at: string;
  start_date?: string;
  endDate?: string; // Změna kvůli kompatibilitě se starým kódem
  attachments?: string[];
  observers?: string[];
  memberVotes: Record<string, Record<string, 'yes' | 'no' | 'abstain'>>; // Dočasné
}

