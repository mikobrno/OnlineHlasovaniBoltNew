import React, { useState } from 'react';
import { Paperclip, FileText } from 'lucide-react';
import { useQuery } from '@apollo/client';
import { useApp } from '../../hooks/useApp';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { calculateQuorum } from '../../lib/utils';
import { 
  GET_MEMBERS,
  type Member 
} from '../../graphql/members';
import {
  GET_VOTE_ATTACHMENTS,
  type VoteAttachment
} from '../../graphql/attachments';
import {
  type Vote,
  type Question,
  type VoteQuestionAnswer
} from '../../graphql/votes';

interface VotingProgressViewProps {
  vote: Vote;
}

export const VotingProgressView: React.FC<VotingProgressViewProps> = ({ vote }) => {
  const { selectedBuilding } = useApp();
  const [showIndividual, setShowIndividual] = useState(false);

  // Načtení členů a jejich váhy hlasů
  const { data: membersData } = useQuery(GET_MEMBERS, {
    variables: { buildingId: selectedBuilding?.id }
  });

  // Načtení příloh pro ruční hlasy
  const { data: attachmentsData } = useQuery(GET_VOTE_ATTACHMENTS, {
    variables: { voteId: vote.id }
  });

  const members = membersData?.members || [];
  const attachments = attachmentsData?.vote_attachments || [];
  const totalWeight = members.reduce((sum, member) => sum + member.vote_weight, 0);
  const votedMembers = Object.keys(vote.member_votes);
  const votedWeight = votedMembers.reduce((sum, memberId) => {
    const member = members.find(m => m.id === memberId);
    return sum + (member?.vote_weight || 0);
  }, 0);

  const getQuestionResults = (questionId: string) => {
    const question = vote.questions.find(q => q.id === questionId);
    if (!question) return { yes: 0, no: 0, abstain: 0, total: 0 };

    let yes = 0, no = 0, abstain = 0;
    
    votedMembers.forEach(memberId => {
      const member = members.find(m => m.id === memberId);
      const memberVote = vote.member_votes[memberId]?.[questionId]?.vote;
      const weight = member?.vote_weight || 0;
      
      if (memberVote === 'yes') yes += weight;
      else if (memberVote === 'no') no += weight;
      else if (memberVote === 'abstain') abstain += weight;
    });

    const requiredQuorum = calculateQuorum(question.quorumType, totalWeight, question.customQuorum);
    
    return { yes, no, abstain, total: yes + no + abstain, requiredQuorum };
  };

  if (showIndividual) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Individuální přehled hlasování
          </h3>
          <Button variant="secondary" onClick={() => setShowIndividual(false)}>
            Zobrazit souhrnné výsledky
          </Button>
        </div>

        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Člen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Jednotka
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Váha
                  </th>
                  {vote.questions.map((question, index) => (
                    <th key={question.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Otázka {index + 1}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Stav
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {buildingMembers.map((member) => {
                  const hasVoted = votedMembers.includes(member.id);
                  const memberAttachments = attachments.filter(a => a.member_id === member.id);
                  const hasAttachments = memberAttachments.length > 0;
                  const hasNote = memberAttachments.some(a => a.note);
                  return (
                    <tr key={member.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        <div className="flex items-center space-x-2">
                          <span>{member.name}</span>
                          {hasAttachments && (
                            <Paperclip className="w-4 h-4 text-blue-500" title="Má přílohy" />
                          )}
                          {hasNote && (
                            <FileText className="w-4 h-4 text-green-500" title="Má poznámku" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {member.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {member.voteWeight}
                      </td>
                      {vote.questions.map((question) => {
                        const memberVote = vote.memberVotes[member.id]?.[question.id];
                        return (
                          <td key={question.id} className="px-6 py-4 whitespace-nowrap text-sm">
                            {hasVoted ? (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                memberVote === 'yes' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200' :
                                memberVote === 'no' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                              }`}>
                                {memberVote === 'yes' && 'Ano'}
                                {memberVote === 'no' && 'Ne'}
                                {memberVote === 'abstain' && 'Zdržel se'}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          hasVoted 
                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
                        }`}>
                          {hasVoted ? 'Hlasoval' : 'Nehlasoval'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Průběh hlasování
        </h3>
        <Button variant="secondary" onClick={() => setShowIndividual(true)}>
          Zobrazit individuální přehled
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {votedMembers.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              z {buildingMembers.length} členů hlasovalo
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${(votedMembers.length / buildingMembers.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {votedWeight.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              z {totalWeight.toFixed(1)} váhy hlasů
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${(votedWeight / totalWeight) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {Math.round((votedWeight / totalWeight) * 100)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              účast (podle váhy)
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Průběžné výsledky podle otázek
        </h4>
        
        {vote.questions.map((question, index) => {
          const results = getQuestionResults(question.id);
          const totalVoted = results.total;
          
          return (
            <Card key={question.id} className="p-6">
              <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
                {index + 1}. {question.text}
              </h5>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {results.yes.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Ano</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {results.no.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Ne</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                    {results.abstain.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Zdržel se</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {results.requiredQuorum.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Potřebné kvórum</div>
                </div>
              </div>

              {totalVoted > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Ano ({((results.yes / totalVoted) * 100).toFixed(1)}%)</span>
                    <span>Ne ({((results.no / totalVoted) * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div className="h-full flex">
                      <div 
                        className="bg-green-500 transition-all"
                        style={{ width: `${(results.yes / totalVoted) * 100}%` }}
                      />
                      <div 
                        className="bg-red-500 transition-all"
                        style={{ width: `${(results.no / totalVoted) * 100}%` }}
                      />
                      <div 
                        className="bg-gray-400 transition-all"
                        style={{ width: `${(results.abstain / totalVoted) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 text-sm">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  results.yes >= results.requiredQuorum
                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
                }`}>
                  {results.yes >= results.requiredQuorum ? 'Zatím schváleno' : 'Zatím neschváleno'}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
