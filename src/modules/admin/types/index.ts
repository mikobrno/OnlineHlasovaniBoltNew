export interface SystemSettings {
  id: string;
  key: string;
  value: string;
  description?: string;
  category: string;
  is_public: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AuditLogEntry {
  id: string;
  table_name: string;
  record_id: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  old_data?: Record<string, unknown>;
  new_data?: Record<string, unknown>;
  user_id?: string;
  created_at: string;
}

export interface SystemStats {
  buildings: {
    total: number;
    active: number;
  };
  members: {
    total: number;
    active: number;
    owners: number;
    committee: number;
  };
  votes: {
    total: number;
    active: number;
    completed: number;
  };
}

export interface SettingFormData {
  key: string;
  value: string;
  description?: string;
  category: string;
  isPublic: boolean;
}

export interface AuditLogFilters {
  tableName?: string;
  action?: 'INSERT' | 'UPDATE' | 'DELETE';
  userId?: string;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
}
