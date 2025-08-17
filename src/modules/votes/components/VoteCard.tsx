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
      className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {title}
            </h3>
            <Badge variant={getVoteStatusColor(status)}>
              {getVoteStatusText(status)}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            {start_date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(start_date)}</span>
                {end_date && <span> - {formatDate(end_date)}</span>}
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{totalVotes} hlasů</span>
            </div>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </Card>
  );
};
