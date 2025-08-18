// src/modules/votes/components/VoteProgressView.tsx
import { FC, useState } from 'react';
import { TrendingUp, Users, Clock, CheckCircle2, ChevronRight, Eye } from 'lucide-react';
import { Card } from '@/components/common';
import { useQuery } from '@apollo/client';
import { GET_VOTE_DETAILS } from '../graphql/queries';

interface VoteProgressViewProps {
  voteId: string;
}



export const VoteProgressView: FC<VoteProgressViewProps> = ({ voteId }) => {
  const [showMemberDetails, setShowMemberDetails] = useState(false);
  const { data, loading, error } = useQuery(GET_VOTE_DETAILS, { variables: { voteId } });
  if (loading) return <div>Načítám statistiky…</div>;
  if (error) return <div>Chyba při načítání statistik: {error.message}</div>;
  const stats = data?.vote?.vote_statistics || {};
  const memberVotes = data?.vote?.member_votes || [];
  const totalMembers = stats.total_votes ?? 0;
  const votedMembers = memberVotes.length;
  const yesVotes = stats.yes_votes ?? 0;
  const noVotes = stats.no_votes ?? 0;
  const abstainVotes = stats.abstain_votes ?? 0;
  const totalWeight = stats.total_weight ?? 0;
  const yesWeight = stats.yes_weight ?? 0;
  const noWeight = stats.no_weight ?? 0;
  const abstainWeight = stats.abstain_weight ?? 0;
  const participationRate = totalMembers ? (votedMembers / totalMembers) * 100 : 0;
  const yesPercentage = votedMembers ? (yesVotes / votedMembers) * 100 : 0;
  const noPercentage = votedMembers ? (noVotes / votedMembers) * 100 : 0;
  const abstainPercentage = votedMembers ? (abstainVotes / votedMembers) * 100 : 0;
  const yesWeightPercentage = totalWeight ? (yesWeight / totalWeight) * 100 : 0;
  const noWeightPercentage = totalWeight ? (noWeight / totalWeight) * 100 : 0;
  const endDate = data?.vote?.end_date ? new Date(data.vote.end_date) : null;
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
          {/* TODO: Pokud budete mít časovou osu v datech, zde ji zobrazte. */}
          <div className="text-gray-400 italic">Průběh v čase zatím není k dispozici.</div>
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
            {memberVotes.map((mv: { id: string; member?: { name?: string; unit?: string; weight?: number }; vote_choice?: 'yes' | 'no' | 'abstain' }) => (
              <div 
                key={mv.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                    {mv.member?.name?.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{mv.member?.name}</div>
                    <div className="text-sm text-gray-500">Jednotka {mv.member?.unit} • Váha {mv.member?.weight ?? '-'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`text-sm font-medium ${mv.vote_choice === 'yes' ? 'text-green-600' : mv.vote_choice === 'no' ? 'text-red-600' : 'text-gray-600'}`}>
                    {mv.vote_choice === 'yes' ? 'Pro' : mv.vote_choice === 'no' ? 'Proti' : mv.vote_choice === 'abstain' ? 'Zdržel se' : 'Nehlasoval'}
                  </div>
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
