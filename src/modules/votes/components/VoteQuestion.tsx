// src/modules/votes/components/VoteQuestion.tsx
import { FC } from 'react';
import { Card } from '@/components/ui/card';
import { VoteQuestion as VoteQuestionType } from '../types';

interface VoteQuestionProps {
  question: VoteQuestionType;
  index: number;
}

export const VoteQuestion: FC<VoteQuestionProps> = ({ question, index }) => {
  const getQuorumText = () => {
    switch (question.quorum_type) {
      case 'simple_majority':
        return 'Prostá většina hlasů';
      case 'qualified_majority':
        return 'Kvalifikovaná většina (75%)';
      case 'custom':
        if (question.custom_quorum_numerator && question.custom_quorum_denominator) {
          return `Vlastní kvórum (${question.custom_quorum_numerator}/${question.custom_quorum_denominator})`;
        }
        return 'Vlastní kvórum';
      default:
        return 'Neznámý typ kvóra';
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Otázka {index + 1}
            </h4>
            <p className="text-base font-medium text-gray-900 dark:text-gray-100 mt-1">
              {question.text}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {getQuorumText()}
        </p>
      </div>
    </Card>
  );
};
