// src/components/voting/VoteDetailView.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from 'react';
import { ArrowLeft, Edit, Play, FileText, Mail, Eye, BarChart3 } from 'lucide-react';
import { useQuery, gql } from '@apollo/client';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { getVoteStatusText, getVoteStatusColor } from '../../lib/utils';
import { FullPageSpinner } from '../FullPageSpinner';
type Building = {
  id: string;
  name: string;
  address: string;
};

type Attachment = {
  id: string;
  attachment_name: string;
  created_at: string;
  member: {
    name: string;
    unit: string;
  };
};

type DetailVote = {
  id: string;
  title: string;
  description?: string;
  status: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  building?: Building;
  questions?: any;
  manual_vote_attachments: Attachment[];
};

// GraphQL dotaz pro detail hlasování
// POZNÁMKA: `questions` může být v DB uložen jako JSON/jsonb scalar. Nepožadujeme
// subfields v dotazu (to způsobí "unexpected subselection"). Komponenta si pole
// bezpečně rozparsuje níže a bude podporovat různé tvary dat.
const GET_VOTE_DETAILS_QUERY = gql`
  query GetVoteDetailsForView($voteId: uuid!) {
    votes_by_pk(id: $voteId) {
      id
      title
      description
      status
      start_date
      end_date
      created_at
      building_id
      questions
      manual_vote_attachments {
        id
        attachment_name
        created_at
        member {
          name
          unit
        }
      }
    }
  }
`;

interface VoteDetailViewProps {
  voteId: string;
  onBack: () => void;
  onEdit: (vote: DetailVote) => void;
}

export const VoteDetailView: React.FC<VoteDetailViewProps> = ({
  voteId,
  onBack,
  onEdit,
}) => {
  const [activeTab, setActiveTab] = useState('info');

  const { data, loading, error } = useQuery<{ votes_by_pk: DetailVote }>(GET_VOTE_DETAILS_QUERY, {
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
    console.error('GraphQL error:', error);
    
    // Uživatelsky přívětivá zpráva
    const userMessage = error.message.includes('unexpected subselection')
      ? 'Omlouváme se, nastala chyba při načítání detailů hlasování. Náš tým byl informován.'
      : 'Chyba při načítání dat. Zkuste to prosím později.';

    return (
      <Card className="p-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
        <h3 className="text-lg font-medium text-red-700 dark:text-red-300 mb-2">
          Chyba při načítání
        </h3>
        <p className="text-red-600 dark:text-red-400">
          {userMessage}
        </p>
        {import.meta.env.DEV && (
          <pre className="mt-4 p-2 bg-red-100 dark:bg-red-900/40 rounded text-sm overflow-auto">
            {error.message}
          </pre>
        )}
      </Card>
    );
  }

  const vote = data?.votes_by_pk;

  if (!vote) {
    return <div>Hlasování nebylo nalezeno.</div>;
  }
  
  // Přemapování dat pro kompatibilitu
  const legacyVote = {
    ...vote,
    buildingId: vote.building?.id,
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
                Hlasovací otázky
              </h3>
              <div className="space-y-4">
                {(() => {
                  const raw: unknown = data?.votes_by_pk?.questions;
                  let parsed: unknown[] = [];
                  if (Array.isArray(raw)) {
                    parsed = raw as unknown[];
                  } else if (typeof raw === 'string') {
                    try {
                      parsed = JSON.parse(raw as string) as unknown[];
                    } catch (e) {
                      parsed = [];
                    }
                  } else if (raw == null) {
                    parsed = [];
                  } else {
                    // fallback - try to coerce to array
                    parsed = Array.isArray((raw as any).questions) ? (raw as any).questions : [];
                  }

                  if (parsed.length === 0) {
                    return <p className="text-gray-500">Žádné otázky nejsou k dispozici</p>;
                  }

                  return (parsed as unknown[]).map((question, index: number) => {
                    const q = question as any;
                    return (
                      <div key={q?.id || index} className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          {index + 1}. {q?.text || q?.title || q?.question_text}
                        </h4>
                        {q?.type && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Typ: {q.type}
                          </p>
                        )}
                      </div>
                    );
                  });
                })()}
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
