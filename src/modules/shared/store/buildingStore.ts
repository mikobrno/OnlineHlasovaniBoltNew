import { create } from 'zustand';
import type { Building } from '../types/building';

interface BuildingStore {
  selectedBuilding: Building | null;
  setSelectedBuilding: (building: Building | null) => void;
}

export const useBuildingStore = create<BuildingStore>((set) => ({
  selectedBuilding: null,
  setSelectedBuilding: (building) => set({ selectedBuilding: building }),
}));
