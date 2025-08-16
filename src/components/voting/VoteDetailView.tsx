// src/components/voting/VoteDetailView.tsx

import React, { useState } from 'react';
import { ArrowLeft, Edit, Play, FileText, Mail, Eye, BarChart3 } from 'lucide-react';
import { useQuery, gql } from '@apollo/client';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { getVoteStatusText, getVoteStatusColor } from '../../lib/utils';
import { FullPageSpinner } from '../FullPageSpinner';
import type { Vote, Question } from '../../types'; // Importujeme z nového centrálního typu

// Import GraphQL fragment
import { VOTE_DETAIL_FIELDS } from '../../graphql/fragments';

// Komplexní GraphQL dotaz, který načte VŠE potřebné pro detail hlasování
const GET_VOTE_DETAILS_QUERY = gql`
  query GetVoteDetailsForView($voteId: uuid!) {
    vote: votes_by_pk(id: $voteId) {
      ...VoteDetailFields
    }
  }
  ${VOTE_DETAIL_FIELDS}
`;

interface VoteDetailViewProps {
  voteId: string;
  onBack: () => void;
  onEdit: (vote: Vote) => void;
}

export const VoteDetailView: React.FC<VoteDetailViewProps> = ({
  voteId,
  onBack,
  onEdit,
}) => {
  const [activeTab, setActiveTab] = useState('info');

  const { data, loading, error } = useQuery(GET_VOTE_DETAILS_QUERY, {
    variables: { voteId },
  });

  // TODO: Implementovat mutaci pro spuštění hlasování
  const handleStartVote = () => {
    alert('Funkce pro spuštění hlasování bude brzy implementována.');
  };

  if (loading) {
    return <FullPageSpinner message="Načítám detail hlasování..." />;
  }
  if (error) {
    return <div>Chyba při načítání dat: {error.message}</div>;
  }

  const vote: Vote | null = data?.vote;

  if (!vote) {
    return <div>Hlasování nebylo nalezeno.</div>;
  }
  
  // Dočasné přemapování dat pro staré komponenty, které budeme dále upravovat
  const legacyVote = {
    ...vote,
    buildingId: vote.building_id,
    createdAt: vote.created_at,
    startDate: vote.start_date,
    memberVotes: {}, 
  };

  type TabId = 'info' | 'members' | 'observers' | 'progress' | 'results';
  interface TabDef { id: TabId; label: string; icon: React.ReactNode; }
  const baseTabs: TabDef[] = [
    { id: 'info', label: 'Informace', icon: <FileText className="w-4 h-4" /> },
    { id: 'members', label: 'Správa členů', icon: <Mail className="w-4 h-4" /> },
    { id: 'observers', label: 'Pozorovatelé', icon: <Eye className="w-4 h-4" /> },
  ];
  const tabs: TabDef[] = [
    ...baseTabs,
    ...(vote.status === 'active' ? [{ id: 'progress', label: 'Průběh', icon: <BarChart3 className="w-4 h-4" /> } as TabDef] : []),
    ...(vote.status === 'completed' ? [{ id: 'results', label: 'Výsledky', icon: <BarChart3 className="w-4 h-4" /> } as TabDef] : [])
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      // Zde budou později komponenty pro záložky, zatím zobrazíme informaci
      case 'members':
        return <Card className="p-6"><p>Záložka "Správa členů" bude brzy funkční.</p></Card>;
      case 'observers':
        return <Card className="p-6"><p>Záložka "Pozorovatelé" bude brzy funkční.</p></Card>;
      case 'progress':
        return <Card className="p-6"><p>Záložka "Průběh" bude brzy funkční.</p></Card>;
      case 'results':
        return <Card className="p-6"><p>Záložka "Výsledky" bude brzy funkční.</p></Card>;
      default:
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {vote.title}
                  </h2>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVoteStatusColor(vote.status)}`}>
                    {getVoteStatusText(vote.status)}
                  </span>
                </div>
                <div className="flex space-x-2">
                  {vote.status === 'draft' && (
                    <Button onClick={handleStartVote} size="sm">
                      <Play className="w-4 h-4 mr-2" />
                      Spustit hlasování
                    </Button>
                  )}
                  <Button onClick={() => onEdit(legacyVote)} size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Upravit
                  </Button>
                </div>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {vote.description}
                </p>
              </div>
            </Card>

            {vote.manual_vote_attachments && vote.manual_vote_attachments.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Přílohy ({vote.manual_vote_attachments.length})
                </h3>
                <div className="space-y-4">
                  {vote.manual_vote_attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {attachment.attachment_name}
                        </div>
                        {attachment.member && (
                          <div className="text-xs text-gray-500">
                            Nahrál(a): {attachment.member.name} (jednotka {attachment.member.unit})
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(attachment.created_at).toLocaleDateString('cs-CZ')}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Hlasovací otázky ({vote.questions.length})
              </h3>
              <div className="space-y-4">
                {vote.questions.map((question: Question, index: number) => (
                  <div key={question.id} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {index + 1}. {question.text}
                    </h4>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zpět na přehled
        </Button>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {renderTabContent()}
    </div>
  );
};
