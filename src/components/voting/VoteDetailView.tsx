import React, { useState } from 'react';
import { ArrowLeft, Edit, Mail, FileText, BarChart3, Eye, Play, FileDown } from 'lucide-react';
import { useMutation, useQuery } from '@apollo/client';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { formatDate, getVoteStatusText, getVoteStatusColor } from '../../lib/utils';
import { VotingProgressView } from './VotingProgressView';
import { ResultsView } from './ResultsView';
import { MemberManagementView } from './MemberManagementView';
import { ObserversView } from './ObserversView';
import { BallotTemplateModal } from './BallotTemplateModal';
import { GET_VOTE_DETAILS } from '../../graphql/queries';
import { START_VOTE } from '../../graphql/mutations';
import { Vote, Member } from '../../types';

interface VoteDetailViewProps {
  voteId: string;
  buildingId: string;
  onBack: () => void;
  onEdit: (vote: Vote) => void;
}

export const VoteDetailView: React.FC<VoteDetailViewProps> = ({
  voteId,
  buildingId,
  onBack,
  onEdit
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'info' | 'members' | 'observers' | 'progress' | 'results' | 'attachments'>('info');
  // attachments odstraněny (zatím neimplementováno v DB)
  const [showBallotModal, setShowBallotModal] = useState(false);

  const { data, loading, error } = useQuery(GET_VOTE_DETAILS, {
    variables: { voteId, buildingId },
  });

  const [startVoteMutation] = useMutation(START_VOTE, {
    variables: { id: voteId },
    refetchQueries: [
      { query: GET_VOTE_DETAILS, variables: { voteId, buildingId } }
    ],
    onCompleted: () => {
      showToast('Hlasování bylo úspěšně spuštěno', 'success');
    },
    onError: (error) => {
      showToast(`Chyba při spuštění hlasování: ${error.message}`, 'error');
    }
  });

  if (loading) return <p>Načítání detailu hlasování...</p>;
  if (error) return <p>Chyba: {error.message}</p>;

  // Transformace custom_quorum numer/denom na objekt kvůli staršímu typu Vote
  type RawQuestion = {
    id: string;
    text: string;
    description?: string;
    quorum_type?: string;
    custom_quorum_numerator?: number | null;
    custom_quorum_denominator?: number | null;
  };
  const vote: Vote | undefined = data?.votes_by_pk ? {
    ...data.votes_by_pk,
    questions: (data.votes_by_pk.questions as RawQuestion[]).map((q) => ({
      id: q.id,
      text: q.text,
      description: q.description,
  quorum_type: (q.quorum_type as 'simple' | 'qualified' | 'unanimous' | 'custom' | undefined),
      custom_quorum: (q.custom_quorum_numerator && q.custom_quorum_denominator)
        ? { numerator: q.custom_quorum_numerator, denominator: q.custom_quorum_denominator }
        : undefined
    }))
    // Rekonstrukce staré struktury member_votes: answers { [questionId]: answer }
  ,
    member_votes: data.member_votes_rows ? Object.values(
      (data.member_votes_rows as { member_id: string; question_id: string; answer: 'yes' | 'no' | 'abstain' | null }[]).reduce((acc, row) => {
        if (!acc[row.member_id]) {
          acc[row.member_id] = { member_id: row.member_id, answers: {} as Record<string, 'yes' | 'no' | 'abstain'> };
        }
        if (row.question_id && row.answer) {
          acc[row.member_id].answers[row.question_id] = row.answer;
        }
        return acc;
      }, {} as Record<string, { member_id: string; answers: Record<string, 'yes' | 'no' | 'abstain'> }>)
  ) : [],
  } : undefined;
  const members: Member[] = data?.members || [];
  // attachments nejsou podporovány v aktuálním schématu
  
  if (!vote) return <p>Hlasování nebylo nalezeno.</p>;

  const votedMembersCount = vote.member_votes?.length || 0;
  // attachments nejsou podporovány

  const handleStartVote = async () => {
    if (window.confirm('Opravdu chcete spustit hlasování? Tato akce je nevratná.')) {
      await startVoteMutation();
    }
  };

  // Funkce pro zobrazení příloh odstraněna
  
  const tabs = [
    { id: 'info', label: 'Informace', icon: <FileText className="w-4 h-4" /> },
    { id: 'members', label: 'Členové', icon: <Mail className="w-4 h-4" /> },
    { id: 'observers', label: 'Pozorovatelé', icon: <Eye className="w-4 h-4" /> },
  // attachments tab odstraněn
  ...(vote.status === 'active' ? [{ id: 'progress', label: 'Průběh', icon: <BarChart3 className="w-4 h-4" /> }] : []),
  ...(vote.status === 'completed' ? [{ id: 'results', label: 'Výsledky', icon: <BarChart3 className="w-4 h-4" /> }] : [])
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'members':
        return <MemberManagementView vote={vote} members={members} />;
      case 'observers':
        return <ObserversView vote={vote} buildingId={buildingId} />;
      case 'progress':
        return vote.status === 'active' ? <VotingProgressView vote={vote} members={members} /> : null;
      case 'results':
        return vote.status === 'completed' ? <ResultsView vote={vote} members={members} /> : null;
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
                  <Button onClick={() => setShowBallotModal(true)} size="sm" title="Vytvořit / vytisknout hlasovací listinu">
                    <FileDown className="w-4 h-4 mr-2" />
                    Hlasovací listina
                  </Button>
                  {vote.status === 'draft' && (
                    <Button onClick={handleStartVote} size="sm">
                      <Play className="w-4 h-4 mr-2" />
                      Spustit hlasování
                    </Button>
                  )}
                  <Button onClick={() => onEdit(vote)} size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Upravit
                  </Button>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none mb-6">
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {vote.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Časové údaje
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <div>Vytvořeno: {formatDate(vote.created_at)}</div>
                    {vote.start_date && (
                      <div>Začátek: {formatDate(vote.start_date)}</div>
                    )}
                    {vote.end_date && (
                      <div>Konec: {formatDate(vote.end_date)}</div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Účast
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <div>Hlasovalo: {votedMembersCount} z {members.length} členů</div>
                    <div>Účast: {members.length > 0 ? Math.round((votedMembersCount / members.length) * 100) : 0}%</div>
                    {/* attachments info odstraněno */}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Hlasovací otázky ({vote.questions.length})
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                {vote.questions.map((question, index) => (
                  <li key={question.id} className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">{index + 1}. {question.text}</span>{' '}
                    <span className="italic">
                      ({question.quorum_type === 'simple' && '1/2'}
                      {question.quorum_type === 'qualified' && '2/3'}
                      {question.quorum_type === 'unanimous' && '100%'}
                      {question.quorum_type === 'custom' && question.custom_quorum && `${question.custom_quorum.numerator}/${question.custom_quorum.denominator}`})
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        );
    }
  };

  // attachments view odstraněn

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
              onClick={() => setActiveTab(tab.id as 'info' | 'members' | 'observers' | 'progress' | 'results' | 'attachments')}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {/* attachments badge removed */}
            </button>
          ))}
        </nav>
      </div>

  {renderTabContent()}

  <BallotTemplateModal vote={vote} isOpen={showBallotModal} onClose={() => setShowBallotModal(false)} />
    </div>
  );
};
