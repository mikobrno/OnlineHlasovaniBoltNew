// KOMPLETNÍ AppContext s rozšířenou funkcionalitą
// Zachovává všechny původní funkce + přidává nové pokročilé funkce

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { completeDatabaseService } from '../lib/completeDatabaseService';
import type { 
  ExtendedBuilding, 
  ExtendedMember, 
  ExtendedVote, 
  ExtendedQuestion,
  VoteDelegation,
  Notification,
  VoteAnalytics,
  Report,
  ProxyVote,
  Attachment,
  CreateVoteData,
  CreateDelegationData,
  CastVoteData,
  VoteFilters,
  MemberFilters,
  NotificationFilters
} from '../types/extended';

// ========================================
// STATE INTERFACE 
// ========================================

interface AppState {
  // Základní data (původní)
  selectedBuilding: ExtendedBuilding | null;
  buildings: ExtendedBuilding[];
  members: ExtendedMember[];
  votes: ExtendedVote[];
  questions: ExtendedQuestion[];
  templates: Record<string, unknown>[];
  globalVariables: Record<string, unknown>[];
  buildingVariables: Record<string, unknown>[];
  observers: Record<string, unknown>[];
  
  // Nová rozšířená data
  delegations: VoteDelegation[];
  notifications: Notification[];
  analytics: Record<string, VoteAnalytics>;
  reports: Report[];
  proxyVotes: ProxyVote[];
  attachments: Attachment[];
  
  // UI stavy
  loading: boolean;
  error: string | null;
  
  // Pokročilé filtry
  voteFilters: VoteFilters;
  memberFilters: MemberFilters;
  notificationFilters: NotificationFilters;
  
  // Uživatelské nastavení
  userPreferences: {
    theme: 'light' | 'dark';
    language: 'cs' | 'en';
    notifications_enabled: boolean;
    auto_refresh: boolean;
  };
}

// ========================================
// ACTIONS
// ========================================

type AppAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  
  // Základní akce (původní)
  | { type: 'SET_SELECTED_BUILDING'; payload: ExtendedBuilding | null }
  | { type: 'SET_BUILDINGS'; payload: ExtendedBuilding[] }
  | { type: 'ADD_BUILDING'; payload: ExtendedBuilding }
  | { type: 'UPDATE_BUILDING'; payload: ExtendedBuilding }
  | { type: 'DELETE_BUILDING'; payload: string }
  
  | { type: 'SET_MEMBERS'; payload: ExtendedMember[] }
  | { type: 'ADD_MEMBER'; payload: ExtendedMember }
  | { type: 'UPDATE_MEMBER'; payload: ExtendedMember }
  | { type: 'DELETE_MEMBER'; payload: string }
  
  | { type: 'SET_VOTES'; payload: ExtendedVote[] }
  | { type: 'ADD_VOTE'; payload: ExtendedVote }
  | { type: 'UPDATE_VOTE'; payload: ExtendedVote }
  | { type: 'DELETE_VOTE'; payload: string }
  
  | { type: 'SET_QUESTIONS'; payload: ExtendedQuestion[] }
  | { type: 'ADD_QUESTION'; payload: ExtendedQuestion }
  | { type: 'UPDATE_QUESTION'; payload: ExtendedQuestion }
  | { type: 'DELETE_QUESTION'; payload: string }
  
  // Nové rozšířené akce
  | { type: 'SET_DELEGATIONS'; payload: VoteDelegation[] }
  | { type: 'ADD_DELEGATION'; payload: VoteDelegation }
  | { type: 'REVOKE_DELEGATION'; payload: string }
  
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  
  | { type: 'SET_ANALYTICS'; payload: { voteId: string; analytics: VoteAnalytics } }
  | { type: 'SET_REPORTS'; payload: Report[] }
  | { type: 'ADD_REPORT'; payload: Report }
  
  | { type: 'SET_PROXY_VOTES'; payload: ProxyVote[] }
  | { type: 'ADD_PROXY_VOTE'; payload: ProxyVote }
  
  | { type: 'SET_ATTACHMENTS'; payload: Attachment[] }
  | { type: 'ADD_ATTACHMENT'; payload: Attachment }
  
  // Template a variable akce (původní)
  | { type: 'SET_TEMPLATES'; payload: Record<string, unknown>[] }
  | { type: 'ADD_TEMPLATE'; payload: Record<string, unknown> }
  | { type: 'UPDATE_TEMPLATE'; payload: Record<string, unknown> }
  | { type: 'DELETE_TEMPLATE'; payload: string }
  
  | { type: 'SET_GLOBAL_VARIABLES'; payload: Record<string, unknown>[] }
  | { type: 'ADD_GLOBAL_VARIABLE'; payload: Record<string, unknown> }
  | { type: 'UPDATE_GLOBAL_VARIABLE'; payload: Record<string, unknown> }
  | { type: 'DELETE_GLOBAL_VARIABLE'; payload: string }
  
  | { type: 'SET_BUILDING_VARIABLES'; payload: Record<string, unknown>[] }
  | { type: 'ADD_BUILDING_VARIABLE'; payload: Record<string, unknown> }
  | { type: 'UPDATE_BUILDING_VARIABLE'; payload: Record<string, unknown> }
  | { type: 'DELETE_BUILDING_VARIABLE'; payload: string }
  
  | { type: 'SET_OBSERVERS'; payload: Record<string, unknown>[] }
  | { type: 'ADD_OBSERVER'; payload: Record<string, unknown> }
  | { type: 'DELETE_OBSERVER'; payload: string }
  
  // Filter akce
  | { type: 'SET_VOTE_FILTERS'; payload: VoteFilters }
  | { type: 'SET_MEMBER_FILTERS'; payload: MemberFilters }
  | { type: 'SET_NOTIFICATION_FILTERS'; payload: NotificationFilters }
  
  // User preferences
  | { type: 'SET_USER_PREFERENCES'; payload: Partial<AppState['userPreferences']> };

// ========================================
// REDUCER
// ========================================

const initialState: AppState = {
  selectedBuilding: null,
  buildings: [],
  members: [],
  votes: [],
  questions: [],
  templates: [],
  globalVariables: [],
  buildingVariables: [],
  observers: [],
  delegations: [],
  notifications: [],
  analytics: {},
  reports: [],
  proxyVotes: [],
  attachments: [],
  loading: false,
  error: null,
  voteFilters: {},
  memberFilters: {},
  notificationFilters: {},
  userPreferences: {
    theme: 'light',
    language: 'cs',
    notifications_enabled: true,
    auto_refresh: true
  }
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
      
    // Building actions
    case 'SET_SELECTED_BUILDING':
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
      
    // Member actions
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
      
    // Vote actions
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
      
    // Question actions
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload };
      
    case 'ADD_QUESTION':
      return { ...state, questions: [...state.questions, action.payload] };
      
    case 'UPDATE_QUESTION':
      return {
        ...state,
        questions: state.questions.map(q => q.id === action.payload.id ? action.payload : q)
      };
      
    case 'DELETE_QUESTION':
      return {
        ...state,
        questions: state.questions.filter(q => q.id !== action.payload)
      };
      
    // Delegation actions
    case 'SET_DELEGATIONS':
      return { ...state, delegations: action.payload };
      
    case 'ADD_DELEGATION':
      return { ...state, delegations: [...state.delegations, action.payload] };
      
    case 'REVOKE_DELEGATION':
      return {
        ...state,
        delegations: state.delegations.map(d => 
          d.id === action.payload ? { ...d, is_active: false } : d
        )
      };
      
    // Notification actions
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
      
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
      
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => 
          n.id === action.payload ? { ...n, is_read: true } : n
        )
      };
      
    // Analytics actions
    case 'SET_ANALYTICS':
      return {
        ...state,
        analytics: { ...state.analytics, [action.payload.voteId]: action.payload.analytics }
      };
      
    // Report actions
    case 'SET_REPORTS':
      return { ...state, reports: action.payload };
      
    case 'ADD_REPORT':
      return { ...state, reports: [...state.reports, action.payload] };
      
    // Proxy vote actions
    case 'SET_PROXY_VOTES':
      return { ...state, proxyVotes: action.payload };
      
    case 'ADD_PROXY_VOTE':
      return { ...state, proxyVotes: [...state.proxyVotes, action.payload] };
      
    // Attachment actions
    case 'SET_ATTACHMENTS':
      return { ...state, attachments: action.payload };
      
    case 'ADD_ATTACHMENT':
      return { ...state, attachments: [...state.attachments, action.payload] };
      
    // Template actions (původní)
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
      
    // Global variable actions (původní)
    case 'SET_GLOBAL_VARIABLES':
      return { ...state, globalVariables: action.payload };
      
    case 'ADD_GLOBAL_VARIABLE':
      return { ...state, globalVariables: [...state.globalVariables, action.payload] };
      
    case 'UPDATE_GLOBAL_VARIABLE':
      return {
        ...state,
        globalVariables: state.globalVariables.map(v => v.name === action.payload.name ? action.payload : v)
      };
      
    case 'DELETE_GLOBAL_VARIABLE':
      return {
        ...state,
        globalVariables: state.globalVariables.filter(v => v.name !== action.payload)
      };
      
    // Building variable actions (původní)
    case 'SET_BUILDING_VARIABLES':
      return { ...state, buildingVariables: action.payload };
      
    case 'ADD_BUILDING_VARIABLE':
      return { ...state, buildingVariables: [...state.buildingVariables, action.payload] };
      
    case 'UPDATE_BUILDING_VARIABLE':
      return {
        ...state,
        buildingVariables: state.buildingVariables.map(v => v.name === action.payload.name ? action.payload : v)
      };
      
    case 'DELETE_BUILDING_VARIABLE':
      return {
        ...state,
        buildingVariables: state.buildingVariables.filter(v => v.name !== action.payload)
      };
      
    // Observer actions (původní)
    case 'SET_OBSERVERS':
      return { ...state, observers: action.payload };
      
    case 'ADD_OBSERVER':
      return { ...state, observers: [...state.observers, action.payload] };
      
    case 'DELETE_OBSERVER':
      return {
        ...state,
        observers: state.observers.filter(o => o.id !== action.payload)
      };
      
    // Filter actions
    case 'SET_VOTE_FILTERS':
      return { ...state, voteFilters: action.payload };
      
    case 'SET_MEMBER_FILTERS':
      return { ...state, memberFilters: action.payload };
      
    case 'SET_NOTIFICATION_FILTERS':
      return { ...state, notificationFilters: action.payload };
      
    // User preferences
    case 'SET_USER_PREFERENCES':
      return {
        ...state,
        userPreferences: { ...state.userPreferences, ...action.payload }
      };
      
    default:
      return state;
  }
}

// ========================================
// CONTEXT INTERFACE
// ========================================

export interface AppContextType {
  // State
  state: AppState;
  
  // Základní akce (původní API zachováno)
  selectBuilding: (building: ExtendedBuilding | null) => void;
  addBuilding: (building: Omit<ExtendedBuilding, 'id' | 'created_at' | 'updated_at'>) => Promise<ExtendedBuilding>;
  updateBuilding: (id: string, updates: Partial<ExtendedBuilding>) => Promise<ExtendedBuilding>;
  deleteBuilding: (id: string) => Promise<void>;
  
  addMember: (member: Omit<ExtendedMember, 'id' | 'created_at' | 'updated_at'>) => Promise<ExtendedMember>;
  updateMember: (id: string, updates: Partial<ExtendedMember>) => Promise<ExtendedMember>;
  deleteMember: (id: string) => Promise<void>;
  importMembers: (buildingId: string, members: Omit<ExtendedMember, 'id' | 'building_id' | 'created_at' | 'updated_at'>[]) => Promise<ExtendedMember[]>;
  
  addVote: (voteData: CreateVoteData) => Promise<ExtendedVote>;
  updateVote: (id: string, updates: Partial<ExtendedVote>) => Promise<ExtendedVote>;
  deleteVote: (id: string) => Promise<void>;
  startVote: (id: string) => Promise<ExtendedVote>;
  castVote: (voteData: CastVoteData) => Promise<void>;
  
  // Nové pokročilé akce
  createDelegation: (delegationData: CreateDelegationData) => Promise<VoteDelegation>;
  revokeDelegation: (delegationId: string) => Promise<void>;
  
  createNotification: (notification: Omit<Notification, 'id' | 'created_at'>) => Promise<Notification>;
  markNotificationAsRead: (id: string) => Promise<void>;
  
  generateReport: (voteId: string, reportType: Report['report_type'], format: Report['format']) => Promise<Report>;
  getVoteAnalytics: (voteId: string) => Promise<VoteAnalytics>;
  
  createProxyVote: (proxy: Omit<ProxyVote, 'id' | 'created_at'>) => Promise<ProxyVote>;
  uploadAttachment: (attachment: Omit<Attachment, 'id' | 'created_at'>) => Promise<Attachment>;
  
  // Původní template a variable akce
  addTemplate: (template: Record<string, unknown>) => Promise<Record<string, unknown>>;
  updateTemplate: (id: string, template: Record<string, unknown>) => Promise<Record<string, unknown>>;
  deleteTemplate: (id: string) => Promise<void>;
  
  addGlobalVariable: (variable: Record<string, unknown>) => Promise<Record<string, unknown>>;
  updateGlobalVariable: (name: string, variable: Record<string, unknown>) => Promise<Record<string, unknown>>;
  deleteGlobalVariable: (name: string) => Promise<void>;
  
  addBuildingVariable: (variable: Record<string, unknown>) => Promise<Record<string, unknown>>;
  updateBuildingVariable: (name: string, variable: Record<string, unknown>) => Promise<Record<string, unknown>>;
  deleteBuildingVariable: (name: string) => Promise<void>;
  
  addObserver: (observer: Record<string, unknown>) => Promise<Record<string, unknown>>;
  deleteObserver: (id: string) => Promise<void>;
  
  // Filter a preference akce
  setVoteFilters: (filters: VoteFilters) => void;
  setMemberFilters: (filters: MemberFilters) => void;
  setNotificationFilters: (filters: NotificationFilters) => void;
  setUserPreferences: (preferences: Partial<AppState['userPreferences']>) => void;
  
  // Utility akce
  refreshData: () => Promise<void>;
  loadBuildingData: (buildingId: string) => Promise<void>;
  
  // Původní vlastnosti pro zpětnou kompatibilitu
  selectedBuilding: ExtendedBuilding | null;
  buildings: ExtendedBuilding[];
  members: ExtendedMember[];
  votes: ExtendedVote[];
  templates: Record<string, unknown>[];
  globalVariables: Record<string, unknown>[];
  buildingVariables: Record<string, unknown>[];
  observers: Record<string, unknown>[];
  loading: boolean;
  error: string | null;
  
  // Reprezentativní hlasování (původní)
  setRepresentative: (memberId: string, representativeId: string | null) => Promise<void>;
}

// ========================================
// CONTEXT IMPLEMENTATION
// ========================================

const AppContext = createContext<AppContextType | undefined>(undefined);

export function CompleteAppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // ========================================
  // ZÁKLADNÍ AKCE (Původní API zachováno)
  // ========================================

  const selectBuilding = (building: ExtendedBuilding | null) => {
    dispatch({ type: 'SET_SELECTED_BUILDING', payload: building });
    if (building) {
      loadBuildingData(building.id);
    }
  };

  const addBuilding = async (buildingData: Omit<ExtendedBuilding, 'id' | 'created_at' | 'updated_at'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const building = await completeDatabaseService.createBuilding(buildingData);
      dispatch({ type: 'ADD_BUILDING', payload: building });
      return building;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateBuilding = async (id: string, updates: Partial<ExtendedBuilding>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const building = await completeDatabaseService.updateBuilding(id, updates);
      dispatch({ type: 'UPDATE_BUILDING', payload: building });
      return building;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteBuilding = async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await completeDatabaseService.deleteBuilding(id);
      dispatch({ type: 'DELETE_BUILDING', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addMember = async (memberData: Omit<ExtendedMember, 'id' | 'created_at' | 'updated_at'>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const member = await completeDatabaseService.createMember(memberData);
      dispatch({ type: 'ADD_MEMBER', payload: member });
      return member;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateMember = async (id: string, updates: Partial<ExtendedMember>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const member = await completeDatabaseService.updateMember(id, updates);
      dispatch({ type: 'UPDATE_MEMBER', payload: member });
      return member;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteMember = async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await completeDatabaseService.deleteMember(id);
      dispatch({ type: 'DELETE_MEMBER', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const importMembers = async (buildingId: string, members: Omit<ExtendedMember, 'id' | 'building_id' | 'created_at' | 'updated_at'>[]) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const importedMembers = await completeDatabaseService.importMembers(buildingId, members);
      // Znovu načíst všechny členy
      if (state.selectedBuilding?.id === buildingId) {
        const allMembers = await completeDatabaseService.getMembersByBuilding(buildingId);
        dispatch({ type: 'SET_MEMBERS', payload: allMembers });
      }
      return importedMembers;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addVote = async (voteData: CreateVoteData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const vote = await completeDatabaseService.createVote(voteData);
      dispatch({ type: 'ADD_VOTE', payload: vote });
      return vote;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateVote = async (id: string, updates: Partial<ExtendedVote>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const vote = await completeDatabaseService.updateVote(id, updates);
      dispatch({ type: 'UPDATE_VOTE', payload: vote });
      return vote;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteVote = async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await completeDatabaseService.deleteVote(id);
      dispatch({ type: 'DELETE_VOTE', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const startVote = async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const vote = await completeDatabaseService.startVote(id);
      dispatch({ type: 'UPDATE_VOTE', payload: vote });
      return vote;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const castVote = async (voteData: CastVoteData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await completeDatabaseService.castVote(voteData);
      // Refresh vote data
      if (state.selectedBuilding) {
        const votes = await completeDatabaseService.getVotesByBuilding(state.selectedBuilding.id);
        dispatch({ type: 'SET_VOTES', payload: votes });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // ========================================
  // NOVÉ POKROČILÉ AKCE
  // ========================================

  const createDelegation = async (delegationData: CreateDelegationData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const delegation = await completeDatabaseService.createDelegation(delegationData);
      dispatch({ type: 'ADD_DELEGATION', payload: delegation });
      return delegation;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const revokeDelegation = async (delegationId: string) => {
    try {
      await completeDatabaseService.revokeDelegation(delegationId);
      dispatch({ type: 'REVOKE_DELEGATION', payload: delegationId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    }
  };

  const createNotification = async (notificationData: Omit<Notification, 'id' | 'created_at'>) => {
    try {
      const notification = await completeDatabaseService.createNotification(notificationData);
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
      return notification;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    }
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      await completeDatabaseService.markNotificationAsRead(id);
      dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    }
  };

  const generateReport = async (voteId: string, reportType: Report['report_type'], format: Report['format']) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const report = await completeDatabaseService.generateVoteReport(voteId, reportType, format);
      dispatch({ type: 'ADD_REPORT', payload: report });
      return report;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getVoteAnalytics = async (voteId: string) => {
    try {
      const analytics = await completeDatabaseService.getVoteAnalytics(voteId);
      if (analytics) {
        dispatch({ type: 'SET_ANALYTICS', payload: { voteId, analytics } });
      }
      return analytics;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    }
  };

  const createProxyVote = async (proxyData: Omit<ProxyVote, 'id' | 'created_at'>) => {
    try {
      const proxy = await completeDatabaseService.createProxyVote(proxyData);
      dispatch({ type: 'ADD_PROXY_VOTE', payload: proxy });
      return proxy;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    }
  };

  const uploadAttachment = async (attachmentData: Omit<Attachment, 'id' | 'created_at'>) => {
    try {
      const attachment = await completeDatabaseService.createAttachment(attachmentData);
      dispatch({ type: 'ADD_ATTACHMENT', payload: attachment });
      return attachment;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    }
  };

  // ========================================
  // PŮVODNÍ TEMPLATE A VARIABLE AKCE
  // ========================================

  const addTemplate = async (template: Record<string, unknown>) => {
    try {
      const newTemplate = await completeDatabaseService.addTemplate(template);
      dispatch({ type: 'ADD_TEMPLATE', payload: newTemplate });
      return newTemplate;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    }
  };

  const updateTemplate = async (id: string, template: Record<string, unknown>) => {
    try {
      const updatedTemplate = await completeDatabaseService.updateTemplate(id, template);
      dispatch({ type: 'UPDATE_TEMPLATE', payload: updatedTemplate });
      return updatedTemplate;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      await completeDatabaseService.deleteTemplate(id);
      dispatch({ type: 'DELETE_TEMPLATE', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    }
  };

  const addGlobalVariable = async (variable: Record<string, unknown>) => {
    try {
      const newVariable = await completeDatabaseService.addGlobalVariable(variable);
      dispatch({ type: 'ADD_GLOBAL_VARIABLE', payload: newVariable });
      return newVariable;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    }
  };

  const updateGlobalVariable = async (name: string, variable: Record<string, unknown>) => {
    try {
      const updatedVariable = await completeDatabaseService.updateGlobalVariable(name, variable);
      dispatch({ type: 'UPDATE_GLOBAL_VARIABLE', payload: updatedVariable });
      return updatedVariable;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    }
  };

  const deleteGlobalVariable = async (name: string) => {
    try {
      await completeDatabaseService.deleteGlobalVariable(name);
      dispatch({ type: 'DELETE_GLOBAL_VARIABLE', payload: name });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    }
  };

  const addBuildingVariable = async (variable: Record<string, unknown>) => {
    try {
      const newVariable = await completeDatabaseService.addBuildingVariable(variable);
      dispatch({ type: 'ADD_BUILDING_VARIABLE', payload: newVariable });
      return newVariable;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    }
  };

  const updateBuildingVariable = async (name: string, variable: Record<string, unknown>) => {
    try {
      const updatedVariable = await completeDatabaseService.updateBuildingVariable(name, variable);
      dispatch({ type: 'UPDATE_BUILDING_VARIABLE', payload: updatedVariable });
      return updatedVariable;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    }
  };

  const deleteBuildingVariable = async (name: string) => {
    try {
      await completeDatabaseService.deleteBuildingVariable(name);
      dispatch({ type: 'DELETE_BUILDING_VARIABLE', payload: name });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    }
  };

  const addObserver = async (observer: Record<string, unknown>) => {
    try {
      const newObserver = await completeDatabaseService.addObserver(observer);
      dispatch({ type: 'ADD_OBSERVER', payload: newObserver });
      return newObserver;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    }
  };

  const deleteObserver = async (id: string) => {
    try {
      await completeDatabaseService.deleteObserver(id);
      dispatch({ type: 'DELETE_OBSERVER', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    }
  };

  // ========================================
  // FILTER A PREFERENCE AKCE
  // ========================================

  const setVoteFilters = (filters: VoteFilters) => {
    dispatch({ type: 'SET_VOTE_FILTERS', payload: filters });
  };

  const setMemberFilters = (filters: MemberFilters) => {
    dispatch({ type: 'SET_MEMBER_FILTERS', payload: filters });
  };

  const setNotificationFilters = (filters: NotificationFilters) => {
    dispatch({ type: 'SET_NOTIFICATION_FILTERS', payload: filters });
  };

  const setUserPreferences = (preferences: Partial<AppState['userPreferences']>) => {
    dispatch({ type: 'SET_USER_PREFERENCES', payload: preferences });
  };

  // ========================================
  // UTILITY FUNKCE
  // ========================================

  const refreshData = async () => {
    if (state.selectedBuilding) {
      await loadBuildingData(state.selectedBuilding.id);
    }
    
    // Načíst globální data
    try {
      const [buildings, templates, globalVariables, buildingVariables] = await Promise.all([
        completeDatabaseService.getBuildings(),
        completeDatabaseService.getEmailTemplates(),
        completeDatabaseService.getGlobalVariables(),
        completeDatabaseService.getBuildingVariables()
      ]);
      
      dispatch({ type: 'SET_BUILDINGS', payload: buildings });
      dispatch({ type: 'SET_TEMPLATES', payload: templates });
      dispatch({ type: 'SET_GLOBAL_VARIABLES', payload: globalVariables });
      dispatch({ type: 'SET_BUILDING_VARIABLES', payload: buildingVariables });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const loadBuildingData = async (buildingId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const [members, votes, observers, delegations, notifications] = await Promise.all([
        completeDatabaseService.getMembersByBuilding(buildingId),
        completeDatabaseService.getVotesByBuilding(buildingId),
        completeDatabaseService.getObservers(buildingId),
        // Načíst delegace pro aktivní hlasování
        Promise.all(
          state.votes
            .filter(v => v.status === 'active')
            .map(v => completeDatabaseService.getDelegationsByVote(v.id))
        ).then(results => results.flat()),
        // Načíst notifikace pro aktivní uživatele (pokud je známo)
        Promise.resolve([]) // TODO: Implementovat po přihlášení
      ]);
      
      dispatch({ type: 'SET_MEMBERS', payload: members });
      dispatch({ type: 'SET_VOTES', payload: votes });
      dispatch({ type: 'SET_OBSERVERS', payload: observers });
      dispatch({ type: 'SET_DELEGATIONS', payload: delegations });
      dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
      
      // Načíst otázky pro všechna hlasování
      const allQuestions = await Promise.all(
        votes.map(vote => completeDatabaseService.getQuestionsByVote(vote.id))
      );
      
      dispatch({ type: 'SET_QUESTIONS', payload: allQuestions.flat() });
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // ========================================
  // REPREZENTATIVNÍ HLASOVÁNÍ (Původní)
  // ========================================

  const setRepresentative = async (memberId: string, representativeId: string | null) => {
    try {
      await updateMember(memberId, { representative_id: representativeId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      throw error;
    }
  };

  // ========================================
  // EFFECT HOOKS
  // ========================================

  useEffect(() => {
    // Načíst základní data při inicializaci
    const initializeData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const buildings = await completeDatabaseService.getBuildings();
        dispatch({ type: 'SET_BUILDINGS', payload: buildings });
        
        // Načíst globální data
        const [templates, globalVariables, buildingVariables] = await Promise.all([
          completeDatabaseService.getEmailTemplates(),
          completeDatabaseService.getGlobalVariables(),
          completeDatabaseService.getBuildingVariables()
        ]);
        
        dispatch({ type: 'SET_TEMPLATES', payload: templates });
        dispatch({ type: 'SET_GLOBAL_VARIABLES', payload: globalVariables });
        dispatch({ type: 'SET_BUILDING_VARIABLES', payload: buildingVariables });
        
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeData();
  }, []);

  // Auto-refresh aktivních hlasování
  useEffect(() => {
    if (!state.userPreferences.auto_refresh) return;
    
    const interval = setInterval(() => {
      if (state.selectedBuilding && state.votes.some(v => v.status === 'active')) {
        // Tichá aktualizace aktivních hlasování
        completeDatabaseService.getVotesByBuilding(state.selectedBuilding.id, {
          status: ['active']
        }).then(activeVotes => {
          dispatch({ type: 'SET_VOTES', payload: [
            ...state.votes.filter(v => v.status !== 'active'),
            ...activeVotes
          ]});
        });
      }
    }, 30000); // Každých 30 sekund

    return () => clearInterval(interval);
  }, [state.selectedBuilding, state.votes, state.userPreferences.auto_refresh]);

  // ========================================
  // CONTEXT VALUE
  // ========================================

  const contextValue: AppContextType = {
    state,
    
    // Základní akce
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
    
    // Nové pokročilé akce
    createDelegation,
    revokeDelegation,
    createNotification,
    markNotificationAsRead,
    generateReport,
    getVoteAnalytics,
    createProxyVote,
    uploadAttachment,
    
    // Template a variable akce
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
    deleteObserver,
    
    // Filter a preference akce
    setVoteFilters,
    setMemberFilters,
    setNotificationFilters,
    setUserPreferences,
    
    // Utility akce
    refreshData,
    loadBuildingData,
    setRepresentative,
    
    // Původní vlastnosti pro zpětnou kompatibilitu
    selectedBuilding: state.selectedBuilding,
    buildings: state.buildings,
    members: state.members,
    votes: state.votes,
    templates: state.templates,
    globalVariables: state.globalVariables,
    buildingVariables: state.buildingVariables,
    observers: state.observers,
    loading: state.loading,
    error: state.error
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useCompleteApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useCompleteApp must be used within a CompleteAppProvider');
  }
  return context;
}

// Alias pro zpětnou kompatibilitu
export const useApp = useCompleteApp;
export const AppProvider = CompleteAppProvider;
