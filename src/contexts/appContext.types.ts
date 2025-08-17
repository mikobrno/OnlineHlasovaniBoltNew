import { createContext } from 'react';

export interface Building {
    id: string;
    name: string;
    address: string;
    total_units: number;
    variables: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}

export interface Settings {
    buildingId: string | null;
}

export interface AppContextType {
    selectedBuilding: Building | null;
    selectBuilding: (building: Building | null) => void;
    settings: Settings;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
