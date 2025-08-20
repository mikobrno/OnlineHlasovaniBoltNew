// src/modules/shared/contexts/AppContext.tsx
import React from 'react';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useAuth } from '../../auth/contexts/AuthContext';
import { GET_USER_BUILDINGS } from '../../../graphql/queries';

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

interface AppContextType {
    selectedBuilding: Building | null;
    selectBuilding: (building: Building | null) => void;
    settings: Settings;
}

// src/modules/shared/contexts/AppContext.tsx
import React from 'react';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useAuth } from '../../auth/contexts/AuthContext';
import { GET_USER_BUILDINGS } from '../../../graphql/queries';
import { AppContext } from './context';
import { Building, Settings } from './types';

export function AppProvider({ children }: { children: React.ReactNode }) {

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
    const [settings] = useState<Settings>({ buildingId: null });

    const { isAuthenticated, isLoading } = useAuth();
    const { data: buildingsData } = useQuery(GET_USER_BUILDINGS, {
        skip: isLoading || !isAuthenticated,
        fetchPolicy: 'cache-and-network'
    });

    React.useEffect(() => {
        if (buildingsData?.buildings?.length > 0 && !selectedBuilding) {
            console.debug('AppProvider auto-selecting building for dev:', buildingsData.buildings[0]);
            setSelectedBuilding(buildingsData.buildings[0]);
        }
    }, [buildingsData, selectedBuilding]);

    const selectBuilding = (building: Building | null) => {
        setSelectedBuilding(building);
    };

    return (
        <AppContext.Provider value={{
            selectedBuilding,
            selectBuilding,
            settings,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => {
    const context = React.useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
