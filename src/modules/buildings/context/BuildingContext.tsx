// src/modules/buildings/context/BuildingContext.tsx
import { createContext, useContext, FC, ReactNode, useState } from 'react';
import { Building, BuildingFormData } from '../types';

interface BuildingContextValue {
  selectedBuilding: Building | null;
  setSelectedBuilding: (building: Building | null) => void;
  isFormOpen: boolean;
  openForm: () => void;
  closeForm: () => void;
  editingBuilding: Building | null;
  setEditingBuilding: (building: Building | null) => void;
  formData: BuildingFormData;
  setFormData: (data: BuildingFormData) => void;
}

const defaultFormData: BuildingFormData = {
  name: '',
  address: '',
  totalUnits: 1,
  variables: {},
};

const BuildingContext = createContext<BuildingContextValue | undefined>(undefined);

export const BuildingProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [formData, setFormData] = useState<BuildingFormData>(defaultFormData);

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => {
    setIsFormOpen(false);
    setEditingBuilding(null);
    setFormData(defaultFormData);
  };

  const value = {
    selectedBuilding,
    setSelectedBuilding,
    isFormOpen,
    openForm,
    closeForm,
    editingBuilding,
    setEditingBuilding,
    formData,
    setFormData,
  };

  return (
    <BuildingContext.Provider value={value}>
      {children}
    </BuildingContext.Provider>
  );
};

export const useBuildingContext = () => {
  const context = useContext(BuildingContext);
  if (context === undefined) {
    throw new Error('useBuildingContext must be used within BuildingProvider');
  }
  return context;
};
