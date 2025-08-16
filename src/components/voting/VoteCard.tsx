import React from 'react';
import { Calendar, Users, CheckCircle, Play, Eye } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { formatDate, getVoteStatusText, getVoteStatusColor } from '../../lib/utils';
import { useMutation, gql } from '@apollo/client';
import { useToast } from '../../contexts/ToastContext';
import { Vote } from './VotesListView';

// GraphQL mutace pro spuštění hlasování
const START_VOTE_MUTATION = gql`
  mutation StartVoteFromCard($id: uuid!) {
    update_votes_by_pk(
      pk_columns: { id: $id }
      _set: { 
        status: "active",
        start_date: "now()"
      }
    ) {
      id
      status
      start_date
    }
  }
`;

interface VoteCardProps {
  vote: Vote;
  onClick: () => void;
  totalMembers: number;
}

export const VoteCard: React.FC<VoteCardProps> = ({ vote, onClick, totalMembers }) => {
  const { showToast } = useToast();
  const votedMembers = vote && vote.member_votes
    ? Object.keys(vote.member_votes || {}).length
    : 0;

  // Mutace pro spuštění hlasování
  const [startVoteMutation] = useMutation(START_VOTE_MUTATION, {
    refetchQueries: ['GetVotes']
  });

  const handleStartVote = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (!e) return;
    e.stopPropagation();
    if (window.confirm('Opravdu chcete spustit hlasování? Tato akce je nevratná.')) {
      startVoteMutation({
        variables: { id: vote.id }
      }).then(() => {
        showToast('Hlasování bylo spuštěno', 'success');
      }).catch((error) => {
        showToast(`Nepodařilo se spustit hlasování: ${error.message}`, 'error');
      });
    }
  };

  // Počet hlasujících členů = počet členů s hlasy v member_votes
  const progressWidth = totalMembers > 0 
    ? `${(votedMembers / totalMembers) * 100}%`
    : '0%';

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <div className="flex items-start justify-between cursor-pointer" onClick={onClick}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
            {vote.title}
          </h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVoteStatusColor(vote.status)}`}>
            {getVoteStatusText(vote.status)}
          </span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 cursor-pointer" onClick={onClick}>
          {vote.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Vytvořeno {formatDate(vote.created_at)}</span>
          </div>

          {vote.status === 'active' && vote.end_date && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Končí {formatDate(vote.end_date)}</span>
            </div>
          )}

          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Users className="w-4 h-4 mr-2" />
            <span>{votedMembers} z {totalMembers} hlasovalo</span>
          </div>

          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <CheckCircle className="w-4 h-4 mr-2" />
            <span>{(vote.questions ? vote.questions.length : 0)} otázek</span>
          </div>

          {vote.observers_aggregate?.aggregate?.count > 0 && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Eye className="w-4 h-4 mr-2" />
              <span>{vote.observers_aggregate.aggregate.count} pozorovatelů</span>
            </div>
          )}
        </div>

        {vote.status === 'active' && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            {/* inline width style kvůli dynamické šířce progress baru */}
            {/* eslint-disable-next-line react/forbid-dom-props */}
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: progressWidth }}
            />
          </div>
        )}

        {vote.status === 'draft' && (
          <div className="flex justify-end pt-2 border-t border-gray-200 dark:border-gray-700">
            <Button
              size="sm"
              onClick={(e) => handleStartVote(e)}
              className="flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Spustit hlasování</span>
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
