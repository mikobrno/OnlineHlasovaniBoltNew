import React, { useEffect, useState } from 'react';
import { Plu  const filteredVotes = votes.filter((vote: Vote) => {
    const matchesSearch = vote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vote.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Udržuj otevřený detail hlasování v aktuálním stavu
  useEffect(() => {
    if (selectedVote && data?.votes) {
      const updated = data.votes.find((v: Vote) => v.id === selectedVote.id);
      if (updated) {
        setSelectedVote(updated);
      }
    }
  }, [data?.votes, selectedVote]);

  if (loading) return <div>Načítám hlasování...</div>;
  if (error) return <div>Chyba: {error.message}</div>;lucide-react';
import { useQuery, gql } from '@apollo/client';
import { PageHeader } from '../common/PageHeader';
import { Input } from '../common/Input';
import { VoteCard } from './VoteCard';
import { VoteFormView } from './VoteFormView';
import { VoteDetailView } from './VoteDetailView';

// GraphQL dotaz pro načtení hlasování
const GET_VOTES_QUERY = gql`
  query GetVotes($building_id: uuid!) {
    votes(where: { building_id: { _eq: $building_id } }) {
      id
      title
      description
      status
      created_at
      start_date
      end_date
      questions {
        id
      }
      observers
      member_votes
      building_id
    }
  }
`;

import { Question as MockQuestion } from '../../data/mockData';

interface Question extends MockQuestion {
  id: string;
}

// Typ pro hlasování - kompatibilní s existujícím typem
export interface Vote {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  created_at: string;
  start_date?: string;
  end_date?: string;
  questions: Question[];
  observers: string[];
  member_votes: Record<string, Record<string, 'yes' | 'no' | 'abstain'>>;
  building_id: string;
  manualVoteNotes?: Record<string, string>;
}

interface VotesListViewProps {
  selectedBuilding?: {
    id: string;
    name: string;
  };
}

export const VotesListView: React.FC<VotesListViewProps> = ({ selectedBuilding }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedVote, setSelectedVote] = useState<Vote | null>(null);
  const [editingVote, setEditingVote] = useState<Vote | null>(null);

  // Načtení hlasování pomocí GraphQL
  const { data, loading, error, refetch } = useQuery(GET_VOTES_QUERY, {
    variables: { building_id: selectedBuilding?.id },
    skip: !selectedBuilding?.id
  });

  const votes = data?.votes || [];
  
  const filteredVotes = (data?.votes || []).filter((vote: Vote) => {
    const matchesSearch = vote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vote.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Udržuj otevřený detail hlasování v aktuálním stavu
  useEffect(() => {
    if (selectedVote && data?.votes) {
      const updated = data.votes.find((v: Vote) => v.id === selectedVote.id);
      if (updated) {
        setSelectedVote(updated);
      }
    }
  }, [data?.votes, selectedVote]);

  if (loading) return <div>Načítám hlasování...</div>;
  if (error) return <div>Chyba: {error.message}</div>;

  if (showForm) {
    return (
      <VoteFormView
        vote={editingVote ? {
          ...editingVote,
          buildingId: editingVote.building_id,
          createdAt: editingVote.created_at,
          memberVotes: editingVote.member_votes
        } : null}
        onBack={() => {
          setShowForm(false);
          setEditingVote(null);
          refetch();
        }}
      />
    );
  }

  if (selectedVote) {
    return (
      <VoteDetailView
        vote={{
          ...selectedVote,
          buildingId: selectedVote.building_id,
          createdAt: selectedVote.created_at,
          memberVotes: selectedVote.member_votes
        }}
        onBack={() => setSelectedVote(null)}
        onEdit={(vote) => {
          setEditingVote({
            ...vote,
            building_id: vote.buildingId,
            created_at: vote.createdAt,
            member_votes: vote.memberVotes
          });
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
          icon: <Plus className="w-4 h-4" />
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
          aria-label="Filtr stavu hlasování"
          title="Filtrovat podle stavu hlasování"
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
              : 'Zatím žádná hlasování'
            }
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVotes.map((vote: Vote) => (
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
