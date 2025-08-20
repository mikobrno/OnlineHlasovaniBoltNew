import type { Vote } from '../types/vote';
import { getVoteStatusStyle, getVoteStatusText } from '../utils/voteStatus';
import { Button } from '../../shared/components/Button';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface VoteDetailHeaderProps {
  vote: Vote;
}

export function VoteDetailHeader({ vote }: VoteDetailHeaderProps) {
  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/votes" className="flex items-center">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Zpět na seznam
        </Link>
      </Button>
      
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">{vote.title}</h1>
          <span className={`px-3 py-1 rounded-full text-sm ${getVoteStatusStyle(vote.status)}`}>
            {getVoteStatusText(vote.status)}
          </span>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            Upravit
          </Button>
          {vote.status === 'DRAFT' && (
            <Button variant="primary" size="sm">
              Zahájit hlasování
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
