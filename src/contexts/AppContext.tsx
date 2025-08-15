import { createContext, useContext, useState, ReactNode } from 'react';

// Typy
export interface Building {
    id: string;
    name: string;
    address: string;
    total_units: number;
    variables: Record<string, any>;
    created_at: string;
    updated_at: string;
}

interface AppContextType {
    selectedBuilding: Building | null;
    selectBuilding: (building: Building | null) => void;
}

// Vytvoření kontextu
const AppContext = createContext<AppContextType | null>(null);

// Provider komponenta

export function AppProvider({ children }: { children: ReactNode }) {
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

    const selectBuilding = (building: Building | null) => {
        setSelectedBuilding(building);
    };

    return (
        <AppContext.Provider value={{ selectedBuilding, selectBuilding }}>
            {children}
        </AppContext.Provider>
    );
}

// Hook pro použití kontextu
export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}


