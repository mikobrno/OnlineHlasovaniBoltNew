// Compatibility layer pro migraci z mock dat na Supabase
// Změňte USE_SUPABASE na true pro aktivaci databáze

import { useApp as useMockApp } from './AppContext';
import { useSupabaseApp } from '../hooks/useSupabaseApp';

// Přepínač pro volbu mezi mock daty a Supabase
const USE_SUPABASE = true; // Aktivováno po vytvoření databáze

export function useApp() {
  if (USE_SUPABASE) {
    // Použít Supabase databázi
    const supabaseApp = useSupabaseApp();
    
    // Mapování na kompatibilní API
    return {
      // State properties
      selectedBuilding: supabaseApp.selectedBuilding,
      buildings: supabaseApp.buildings,
      members: supabaseApp.members,
      votes: supabaseApp.votes,
      templates: supabaseApp.templates,
      globalVariables: supabaseApp.globalVariables,
      buildingVariables: supabaseApp.buildingVariables,
      observers: supabaseApp.observers,
      loading: supabaseApp.loading || false,
      error: supabaseApp.error || null,
      
      // Actions - async verze
      selectBuilding: supabaseApp.selectBuilding,
      addBuilding: supabaseApp.addBuilding,
      updateBuilding: supabaseApp.updateBuilding,
      deleteBuilding: supabaseApp.deleteBuilding,
      addMember: supabaseApp.addMember,
      updateMember: supabaseApp.updateMember,
      deleteMember: supabaseApp.deleteMember,
      importMembers: supabaseApp.importMembers,
      addVote: supabaseApp.addVote,
      updateVote: supabaseApp.updateVote,
      deleteVote: supabaseApp.deleteVote,
      startVote: supabaseApp.startVote,
      castVote: supabaseApp.castVote,
      setRepresentative: supabaseApp.setRepresentative,
      addTemplate: supabaseApp.addTemplate,
      updateTemplate: supabaseApp.updateTemplate,
      deleteTemplate: supabaseApp.deleteTemplate,
      addGlobalVariable: supabaseApp.addGlobalVariable,
      updateGlobalVariable: supabaseApp.updateGlobalVariable,
      deleteGlobalVariable: supabaseApp.deleteGlobalVariable,
      addBuildingVariable: supabaseApp.addBuildingVariable,
      updateBuildingVariable: supabaseApp.updateBuildingVariable,
      deleteBuildingVariable: supabaseApp.deleteBuildingVariable,
      addObserver: supabaseApp.addObserver,
      updateObserver: supabaseApp.updateObserver,
      deleteObserver: supabaseApp.deleteObserver,
      addVoteObserver: supabaseApp.addVoteObserver,
      removeVoteObserver: supabaseApp.removeVoteObserver
    };
  } else {
    // Použít mock data (původní chování)
    const mainApp = useMockApp();
    
    // Mapování na kompatibilní API s async wrappery
    return {
      // State properties
      selectedBuilding: mainApp.selectedBuilding,
      buildings: mainApp.buildings,
      members: mainApp.members,
      votes: mainApp.votes,
      templates: mainApp.templates,
      globalVariables: mainApp.globalVariables,
      buildingVariables: mainApp.buildingVariables,
      observers: mainApp.observers,
      loading: false,
      error: null,
      
      // Actions - wrapped to async for compatibility
      selectBuilding: async (building: any) => mainApp.selectBuilding(building),
      addBuilding: async (building: any) => mainApp.addBuilding(building),
      updateBuilding: async (building: any) => mainApp.updateBuilding(building),
      deleteBuilding: async (id: string) => mainApp.deleteBuilding(id),
      addMember: async (member: any) => mainApp.addMember(member),
      updateMember: async (member: any) => mainApp.updateMember(member),
      deleteMember: async (id: string) => mainApp.deleteMember(id),
      importMembers: async (members: any) => mainApp.importMembers(members),
      addVote: async (vote: any) => mainApp.addVote(vote),
      updateVote: async (vote: any) => mainApp.updateVote(vote),
      deleteVote: async (id: string) => mainApp.deleteVote(id),
      startVote: async (id: string) => mainApp.startVote(id),
      castVote: async (voteId: string, memberId: string, answers: any, attachments?: string[], note?: string, isManual?: boolean) => 
        mainApp.castVote(voteId, memberId, answers, attachments, note, isManual),
      setRepresentative: async (voteId: string, memberId: string, representativeId: string | undefined) =>
        mainApp.setRepresentative(voteId, memberId, representativeId),
      addTemplate: async (template: any) => mainApp.addTemplate(template),
      updateTemplate: async (template: any) => mainApp.updateTemplate(template),
      deleteTemplate: async (id: string) => mainApp.deleteTemplate(id),
      addGlobalVariable: async (variable: any) => mainApp.addGlobalVariable(variable),
      updateGlobalVariable: async (variable: any) => mainApp.updateGlobalVariable(variable),
      deleteGlobalVariable: async (name: string) => mainApp.deleteGlobalVariable(name),
      addBuildingVariable: async (variable: any) => mainApp.addBuildingVariable(variable),
      updateBuildingVariable: async (variable: any) => mainApp.updateBuildingVariable(variable),
      deleteBuildingVariable: async (name: string) => mainApp.deleteBuildingVariable(name),
      addObserver: async (observer: any) => mainApp.addObserver(observer),
      updateObserver: async (observer: any) => mainApp.updateObserver(observer),
      deleteObserver: async (id: string) => mainApp.deleteObserver(id),
      addVoteObserver: async (voteId: string, observerId: string) => mainApp.addVoteObserver(voteId, observerId),
      removeVoteObserver: async (voteId: string, observerId: string) => mainApp.removeVoteObserver(voteId, observerId)
    };
  }
}
