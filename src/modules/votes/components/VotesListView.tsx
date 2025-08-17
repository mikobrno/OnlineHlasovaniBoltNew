// src/modules/votes/components/VotesListView.tsx
import { FC, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Plus, Search, Vote } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useVoteContext } from '../context/VoteContext';
import { GET_VOTES } from '../graphql/queries';
import { Vote as VoteType } from '../types';
import { VoteCard } from './VoteCard';
import { getVoteStatusColor, getVoteStatusText } from '@/lib/utils';

interface VotesListViewProps {
  buildingId: string;
}

export const VotesListView: FC<VotesListViewProps> = ({ buildingId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const { data, loading, error } = useQuery(GET_VOTES, {
    variables: { buildingId },
  });

  const { setSelectedVote, openVoteForm } = useVoteContext();

  if (loading) return <div>Načítám...</div>;
  if (error) return <div>Chyba: {error.message}</div>;

  const votes = data?.votes || [];

  const filteredVotes = votes.filter((vote: VoteType) => {
    const matchesSearch = vote.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Vote className="w-6 h-6" />
          Hlasování
        </h1>
        <Button onClick={openVoteForm}>
          <Plus className="w-4 h-4 mr-2" />
          Nové hlasování
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Vyhledat hlasování..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
          >
            <option value="all">Všechny stavy</option>
            <option value="draft">Koncepty</option>
            <option value="active">Aktivní</option>
            <option value="completed">Dokončené</option>
            <option value="cancelled">Zrušené</option>
          </select>
        </div>
      </Card>

      <div className="grid gap-4">
        {filteredVotes.map((vote: VoteType) => (
          <VoteCard
            key={vote.id}
            vote={vote}
            onClick={() => setSelectedVote(vote)}
          />
        ))}

        {filteredVotes.length === 0 && (
          <Card className="p-8 text-center text-gray-500 dark:text-gray-400">
            {searchTerm
              ? 'Nenalezena žádná hlasování odpovídající vašemu vyhledávání'
              : 'Zatím nebyla vytvořena žádná hlasování'}
          </Card>
        )}
      </div>
    </div>
  );
};
