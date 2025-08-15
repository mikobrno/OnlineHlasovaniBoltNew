import { createContext } from 'react';
import { Building, Member, Vote, EmailTemplate, GlobalVariable, BuildingVariable, Observer } from '../data/mockData';

export interface AppState {
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

// Rozšířený typ pro kompatibilitu se starým kódem, který destrukturuje vlastnosti přímo
export interface AppContextType extends AppState {
  state: AppState; // ponecháno pro nové použití
  selectBuilding: (building: Building) => void;
  castVote: (voteId: string, memberId: string, answers: Record<string, 'yes' | 'no' | 'abstain'>) => void;
  // Placeholdery pro staré API – zatím no-op, aby se aplikace zkompilovala
  loadBuildings?: () => Promise<void> | void;
  importMembers?: (members: any[]) => Promise<void> | void; // TODO: přesný typ
  addMember?: (member: any) => Promise<void> | void;
  updateMember?: (member: any) => Promise<void> | void;
  deleteMember?: (id: string) => Promise<void> | void;
  addGlobalVariable?: (variable: any) => Promise<void> | void;
  updateGlobalVariable?: (variable: any) => Promise<void> | void;
  deleteGlobalVariable?: (name: string) => Promise<void> | void;
  addTemplate?: (template: any) => Promise<void> | void;
  updateTemplate?: (template: any) => Promise<void> | void;
  deleteTemplate?: (id: string) => Promise<void> | void;
  addBuildingVariable?: (variable: any) => Promise<void> | void;
  updateBuildingVariable?: (variable: any) => Promise<void> | void;
  deleteBuildingVariable?: (name: string) => Promise<void> | void;
  setRepresentative?: (memberId: string, representativeId: string | null) => Promise<void> | void;
  addObserver?: (observer: unknown) => Promise<void> | void;
  deleteObserver?: (id: string) => Promise<void> | void;
  addVoteObserver?: (voteId: string, observerId: string) => Promise<void> | void;
  removeVoteObserver?: (voteId: string, observerId: string) => Promise<void> | void;
  addBuilding?: (buildingData: { name: string; address: string; totalUnits: number }) => Promise<Building> | void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
