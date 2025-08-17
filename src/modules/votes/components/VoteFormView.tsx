import React, { FC, useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { ArrowLeft } from 'lucide-react';
import { PageHeader, Button, Card, Input } from '@/components/common';
import { useToast } from '@/contexts';
import type { Vote } from '../types';
import { ADD_VOTE, UPDATE_VOTE, VoteInput } from '@/graphql/votes';

interface VoteFormViewProps {
  vote?: Vote | null;
  onBack: () => void;
  buildingId: string;
}

export const VoteFormView: FC<VoteFormViewProps> = ({ vote, onBack, buildingId }) => {
  const { showToast } = useToast();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [votingDays, setVotingDays] = useState(30);
  const [endDate, setEndDate] = useState('');

  // Automatický výpočet konce hlasování
  useEffect(() => {
    if (startDate && votingDays > 0) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + votingDays);
      setEndDate(end.toISOString().slice(0, 16));
    }
  }, [startDate, votingDays]);

  // Načtení dat z existujícího hlasování pro editaci
  useEffect(() => {
    if (vote) {
      setTitle(vote.title);
      setDescription(vote.description || '');
      if (vote.start_date) setStartDate(new Date(vote.start_date).toISOString().slice(0, 16));
      if (vote.end_date) {
        const start = new Date(vote.start_date);
        const end = new Date(vote.end_date);
        const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        setVotingDays(days);
      }
    }
  }, [vote]);

  const [addVoteMutation] = useMutation(ADD_VOTE, {
    onCompleted: () => {
      showToast('Hlasování bylo úspěšně vytvořeno', 'success');
      onBack();
    },
    onError: (error) => {
      showToast(`Chyba při vytváření hlasování: ${error.message}`, 'error');
    }
  });

  const [updateVoteMutation] = useMutation(UPDATE_VOTE, {
    onCompleted: () => {
      showToast('Hlasování bylo úspěšně aktualizováno', 'success');
      onBack();
    },
    onError: (error) => {
      showToast(`Chyba při aktualizaci hlasování: ${error.message}`, 'error');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!buildingId) return;
    
    if (!title.trim() || !description.trim()) {
      showToast('Vyplňte všechna povinná pole', 'error');
      return;
    }

    const voteData: VoteInput = {
      building_id: buildingId,
      title: title.trim(),
      description: description.trim(),
      status: 'draft',
      start_date: startDate ? new Date(startDate).toISOString() : undefined,
      end_date: endDate ? new Date(endDate).toISOString() : undefined,
      questions: {
        data: []
      }
    };

    try {
      if (vote) {
        await updateVoteMutation({
          variables: {
            id: vote.id,
            vote: voteData
          }
        });
      } else {
        await addVoteMutation({
          variables: {
            vote: voteData
          }
        });
      }
    } catch (error) {
      // Chyby jsou zpracovány v onError callbacku mutací
      console.error('Error submitting vote:', error);
    }
  };

  return (
    <div>
      <PageHeader 
        title={vote ? 'Upravit hlasování' : 'Nové hlasování'}
        action={{
          label: "Zpět na přehled",
          onClick: onBack,
          icon: <ArrowLeft className="w-4 h-4" />
        }}
      />

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <Input
                name="title"
                label="Název hlasování *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="např. Schválení ročního rozpočtu"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Popis hlasování *
                </label>
                <textarea
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Detailní popis hlasování..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Začátek hlasování"
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  helperText="Datum a čas spuštění hlasování"
                />
                
                <Input
                  label="Počet dní na hlasování"
                  type="number"
                  min="1"
                  max="365"
                  value={votingDays}
                  onChange={(e) => setVotingDays(parseInt(e.target.value) || 30)}
                  helperText="Délka hlasování ve dnech"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Konec hlasování
                  </label>
                  <div className="h-10 flex items-center px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-600 dark:text-gray-400">
                    {endDate ? new Date(endDate).toLocaleString('cs-CZ') : 'Nastavte začátek hlasování'}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="secondary" onClick={onBack}>
              Zrušit
            </Button>
            <Button type="submit">
              {vote ? 'Aktualizovat' : 'Vytvořit'} hlasování
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
