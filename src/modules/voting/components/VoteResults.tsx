import type { Vote, VoteMember } from '../types/vote';
import { Card } from '../../shared/components/Card';
import { useEffect, useMemo } from 'react';

interface VoteResultsProps {
  vote: Vote;
}

interface VoteStats {
  totalWeight: number;
  votedWeight: number;
  participationPercentage: number;
  forWeight: number;
  againstWeight: number;
  abstainWeight: number;
  forPercentage: number;
  againstPercentage: number;
  abstainPercentage: number;
  hasQuorum: boolean;
  isApproved: boolean;
}

function calculateVoteStats(vote: Vote): VoteStats {
  const members = vote.members || [];
  const totalWeight = members.reduce((sum, m) => sum + m.vote_weight, 0);
  const votedMembers = members.filter(m => m.vote_date);
  const votedWeight = votedMembers.reduce((sum, m) => sum + m.vote_weight, 0);
  
  const forVotes = votedMembers.filter(m => m.vote_option === 'FOR');
  const againstVotes = votedMembers.filter(m => m.vote_option === 'AGAINST');
  const abstainVotes = votedMembers.filter(m => m.vote_option === 'ABSTAIN');
  
  const forWeight = forVotes.reduce((sum, m) => sum + m.vote_weight, 0);
  const againstWeight = againstVotes.reduce((sum, m) => sum + m.vote_weight, 0);
  const abstainWeight = abstainVotes.reduce((sum, m) => sum + m.vote_weight, 0);
  
  const participationPercentage = (votedWeight / totalWeight) * 100;
  const forPercentage = (forWeight / votedWeight) * 100;
  const againstPercentage = (againstWeight / votedWeight) * 100;
  const abstainPercentage = (abstainWeight / votedWeight) * 100;

  const hasQuorum = participationPercentage >= vote.quorum_value;
  const isApproved = hasQuorum && forPercentage >= vote.approval_value;

  return {
    totalWeight,
    votedWeight,
    participationPercentage,
    forWeight,
    againstWeight,
    abstainWeight,
    forPercentage,
    againstPercentage,
    abstainPercentage,
    hasQuorum,
    isApproved
  };
}

export function VoteResults({ vote }: VoteResultsProps) {
  const stats = useMemo(() => calculateVoteStats(vote), [vote]);

  if (vote.status === 'DRAFT') {
    return (
      <Card className="p-6">
        <p className="text-center text-gray-600 dark:text-gray-400">
          Hlasování ještě nebylo zahájeno.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Účast v hlasování</h3>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-400">Celková váha hlasů</dt>
              <dd className="mt-1 text-2xl font-semibold">{stats.totalWeight}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-400">Odevzdaná váha hlasů</dt>
              <dd className="mt-1 text-2xl font-semibold">{stats.votedWeight}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-400">Účast</dt>
              <dd className="mt-1 text-2xl font-semibold">
                {stats.participationPercentage.toFixed(1)}%
              </dd>
            </div>
          </dl>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Výsledky hlasování</h3>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-400">Pro</dt>
              <dd className="mt-1">
                <div className="flex items-baseline">
                  <span className="text-2xl font-semibold">{stats.forWeight}</span>
                  <span className="ml-2 text-gray-600">({stats.forPercentage.toFixed(1)}%)</span>
                </div>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-400">Proti</dt>
              <dd className="mt-1">
                <div className="flex items-baseline">
                  <span className="text-2xl font-semibold">{stats.againstWeight}</span>
                  <span className="ml-2 text-gray-600">({stats.againstPercentage.toFixed(1)}%)</span>
                </div>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-400">Zdrželo se</dt>
              <dd className="mt-1">
                <div className="flex items-baseline">
                  <span className="text-2xl font-semibold">{stats.abstainWeight}</span>
                  <span className="ml-2 text-gray-600">({stats.abstainPercentage.toFixed(1)}%)</span>
                </div>
              </dd>
            </div>
          </dl>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Vyhodnocení</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Kvórum ({vote.quorum_value}%)
            </p>
            <p className={`text-lg font-semibold ${stats.hasQuorum ? 'text-green-600' : 'text-red-600'}`}>
              {stats.hasQuorum ? 'Splněno' : 'Nesplněno'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Schválení ({vote.approval_value}%)
            </p>
            <p className={`text-lg font-semibold ${stats.isApproved ? 'text-green-600' : 'text-red-600'}`}>
              {stats.isApproved ? 'Schváleno' : 'Neschváleno'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
