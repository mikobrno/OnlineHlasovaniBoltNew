import React from 'react';
import { useState } from 'react';
import { nhost } from '../lib/nhostClient';
import { useQuery } from '@apollo/client';
import { GET_USER_BUILDINGS } from '../graphql/queries';
import { AppContext, Building, Settings } from './appContext.types';

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
    const [settings] = useState<Settings>({ buildingId: null });

    const { data: buildingsData } = useQuery(GET_USER_BUILDINGS, {
        skip: !nhost.auth.getAccessToken(),
    });

    // Pokud máme data o budovách a není vybraná žádná, vybereme první
    React.useEffect(() => {
        if (buildingsData?.buildings?.length > 0 && !selectedBuilding) {
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


