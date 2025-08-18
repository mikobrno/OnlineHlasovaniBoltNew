import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { MainApp } from './MainApp';
import { SimplePublicVotingPage } from '../modules/votes/components/SimplePublicVotingPage';
import type { Building } from '../graphql/buildings';

interface AppContentProps {
  selectedBuilding: Building;
  onDeselectBuilding?: () => void;
}

export const AppContent: React.FC<AppContentProps> = ({ selectedBuilding, onDeselectBuilding }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppHeader selectedBuilding={selectedBuilding} onDeselectBuilding={onDeselectBuilding} />
      <Routes>
        <Route path="/vote/:token" element={<SimplePublicVotingPage />} />
        <Route path="/*" element={<MainApp selectedBuilding={selectedBuilding} />} />
      </Routes>
    </div>
  );
};
