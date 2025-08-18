// src/components/voting/VotesListView.tsx

import React, { useState, useMemo } from 'react';
import { Plus, Search, Vote as VoteIcon, Clock, Users, CheckCircle } from 'lucide-react';
import { useQuery } from '@apollo/client';
import { useApp } from '@/contexts';
import { Input, Card } from '@/components/common';
import { VoteCard } from './VoteCard';
import { VoteDetailView } from './VoteDetailView';
import { VoteFormView } from './';
import { FullPageSpinner } from '../../../components/FullPageSpinner';
import type { Vote } from '../types';
import { GET_VOTES_QUERY } from './queries';

export const VotesListView: React.FC = () => {
  const { selectedBuilding } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingVote, setEditingVote] = useState<Vote | null>(null);
  const [selectedVote, setSelectedVote] = useState<Vote | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data, loading, error } = useQuery(GET_VOTES_QUERY, {
    variables: { buildingId: selectedBuilding?.id },
    skip: !selectedBuilding,
  });

  const filteredVotes = useMemo(() => {
    if (!data?.votes) return [];
    return data.votes.filter((vote: Vote) =>
      vote.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data?.votes, searchTerm]);

  if (!selectedBuilding) {
    return <div>Vyberte budovu pro zobrazení hlasování.</div>;
  }
  
  if (loading) {
    return <FullPageSpinner message="Načítám hlasování..." />;
  }

  if (error) {
    return <div>Chyba při načítání hlasování: {error.message}</div>;
  }
  
  if (selectedVote) {
    return (
      <VoteDetailView
        vote={selectedVote}
        onBack={() => setSelectedVote(null)}
        onEdit={() => {
          // set editing vote, clear selectedVote so the form view is shown, then open form
          setEditingVote(selectedVote);
          setSelectedVote(null);
          setShowForm(true);
        }}
      />
    );
  }

  if (showForm) {
    return (
      <VoteFormView
        vote={editingVote}
        onBack={() => {
          setShowForm(false);
          setEditingVote(null);
        }}
        buildingId={selectedBuilding.id}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Přehled hlasování</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Spravujte hlasování pro budovu {selectedBuilding.name}
          </p>
        </div>
        <button
          onClick={() => { setEditingVote(null); setShowForm(true); }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nové hlasování
        </button>
      </div>

      <Card className="p-6">
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

      {/* Quick stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <VoteIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Celkem hlasování</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{data?.votes?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Aktivních</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{data?.votes?.filter((v: Vote) => v.status === 'active').length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Připravených</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{data?.votes?.filter((v: Vote) => v.status === 'draft').length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Dokončených</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{data?.votes?.filter((v: Vote) => v.status === 'completed').length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {filteredVotes.length === 0 ? (
        <Card className="p-12 text-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <div className="mx-auto w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
            <VoteIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {searchTerm ? 'Žádné hlasování nenalezeno' : 'Zatím žádná hlasování'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            {searchTerm 
              ? 'Zkuste změnit vyhledávací kritéria nebo vymazat filtr.'
              : 'Vytvořte své první hlasování pro vlastníky jednotek.'
            }
          </p>
          <button
            onClick={() => { setEditingVote(null); setShowForm(true); }}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Vytvořit první hlasování
          </button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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

export { GET_VOTES_QUERY };