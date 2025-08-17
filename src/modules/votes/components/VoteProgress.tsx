// src/modules/votes/components/VoteProgress.tsx
import { FC } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Vote } from '../types';

interface VoteProgressProps {
  vote: Vote;
}

export const VoteProgress: FC<VoteProgressProps> = ({ vote }) => {
  const stats = vote.vote_statistics;
  if (!stats) return null;

  const totalVotes = stats.total_votes;
  const votedPercentage = (totalVotes / (vote.member_votes?.length || 1)) * 100;

  const yesPercentage = (stats.yes_votes / totalVotes) * 100;
  const noPercentage = (stats.no_votes / totalVotes) * 100;
  const abstainPercentage = (stats.abstain_votes / totalVotes) * 100;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Průběh hlasování
        </h3>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Celková účast
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {totalVotes} hlasů ({Math.round(votedPercentage)}%)
              </span>
            </div>
            <Progress value={votedPercentage} className="h-2" />
          </div>

          <div className="grid gap-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  Pro
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {stats.yes_votes} ({Math.round(yesPercentage)}%)
                </span>
              </div>
              <Progress value={yesPercentage} className="h-2 bg-green-100 dark:bg-green-900" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  Proti
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {stats.no_votes} ({Math.round(noPercentage)}%)
                </span>
              </div>
              <Progress value={noPercentage} className="h-2 bg-red-100 dark:bg-red-900" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-500">
                  Zdrželo se
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {stats.abstain_votes} ({Math.round(abstainPercentage)}%)
                </span>
              </div>
              <Progress value={abstainPercentage} className="h-2 bg-gray-100 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
