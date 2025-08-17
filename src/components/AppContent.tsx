import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { MainApp } from './MainApp';
import { SimplePublicVotingPage } from '../modules/votes/components/SimplePublicVotingPage';
import type { Building } from '../graphql/buildings';
import { GET_BUILDINGS } from '../graphql/buildings';
import { useQuery } from '@apollo/client';

interface AppContentProps {
  selectedBuilding?: Building;
  onDeselectBuilding?: () => void;
}

export const AppContent: React.FC<AppContentProps> = ({ selectedBuilding, onDeselectBuilding }) => {
  const shouldFetch = !selectedBuilding;
  const { data, loading, error } = useQuery(GET_BUILDINGS, { skip: !shouldFetch });

  const effectiveBuilding: Building | undefined = selectedBuilding || data?.buildings?.[0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppHeader selectedBuilding={effectiveBuilding} onDeselectBuilding={onDeselectBuilding} />
      <Routes>
  <Route path="/vote/:token" element={<SimplePublicVotingPage />} />
        <Route
          path="/*"
          element={
            loading && !effectiveBuilding ? (
              <div className="p-8 text-gray-600 dark:text-gray-300">Načítám budovy...</div>
            ) : error ? (
              <div className="p-8 text-red-600">Chyba načítání budov: {error.message}</div>
            ) : !effectiveBuilding ? (
              <div className="p-8 text-gray-600 dark:text-gray-300">Žádné budovy nejsou k dispozici.</div>
            ) : (
              <MainApp selectedBuilding={effectiveBuilding} />
            )
          }
        />
      </Routes>
    </div>
  );
};
