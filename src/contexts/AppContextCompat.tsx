// Compatibility layer pro migraci z mock dat na Supabase
// Tento soubor poskytuje stejné API jako starý AppContext ale používá nový

import { useApp as useMainApp } from './AppContext';

export function useApp() {
  const mainApp = useMainApp();
  
  // Mapování na starý API
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
    loading: false, // mainApp nepoužívá loading state
    error: null,    // mainApp nepoužívá error state
    
    // Actions
    selectBuilding: mainApp.selectBuilding,
    addBuilding: mainApp.addBuilding,
    updateBuilding: mainApp.updateBuilding,
    deleteBuilding: mainApp.deleteBuilding,
    addMember: mainApp.addMember,
    updateMember: mainApp.updateMember,
    deleteMember: mainApp.deleteMember,
    importMembers: mainApp.importMembers,
    addVote: mainApp.addVote,
    updateVote: mainApp.updateVote,
    deleteVote: mainApp.deleteVote,
    startVote: mainApp.startVote,
    castVote: mainApp.castVote,
    setRepresentative: mainApp.setRepresentative,
    addTemplate: mainApp.addTemplate,
    updateTemplate: mainApp.updateTemplate,
    deleteTemplate: mainApp.deleteTemplate,
    addGlobalVariable: mainApp.addGlobalVariable,
    updateGlobalVariable: mainApp.updateGlobalVariable,
    deleteGlobalVariable: mainApp.deleteGlobalVariable,
    addBuildingVariable: mainApp.addBuildingVariable,
    updateBuildingVariable: mainApp.updateBuildingVariable,
    deleteBuildingVariable: mainApp.deleteBuildingVariable,
    addObserver: mainApp.addObserver,
    deleteObserver: mainApp.deleteObserver,
  };
}
