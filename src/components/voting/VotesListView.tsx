// src/components/voting/VotesListView.tsx

import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useQuery, gql } from '@apollo/client';
import { useApp } from '../../hooks/useApp'; // Pro selectedBuilding
import { PageHeader } from '../common/PageHeader';
import { Input } from '../common/Input';
import { VoteCard } from './VoteCard';
import { VoteFormView } from './VoteFormView';
import { VoteDetailView } from './VoteDetailView';
import type { Vote } from '../../data/mockData';

// GraphQL dotaz pro načtení hlasování
const GET_VOTES_QUERY = gql`
  query GetVotes($buildingId: uuid!) {
    votes(where: { building_id: { _eq: $buildingId } }, order_by: { created_at: desc }) {
      id
      title
      description
      status
      created_at
      start_date
      end_date
      # Přidej další pole, která potřebuje VoteCard
      questions {
        id
      }
      observers
      member_votes # Potřebujeme pro zjištění počtu hlasujících
    }
  }
`;

export const VotesListView: React.FC = () => {
  const { selectedBuilding } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedVote, setSelectedVote] = useState<Vote | null>(null);
  const [editingVote, setEditingVote] = useState<Vote | null>(null);

  const { data, loading, error } = useQuery(GET_VOTES_QUERY, {
    variables: { buildingId: selectedBuilding?.id },
    skip: !selectedBuilding?.id,
  });

  const buildingVotes: Vote[] = data?.votes || [];

  const filteredVotes = buildingVotes.filter(vote => {
    const matchesSearch =
      vote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vote.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div>Načítám hlasování...</div>;
  if (error) return <div>Chyba: {error.message}</div>;

  if (showForm) {
    return (
      <VoteFormView
        vote={editingVote}
        onBack={() => {
          setShowForm(false);
          setEditingVote(null);
        }}
      />
    );
  }

  if (selectedVote) {
    return (
      <VoteDetailView
        vote={selectedVote}
        onBack={() => setSelectedVote(null)}
        onEdit={(voteToEdit) => {
          setEditingVote(voteToEdit);
          setSelectedVote(null);
          setShowForm(true);
        }}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="Hlasování"
        subtitle={`${filteredVotes.length} hlasování pro ${selectedBuilding?.name}`}
        action={{
          label: 'Nové hlasování',
          onClick: () => setShowForm(true),
          icon: <Plus className="w-4 h-4" />,
        }}
      />

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Input
            placeholder="Hledat hlasování..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        <select
          title="Filtrovat podle stavu"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Všechny stavy</option>
          <option value="draft">Návrh</option>
          <option value="active">Aktivní</option>
          <option value="completed">Ukončeno</option>
          <option value="cancelled">Zrušeno</option>
        </select>
      </div>

      {filteredVotes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            {searchTerm || statusFilter !== 'all'
              ? 'Žádné hlasování nevyhovuje filtru'
              : 'Zatím žádná hlasování'}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVotes.map((vote) => (
            <VoteCard
              key={vote.id}
              vote={vote}
              onClick={() => setSelectedVote(vote)}
            />
          ))}
        </div>
      )}
    </div>
  );
};