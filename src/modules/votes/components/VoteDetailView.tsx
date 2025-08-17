// src/modules/votes/components/VoteDetailView.tsx
import { FC, useState } from 'react';
import { useQuery } from '@apollo/client';
import { ArrowLeft, Edit, Play, FileText, Mail, Eye, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useVoteContext } from '../context/VoteContext';
import { GET_VOTE_DETAILS } from '../graphql/queries';
import { getVoteStatusColor, getVoteStatusText } from '@/lib/utils';
import { formatDate } from '@/lib/date';
import { Badge } from '@/components/ui/badge';
import { VoteQuestion } from './VoteQuestion';
import { VoteProgress } from './VoteProgress';
import { VoteResults } from './VoteResults';

interface VoteDetailViewProps {
  voteId: string;
  onBack: () => void;
}

export const VoteDetailView: FC<VoteDetailViewProps> = ({ voteId, onBack }) => {
  const [activeTab, setActiveTab] = useState('info');
  const { setEditingVote, openVoteForm } = useVoteContext();

  const { data, loading, error } = useQuery(GET_VOTE_DETAILS, {
    variables: { voteId },
  });

  if (loading) return <div>Načítám...</div>;
  if (error) return <div>Chyba: {error.message}</div>;

  const vote = data?.vote;
  if (!vote) return <div>Hlasování nebylo nalezeno</div>;

  const handleEdit = () => {
    setEditingVote(vote);
    openVoteForm();
  };

  const handleStartVote = async () => {
    // TODO: Implement start vote mutation
    console.log('Starting vote:', vote.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zpět na seznam
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Detail hlasování
        </h1>
      </div>

      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {vote.title}
              </h2>
              <Badge variant={getVoteStatusColor(vote.status)}>
                {getVoteStatusText(vote.status)}
              </Badge>
            </div>
            {vote.start_date && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(vote.start_date)}
                {vote.end_date && ` - ${formatDate(vote.end_date)}`}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            {vote.status === 'draft' && (
              <Button onClick={handleStartVote}>
                <Play className="w-4 h-4 mr-2" />
                Spustit hlasování
              </Button>
            )}
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Upravit
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="info">
              <FileText className="w-4 h-4 mr-2" />
              Informace
            </TabsTrigger>
            <TabsTrigger value="questions">
              <Mail className="w-4 h-4 mr-2" />
              Otázky
            </TabsTrigger>
            {vote.status === 'active' && (
              <TabsTrigger value="progress">
                <Eye className="w-4 h-4 mr-2" />
                Průběh
              </TabsTrigger>
            )}
            {vote.status === 'completed' && (
              <TabsTrigger value="results">
                <BarChart3 className="w-4 h-4 mr-2" />
                Výsledky
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="info">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {vote.description}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="questions">
            <div className="space-y-4">
              {vote.questions.map((question, index) => (
                <VoteQuestion key={question.id} question={question} index={index} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress">
            {vote.status === 'active' && (
              <VoteProgress vote={vote} />
            )}
          </TabsContent>

          <TabsContent value="results">
            {vote.status === 'completed' && (
              <VoteResults vote={vote} />
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
