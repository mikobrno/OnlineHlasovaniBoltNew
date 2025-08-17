// src/types/index.ts

export interface Building {
  id: string;
  name: string;
}

export interface Question {
    id: string;
    text: string;
    description?: string;
    quorum_type: string;
    custom_quorum_numerator?: number;
    custom_quorum_denominator?: number;
    order_index: number;
}

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
  // Tyto vlastnosti přidáváme pro kompatibilitu, dokud nebudou všechny komponenty přepsány
  buildingId?: string;
  startDate?: string;
  endDate?: string;
  memberVotes?: any;
}