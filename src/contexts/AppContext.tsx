// src/contexts/AppContext.tsx
import React, { useReducer, ReactNode, useEffect } from 'react';
import { useNhostClient } from '@nhost/react'; // Používáme Nhost
import { Building } from '../data/mockData'; // Detailní typy už definované v appContextTypes
import { AppContext, AppState } from './appContextTypes';

// Initial state přesunutý do tohoto souboru – typ je importován
const initialState: AppState = {
    selectedBuilding: null,
    buildings: [],
    members: [],
    votes: [],
    templates: [],
    globalVariables: [],
    buildingVariables: [],
    observers: [],
    loading: true,
    error: null,
};

type AppAction =
    | { type: 'SET_BUILDINGS'; payload: Building[] }
    | { type: 'SELECT_BUILDING'; payload: Building }
    | { type: 'ADD_BUILDING'; payload: Building }
    | { type: 'SET_ERROR'; payload: string };

function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'SET_BUILDINGS':
            return { ...state, buildings: action.payload, loading: false };
        case 'SELECT_BUILDING':
            return { ...state, selectedBuilding: action.payload };
        case 'ADD_BUILDING':
            return { ...state, buildings: [...state.buildings, action.payload] };
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };
        default:
            return state;
    }
}

// AppContext, AppContextType importovány – nebudeme znovu deklarovat

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);
    const nhost = useNhostClient(); // Získáme Nhost klienta

    // Načítání dat z Nhost databáze s fallback na mock
    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                // Pokusíme se načíst z Nhost
                const { data, error } = await nhost.graphql.request(`
                    query GetBuildings {
                        buildings {
                            id
                            name
                            address
                            total_units
                            created_at
                            updated_at
                        }
                    }
                `);
                
                if (error) {
                    console.warn('Nhost error, using empty state:', error);
                    // Místo chyby použijeme prázdný seznam - uživatel může přidat budovy
                    dispatch({ type: 'SET_BUILDINGS', payload: [] });
                    return;
                }
                
                if (data && data.buildings) {
                    dispatch({ type: 'SET_BUILDINGS', payload: data.buildings });
                } else {
                    dispatch({ type: 'SET_BUILDINGS', payload: [] });
                }
            } catch (err) {
                console.warn('Nhost connection failed, using empty state:', err);
                // Fallback na prázdný seznam
                dispatch({ type: 'SET_BUILDINGS', payload: [] });
            }
        };
        
        // Malé zpoždění pro lepší UX
        const timer = setTimeout(fetchBuildings, 100);
        return () => clearTimeout(timer);
    }, [nhost]);

    const selectBuilding = (building: Building) => {
        dispatch({ type: 'SELECT_BUILDING', payload: building });
        // Zde by se načítala další data pro danou budovu
    };

    const addBuilding = async (buildingData: { name: string; address: string; totalUnits: number }) => {
        try {
            // Pokus o přidání do Nhost
            const { data, error } = await nhost.graphql.request(`
                mutation InsertBuilding($name: String!, $address: String!, $total_units: Int!) {
                    insert_buildings_one(object: {
                        name: $name
                        address: $address
                        total_units: $total_units
                    }) {
                        id
                        name
                        address
                        total_units
                        created_at
                        updated_at
                    }
                }
            `, {
                name: buildingData.name,
                address: buildingData.address,
                total_units: buildingData.totalUnits
            });

            if (error || !data?.insert_buildings_one) {
                console.warn('Nhost unavailable, creating locally:', error);
                // Fallback na lokální řešení
                const newBuilding = {
                    id: Date.now().toString(),
                    name: buildingData.name,
                    address: buildingData.address,
                    total_units: buildingData.totalUnits,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                
                dispatch({ type: 'ADD_BUILDING', payload: newBuilding });
                return newBuilding;
            }

            if (data && data.insert_buildings_one) {
                dispatch({ type: 'ADD_BUILDING', payload: data.insert_buildings_one });
                return data.insert_buildings_one;
            }
        } catch (err) {
            console.warn('Database error, creating locally:', err);
            // Fallback na lokální řešení při chybě
            const newBuilding = {
                id: Date.now().toString(),
                name: buildingData.name,
                address: buildingData.address,
                total_units: buildingData.totalUnits,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            
            dispatch({ type: 'ADD_BUILDING', payload: newBuilding });
            return newBuilding;
        }
    };

        // Dočasná implementace pro zachování API (původně složitější logika)
            const castVote = (voteId: string, memberId: string, answers: Record<string, 'yes' | 'no' | 'abstain'>) => {
                // TODO: implementace perzistence hlasu
                // Parametry se zatím nevyužívají – zachováme ticho pro lint
                void voteId; void memberId; void answers;
            };


    const value = {
        // Rozbalíme stav pro zpětnou kompatibilitu (selectedBuilding, votes, ...)
        ...state,
        state, // zároveň poskytujeme celý state objekt
        selectBuilding,
        castVote,
        addBuilding,
    // No-op placeholdery (zatím jen konzole) – zachovat signatury
    loadBuildings: async () => { /* TODO: implement real loading */ },
    importMembers: async () => { /* TODO */ },
    addMember: async () => { /* TODO */ },
    updateMember: async () => { /* TODO */ },
    deleteMember: async () => { /* TODO */ },
    addGlobalVariable: async () => { /* TODO */ },
    updateGlobalVariable: async () => { /* TODO */ },
    deleteGlobalVariable: async () => { /* TODO */ },
    addTemplate: async () => { /* TODO */ },
    updateTemplate: async () => { /* TODO */ },
    deleteTemplate: async () => { /* TODO */ },
    addBuildingVariable: async () => { /* TODO */ },
    updateBuildingVariable: async () => { /* TODO */ },
    deleteBuildingVariable: async () => { /* TODO */ },
    setRepresentative: async () => { /* TODO */ },
    addObserver: async () => { /* TODO */ },
    deleteObserver: async () => { /* TODO */ },
    addVoteObserver: async () => { /* TODO */ },
    removeVoteObserver: async () => { /* TODO */ },
    } as const;

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};


