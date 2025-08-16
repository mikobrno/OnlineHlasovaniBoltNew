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

// Typy pro Nhost autentizaci
export interface NhostSession {
  accessToken: string;
  user: NhostUser;
}

export interface NhostUser {
  id: string;
  email: string;
  displayName?: string;
  metadata?: Record<string, unknown>;
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
  end_date?: string;
  manual_vote_attachments?: Array<{
    id: string;
    attachment_name: string;
    created_at: string;
    member?: {
      id: string;
      name: string;
      unit: string;
    };
  }>;
  observers_list?: string[];
  observers_aggregate?: {
    aggregate: {
      count: number;
    };
  };
  memberVotes?: Record<string, Record<string, 'yes' | 'no' | 'abstain'>>;
}

// Typ pro Observer (Pozorovatel)
export interface Observer {
  id: string;
  name: string;
  email: string;
  building_id: string;
}