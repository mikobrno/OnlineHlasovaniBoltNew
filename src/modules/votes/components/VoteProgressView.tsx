// src/modules/votes/components/VoteProgressView.tsx
import { FC, useState } from 'react';
import { TrendingUp, Users, Clock, CheckCircle2, ChevronRight, Eye } from 'lucide-react';
import { Card } from '@/components/common';
import { Vote } from '../types';

interface VoteProgressViewProps {
  vote: Vote;
}

// Mock progress data
const mockProgressData = {
  totalMembers: 120,
  votedMembers: 87,
  yesVotes: 52,
  noVotes: 28,
  abstainVotes: 7,
  totalWeight: 145.5,
  yesWeight: 89.2,
  noWeight: 42.1,
  abstainWeight: 14.2,
  timeline: [
    { time: '09:00', votes: 15 },
    { time: '10:00', votes: 28 },
    { time: '11:00', votes: 42 },
    { time: '12:00', votes: 56 },
    { time: '13:00', votes: 71 },
    { time: '14:00', votes: 84 },
    { time: '15:00', votes: 87 }
  ]
};

// Mock detailed member data
const mockMemberVotes = [
  { id: '1', name: 'Jan Novák', unit: 'A1', weight: 1.0, hasVoted: true, voteValue: 'yes', votedAt: '2025-08-17T09:15:00' },
  { id: '2', name: 'Marie Svobodová', unit: 'B2', weight: 1.5, hasVoted: true, voteValue: 'no', votedAt: '2025-08-17T09:32:00' },
  { id: '3', name: 'Pavel Dvořák', unit: 'C3', weight: 2.0, hasVoted: false },
  { id: '4', name: 'Jana Procházková', unit: 'D4', weight: 1.2, hasVoted: true, voteValue: 'abstain', votedAt: '2025-08-17T10:05:00' },
  { id: '5', name: 'Tomáš Černý', unit: 'A2', weight: 0.8, hasVoted: true, voteValue: 'yes', votedAt: '2025-08-17T11:20:00' },
  { id: '6', name: 'Petra Nová', unit: 'B1', weight: 1.3, hasVoted: false },
];

export const VoteProgressView: FC<VoteProgressViewProps> = ({ vote }) => {
  const [showMemberDetails, setShowMemberDetails] = useState(false);
  const { totalMembers, votedMembers, yesVotes, noVotes, abstainVotes, totalWeight, yesWeight, noWeight, abstainWeight } = mockProgressData;
  
  const participationRate = (votedMembers / totalMembers) * 100;
  const yesPercentage = (yesVotes / votedMembers) * 100;
  const noPercentage = (noVotes / votedMembers) * 100;
  const abstainPercentage = (abstainVotes / votedMembers) * 100;
  
  const yesWeightPercentage = (yesWeight / totalWeight) * 100;
  const noWeightPercentage = (noWeight / totalWeight) * 100;

  const endDate = vote.end_date ? new Date(vote.end_date) : null;
  const now = new Date();
  const timeRemaining = endDate ? Math.max(0, endDate.getTime() - now.getTime()) : 0;
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="space-y-6">
      {/* Základní statistiky */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Účast</p>
              <p className="text-xl font-semibold">{votedMembers}/{totalMembers}</p>
              <p className="text-xs text-gray-500">{participationRate.toFixed(1)}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pro</p>
              <p className="text-xl font-semibold">{yesVotes}</p>
              <p className="text-xs text-gray-500">{yesPercentage.toFixed(1)}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Proti</p>
              <p className="text-xl font-semibold">{noVotes}</p>
              <p className="text-xs text-gray-500">{noPercentage.toFixed(1)}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Zbývá</p>
              <p className="text-xl font-semibold">{hoursRemaining}h {minutesRemaining}m</p>
              <p className="text-xs text-gray-500">do konce</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Průběh hlasování v čase */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Průběh hlasování v čase
        </h3>
        <div className="h-64 flex items-end gap-2">
          {mockProgressData.timeline.map((point, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-blue-500 rounded-t"
                style={{ height: `${(point.votes / totalMembers) * 200}px` }}
              ></div>
              <div className="mt-2 text-xs text-gray-600">{point.time}</div>
              <div className="text-xs font-semibold text-gray-900">{point.votes}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Detailní přehled hlasů */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Počet hlasů</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-green-600">Pro</span>
                <span className="text-sm text-gray-900">{yesVotes} hlasů ({yesPercentage.toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${yesPercentage}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-red-600">Proti</span>
                <span className="text-sm text-gray-900">{noVotes} hlasů ({noPercentage.toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-red-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${noPercentage}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Zdrželo se</span>
                <span className="text-sm text-gray-900">{abstainVotes} hlasů ({abstainPercentage.toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gray-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${abstainPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Váha hlasů</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-green-600">Pro</span>
                <span className="text-sm text-gray-900">{yesWeight} ({yesWeightPercentage.toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${yesWeightPercentage}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-red-600">Proti</span>
                <span className="text-sm text-gray-900">{noWeight} ({noWeightPercentage.toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-red-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${noWeightPercentage}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Zdrželo se</span>
                <span className="text-sm text-gray-900">{abstainWeight} ({((abstainWeight/totalWeight)*100).toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gray-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(abstainWeight/totalWeight)*100}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Celková váha:</span>
                <span>{totalWeight}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailní seznam hlasů členů */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Detailní přehled hlasů</h3>
          <button 
            onClick={() => setShowMemberDetails(!showMemberDetails)}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
          >
            <Eye className="w-4 h-4" />
            {showMemberDetails ? 'Skrýt detail' : 'Zobrazit detail'}
          </button>
        </div>
        
        {showMemberDetails && (
          <div className="space-y-3">
            {mockMemberVotes.map((member) => (
              <div 
                key={member.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => console.log('Show member detail:', member)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{member.name}</div>
                    <div className="text-sm text-gray-500">Jednotka {member.unit} • Váha {member.weight}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {member.hasVoted ? (
                    <>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          member.voteValue === 'yes' ? 'text-green-600' : 
                          member.voteValue === 'no' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {member.voteValue === 'yes' ? 'Pro' : member.voteValue === 'no' ? 'Proti' : 'Zdržel se'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(member.votedAt!).toLocaleString('cs-CZ')}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-500">Nehlasoval</div>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
