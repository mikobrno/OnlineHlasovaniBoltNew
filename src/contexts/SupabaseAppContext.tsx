import React, { createContext, useReducer, ReactNode, useEffect } from 'react';
import { 
  Building,
  Member,
  Vote,
  EmailTemplate,
  GlobalVariable,
  BuildingVariable,
  Observer
} from '../data/mockData';
import {
  buildingService,
  memberService,
  voteService,
  templateService,
  globalVariableService,
  buildingVariableService,
  observerService
} from '../lib/supabaseServices';
import { initializeAuth } from '../lib/supabaseClient';
import { useAuth } from './SupabaseAuthContext';
import { useToast } from './ToastContext';

interface AppState {
  selectedBuilding: Building | null;
  buildings: Building[];
  members: Member[];
  votes: Vote[];
  templates: EmailTemplate[];
  globalVariables: GlobalVariable[];
  buildingVariables: BuildingVariable[];
  observers: Observer[];
  loading: boolean;
  error: string | null;
}

type AppAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SELECT_BUILDING'; payload: Building }
  | { type: 'SET_BUILDINGS'; payload: Building[] }
  | { type: 'ADD_BUILDING'; payload: Building }
  | { type: 'UPDATE_BUILDING'; payload: Building }
  | { type: 'DELETE_BUILDING'; payload: string }
  | { type: 'SET_MEMBERS'; payload: Member[] }
  | { type: 'ADD_MEMBER'; payload: Member }
  | { type: 'UPDATE_MEMBER'; payload: Member }
  | { type: 'DELETE_MEMBER'; payload: string }
  | { type: 'SET_VOTES'; payload: Vote[] }
  | { type: 'ADD_VOTE'; payload: Vote }
  | { type: 'UPDATE_VOTE'; payload: Vote }
  | { type: 'DELETE_VOTE'; payload: string }
  | { type: 'SET_TEMPLATES'; payload: EmailTemplate[] }
  | { type: 'ADD_TEMPLATE'; payload: EmailTemplate }
  | { type: 'UPDATE_TEMPLATE'; payload: EmailTemplate }
  | { type: 'DELETE_TEMPLATE'; payload: string }
  | { type: 'SET_GLOBAL_VARIABLES'; payload: GlobalVariable[] }
  | { type: 'ADD_GLOBAL_VARIABLE'; payload: GlobalVariable }
  | { type: 'UPDATE_GLOBAL_VARIABLE'; payload: GlobalVariable }
  | { type: 'DELETE_GLOBAL_VARIABLE'; payload: string }
  | { type: 'SET_BUILDING_VARIABLES'; payload: BuildingVariable[] }
  | { type: 'ADD_BUILDING_VARIABLE'; payload: BuildingVariable }
  | { type: 'UPDATE_BUILDING_VARIABLE'; payload: BuildingVariable }
  | { type: 'DELETE_BUILDING_VARIABLE'; payload: string }
  | { type: 'SET_OBSERVERS'; payload: Observer[] }
  | { type: 'ADD_OBSERVER'; payload: Observer }
  | { type: 'UPDATE_OBSERVER'; payload: Observer }
  | { type: 'DELETE_OBSERVER'; payload: string };

const initialState: AppState = {
  selectedBuilding: null,
  buildings: [],
  members: [],
  votes: [],
  templates: [],
  globalVariables: [],
  buildingVariables: [],
  observers: [],
  loading: false,
  error: null
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SELECT_BUILDING':
      return { ...state, selectedBuilding: action.payload };
    
    case 'SET_BUILDINGS':
      return { ...state, buildings: action.payload };
    
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
    
    case 'SET_MEMBERS':
      return { ...state, members: action.payload };
    
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
    
    case 'SET_VOTES':
      return { ...state, votes: action.payload };
    
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
    
    case 'SET_TEMPLATES':
      return { ...state, templates: action.payload };
    
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
    
    case 'SET_GLOBAL_VARIABLES':
      return { ...state, globalVariables: action.payload };
    
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
    
    case 'SET_BUILDING_VARIABLES':
      return { ...state, buildingVariables: action.payload };
    
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
    
    case 'SET_OBSERVERS':
      return { ...state, observers: action.payload };
    
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
    
    default:
      return state;
  }
};

interface AppContextValue extends AppState {
  dispatch: React.Dispatch<AppAction>;
  // Building methods
  selectBuilding: (building: Building) => Promise<void>;
  addBuilding: (building: Omit<Building, 'id'>) => Promise<void>;
  updateBuilding: (building: Building) => Promise<void>;
  deleteBuilding: (id: string) => Promise<void>;
  
  // Member methods
  addMember: (member: Omit<Member, 'id'>) => Promise<void>;
  updateMember: (member: Member) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  importMembers: (members: Omit<Member, 'id'>[]) => Promise<void>;
  
  // Vote methods
  addVote: (vote: Omit<Vote, 'id'>) => Promise<void>;
  updateVote: (vote: Vote) => Promise<void>;
  deleteVote: (id: string) => Promise<void>;
  startVote: (id: string) => Promise<void>;
  castVote: (voteId: string, memberId: string, answers: Record<string, 'yes' | 'no' | 'abstain'>, attachments?: string[], note?: string, isManual?: boolean) => Promise<void>;
  setRepresentative: (voteId: string, memberId: string, representativeId: string | undefined) => Promise<void>;
  
  // Template methods
  addTemplate: (template: Omit<EmailTemplate, 'id'>) => Promise<void>;
  updateTemplate: (template: EmailTemplate) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  
  // Global variable methods
  addGlobalVariable: (variable: GlobalVariable) => Promise<void>;
  updateGlobalVariable: (variable: GlobalVariable) => Promise<void>;
  deleteGlobalVariable: (name: string) => Promise<void>;
  
  // Building variable methods
  addBuildingVariable: (variable: BuildingVariable) => Promise<void>;
  updateBuildingVariable: (variable: BuildingVariable) => Promise<void>;
  deleteBuildingVariable: (name: string) => Promise<void>;
  
  // Observer methods
  addObserver: (observer: Omit<Observer, 'id'>) => Promise<void>;
  updateObserver: (observer: Observer) => Promise<void>;
  deleteObserver: (id: string) => Promise<void>;
  addVoteObserver: (voteId: string, observerId: string) => Promise<void>;
  removeVoteObserver: (voteId: string, observerId: string) => Promise<void>;
  
  // Data loading methods
  loadBuildings: () => Promise<void>;
  loadMembers: () => Promise<void>;
  loadVotes: () => Promise<void>;
  loadTemplates: () => Promise<void>;
  loadGlobalVariables: () => Promise<void>;
  loadBuildingVariables: () => Promise<void>;
  loadObservers: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const SupabaseAppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { showToast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const handleError = (error: Error | unknown, action: string) => {
    console.error(`Error ${action}:`, error);
    const message = error instanceof Error ? error.message : `Chyba při ${action}`;
    dispatch({ type: 'SET_ERROR', payload: message });
    showToast(message, 'error');
  };

  // Data loading methods
  const loadBuildings = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const buildings = await buildingService.getAll();
      dispatch({ type: 'SET_BUILDINGS', payload: buildings });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      handleError(error, 'načítání budov');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadMembers = async () => {
    try {
      const members = await memberService.getAll();
      dispatch({ type: 'SET_MEMBERS', payload: members });
    } catch (error) {
      handleError(error, 'načítání členů');
    }
  };

  const loadVotes = async () => {
    try {
      const votes = await voteService.getAll();
      dispatch({ type: 'SET_VOTES', payload: votes });
    } catch (error) {
      handleError(error, 'načítání hlasování');
    }
  };

  const loadTemplates = async () => {
    try {
      const templates = await templateService.getAll();
      dispatch({ type: 'SET_TEMPLATES', payload: templates });
    } catch (error) {
      handleError(error, 'načítání šablon');
    }
  };

  const loadGlobalVariables = async () => {
    try {
      const variables = await globalVariableService.getAll();
      dispatch({ type: 'SET_GLOBAL_VARIABLES', payload: variables });
    } catch (error) {
      handleError(error, 'načítání globálních proměnných');
    }
  };

  const loadBuildingVariables = async () => {
    try {
      const variables = await buildingVariableService.getAll();
      dispatch({ type: 'SET_BUILDING_VARIABLES', payload: variables });
    } catch (error) {
      handleError(error, 'načítání proměnných budov');
    }
  };

  const loadObservers = async () => {
    try {
      const observers = await observerService.getAll();
      dispatch({ type: 'SET_OBSERVERS', payload: observers });
    } catch (error) {
      handleError(error, 'načítání pozorovatelů');
    }
  };

  // Building methods
  const selectBuilding = async (building: Building) => {
    dispatch({ type: 'SELECT_BUILDING', payload: building });
    // Load building-specific data
    try {
      const members = await memberService.getByBuildingId(building.id);
      const votes = await voteService.getByBuildingId(building.id);
      const observers = await observerService.getByBuildingId(building.id);
      
      dispatch({ type: 'SET_MEMBERS', payload: members });
      dispatch({ type: 'SET_VOTES', payload: votes });
      dispatch({ type: 'SET_OBSERVERS', payload: observers });
    } catch (error) {
      handleError(error, 'načítání dat budovy');
    }
  };

  const addBuilding = async (building: Omit<Building, 'id'>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newBuilding = await buildingService.create(building);
      dispatch({ type: 'ADD_BUILDING', payload: newBuilding });
      showToast('Budova byla vytvořena', 'success');
    } catch (error) {
      handleError(error, 'vytváření budovy');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateBuilding = async (building: Building) => {
    try {
      const updatedBuilding = await buildingService.update(building);
      dispatch({ type: 'UPDATE_BUILDING', payload: updatedBuilding });
      showToast('Budova byla aktualizována', 'success');
    } catch (error) {
      handleError(error, 'aktualizaci budovy');
    }
  };

  const deleteBuilding = async (id: string) => {
    try {
      await buildingService.delete(id);
      dispatch({ type: 'DELETE_BUILDING', payload: id });
      showToast('Budova byla smazána', 'success');
    } catch (error) {
      handleError(error, 'mazání budovy');
    }
  };

  // Member methods
  const addMember = async (member: Omit<Member, 'id'>) => {
    try {
      const newMember = await memberService.create(member);
      dispatch({ type: 'ADD_MEMBER', payload: newMember });
      showToast('Člen byl přidán', 'success');
    } catch (error) {
      handleError(error, 'přidávání člena');
    }
  };

  const updateMember = async (member: Member) => {
    try {
      const updatedMember = await memberService.update(member);
      dispatch({ type: 'UPDATE_MEMBER', payload: updatedMember });
      showToast('Člen byl aktualizován', 'success');
    } catch (error) {
      handleError(error, 'aktualizaci člena');
    }
  };

  const deleteMember = async (id: string) => {
    try {
      await memberService.delete(id);
      dispatch({ type: 'DELETE_MEMBER', payload: id });
      showToast('Člen byl smazán', 'success');
    } catch (error) {
      handleError(error, 'mazání člena');
    }
  };

  const importMembers = async (members: Omit<Member, 'id'>[]) => {
    try {
      const newMembers = await memberService.importMembers(members);
      // Replace existing members for the current building
      const currentMembers = state.members.filter(m => m.buildingId !== state.selectedBuilding?.id);
      dispatch({ type: 'SET_MEMBERS', payload: [...currentMembers, ...newMembers] });
      showToast(`Importováno ${newMembers.length} členů`, 'success');
    } catch (error) {
      handleError(error, 'importu členů');
    }
  };

  // Vote methods
  const addVote = async (vote: Omit<Vote, 'id'>) => {
    try {
      const newVote = await voteService.create(vote);
      dispatch({ type: 'ADD_VOTE', payload: newVote });
      showToast('Hlasování bylo vytvořeno', 'success');
    } catch (error) {
      handleError(error, 'vytváření hlasování');
    }
  };

  const updateVote = async (vote: Vote) => {
    try {
      const updatedVote = await voteService.update(vote);
      dispatch({ type: 'UPDATE_VOTE', payload: updatedVote });
      showToast('Hlasování bylo aktualizováno', 'success');
    } catch (error) {
      handleError(error, 'aktualizaci hlasování');
    }
  };

  const deleteVote = async (id: string) => {
    try {
      await voteService.delete(id);
      dispatch({ type: 'DELETE_VOTE', payload: id });
      showToast('Hlasování bylo smazáno', 'success');
    } catch (error) {
      handleError(error, 'mazání hlasování');
    }
  };

  const startVote = async (id: string) => {
    try {
      const vote = state.votes.find(v => v.id === id);
      if (vote) {
        const updatedVote = { ...vote, status: 'active' as const, startDate: new Date().toISOString() };
        await updateVote(updatedVote);
      }
    } catch (error) {
      handleError(error, 'zahájení hlasování');
    }
  };

  const castVote = async (voteId: string, memberId: string, answers: Record<string, 'yes' | 'no' | 'abstain'>, attachments?: string[], note?: string, isManual?: boolean) => {
    try {
      await voteService.castVote(voteId, memberId, answers, attachments, note);
      
      // Update local state
      const vote = state.votes.find(v => v.id === voteId);
      if (vote) {
        const updatedVote = {
          ...vote,
          memberVotes: {
            ...vote.memberVotes,
            [memberId]: answers
          },
          ...(isManual && attachments && {
            manualVoteAttachments: {
              ...vote.manualVoteAttachments,
              [memberId]: attachments
            }
          }),
          ...(isManual && note && {
            manualVoteNotes: {
              ...vote.manualVoteNotes,
              [memberId]: note
            }
          })
        };
        dispatch({ type: 'UPDATE_VOTE', payload: updatedVote });
      }
      
      showToast('Hlas byl zaznamenán', 'success');
    } catch (error) {
      handleError(error, 'zaznamenání hlasu');
    }
  };

  const setRepresentative = async (voteId: string, memberId: string, representativeId: string | undefined) => {
    try {
      const vote = state.votes.find(v => v.id === voteId);
      if (vote) {
        const updatedVote = {
          ...vote,
          memberRepresentatives: {
            ...vote.memberRepresentatives,
            [memberId]: representativeId || ''
          }
        };
        await updateVote(updatedVote);
      }
    } catch (error) {
      handleError(error, 'nastavení zástupce');
    }
  };

  // Template methods
  const addTemplate = async (template: Omit<EmailTemplate, 'id'>) => {
    try {
      const newTemplate = await templateService.create(template);
      dispatch({ type: 'ADD_TEMPLATE', payload: newTemplate });
      showToast('Šablona byla vytvořena', 'success');
    } catch (error) {
      handleError(error, 'vytváření šablony');
    }
  };

  const updateTemplate = async (template: EmailTemplate) => {
    try {
      const updatedTemplate = await templateService.update(template);
      dispatch({ type: 'UPDATE_TEMPLATE', payload: updatedTemplate });
      showToast('Šablona byla aktualizována', 'success');
    } catch (error) {
      handleError(error, 'aktualizaci šablony');
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      await templateService.delete(id);
      dispatch({ type: 'DELETE_TEMPLATE', payload: id });
      showToast('Šablona byla smazána', 'success');
    } catch (error) {
      handleError(error, 'mazání šablony');
    }
  };

  // Global variable methods
  const addGlobalVariable = async (variable: GlobalVariable) => {
    try {
      const newVariable = await globalVariableService.create(variable);
      dispatch({ type: 'ADD_GLOBAL_VARIABLE', payload: newVariable });
      showToast('Globální proměnná byla přidána', 'success');
    } catch (error) {
      handleError(error, 'přidávání globální proměnné');
    }
  };

  const updateGlobalVariable = async (variable: GlobalVariable) => {
    try {
      const updatedVariable = await globalVariableService.update(variable);
      dispatch({ type: 'UPDATE_GLOBAL_VARIABLE', payload: updatedVariable });
      showToast('Globální proměnná byla aktualizována', 'success');
    } catch (error) {
      handleError(error, 'aktualizaci globální proměnné');
    }
  };

  const deleteGlobalVariable = async (name: string) => {
    try {
      await globalVariableService.delete(name);
      dispatch({ type: 'DELETE_GLOBAL_VARIABLE', payload: name });
      showToast('Globální proměnná byla smazána', 'success');
    } catch (error) {
      handleError(error, 'mazání globální proměnné');
    }
  };

  // Building variable methods
  const addBuildingVariable = async (variable: BuildingVariable) => {
    try {
      const newVariable = await buildingVariableService.create(variable);
      dispatch({ type: 'ADD_BUILDING_VARIABLE', payload: newVariable });
      showToast('Proměnná budovy byla přidána', 'success');
    } catch (error) {
      handleError(error, 'přidávání proměnné budovy');
    }
  };

  const updateBuildingVariable = async (variable: BuildingVariable) => {
    try {
      const updatedVariable = await buildingVariableService.update(variable);
      dispatch({ type: 'UPDATE_BUILDING_VARIABLE', payload: updatedVariable });
      showToast('Proměnná budovy byla aktualizována', 'success');
    } catch (error) {
      handleError(error, 'aktualizaci proměnné budovy');
    }
  };

  const deleteBuildingVariable = async (name: string) => {
    try {
      await buildingVariableService.delete(name);
      dispatch({ type: 'DELETE_BUILDING_VARIABLE', payload: name });
      showToast('Proměnná budovy byla smazána', 'success');
    } catch (error) {
      handleError(error, 'mazání proměnné budovy');
    }
  };

  // Observer methods
  const addObserver = async (observer: Omit<Observer, 'id'>) => {
    try {
      const newObserver = await observerService.create(observer);
      dispatch({ type: 'ADD_OBSERVER', payload: newObserver });
      showToast('Pozorovatel byl přidán', 'success');
    } catch (error) {
      handleError(error, 'přidávání pozorovatele');
    }
  };

  const updateObserver = async (observer: Observer) => {
    try {
      const updatedObserver = await observerService.update(observer);
      dispatch({ type: 'UPDATE_OBSERVER', payload: updatedObserver });
      showToast('Pozorovatel byl aktualizován', 'success');
    } catch (error) {
      handleError(error, 'aktualizaci pozorovatele');
    }
  };

  const deleteObserver = async (id: string) => {
    try {
      await observerService.delete(id);
      dispatch({ type: 'DELETE_OBSERVER', payload: id });
      showToast('Pozorovatel byl smazán', 'success');
    } catch (error) {
      handleError(error, 'mazání pozorovatele');
    }
  };

  const addVoteObserver = async (voteId: string, observerId: string) => {
    try {
      const vote = state.votes.find(v => v.id === voteId);
      if (vote) {
        const updatedVote = {
          ...vote,
          observers: [...(vote.observers || []), observerId]
        };
        await updateVote(updatedVote);
      }
    } catch (error) {
      handleError(error, 'přidávání pozorovatele k hlasování');
    }
  };

  const removeVoteObserver = async (voteId: string, observerId: string) => {
    try {
      const vote = state.votes.find(v => v.id === voteId);
      if (vote) {
        const updatedVote = {
          ...vote,
          observers: (vote.observers || []).filter(id => id !== observerId)
        };
        await updateVote(updatedVote);
      }
    } catch (error) {
      handleError(error, 'odebírání pozorovatele z hlasování');
    }
  };

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      // počkej na auth a teprve pak načti data
      if (authLoading) return;
      if (!isAuthenticated) return;

      await initializeAuth();
      await Promise.all([
        loadBuildings(),
        loadTemplates(),
        loadGlobalVariables(),
        loadBuildingVariables()
      ]);
    };

    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading]);

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
    removeVoteObserver,
    loadBuildings,
    loadMembers,
    loadVotes,
    loadTemplates,
    loadGlobalVariables,
    loadBuildingVariables,
    loadObservers
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext };
