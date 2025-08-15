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

    // Načítání dat z Nhost databáze
    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const { data, error } = await nhost.graphql.request(`
                    query GetBuildings {
                        buildings {
                            id
                            name
                            address
                            total_units
                            variables
                            created_at
                            updated_at
                        }
                    }
                `);
                
                if (error) {
                    console.error('GraphQL error:', error);
                    const errorMessage = Array.isArray(error) ? error[0]?.message : error.message;
                    dispatch({ type: 'SET_ERROR', payload: `Databázová chyba: ${errorMessage}` });
                    return;
                }
                
                if (data && data.buildings) {
                    // Transformujeme databázové objekty na Building typy
                    const buildings: Building[] = data.buildings.map((b: any) => ({
                        id: b.id,
                        name: b.name,
                        address: b.address,
                        totalUnits: b.total_units,
                        variables: b.variables || {},
                        created_at: b.created_at,
                        updated_at: b.updated_at
                    }));
                    dispatch({ type: 'SET_BUILDINGS', payload: buildings });
                } else {
                    dispatch({ type: 'SET_BUILDINGS', payload: [] });
                }
            } catch (err) {
                console.error('Network error:', err);
                dispatch({ type: 'SET_ERROR', payload: 'Chyba připojení k databázi' });
            }
        };
        fetchBuildings();
    }, [nhost]);

    const selectBuilding = (building: Building) => {
        dispatch({ type: 'SELECT_BUILDING', payload: building });
        // Zde by se načítala další data pro danou budovu
    };

    const addBuilding = async (buildingData: { name: string; address: string; totalUnits: number }) => {
        try {
            // Přidání do Nhost databáze
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
                        variables
                        created_at
                        updated_at
                    }
                }
            `, {
                name: buildingData.name,
                address: buildingData.address,
                total_units: buildingData.totalUnits
            });

            if (error) {
                console.error('GraphQL error:', error);
                const errorMessage = Array.isArray(error) ? error[0]?.message : error.message;
                throw new Error(`Chyba při ukládání budovy: ${errorMessage}`);
            }

            if (data && data.insert_buildings_one) {
                // Transformujeme databázový objekt na Building typ
                const building: Building = {
                    id: data.insert_buildings_one.id,
                    name: data.insert_buildings_one.name,
                    address: data.insert_buildings_one.address,
                    totalUnits: data.insert_buildings_one.total_units,
                    variables: data.insert_buildings_one.variables || {},
                    created_at: data.insert_buildings_one.created_at,
                    updated_at: data.insert_buildings_one.updated_at
                };
                
                dispatch({ type: 'ADD_BUILDING', payload: building });
                return building;
            }
            
            throw new Error('Nepodařilo se přidat budovu');
        } catch (err) {
            console.error('Error adding building:', err);
            throw err;
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


