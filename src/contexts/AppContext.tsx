import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { 
  mockBuildings, 
  mockMembers, 
  mockVotes, 
  mockTemplates,
  mockGlobalVariables,
  defaultBuildingVariables,
  mockObservers,
  Building,
  Member,
  Vote,
  EmailTemplate,
  GlobalVariable,
  BuildingVariable,
  Observer
} from '../data/mockData';

interface AppState {
  selectedBuilding: Building | null;
  buildings: Building[];
  members: Member[];
  votes: Vote[];
  templates: EmailTemplate[];
  globalVariables: GlobalVariable[];
  buildingVariables: BuildingVariable[];
  observers: Observer[];
}

type AppAction = 
  | { type: 'SELECT_BUILDING'; payload: Building }
  | { type: 'ADD_BUILDING'; payload: Building }
  | { type: 'UPDATE_BUILDING'; payload: Building }
  | { type: 'DELETE_BUILDING'; payload: string }
  | { type: 'ADD_MEMBER'; payload: Member }
  | { type: 'UPDATE_MEMBER'; payload: Member }
  | { type: 'DELETE_MEMBER'; payload: string }
  | { type: 'IMPORT_MEMBERS'; payload: Member[] }
  | { type: 'ADD_VOTE'; payload: Vote }
  | { type: 'UPDATE_VOTE'; payload: Vote }
  | { type: 'DELETE_VOTE'; payload: string }
  | { type: 'START_VOTE'; payload: string }
  | { type: 'CAST_VOTE'; payload: { voteId: string; memberId: string; answers: Record<string, 'yes' | 'no' | 'abstain'>; attachments?: string[]; note?: string; isManual?: boolean } }
  | { type: 'SET_REPRESENTATIVE'; payload: { voteId: string; memberId: string; representativeId: string | undefined } }
  | { type: 'ADD_TEMPLATE'; payload: EmailTemplate }
  | { type: 'UPDATE_TEMPLATE'; payload: EmailTemplate }
  | { type: 'DELETE_TEMPLATE'; payload: string }
  | { type: 'ADD_GLOBAL_VARIABLE'; payload: GlobalVariable }
  | { type: 'UPDATE_GLOBAL_VARIABLE'; payload: GlobalVariable }
  | { type: 'DELETE_GLOBAL_VARIABLE'; payload: string }
  | { type: 'ADD_BUILDING_VARIABLE'; payload: BuildingVariable }
  | { type: 'UPDATE_BUILDING_VARIABLE'; payload: BuildingVariable }
  | { type: 'DELETE_BUILDING_VARIABLE'; payload: string }
  | { type: 'ADD_OBSERVER'; payload: Observer }
  | { type: 'UPDATE_OBSERVER'; payload: Observer }
  | { type: 'DELETE_OBSERVER'; payload: string }
  | { type: 'ADD_VOTE_OBSERVER'; payload: { voteId: string; observerId: string } }
  | { type: 'REMOVE_VOTE_OBSERVER'; payload: { voteId: string; observerId: string } };

const initialState: AppState = {
  selectedBuilding: null,
  buildings: mockBuildings,
  members: mockMembers,
  votes: mockVotes,
  templates: mockTemplates,
  globalVariables: mockGlobalVariables,
  buildingVariables: defaultBuildingVariables,
  observers: mockObservers
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SELECT_BUILDING':
      return { ...state, selectedBuilding: action.payload };
    
    case 'ADD_BUILDING':
      return { ...state, buildings: [...state.buildings, action.payload] };
    
    case 'UPDATE_BUILDING':
      return {
        ...state,
        buildings: state.buildings.map(b => b.id === action.payload.id ? action.payload : b),
        selectedBuilding: state.selectedBuilding?.id === action.payload.id ? action.payload : state.selectedBuilding
      };
    
    case 'DELETE_BUILDING':
      return {
        ...state,
        buildings: state.buildings.filter(b => b.id !== action.payload),
        selectedBuilding: state.selectedBuilding?.id === action.payload ? null : state.selectedBuilding
      };
    
    case 'ADD_MEMBER':
      return { ...state, members: [...state.members, action.payload] };
    
    case 'UPDATE_MEMBER':
      return {
        ...state,
        members: state.members.map(m => m.id === action.payload.id ? action.payload : m)
      };
    
    case 'DELETE_MEMBER':
      return {
        ...state,
        members: state.members.filter(m => m.id !== action.payload)
      };
    
    case 'IMPORT_MEMBERS':
      return {
        ...state,
        members: [...state.members.filter(m => m.buildingId !== state.selectedBuilding?.id), ...action.payload]
      };
    
    case 'ADD_VOTE':
      return { ...state, votes: [...state.votes, action.payload] };
    
    case 'UPDATE_VOTE':
      return {
        ...state,
        votes: state.votes.map(v => v.id === action.payload.id ? action.payload : v)
      };
    
    case 'DELETE_VOTE':
      return {
        ...state,
        votes: state.votes.filter(v => v.id !== action.payload)
      };
    
    case 'START_VOTE':
      return {
        ...state,
        votes: state.votes.map(v => 
          v.id === action.payload 
            ? { ...v, status: 'active' as const, startDate: new Date().toISOString() }
            : v
        )
      };
    
    case 'CAST_VOTE':
      return {
        ...state,
        votes: state.votes.map(v => 
          v.id === action.payload.voteId 
            ? {
                ...v,
                memberVotes: {
                  ...v.memberVotes,
                  [action.payload.memberId]: action.payload.answers
                },
                ...(action.payload.isManual && action.payload.attachments && {
                  manualVoteAttachments: {
                    ...v.manualVoteAttachments,
                    [action.payload.memberId]: action.payload.attachments
                  }
                }),
                ...(action.payload.isManual && action.payload.note && {
                  manualVoteNotes: {
                    ...v.manualVoteNotes,
                    [action.payload.memberId]: action.payload.note
                  }
                })
              }
            : v
        )
      };
    
    case 'SET_REPRESENTATIVE':
      return {
        ...state,
        votes: state.votes.map(v => 
          v.id === action.payload.voteId 
            ? {
                ...v,
                memberRepresentatives: {
                  ...v.memberRepresentatives,
                  [action.payload.memberId]: action.payload.representativeId || ''
                }
              }
            : v
        )
      };
    
    case 'ADD_TEMPLATE':
      return { ...state, templates: [...state.templates, action.payload] };
    
    case 'UPDATE_TEMPLATE':
      return {
        ...state,
        templates: state.templates.map(t => t.id === action.payload.id ? action.payload : t)
      };
    
    case 'DELETE_TEMPLATE':
      return {
        ...state,
        templates: state.templates.filter(t => t.id !== action.payload)
      };
    
    case 'ADD_GLOBAL_VARIABLE':
      return {
        ...state,
        globalVariables: [...state.globalVariables, action.payload]
      };
    
    case 'UPDATE_GLOBAL_VARIABLE':
      return {
        ...state,
        globalVariables: state.globalVariables.map(v => 
          v.name === action.payload.name ? action.payload : v
        )
      };
    
    case 'DELETE_GLOBAL_VARIABLE':
      return {
        ...state,
        globalVariables: state.globalVariables.filter(v => v.name !== action.payload)
      };
    
    case 'ADD_BUILDING_VARIABLE':
      return {
        ...state,
        buildingVariables: [...state.buildingVariables, action.payload]
      };
    
    case 'UPDATE_BUILDING_VARIABLE':
      return {
        ...state,
        buildingVariables: state.buildingVariables.map(v => 
          v.name === action.payload.name ? action.payload : v
        )
      };
    
    case 'DELETE_BUILDING_VARIABLE':
      return {
        ...state,
        buildingVariables: state.buildingVariables.filter(v => v.name !== action.payload)
      };
    
    case 'ADD_OBSERVER':
      return { ...state, observers: [...state.observers, action.payload] };
    
    case 'UPDATE_OBSERVER':
      return {
        ...state,
        observers: state.observers.map(o => o.id === action.payload.id ? action.payload : o)
      };
    
    case 'DELETE_OBSERVER':
      return {
        ...state,
        observers: state.observers.filter(o => o.id !== action.payload)
      };
    
    case 'ADD_VOTE_OBSERVER':
      return {
        ...state,
        votes: state.votes.map(v => 
          v.id === action.payload.voteId 
            ? {
                ...v,
                observers: [...(v.observers || []), action.payload.observerId]
              }
            : v
        )
      };
    
    case 'REMOVE_VOTE_OBSERVER':
      return {
        ...state,
        votes: state.votes.map(v => 
          v.id === action.payload.voteId 
            ? {
                ...v,
                observers: (v.observers || []).filter(id => id !== action.payload.observerId)
              }
            : v
        )
      };
    
    default:
      return state;
  }
};

interface AppContextValue extends AppState {
  dispatch: React.Dispatch<AppAction>;
  selectBuilding: (building: Building) => void;
  addBuilding: (building: Building) => void;
  updateBuilding: (building: Building) => void;
  deleteBuilding: (id: string) => void;
  addMember: (member: Member) => void;
  updateMember: (member: Member) => void;
  deleteMember: (id: string) => void;
  importMembers: (members: Member[]) => void;
  addVote: (vote: Vote) => void;
  updateVote: (vote: Vote) => void;
  deleteVote: (id: string) => void;
  startVote: (id: string) => void;
  castVote: (voteId: string, memberId: string, answers: Record<string, 'yes' | 'no' | 'abstain'>, attachments?: string[], note?: string, isManual?: boolean) => void;
  setRepresentative: (voteId: string, memberId: string, representativeId: string | undefined) => void;
  addTemplate: (template: EmailTemplate) => void;
  updateTemplate: (template: EmailTemplate) => void;
  deleteTemplate: (id: string) => void;
  addGlobalVariable: (variable: GlobalVariable) => void;
  updateGlobalVariable: (variable: GlobalVariable) => void;
  deleteGlobalVariable: (name: string) => void;
  addBuildingVariable: (variable: BuildingVariable) => void;
  updateBuildingVariable: (variable: BuildingVariable) => void;
  deleteBuildingVariable: (name: string) => void;
  addObserver: (observer: Observer) => void;
  updateObserver: (observer: Observer) => void;
  deleteObserver: (id: string) => void;
  addVoteObserver: (voteId: string, observerId: string) => void;
  removeVoteObserver: (voteId: string, observerId: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const selectBuilding = (building: Building) => {
    dispatch({ type: 'SELECT_BUILDING', payload: building });
  };

  const addBuilding = (building: Building) => {
    dispatch({ type: 'ADD_BUILDING', payload: building });
  };

  const updateBuilding = (building: Building) => {
    dispatch({ type: 'UPDATE_BUILDING', payload: building });
  };

  const deleteBuilding = (id: string) => {
    dispatch({ type: 'DELETE_BUILDING', payload: id });
  };

  const addMember = (member: Member) => {
    dispatch({ type: 'ADD_MEMBER', payload: member });
  };

  const updateMember = (member: Member) => {
    dispatch({ type: 'UPDATE_MEMBER', payload: member });
  };

  const deleteMember = (id: string) => {
    dispatch({ type: 'DELETE_MEMBER', payload: id });
  };

  const importMembers = (members: Member[]) => {
    dispatch({ type: 'IMPORT_MEMBERS', payload: members });
  };

  const addVote = (vote: Vote) => {
    dispatch({ type: 'ADD_VOTE', payload: vote });
  };

  const updateVote = (vote: Vote) => {
    dispatch({ type: 'UPDATE_VOTE', payload: vote });
  };

  const deleteVote = (id: string) => {
    dispatch({ type: 'DELETE_VOTE', payload: id });
  };

  const startVote = (id: string) => {
    dispatch({ type: 'START_VOTE', payload: id });
  };

  const castVote = (voteId: string, memberId: string, answers: Record<string, 'yes' | 'no' | 'abstain'>, attachments?: string[], note?: string, isManual?: boolean) => {
    dispatch({ type: 'CAST_VOTE', payload: { voteId, memberId, answers, attachments, note, isManual } });
  };

  const setRepresentative = (voteId: string, memberId: string, representativeId: string | undefined) => {
    dispatch({ type: 'SET_REPRESENTATIVE', payload: { voteId, memberId, representativeId } });
  };

  const addTemplate = (template: EmailTemplate) => {
    dispatch({ type: 'ADD_TEMPLATE', payload: template });
  };

  const updateTemplate = (template: EmailTemplate) => {
    dispatch({ type: 'UPDATE_TEMPLATE', payload: template });
  };

  const deleteTemplate = (id: string) => {
    dispatch({ type: 'DELETE_TEMPLATE', payload: id });
  };

  const addGlobalVariable = (variable: GlobalVariable) => {
    dispatch({ type: 'ADD_GLOBAL_VARIABLE', payload: variable });
  };

  const updateGlobalVariable = (variable: GlobalVariable) => {
    dispatch({ type: 'UPDATE_GLOBAL_VARIABLE', payload: variable });
  };

  const deleteGlobalVariable = (name: string) => {
    dispatch({ type: 'DELETE_GLOBAL_VARIABLE', payload: name });
  };

  const addBuildingVariable = (variable: BuildingVariable) => {
    dispatch({ type: 'ADD_BUILDING_VARIABLE', payload: variable });
  };

  const updateBuildingVariable = (variable: BuildingVariable) => {
    dispatch({ type: 'UPDATE_BUILDING_VARIABLE', payload: variable });
  };

  const deleteBuildingVariable = (name: string) => {
    dispatch({ type: 'DELETE_BUILDING_VARIABLE', payload: name });
  };

  const addObserver = (observer: Observer) => {
    dispatch({ type: 'ADD_OBSERVER', payload: observer });
  };

  const updateObserver = (observer: Observer) => {
    dispatch({ type: 'UPDATE_OBSERVER', payload: observer });
  };

  const deleteObserver = (id: string) => {
    dispatch({ type: 'DELETE_OBSERVER', payload: id });
  };

  const addVoteObserver = (voteId: string, observerId: string) => {
    dispatch({ type: 'ADD_VOTE_OBSERVER', payload: { voteId, observerId } });
  };

  const removeVoteObserver = (voteId: string, observerId: string) => {
    dispatch({ type: 'REMOVE_VOTE_OBSERVER', payload: { voteId, observerId } });
  };

  const value: AppContextValue = {
    ...state,
    dispatch,
    selectBuilding,
    addBuilding,
    updateBuilding,
    deleteBuilding,
    addMember,
    updateMember,
    deleteMember,
    importMembers,
    addVote,
    updateVote,
    deleteVote,
    startVote,
    castVote,
    setRepresentative,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    addGlobalVariable,
    updateGlobalVariable,
    deleteGlobalVariable,
    addBuildingVariable,
    updateBuildingVariable,
    deleteBuildingVariable,
    addObserver,
    updateObserver,
    deleteObserver,
    addVoteObserver,
    removeVoteObserver
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextValue => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};