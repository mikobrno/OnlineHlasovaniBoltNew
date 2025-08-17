import React from 'react';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useAuth } from './useAuth';
import { GET_USER_BUILDINGS } from '../graphql/queries';
import { AppContext, Building, Settings } from './appContext.types';

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
    const [settings] = useState<Settings>({ buildingId: null });

    // For development UX: try to load buildings even if there's no access token
    // (helps when auth isn't working yet). In production this will still require
    // proper backend permissions.
    const { isAuthenticated, isLoading } = useAuth();
    const { data: buildingsData } = useQuery(GET_USER_BUILDINGS, {
        skip: isLoading || !isAuthenticated,
        fetchPolicy: 'cache-and-network'
    });

    // Pokud máme data o budovách a není vybraná žádná, vybereme první
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


