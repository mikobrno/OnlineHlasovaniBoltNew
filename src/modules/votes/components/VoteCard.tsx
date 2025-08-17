// src/modules/votes/components/VoteCard.tsx
import { FC } from 'react';
import { Calendar, Users, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Vote } from '../types';
import { getVoteStatusColor, getVoteStatusText } from '@/lib/utils';
import { formatDate } from '@/lib/date';

interface VoteCardProps {
  vote: Vote;
  onClick: () => void;
}

export const VoteCard: FC<VoteCardProps> = ({ vote, onClick }) => {
  const {
    title,
    status,
    start_date,
    end_date,
    vote_statistics
  } = vote;

  const totalVotes = vote_statistics?.total_votes ?? 0;

  return (
    <Card 
      className="p-6 hover:shadow-xl transition-all duration-200 cursor-pointer border-l-4 border-l-blue-500 hover:border-l-blue-600"
      onClick={onClick}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {title}
            </h3>
            <Badge variant={getVoteStatusColor(status)}>
              {getVoteStatusText(status)}
            </Badge>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>

        <div className="space-y-2">
          {start_date && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>
                {formatDate(start_date)}
                {end_date && ` - ${formatDate(end_date)}`}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4 text-gray-500" />
            <span>{totalVotes} {totalVotes === 1 ? 'hlas' : totalVotes < 5 ? 'hlasy' : 'hlasů'}</span>
          </div>
        </div>

        {status === 'active' && (
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-medium">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Probíhá hlasování
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
