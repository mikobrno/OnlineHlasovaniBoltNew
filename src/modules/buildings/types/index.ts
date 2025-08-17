// src/modules/buildings/types/index.ts

export interface Building {
  id: string;
  name: string;
  address: string;
  total_units: number;
  variables: Record<string, string>;
}

export interface BuildingVariable {
  name: string;
  description: string;
  type: 'text' | 'textarea' | 'select' | 'number';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export interface BuildingFormData {
  name: string;
  address: string;
  totalUnits: number;
  variables: Record<string, string>;
}
