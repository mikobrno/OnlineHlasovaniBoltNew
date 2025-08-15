export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  building_id: string;
  unit?: string;
  vote_weight?: number;
  representative_id?: string;
}

export interface Building {
  id: string;
  name: string;
  address: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  building_id?: string;
  is_global: boolean;
  // customVariables?: any; // Zatím neřešíme
}

export interface DocumentTemplate {
  id: string;
  name:string;
  body: string;
  help_text?: string;
  is_global: boolean;
  building_id?: string;
}

export interface BuildingVariable {
  name: string;
  building_id: string;
  description: string;
  value: string;
  created_at?: string;
  updated_at?: string;
}

export interface GlobalVariable {
  name: string;
  value: string;
  description?: string;
  is_editable?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Vote {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  building_id: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
    questions: {
      id: string;
      text: string;
      description?: string;
      quorum_type?: 'simple' | 'qualified' | 'unanimous' | 'custom';
      custom_quorum?: {
        numerator: number;
        denominator: number;
      };
    }[];
    member_votes?: MemberVote[];
    attachments?: VoteAttachment[];
    observers?: string[];
    created_at: string;
    description?: string;
  }

  export interface MemberVote {
    member_id: string;
    answers: Record<string, 'yes' | 'no' | 'abstain'>;
    note?: string;
    attachments?: {
      id: string;
      file_name: string;
    }[];
  }


  export interface VoteAttachment {
    id: string;
    file_name: string;
    file_size: number;
    created_at: string;
    note?: string;
    member?: {
      id: string;
      name: string;
      unit?: string;
    };
  }

  export interface Observer {
    id: string;
    name: string;
    email: string;
    building_id?: string;
  }
