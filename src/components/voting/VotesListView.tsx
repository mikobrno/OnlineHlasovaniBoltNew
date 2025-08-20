import React, { useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import { useQuery, gql } from '@apollo/client';
import { useApp } from '../../contexts/AppContext';
import { PageHeader } from '../common/PageHeader';
import { Input } from '../common/Input';
import { Card } from '../common/Card';
import { VoteCard } from './VoteCard';
import { VoteDetailView } from './VoteDetailView';
import { VoteFormView } from './VoteFormView';
import { FullPageSpinner } from '../FullPageSpinner';
import type { Vote } from '../../types';

const GET_VOTES_QUERY = gql`
  query GetVotes($buildingId: uuid!) {
    votes(where: { building_id: { _eq: $buildingId } }, order_by: { created_at: desc }) {
      id
      title
      status
      created_at
      start_date
      end_date
    }
  }
`;

export const VotesListView: React.FC = () => {
  const { selectedBuilding } = useApp();
  const [view, setView] = useState<'list' | 'form' | 'detail'>('list');
  const [editingVote, setEditingVote] = useState<Vote | null>(null);
  const [selectedVoteId, setSelectedVoteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data, loading, error, refetch } = useQuery(GET_VOTES_QUERY, {
    variables: { buildingId: selectedBuilding?.id },
    skip: !selectedBuilding,
  });

  const votes = useMemo(() => data?.votes || [], [data]);

  const filteredVotes = useMemo(() => {
    if (!votes) return [];
    return votes.filter((vote: Vote) =>
      vote.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [votes, searchTerm]);

  if (!selectedBuilding) {
    return <Card className="p-6 text-center text-gray-500">Vyberte prosím budovu pro zobrazení hlasování.</Card>;
  }
  
  if (loading) {
    return <FullPageSpinner message="Načítám hlasování..." />;
  }

  if (error) {
    return <div className="text-red-500">Chyba při načítání hlasování: {error.message}</div>;
  }
  
  if (view === 'detail' && selectedVoteId) {
    return (
      <VoteDetailView
        voteId={selectedVoteId}
        onBack={() => setView('list')}
        onEdit={(voteToEdit) => {
          setEditingVote(voteToEdit);
          setView('form');
        }}
      />
    );
  }

  if (view === 'form') {
    return (
      <VoteFormView
        vote={editingVote}
        onBack={() => {
          setView('list');
          setEditingVote(null);
          refetch(); // Znovu načteme seznam hlasování
        }}
        buildingId={selectedBuilding.id}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="Přehled hlasování"
        actions={
          <Button onClick={() => { setEditingVote(null); setView('form'); }}>
            <Plus className="w-4 h-4 mr-2" />
            Nové hlasování
          </Button>
        }
      />
      <Card className="p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Hledat hlasování..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVotes.map((vote: Vote) => (
          <VoteCard
            key={vote.id}
            vote={vote}
            onSelect={() => {
              setSelectedVoteId(vote.id);
              setView('detail');
            }}
          />
        ))}
      </div>
      {filteredVotes.length === 0 && (
         <Card className="p-6 text-center text-gray-500">Pro tuto budovu nebyla nalezena žádná hlasování.</Card>
      )}
    </div>
  );
};
