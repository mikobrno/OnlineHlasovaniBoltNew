import React from 'react';
import { Calendar, Users, CheckCircle, Play, Eye } from 'lucide-react';
import { Vote } from '../../data/mockData';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { formatDate, getVoteStatusText, getVoteStatusColor } from '../../lib/utils';
import { useApp } from '../../contexts/AppContextCompat';
import { useToast } from '../../contexts/ToastContext';

interface VoteCardProps {
  vote: Vote;
  onClick: () => void;
}

export const VoteCard: React.FC<VoteCardProps> = ({ vote, onClick }) => {
  const { members, startVote, observers } = useApp();
  const { showToast } = useToast();
  const buildingMembers = members.filter(m => m.buildingId === vote.buildingId);
  const votedMembers = Object.keys(vote.memberVotes).length;
  const voteObservers = (vote.observers || []).map(id => 
    observers.find(o => o.id === id)
  ).filter(Boolean);

  const handleStartVote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Opravdu chcete spustit hlasování? Tato akce je nevratná.')) {
      startVote(vote.id);
      showToast('Hlasování bylo spuštěno', 'success');
    }
  };

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
            <span>Vytvořeno {formatDate(vote.createdAt)}</span>
          </div>

          {vote.status === 'active' && vote.endDate && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Končí {formatDate(vote.endDate)}</span>
            </div>
          )}

          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Users className="w-4 h-4 mr-2" />
            <span>{votedMembers} z {buildingMembers.length} hlasovalo</span>
          </div>

          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <CheckCircle className="w-4 h-4 mr-2" />
            <span>{vote.questions.length} otázek</span>
          </div>

          {voteObservers.length > 0 && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Eye className="w-4 h-4 mr-2" />
              <span>{voteObservers.length} pozorovatelů</span>
            </div>
          )}
        </div>

        {vote.status === 'active' && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(votedMembers / buildingMembers.length) * 100}%` }}
            />
          </div>
        )}

        {vote.status === 'draft' && (
          <div className="flex justify-end pt-2 border-t border-gray-200 dark:border-gray-700">
            <Button
              size="sm"
              onClick={handleStartVote}
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
