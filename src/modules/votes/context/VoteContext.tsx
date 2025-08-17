// src/modules/votes/context/VoteContext.tsx
import { createContext, useContext, FC, ReactNode, useState } from 'react';
import { Vote } from '../types';

interface VoteContextValue {
  selectedVote: Vote | null;
  setSelectedVote: (vote: Vote | null) => void;
  isVoteFormOpen: boolean;
  openVoteForm: () => void;
  closeVoteForm: () => void;
  editingVote: Vote | null;
  setEditingVote: (vote: Vote | null) => void;
}

const VoteContext = createContext<VoteContextValue | undefined>(undefined);

export const VoteProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedVote, setSelectedVote] = useState<Vote | null>(null);
  const [isVoteFormOpen, setIsVoteFormOpen] = useState(false);
  const [editingVote, setEditingVote] = useState<Vote | null>(null);

  const openVoteForm = () => setIsVoteFormOpen(true);
  const closeVoteForm = () => {
    setIsVoteFormOpen(false);
    setEditingVote(null);
  };

  const value = {
    selectedVote,
    setSelectedVote,
    isVoteFormOpen,
    openVoteForm,
    closeVoteForm,
    editingVote,
    setEditingVote,
  };

  return (
    <VoteContext.Provider value={value}>
      {children}
    </VoteContext.Provider>
  );
};

export const useVoteContext = () => {
  const context = useContext(VoteContext);
  if (context === undefined) {
    throw new Error('useVoteContext must be used within VoteProvider');
  }
  return context;
};
