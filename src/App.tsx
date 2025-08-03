import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useApp } from './contexts/AppContextSupabase';
import { BuildingSelector } from './components/BuildingSelector';
import { MainApp } from './components/MainApp';
import { VotingPage } from './components/voting/VotingPage';

function App() {
  const { state } = useApp();

  return (
    <Routes>
      <Route path="/vote/:token" element={<VotingPage />} />
      <Route path="/*" element={
        !state.selectedBuilding ? <BuildingSelector /> : <MainApp />
      } />
    </Routes>
  );
}

export default App;
