// src/types/index.ts
// Základní centralizované typy podle nového návrhu

// Základní typ pro Budovu
export interface Building {
  id: string;
  name: string;
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
  description?: string; // Přidána chybějící vlastnost
  quorum_type: string;
  custom_quorum_numerator?: number;
  custom_quorum_denominator?: number;
  order_index: number; // Přidána chybějící vlastnost
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
  // Tyto vlastnosti přidáváme pro kompatibilitu
  buildingId?: string;
  startDate?: string;
  endDate?: string;
  memberVotes?: any;
}

// Typ pro Observer (Pozorovatel)
export interface Observer {
  id: string;
  name: string;
  email: string;
  building_id: string;
}