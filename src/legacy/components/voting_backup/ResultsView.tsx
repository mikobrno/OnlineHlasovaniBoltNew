import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Vote, Member } from '../../types';
import { Card } from '../common/Card';

interface ResultsViewProps {
  vote: Vote;
  members: Member[];
}

export const ResultsView: React.FC<ResultsViewProps> = ({ vote, members }) => {
  
  const calculateResults = () => {
    const results: Record<string, { yes: number; no: number; abstain: number }> = {};
    const totalVoteWeight = members.reduce((sum, m) => sum + (m.vote_weight || 0), 0);

    vote.questions.forEach(q => {
      results[q.id] = { yes: 0, no: 0, abstain: 0 };
    });

    vote.member_votes?.forEach(voteEntry => {
      const member = members.find(m => m.id === voteEntry.member_id);
      if (!member) return;

      const weight = member.vote_weight || 0;

      Object.entries(voteEntry.answers).forEach(([questionId, answer]) => {
        if (results[questionId]) {
          results[questionId][answer as 'yes' | 'no' | 'abstain'] += weight;
        }
      });
    });

    return { results, totalVoteWeight };
  };

  const { results, totalVoteWeight } = calculateResults();

  const getQuorumPercentage = (question: Vote['questions'][0]): number => {
    switch (question.quorum_type) {
      case 'simple': return 50;
      case 'qualified': return 2/3 * 100;
      case 'unanimous': return 100;
      case 'custom':
        if (question.custom_quorum) {
          return (question.custom_quorum.numerator / question.custom_quorum.denominator) * 100;
        }
        return 50;
      default: return 50;
    }
  };

  const isQuorumMet = (question: Vote['questions'][0], questionResults: { yes: number; no: number; abstain: number }) => {
    const quorumPercentage = getQuorumPercentage(question);
    const yesPercentage = totalVoteWeight > 0 ? (questionResults.yes / totalVoteWeight) * 100 : 0;
    return yesPercentage >= quorumPercentage;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Celkové výsledky hlasování
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Celková váha hlasů</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalVoteWeight.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Počet hlasujících</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{vote.member_votes?.length || 0} / {members.length}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Účast</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {members.length > 0 ? `${Math.round(((vote.member_votes?.length || 0) / members.length) * 100)}%` : '0%'}
                </p>
            </div>
        </div>
      </Card>

      {vote.questions.map((question, index) => {
        const questionResults = results[question.id];
        const totalVotesCasted = questionResults.yes + questionResults.no + questionResults.abstain;
        const quorumMet = isQuorumMet(question, questionResults);

        return (
          <Card key={question.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">
                  {index + 1}. {question.text}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Kvórum: {getQuorumPercentage(question).toFixed(1)}% pro přijetí
                </p>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                  quorumMet ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                  {quorumMet ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  <span>{quorumMet ? 'Přijato' : 'Nepřijato'}</span>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              {/* Yes votes */}
              <div className="flex items-center">
                <span className="w-24 text-sm font-medium text-green-600">Pro</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6">
                  <div
                    className="bg-green-500 h-6 rounded-full flex items-center justify-end px-2 text-white text-xs font-bold"
                    style={{ width: `${totalVotesCasted > 0 ? (questionResults.yes / totalVotesCasted) * 100 : 0}%` }}
                  >
                    {questionResults.yes.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* No votes */}
              <div className="flex items-center">
                <span className="w-24 text-sm font-medium text-red-600">Proti</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6">
                  <div
                    className="bg-red-500 h-6 rounded-full flex items-center justify-end px-2 text-white text-xs font-bold"
                    style={{ width: `${totalVotesCasted > 0 ? (questionResults.no / totalVotesCasted) * 100 : 0}%` }}
                  >
                    {questionResults.no.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Abstain votes */}
              <div className="flex items-center">
                <span className="w-24 text-sm font-medium text-gray-500">Zdrželo se</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6">
                  <div
                    className="bg-gray-400 h-6 rounded-full flex items-center justify-end px-2 text-white text-xs font-bold"
                    style={{ width: `${totalVotesCasted > 0 ? (questionResults.abstain / totalVotesCasted) * 100 : 0}%` }}
                  >
                    {questionResults.abstain.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
