// src/modules/votes/components/VoteResults.tsx
import { FC } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Vote } from '../types';

interface VoteResultsProps {
  vote: Vote;
}

export const VoteResults: FC<VoteResultsProps> = ({ vote }) => {
  const stats = vote.vote_statistics;
  if (!stats) return null;

  const totalWeight = stats.total_weight;
  const yesPercentage = (stats.yes_weight / totalWeight) * 100;
  const noPercentage = (stats.no_weight / totalWeight) * 100;
  const abstainPercentage = (stats.abstain_weight / totalWeight) * 100;

  const getQuorumText = (question: Vote['questions'][0]) => {
    switch (question.quorum_type) {
      case 'simple_majority':
        return 'Prostá většina (>50%)';
      case 'qualified_majority':
        return 'Kvalifikovaná většina (>75%)';
      case 'custom':
        if (question.custom_quorum_numerator && question.custom_quorum_denominator) {
          return `Vlastní kvórum (>${(question.custom_quorum_numerator / question.custom_quorum_denominator) * 100}%)`;
        }
        return 'Vlastní kvórum';
      default:
        return 'Neznámý typ kvóra';
    }
  };

  const isApproved = (question: Vote['questions'][0]) => {
    let requiredPercentage = 50;
    switch (question.quorum_type) {
      case 'simple_majority':
        requiredPercentage = 50;
        break;
      case 'qualified_majority':
        requiredPercentage = 75;
        break;
      case 'custom':
        if (question.custom_quorum_numerator && question.custom_quorum_denominator) {
          requiredPercentage = (question.custom_quorum_numerator / question.custom_quorum_denominator) * 100;
        }
        break;
    }
    return yesPercentage > requiredPercentage;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
          Výsledky hlasování
        </h3>

        <div className="space-y-8">
          {vote.questions.map((question, index) => (
            <div key={question.id} className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Otázka {index + 1}
                  </h4>
                  <p className="text-base font-medium text-gray-900 dark:text-gray-100 mt-1">
                    {question.text}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {getQuorumText(question)}
                  </p>
                </div>
                <div className="flex items-center">
                  {isApproved(question) ? (
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <CheckCircle2 className="w-5 h-5 mr-1" />
                      <span className="text-sm font-medium">Schváleno</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600 dark:text-red-400">
                      <XCircle className="w-5 h-5 mr-1" />
                      <span className="text-sm font-medium">Neschváleno</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {/* Pro hlasy */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      Pro
                    </span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {stats.yes_weight.toFixed(1)} ({Math.round(yesPercentage)}%)
                    </span>
                  </div>
                  <Progress
                    value={yesPercentage}
                    className="h-2 bg-green-100 dark:bg-green-900"
                  />
                </div>

                {/* Proti hlasy */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                      Proti
                    </span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {stats.no_weight.toFixed(1)} ({Math.round(noPercentage)}%)
                    </span>
                  </div>
                  <Progress
                    value={noPercentage}
                    className="h-2 bg-red-100 dark:bg-red-900"
                  />
                </div>

                {/* Zdržel se */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-500">
                      Zdrželo se
                    </span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {stats.abstain_weight.toFixed(1)} ({Math.round(abstainPercentage)}%)
                    </span>
                  </div>
                  <Progress
                    value={abstainPercentage}
                    className="h-2 bg-gray-100 dark:bg-gray-700"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
