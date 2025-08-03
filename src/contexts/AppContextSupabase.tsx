import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { DatabaseService } from '../lib/databaseService';
import type {
  Building,
  Member,
  Vote,
  Question,
  EmailTemplate,
  GlobalVariable,
  Observer
} from '../lib/databaseService';

// Extended types that match the current interface
interface ExtendedVote extends Vote {
  questions: Question[];
  memberVotes: Record<string, Record<string, 'yes' | 'no' | 'abstain'>>;
  memberRepresentatives?: Record<string, string>;
  manualVoteAttachments?: Record<string, string[]>;
  manualVoteNotes?: Record<string, string>;
}

interface ExtendedMember extends Member {
  voteWeight: number;
  representativeId?: string;
  buildingId: string;
}

interface ExtendedBuilding extends Building {
  totalUnits: number;
}

interface BuildingVariable {
  name: string;
  description: string;
  type: 'text' | 'select' | 'number';
  options?: string[];
  required: boolean;
  placeholder?: string;
}

interface AppState {
  selectedBuilding: ExtendedBuilding | null;
  buildings: ExtendedBuilding[];
  members: ExtendedMember[];
  votes: ExtendedVote[];
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
  | { type: 'SET_BUILDINGS'; payload: ExtendedBuilding[] }
  | { type: 'SELECT_BUILDING'; payload: ExtendedBuilding }
  | { type: 'ADD_BUILDING'; payload: ExtendedBuilding }
  | { type: 'UPDATE_BUILDING'; payload: ExtendedBuilding }
  | { type: 'DELETE_BUILDING'; payload: string }
  | { type: 'SET_MEMBERS'; payload: ExtendedMember[] }
  | { type: 'ADD_MEMBER'; payload: ExtendedMember }
  | { type: 'UPDATE_MEMBER'; payload: ExtendedMember }
  | { type: 'DELETE_MEMBER'; payload: string }
  | { type: 'IMPORT_MEMBERS'; payload: ExtendedMember[] }
  | { type: 'SET_VOTES'; payload: ExtendedVote[] }
  | { type: 'ADD_VOTE'; payload: ExtendedVote }
  | { type: 'UPDATE_VOTE'; payload: ExtendedVote }
  | { type: 'DELETE_VOTE'; payload: string }
  | { type: 'START_VOTE'; payload: string }
  | { type: 'CAST_VOTE'; payload: { voteId: string; memberId: string; answers: Record<string, 'yes' | 'no' | 'abstain'>; attachments?: string[]; note?: string; isManual?: boolean } }
  | { type: 'SET_REPRESENTATIVE'; payload: { voteId: string; memberId: string; representativeId: string | undefined } }
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
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_BUILDINGS':
      return { ...state, buildings: action.payload };
    
    case 'SELECT_BUILDING':
      return { ...state, selectedBuilding: action.payload };
    
    case 'ADD_BUILDING':
      return { 
        ...state, 
        buildings: [...state.buildings, action.payload],
        selectedBuilding: action.payload
      };
    
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
    
    case 'IMPORT_MEMBERS':
      return {
        ...state,
        members: [...state.members, ...action.payload]
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
        votes: state.votes.map(v => {
          if (v.id === action.payload.voteId) {
            const updatedVote = { ...v };
            updatedVote.memberVotes = {
              ...updatedVote.memberVotes,
              [action.payload.memberId]: action.payload.answers
            };
            
            if (action.payload.attachments && action.payload.isManual) {
              updatedVote.manualVoteAttachments = {
                ...updatedVote.manualVoteAttachments,
                [action.payload.memberId]: action.payload.attachments
              };
            }
            
            if (action.payload.note && action.payload.isManual) {
              updatedVote.manualVoteNotes = {
                ...updatedVote.manualVoteNotes,
                [action.payload.memberId]: action.payload.note
              };
            }
            
            return updatedVote;
          }
          return v;
        })
      };
    
    case 'SET_REPRESENTATIVE':
      return {
        ...state,
        votes: state.votes.map(v => {
          if (v.id === action.payload.voteId) {
            const updatedVote = { ...v };
            if (!updatedVote.memberRepresentatives) {
              updatedVote.memberRepresentatives = {};
            }
            
            if (action.payload.representativeId) {
              updatedVote.memberRepresentatives[action.payload.memberId] = action.payload.representativeId;
            } else {
              delete updatedVote.memberRepresentatives[action.payload.memberId];
            }
            
            return updatedVote;
          }
          return v;
        })
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
      return { ...state, globalVariables: [...state.globalVariables, action.payload] };
    
    case 'UPDATE_GLOBAL_VARIABLE':
      return {
        ...state,
        globalVariables: state.globalVariables.map(gv => gv.name === action.payload.name ? action.payload : gv)
      };
    
    case 'DELETE_GLOBAL_VARIABLE':
      return {
        ...state,
        globalVariables: state.globalVariables.filter(gv => gv.name !== action.payload)
      };
    
    case 'SET_BUILDING_VARIABLES':
      return { ...state, buildingVariables: action.payload };
    
    case 'ADD_BUILDING_VARIABLE':
      return { ...state, buildingVariables: [...state.buildingVariables, action.payload] };
    
    case 'UPDATE_BUILDING_VARIABLE':
      return {
        ...state,
        buildingVariables: state.buildingVariables.map(bv => bv.name === action.payload.name ? action.payload : bv)
      };
    
    case 'DELETE_BUILDING_VARIABLE':
      return {
        ...state,
        buildingVariables: state.buildingVariables.filter(bv => bv.name !== action.payload)
      };
    
    case 'SET_OBSERVERS':
      return { ...state, observers: action.payload };
    
    case 'ADD_OBSERVER':
      return { ...state, observers: [...state.observers, action.payload] };
    
    case 'DELETE_OBSERVER':
      return {
        ...state,
        observers: state.observers.filter(o => o.id !== action.payload)
      };
    
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  // Building actions
  loadBuildings: () => Promise<void>;
  selectBuilding: (building: ExtendedBuilding) => Promise<void>;
  addBuilding: (building: Omit<ExtendedBuilding, 'id'>) => Promise<void>;
  updateBuilding: (building: ExtendedBuilding) => Promise<void>;
  deleteBuilding: (id: string) => Promise<void>;
  
  // Member actions
  loadMembers: (buildingId: string) => Promise<void>;
  addMember: (member: Omit<ExtendedMember, 'id'>) => Promise<void>;
  updateMember: (member: ExtendedMember) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  importMembers: (members: Omit<ExtendedMember, 'id'>[]) => Promise<void>;
  
  // Vote actions
  loadVotes: (buildingId: string) => Promise<void>;
  addVote: (vote: Omit<ExtendedVote, 'id' | 'questions'> & { questions: Omit<Question, 'id' | 'vote_id'>[] }) => Promise<void>;
  updateVote: (vote: ExtendedVote) => Promise<void>;
  deleteVote: (id: string) => Promise<void>;
  startVote: (id: string) => Promise<void>;
  castVote: (voteId: string, memberId: string, answers: Record<string, 'yes' | 'no' | 'abstain'>, attachments?: string[], note?: string, isManual?: boolean) => void;
  setRepresentative: (voteId: string, memberId: string, representativeId: string | undefined) => void;
  
  // Template actions
  loadTemplates: (buildingId?: string) => Promise<void>;
  addTemplate: (template: Omit<EmailTemplate, 'id'>) => Promise<void>;
  updateTemplate: (template: EmailTemplate) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  
  // Global variable actions
  loadGlobalVariables: () => Promise<void>;
  addGlobalVariable: (variable: Omit<GlobalVariable, 'name'>) => Promise<void>;
  updateGlobalVariable: (variable: GlobalVariable) => Promise<void>;
  deleteGlobalVariable: (name: string) => Promise<void>;
  
  // Building variable actions
  loadBuildingVariables: () => Promise<void>;
  addBuildingVariable: (variable: BuildingVariable) => Promise<void>;
  updateBuildingVariable: (variable: BuildingVariable) => Promise<void>;
  deleteBuildingVariable: (name: string) => Promise<void>;
  
  // Observer actions
  loadObservers: (buildingId: string) => Promise<void>;
  addObserver: (observer: Omit<Observer, 'id' | 'created_at'>) => Promise<void>;
  deleteObserver: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Helper function to handle errors
  const handleError = (error: any) => {
    console.error('Database error:', error);
    dispatch({ type: 'SET_ERROR', payload: error.message || 'An error occurred' });
  };

  // Building actions
  const loadBuildings = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const buildings = await DatabaseService.getBuildings();
      dispatch({ type: 'SET_BUILDINGS', payload: buildings as ExtendedBuilding[] });
    } catch (error) {
      handleError(error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const selectBuilding = async (building: ExtendedBuilding) => {
    dispatch({ type: 'SELECT_BUILDING', payload: building });
    // Load related data
    await Promise.all([
      loadMembers(building.id),
      loadVotes(building.id),
      loadObservers(building.id),
      loadTemplates(building.id)
    ]);
  };

  const addBuilding = async (building: Omit<ExtendedBuilding, 'id'>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newBuilding = await DatabaseService.createBuilding({
        name: building.name,
        address: building.address,
        total_units: building.totalUnits,
        variables: building.variables
      });
      dispatch({ type: 'ADD_BUILDING', payload: newBuilding as ExtendedBuilding });
    } catch (error) {
      handleError(error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateBuilding = async (building: ExtendedBuilding) => {
    try {
      const updatedBuilding = await DatabaseService.updateBuilding(building.id, {
        name: building.name,
        address: building.address,
        total_units: building.totalUnits,
        variables: building.variables
      });
      dispatch({ type: 'UPDATE_BUILDING', payload: updatedBuilding as ExtendedBuilding });
    } catch (error) {
      handleError(error);
    }
  };

  const deleteBuilding = async (id: string) => {
    try {
      await DatabaseService.deleteBuilding(id);
      dispatch({ type: 'DELETE_BUILDING', payload: id });
    } catch (error) {
      handleError(error);
    }
  };

  // Member actions
  const loadMembers = async (buildingId: string) => {
    try {
      const members = await DatabaseService.getMembersByBuilding(buildingId);
      dispatch({ type: 'SET_MEMBERS', payload: members as ExtendedMember[] });
    } catch (error) {
      handleError(error);
    }
  };

  const addMember = async (member: Omit<ExtendedMember, 'id'>) => {
    try {
      const newMember = await DatabaseService.createMember({
        name: member.name,
        email: member.email,
        phone: member.phone,
        unit: member.unit,
        vote_weight: member.voteWeight,
        representative_id: member.representativeId || null,
        building_id: member.buildingId
      });
      dispatch({ type: 'ADD_MEMBER', payload: newMember as ExtendedMember });
    } catch (error) {
      handleError(error);
    }
  };

  const updateMember = async (member: ExtendedMember) => {
    try {
      const updatedMember = await DatabaseService.updateMember(member.id, {
        name: member.name,
        email: member.email,
        phone: member.phone,
        unit: member.unit,
        vote_weight: member.voteWeight,
        representative_id: member.representativeId || null,
        building_id: member.buildingId
      });
      dispatch({ type: 'UPDATE_MEMBER', payload: updatedMember as ExtendedMember });
    } catch (error) {
      handleError(error);
    }
  };

  const deleteMember = async (id: string) => {
    try {
      await DatabaseService.deleteMember(id);
      dispatch({ type: 'DELETE_MEMBER', payload: id });
    } catch (error) {
      handleError(error);
    }
  };

  const importMembers = async (members: Omit<ExtendedMember, 'id'>[]) => {
    try {
      const memberInserts = members.map(member => ({
        name: member.name,
        email: member.email,
        phone: member.phone,
        unit: member.unit,
        vote_weight: member.voteWeight,
        representative_id: member.representativeId || null,
        building_id: member.buildingId
      }));
      const newMembers = await DatabaseService.importMembers(memberInserts);
      dispatch({ type: 'IMPORT_MEMBERS', payload: newMembers as ExtendedMember[] });
    } catch (error) {
      handleError(error);
    }
  };

  // Vote actions
  const loadVotes = async (buildingId: string) => {
    try {
      const votes = await DatabaseService.getVotesByBuilding(buildingId);
      // Load questions for each vote
      const votesWithQuestions = await Promise.all(
        votes.map(async (vote) => {
          const questions = await DatabaseService.getQuestionsByVote(vote.id);
          return {
            ...vote,
            questions,
            memberVotes: {},
            memberRepresentatives: {},
            manualVoteAttachments: {},
            manualVoteNotes: {}
          } as ExtendedVote;
        })
      );
      dispatch({ type: 'SET_VOTES', payload: votesWithQuestions });
    } catch (error) {
      handleError(error);
    }
  };

  const addVote = async (vote: Omit<ExtendedVote, 'id' | 'questions'> & { questions: Omit<Question, 'id' | 'vote_id'>[] }) => {
    try {
      const newVote = await DatabaseService.createVote({
        title: vote.title,
        description: vote.description,
        building_id: vote.building_id,
        status: vote.status,
        start_date: vote.start_date || null,
        end_date: vote.end_date || null,
        attachments: vote.attachments || null,
        observers: vote.observers || null
      });

      // Create questions
      const questionInserts = vote.questions.map(q => ({
        vote_id: newVote.id,
        text: q.text,
        quorum_type: q.quorum_type,
        custom_quorum_numerator: q.custom_quorum_numerator,
        custom_quorum_denominator: q.custom_quorum_denominator
      }));
      const questions = await DatabaseService.createQuestions(questionInserts);

      const extendedVote: ExtendedVote = {
        ...newVote,
        questions,
        memberVotes: {},
        memberRepresentatives: {},
        manualVoteAttachments: {},
        manualVoteNotes: {}
      };

      dispatch({ type: 'ADD_VOTE', payload: extendedVote });
    } catch (error) {
      handleError(error);
    }
  };

  const updateVote = async (vote: ExtendedVote) => {
    try {
      const updatedVote = await DatabaseService.updateVote(vote.id, {
        title: vote.title,
        description: vote.description,
        status: vote.status,
        start_date: vote.start_date || null,
        end_date: vote.end_date || null,
        attachments: vote.attachments || null,
        observers: vote.observers || null
      });

      // Update questions (delete and recreate for simplicity)
      await DatabaseService.deleteQuestionsByVote(vote.id);
      const questionInserts = vote.questions.map(q => ({
        vote_id: vote.id,
        text: q.text,
        quorum_type: q.quorum_type,
        custom_quorum_numerator: q.custom_quorum_numerator,
        custom_quorum_denominator: q.custom_quorum_denominator
      }));
      const questions = await DatabaseService.createQuestions(questionInserts);

      const extendedVote: ExtendedVote = {
        ...updatedVote,
        questions,
        memberVotes: vote.memberVotes,
        memberRepresentatives: vote.memberRepresentatives,
        manualVoteAttachments: vote.manualVoteAttachments,
        manualVoteNotes: vote.manualVoteNotes
      };

      dispatch({ type: 'UPDATE_VOTE', payload: extendedVote });
    } catch (error) {
      handleError(error);
    }
  };

  const deleteVote = async (id: string) => {
    try {
      await DatabaseService.deleteVote(id);
      dispatch({ type: 'DELETE_VOTE', payload: id });
    } catch (error) {
      handleError(error);
    }
  };

  const startVote = async (id: string) => {
    try {
      await DatabaseService.updateVote(id, { 
        status: 'active',
        start_date: new Date().toISOString()
      });
      dispatch({ type: 'START_VOTE', payload: id });
    } catch (error) {
      handleError(error);
    }
  };

  const castVote = (voteId: string, memberId: string, answers: Record<string, 'yes' | 'no' | 'abstain'>, attachments?: string[], note?: string, isManual?: boolean) => {
    dispatch({ 
      type: 'CAST_VOTE', 
      payload: { voteId, memberId, answers, attachments, note, isManual } 
    });
  };

  const setRepresentative = (voteId: string, memberId: string, representativeId: string | undefined) => {
    dispatch({ 
      type: 'SET_REPRESENTATIVE', 
      payload: { voteId, memberId, representativeId } 
    });
  };

  // Template actions
  const loadTemplates = async (buildingId?: string) => {
    try {
      const templates = await DatabaseService.getTemplates(buildingId);
      dispatch({ type: 'SET_TEMPLATES', payload: templates });
    } catch (error) {
      handleError(error);
    }
  };

  const addTemplate = async (template: Omit<EmailTemplate, 'id'>) => {
    try {
      const newTemplate = await DatabaseService.createTemplate(template);
      dispatch({ type: 'ADD_TEMPLATE', payload: newTemplate });
    } catch (error) {
      handleError(error);
    }
  };

  const updateTemplate = async (template: EmailTemplate) => {
    try {
      const updatedTemplate = await DatabaseService.updateTemplate(template.id, template);
      dispatch({ type: 'UPDATE_TEMPLATE', payload: updatedTemplate });
    } catch (error) {
      handleError(error);
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      await DatabaseService.deleteTemplate(id);
      dispatch({ type: 'DELETE_TEMPLATE', payload: id });
    } catch (error) {
      handleError(error);
    }
  };

  // Global variable actions
  const loadGlobalVariables = async () => {
    try {
      const variables = await DatabaseService.getGlobalVariables();
      dispatch({ type: 'SET_GLOBAL_VARIABLES', payload: variables });
    } catch (error) {
      handleError(error);
    }
  };

  const addGlobalVariable = async (variable: Omit<GlobalVariable, 'name'>) => {
    try {
      const newVariable = await DatabaseService.createGlobalVariable(variable as any);
      dispatch({ type: 'ADD_GLOBAL_VARIABLE', payload: newVariable });
    } catch (error) {
      handleError(error);
    }
  };

  const updateGlobalVariable = async (variable: GlobalVariable) => {
    try {
      const updatedVariable = await DatabaseService.updateGlobalVariable(variable.name, variable);
      dispatch({ type: 'UPDATE_GLOBAL_VARIABLE', payload: updatedVariable });
    } catch (error) {
      handleError(error);
    }
  };

  const deleteGlobalVariable = async (name: string) => {
    try {
      await DatabaseService.deleteGlobalVariable(name);
      dispatch({ type: 'DELETE_GLOBAL_VARIABLE', payload: name });
    } catch (error) {
      handleError(error);
    }
  };

  // Building variable actions
  const loadBuildingVariables = async () => {
    try {
      const variables = await DatabaseService.getBuildingVariableDefinitions();
      dispatch({ type: 'SET_BUILDING_VARIABLES', payload: variables as BuildingVariable[] });
    } catch (error) {
      handleError(error);
    }
  };

  const addBuildingVariable = async (variable: BuildingVariable) => {
    // This would need to be implemented in DatabaseService
    dispatch({ type: 'ADD_BUILDING_VARIABLE', payload: variable });
  };

  const updateBuildingVariable = async (variable: BuildingVariable) => {
    // This would need to be implemented in DatabaseService
    dispatch({ type: 'UPDATE_BUILDING_VARIABLE', payload: variable });
  };

  const deleteBuildingVariable = async (name: string) => {
    // This would need to be implemented in DatabaseService
    dispatch({ type: 'DELETE_BUILDING_VARIABLE', payload: name });
  };

  // Observer actions
  const loadObservers = async (buildingId: string) => {
    try {
      const observers = await DatabaseService.getObserversByBuilding(buildingId);
      dispatch({ type: 'SET_OBSERVERS', payload: observers });
    } catch (error) {
      handleError(error);
    }
  };

  const addObserver = async (observer: Omit<Observer, 'id' | 'created_at'>) => {
    try {
      const newObserver = await DatabaseService.createObserver({
        ...observer,
        created_at: new Date().toISOString()
      });
      dispatch({ type: 'ADD_OBSERVER', payload: newObserver });
    } catch (error) {
      handleError(error);
    }
  };

  const deleteObserver = async (id: string) => {
    try {
      await DatabaseService.deleteObserver(id);
      dispatch({ type: 'DELETE_OBSERVER', payload: id });
    } catch (error) {
      handleError(error);
    }
  };

  // Load initial data
  useEffect(() => {
    loadBuildings();
    loadGlobalVariables();
    loadBuildingVariables();
  }, []);

  const contextValue: AppContextType = {
    state,
    loadBuildings,
    selectBuilding,
    addBuilding,
    updateBuilding,
    deleteBuilding,
    loadMembers,
    addMember,
    updateMember,
    deleteMember,
    importMembers,
    loadVotes,
    addVote,
    updateVote,
    deleteVote,
    startVote,
    castVote,
    setRepresentative,
    loadTemplates,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    loadGlobalVariables,
    addGlobalVariable,
    updateGlobalVariable,
    deleteGlobalVariable,
    loadBuildingVariables,
    addBuildingVariable,
    updateBuildingVariable,
    deleteBuildingVariable,
    loadObservers,
    addObserver,
    deleteObserver,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Export types for compatibility
export type {
  ExtendedBuilding as Building,
  ExtendedMember as Member,
  ExtendedVote as Vote,
  Question,
  EmailTemplate,
  GlobalVariable,
  BuildingVariable,
  Observer
};
