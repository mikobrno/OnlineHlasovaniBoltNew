import type { Vote } from '../types/vote';
import { Card } from '../../shared/components/Card';
import { formatDate } from '../../shared/utils/date';

interface VoteOverviewProps {
  vote: Vote;
}

export function VoteOverview({ vote }: VoteOverviewProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Popis hlasování</h3>
        <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
          {vote.description}
        </p>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Základní informace</h3>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-400">Typ hlasování</dt>
              <dd className="mt-1 text-gray-900 dark:text-gray-100">{vote.type}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-400">Začátek hlasování</dt>
              <dd className="mt-1 text-gray-900 dark:text-gray-100">
                {formatDate(vote.start_date)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-400">Konec hlasování</dt>
              <dd className="mt-1 text-gray-900 dark:text-gray-100">
                {formatDate(vote.end_date)}
              </dd>
            </div>
          </dl>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Podmínky hlasování</h3>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-400">Typ kvóra</dt>
              <dd className="mt-1 text-gray-900 dark:text-gray-100">{vote.quorum_type}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-400">Hodnota kvóra</dt>
              <dd className="mt-1 text-gray-900 dark:text-gray-100">{vote.quorum_value}%</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-400">Typ schválení</dt>
              <dd className="mt-1 text-gray-900 dark:text-gray-100">{vote.approval_type}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-400">Hodnota schválení</dt>
              <dd className="mt-1 text-gray-900 dark:text-gray-100">{vote.approval_value}%</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}
