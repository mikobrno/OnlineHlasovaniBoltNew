// src/components/voting/VotesListView.tsx

import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useQuery } from '@apollo/client';
import { PageHeader } from '../common/PageHeader';
import { Input } from '../common/Input';
import { VoteCard } from './VoteCard';
import { VoteFormView } from './VoteFormView';
import { VoteDetailView } from './VoteDetailView';
import { GET_VOTES } from '../../graphql/votes';
import { Vote } from '../../types';

interface VoteWithStats extends Vote { votesCount?: number; vote_statistics?: Record<string, unknown>; }

interface VotesListViewProps {
  buildingId: string;
}

export const VotesListView: React.FC<VotesListViewProps> = ({ buildingId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedVoteId, setSelectedVoteId] = useState<string | null>(null);
  const [editingVote, setEditingVote] = useState<Vote | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_VOTES, {
    variables: { buildingId },
    skip: !buildingId,
  });

  const buildingVotes: Vote[] = data?.votes || [];
  const totalMembers = data?.members_aggregate?.aggregate?.count || 0;

  const filteredVotes = buildingVotes.filter(vote => {
    const voteDescription = vote.description || '';
    const matchesSearch =
      vote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voteDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div>Načítám hlasování...</div>;
  if (error) return <div>Chyba: {error.message}</div>;

  if (showForm) {
    return (
      <VoteFormView
        vote={editingVote}
        buildingId={buildingId}
        onBack={() => {
          setShowForm(false);
          setEditingVote(null);
          refetch();
        }}
      />
    );
  }

  if (selectedVoteId) {
    return (
      <VoteDetailView
        voteId={selectedVoteId}
        onBack={() => setSelectedVoteId(null)}
        onEdit={(voteToEdit) => {
          setEditingVote(voteToEdit);
          setSelectedVoteId(null);
          setShowForm(true);
        }}
      />
    );
  }
  return (
    <div>
      <PageHeader
        title="Hlasování"
        subtitle={`${filteredVotes.length} hlasování`}
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
          {filteredVotes.map((vote: VoteWithStats) => {
            const stats = (vote.vote_statistics as Record<string, unknown>) || {};
            const votesCount = stats.total_votes || stats.count || 0;
            return (
              <VoteCard
                key={vote.id}
                vote={{ ...vote, votesCount }}
                onClick={() => setSelectedVoteId(vote.id)}
                totalMembers={totalMembers}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};