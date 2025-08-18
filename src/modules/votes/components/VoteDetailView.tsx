/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { ArrowLeft, Edit, Play, FileText, Mail, Eye, BarChart3, AlertCircle } from 'lucide-react';
import { useQuery, gql } from '@apollo/client';
import { Button, Card } from '@/components/common';
import { ReadOnlyAlert } from '@/components/common/ReadOnlyAlert';
import { getVoteStatusText, getVoteStatusColor } from '@/lib/utils';
import { FullPageSpinner } from '@/components/FullPageSpinner';
import { Vote } from '../types';
import { VoteMembersView } from './VoteMembersView';
import { VoteObserversView } from './VoteObserversView';
import { VoteProgressView } from './VoteProgressView';

// GraphQL dotaz pro detail hlasování
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
  voteId?: string;
  vote?: Vote;
  onBack: () => void;
  onEdit?: () => void;
}

export const VoteDetailView: React.FC<VoteDetailViewProps> = ({
  voteId,
  vote: voteProp,
  onBack,
  onEdit,
}) => {
  const [activeTab, setActiveTab] = useState('info');

  const shouldQuery = !voteProp && !!voteId;
  const { data, loading, error } = useQuery(GET_VOTE_DETAILS_QUERY, {
    variables: { voteId },
    skip: !shouldQuery,
  });

  const handleStartVote = () => {
    alert('Funkce pro spuštění hlasování bude brzy implementována.');
  };

  const handleEdit = () => {
    if (onEdit) {
      try { onEdit(); } catch { /* ignore */ }
    }
  };

  if (loading) {
    return <FullPageSpinner message="Načítám detail hlasování..." />;
  }
  if (error) {
    console.error('GraphQL error:', error);
    
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

  const vote = voteProp || data?.votes_by_pk;

  if (!vote) {
    return <div>Hlasování nebylo nalezeno.</div>;
  }

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
      case 'members':
        return <VoteMembersView voteId={vote.id} buildingId={vote.building_id} />;
      case 'observers':
        return <VoteObserversView vote={vote} />;
      case 'progress':
        return <VoteProgressView voteId={vote.id} />;
      case 'results':
        return <Card className="p-6"><p>Záložka "Výsledky" bude brzy funkční.</p></Card>;
      default:
        return (
          <div className="space-y-6">
            {/* Informační panel o stavu editovatelnosti */}
            {vote.status !== 'draft' && vote.status !== 'scheduled' && (
              <ReadOnlyAlert
                message="Hlasování je v režimu pouze pro čtení"
                description={
                  (vote.status === 'active' && 'Hlasování právě probíhá, změny nejsou možné.') ||
                  (vote.status === 'closed' && 'Hlasování bylo ukončeno, změny nejsou možné.') ||
                  (vote.status === 'cancelled' && 'Hlasování bylo zrušeno, změny nejsou možné.') ||
                  (!['active', 'closed', 'cancelled'].includes(vote.status) && 'Hlasování nelze upravovat v současném stavu.') +
                  ' Můžete si prohlédnout všechny detaily včetně otázek.'
                }
              />
            )}

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
                    <Button onClick={handleStartVote} size="sm" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-green-600 rounded-md hover:bg-green-700 hover:border-green-700 transition-colors duration-200 shadow-sm">
                      <Play className="w-4 h-4 mr-2" />
                      Spustit hlasování
                    </Button>
                  )}
                  
                  {/* Tlačítko upravit - aktivní pouze pokud hlasování není aktivní */}
                  {vote.status === 'draft' || vote.status === 'scheduled' ? (
                    <Button 
                      onClick={handleEdit} 
                      size="sm" 
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 hover:border-blue-700 transition-colors duration-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Upravit hlasování
                    </Button>
                  ) : (
                    <Button 
                      disabled 
                      size="sm" 
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-gray-200 border border-gray-200 rounded-md cursor-not-allowed shadow-sm dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
                      title="Hlasování nelze upravovat během běhu nebo po ukončení"
                    >
                      <Edit className="w-4 h-4 mr-2 opacity-50" />
                      Nelze upravit
                    </Button>
                  )}
                </div>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {vote.description}
                </p>
              </div>
            </Card>

            {(vote as any)?.manual_vote_attachments && (vote as any).manual_vote_attachments.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Přílohy ({(vote as any).manual_vote_attachments.length})
                </h3>
                <div className="space-y-4">
                  {(vote as any).manual_vote_attachments.map((attachment: any) => (
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Hlasovací otázky
                </h3>
                {vote.status !== 'draft' && vote.status !== 'scheduled' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Pouze pro čtení
                  </span>
                )}
              </div>
              <div className="space-y-4">
                {(() => {
                  const raw: unknown = vote?.questions;
                  let parsed: unknown[] = [];
                  if (Array.isArray(raw)) {
                    parsed = raw as unknown[];
                  } else if (typeof raw === 'string') {
                    try {
                      parsed = JSON.parse(raw as string) as unknown[];
                    } catch {
                      parsed = [];
                    }
                  } else if (raw == null) {
                    parsed = [];
                  } else {
                    parsed = Array.isArray((raw as any).questions) ? (raw as any).questions : [];
                  }

                  if (parsed.length === 0) {
                    return <p className="text-gray-500">Žádné otázky nejsou k dispozici</p>;
                  }

                  return (parsed as unknown[]).map((question, index: number) => {
                    const q = question as any;
                    const isReadOnly = vote.status !== 'draft' && vote.status !== 'scheduled';
                    return (
                      <div 
                        key={q?.id || index} 
                        className={`border-l-4 pl-4 p-4 rounded-r-lg transition-colors ${
                          isReadOnly 
                            ? 'border-gray-400 bg-gray-50 dark:bg-gray-700/50 dark:border-gray-500' 
                            : 'border-blue-500 bg-blue-50/30 dark:bg-blue-900/10 dark:border-blue-400'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`font-medium mb-2 ${
                              isReadOnly 
                                ? 'text-gray-700 dark:text-gray-300' 
                                : 'text-gray-900 dark:text-gray-100'
                            }`}>
                              {index + 1}. {q?.text || q?.title || q?.question_text}
                            </h4>
                            {q?.type && (
                              <div className="flex items-center gap-2">
                                <span className={`text-sm px-2 py-1 rounded-md ${
                                  isReadOnly
                                    ? 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-400'
                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                }`}>
                                  Typ: {q.type}
                                </span>
                              </div>
                            )}
                          </div>
                          {isReadOnly && (
                            <div className="ml-4 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Neupravitelné
                            </div>
                          )}
                        </div>
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
