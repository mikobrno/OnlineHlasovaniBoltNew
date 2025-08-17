// src/modules/votes/components/VoteDetailView.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import type { Vote } from '../types';
import { VoteQuestion } from './VoteQuestion';
import { VoteProgress } from './VoteProgress';
import { VoteResults } from './VoteResults';

interface VoteDetailViewProps {
  voteId?: string;
  vote?: Vote;
  onBack: () => void;
  onEdit?: () => void;
}

export const VoteDetailView: FC<VoteDetailViewProps> = ({ voteId, vote: voteProp, onBack, onEdit }) => {
  const [activeTab, setActiveTab] = useState<string>('info');
  const { setEditingVote, openVoteForm } = useVoteContext();

  const shouldQuery = !voteProp && !!voteId;
  const { data, loading, error } = useQuery(GET_VOTE_DETAILS, {
    variables: { voteId },
    skip: !shouldQuery,
  });

  if (loading) return <div>Načítám...</div>;
  if (error) return <div>Chyba: {error.message}</div>;

  const voteData = (voteProp ?? (data as any)?.vote ?? (data as any)?.votes_by_pk) as Vote | undefined;
  if (!voteData) return <div>Hlasování nebylo nalezeno</div>;

  const handleEdit = () => {
    if (onEdit) {
      try { onEdit(); } catch { /* ignore */ }
    } else {
      setEditingVote(voteData);
      openVoteForm();
    }
  };

  const handleStartVote = () => {
    // TODO: Implement start vote mutation
    console.log('Starting vote:', voteData.id);
  };

  // normalize questions which may be stored as JSON scalar or nested 'data' wrapper
  const parseQuestions = (): unknown[] => {
    const raw = (voteData as any).questions as unknown;
    if (Array.isArray(raw)) return raw as unknown[];
    if (typeof raw === 'string') {
      try { return JSON.parse(raw) as unknown[]; } catch { return []; }
    }
    if (raw && typeof raw === 'object' && Array.isArray((raw as any).data)) return (raw as any).data as unknown[];
    return [];
  };

  const questions = parseQuestions();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zpět na přehled
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Detail hlasování</h1>
      </div>

      <Card className="p-6">
  <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{voteData.title}</h2>
              <Badge variant={getVoteStatusColor(voteData.status)}>{getVoteStatusText(voteData.status)}</Badge>
            </div>
            {voteData.start_date && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(voteData.start_date)}{voteData.end_date && ` - ${formatDate(voteData.end_date)}`}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            {voteData.status === 'draft' && (
              <Button onClick={handleStartVote}><Play className="w-4 h-4 mr-2" />Spustit hlasování</Button>
            )}
            <Button variant="outline" onClick={handleEdit}><Edit className="w-4 h-4 mr-2" />Upravit</Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="info"><FileText className="w-4 h-4 mr-2" />Informace</TabsTrigger>
            <TabsTrigger value="members"><Mail className="w-4 h-4 mr-2" />Správa členů</TabsTrigger>
            <TabsTrigger value="questions"><Mail className="w-4 h-4 mr-2" />Otázky</TabsTrigger>
            <TabsTrigger value="observers"><Eye className="w-4 h-4 mr-2" />Pozorovatelé</TabsTrigger>
            {voteData.status === 'active' && <TabsTrigger value="progress"><Eye className="w-4 h-4 mr-2" />Průběh</TabsTrigger>}
            {voteData.status === 'completed' && <TabsTrigger value="results"><BarChart3 className="w-4 h-4 mr-2" />Výsledky</TabsTrigger>}
          </TabsList>

          <TabsContent value="info">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{voteData.description}</p>
            </div>
          </TabsContent>

          <TabsContent value="members">
            <Card className="p-6"><p>Správa členů bude brzy funkční.</p></Card>
          </TabsContent>

            {((voteData as any)?.manual_vote_attachments?.length ?? 0) > 0 && (
            <div className="mt-4">
              <Card className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Přílohy ({((voteData as any)?.manual_vote_attachments || []).length})</h3>
                <div className="space-y-4">
                    {((voteData as any)?.manual_vote_attachments || []).map((attachment: any) => (
                    <div key={attachment.id} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{attachment.attachment_name}</div>
                        {attachment.member && (
                          <div className="text-xs text-gray-500">Nahrál(a): {attachment.member.name} (jednotka {attachment.member.unit})</div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">{new Date(attachment.created_at).toLocaleDateString('cs-CZ')}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          <TabsContent value="questions">
            <div className="space-y-4">
              {questions.length === 0 ? (
                <p className="text-gray-500">Žádné otázky nejsou k dispozici</p>
              ) : (
                questions.map((q, i) => <VoteQuestion key={(q as any)?.id || i} question={q as any} index={i} />)
              )}
            </div>
          </TabsContent>

          <TabsContent value="progress">
            {voteData.status === 'active' && <VoteProgress vote={voteData} />}
          </TabsContent>

          <TabsContent value="results">
            {voteData.status === 'completed' && <VoteResults vote={voteData} />}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
