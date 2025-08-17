// src/modules/votes/components/VotesModule.tsx
import { FC } from 'react';
import { VoteProvider } from '../context/VoteContext';
import { VotesListView } from './VotesListView';
import { VoteDetailView } from './VoteDetailView';
import { useVoteContext } from '../context/VoteContext';

export const VotesContent: FC<{ buildingId: string }> = ({ buildingId }) => {
  const { selectedVote, setSelectedVote } = useVoteContext();

  return selectedVote ? (
    <VoteDetailView
      voteId={selectedVote.id}
      onBack={() => setSelectedVote(null)}
    />
  ) : (
    <VotesListView buildingId={buildingId} />
  );
};

export const VotesModule: FC<{ buildingId: string }> = ({ buildingId }) => {
  return (
    <VoteProvider>
      <VotesContent buildingId={buildingId} />
    </VoteProvider>
  );
};
