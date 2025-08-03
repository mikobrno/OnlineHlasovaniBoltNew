// Compatibility layer pro migraci z mock dat na Supabase
// Tento soubor poskytuje stejné API jako starý AppContext ale používá nový

import { useApp as useSupabaseApp } from './AppContextSupabase';

export function useApp() {
  const supabaseApp = useSupabaseApp();
  
  // Mapování na starý API
  return {
    // State properties
    selectedBuilding: supabaseApp.state.selectedBuilding,
    buildings: supabaseApp.state.buildings,
    members: supabaseApp.state.members,
    votes: supabaseApp.state.votes,
    templates: supabaseApp.state.templates,
    globalVariables: supabaseApp.state.globalVariables,
    buildingVariables: supabaseApp.state.buildingVariables,
    observers: supabaseApp.state.observers,
    loading: supabaseApp.state.loading,
    error: supabaseApp.state.error,
    
    // Actions
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
    deleteObserver: supabaseApp.deleteObserver,
  };
}
