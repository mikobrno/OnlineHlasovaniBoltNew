import React from 'react';
import { 
  Vote, 
  Users, 
  Mail, 
  Settings,
  BarChart3,
  CheckCircle,
  Clock,
  FileText,
  MessageSquare
} from 'lucide-react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { useQuery } from '@apollo/client';
import { GET_VOTES } from '../modules/votes/graphql/queries';
import { GET_MEMBERS } from '../graphql/members';
import type { Building } from '../graphql/buildings';

interface DashboardViewProps {
  selectedBuilding: Building;
  onNavigate: (tab: string) => void;
}

interface VoteType {
  id: string;
  title: string;
  status: string;
  end_date?: string;
  vote_statistics?: {
    total_votes?: number;
  };
}

export const DashboardView: React.FC<DashboardViewProps> = ({ selectedBuilding, onNavigate }) => {
  const { data: votesData, loading: votesLoading } = useQuery(GET_VOTES, {
    variables: { buildingId: selectedBuilding.id }
  });

  const { data: membersData, loading: membersLoading } = useQuery(GET_MEMBERS, {
    variables: { buildingId: selectedBuilding.id }
  });

  const votes: VoteType[] = votesData?.votes || [];
  const members = membersData?.members || [];
  
  const activeVotes = votes.filter((v: VoteType) => v.status === 'active');
  const draftVotes = votes.filter((v: VoteType) => v.status === 'draft');
  const completedVotes = votes.filter((v: VoteType) => v.status === 'completed');

  const stats = [
    {
      title: 'Aktivní hlasování',
      value: activeVotes.length.toString(),
      icon: <Vote className="w-6 h-6" />,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      onClick: () => onNavigate('votes')
    },
    {
      title: 'Členové',
      value: members.length.toString(),
      icon: <Users className="w-6 h-6" />,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      onClick: () => onNavigate('members')
    },
    {
      title: 'Návrhy hlasování',
      value: draftVotes.length.toString(),
      icon: <FileText className="w-6 h-6" />,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      onClick: () => onNavigate('votes')
    },
    {
      title: 'Ukončená hlasování',
      value: completedVotes.length.toString(),
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-100 dark:bg-gray-900/20',
      onClick: () => onNavigate('votes')
    }
  ];

  const quickActions = [
    {
      title: 'Nové hlasování',
      description: 'Vytvořit nové hlasování pro vlastníky',
      icon: <Vote className="w-6 h-6" />,
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => onNavigate('votes')
    },
    {
      title: 'Spravovat členy',
      description: 'Přidat nebo upravit členy budovy',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => onNavigate('members')
    },
    {
      title: 'E-mailové šablony',
      description: 'Vytvořit nebo upravit e-mailové šablony',
      icon: <Mail className="w-6 h-6" />,
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => onNavigate('emails')
    },
    {
      title: 'Nastavení budovy',
      description: 'Upravit nastavení a proměnné budovy',
      icon: <Settings className="w-6 h-6" />,
      color: 'bg-gray-500 hover:bg-gray-600',
      onClick: () => onNavigate('admin')
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Vítejte v OnlineHlasování
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-1">
              Budova: <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedBuilding.name}</span>
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              {selectedBuilding.address}
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
              <BarChart3 className="w-12 h-12 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card 
            key={index}
            className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${stat.bgColor}`}
            onClick={stat.onClick}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {votesLoading || membersLoading ? '...' : stat.value}
                </p>
              </div>
              <div className={`${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Votes */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Aktivní hlasování
            </h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('votes')}
            >
              Zobrazit vše
            </Button>
          </div>
          
          {votesLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : activeVotes.length > 0 ? (
            <div className="space-y-3">
              {activeVotes.slice(0, 3).map((vote: VoteType) => (
                <div key={vote.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      {vote.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {vote.end_date && new Date(vote.end_date).toLocaleDateString('cs-CZ')} • 
                      {vote.vote_statistics?.total_votes || 0} hlasů
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs text-yellow-600 dark:text-yellow-400">Aktivní</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Vote className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Žádná aktivní hlasování</p>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Rychlé akce
          </h3>
          
          <div className="grid grid-cols-1 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`p-4 rounded-lg text-white transition-all duration-300 hover:scale-105 ${action.color}`}
              >
                <div className="flex items-center space-x-3">
                  {action.icon}
                  <div className="text-left">
                    <p className="font-medium">{action.title}</p>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Help Section */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <MessageSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Potřebujete pomoc?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              OnlineHlasování umožňuje jednoduše spravovat hlasování ve vašem SVJ nebo BD. 
              Vytvářejte hlasování, spravujte členy, odesílejte e-maily a sledujte výsledky na jednom místě.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200">
                ✨ Automatické e-maily
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200">
                📊 Sledování výsledků
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200">
                🔒 Bezpečné hlasování
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
