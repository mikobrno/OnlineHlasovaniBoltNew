// src/modules/shared/contexts/AppContext.tsx
import { FC, ReactNode, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useAuth } from '../../auth/contexts/AuthContext';
import { GET_USER_BUILDINGS } from '../../../graphql/queries';
import { AppContext } from './context';
import { Building, Settings } from './types';

export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
    const [settings] = useState<Settings>({ buildingId: null });

    const { isAuthenticated, isLoading } = useAuth();
    const { data: buildingsData } = useQuery(GET_USER_BUILDINGS, {
        skip: isLoading || !isAuthenticated,
        fetchPolicy: 'cache-and-network'
    });

    useEffect(() => {
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
};
