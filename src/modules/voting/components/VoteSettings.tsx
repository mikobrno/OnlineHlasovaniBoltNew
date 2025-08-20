import { useMutation } from '@apollo/client';
import type { Vote } from '../types/vote';
import { Card } from '../../shared/components/Card';
import { Input } from '../../shared/components/Input';
import { Button } from '../../shared/components/Button';
import { Textarea } from '../../shared/components/Textarea';
import { UPDATE_VOTE_SETTINGS } from '../graphql/votes';
import { useToast } from '../../shared/hooks/useToast';
import { useState } from 'react';

interface VoteSettingsProps {
  vote: Vote;
}

interface VoteSettingsForm {
  title: string;
  description: string;
  quorum_type: string;
  quorum_value: number;
  approval_type: string;
  approval_value: number;
  is_secret: boolean;
}

export function VoteSettings({ vote }: VoteSettingsProps) {
  const [formData, setFormData] = useState<VoteSettingsForm>({
    title: vote.title,
    description: vote.description,
    quorum_type: vote.quorum_type,
    quorum_value: vote.quorum_value,
    approval_type: vote.approval_type,
    approval_value: vote.approval_value,
    is_secret: vote.is_secret
  });

  const { showToast } = useToast();
  const [updateVote, { loading }] = useMutation(UPDATE_VOTE_SETTINGS, {
    onCompleted: () => {
      showToast({
        type: 'success',
        title: 'Nastavení uloženo',
        message: 'Změny byly úspěšně uloženy.'
      });
    },
    onError: (error) => {
      showToast({
        type: 'error',
        title: 'Chyba při ukládání',
        message: error.message
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateVote({
      variables: {
        id: vote.id,
        input: formData
      }
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Základní nastavení</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Název hlasování
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Popis
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Podmínky hlasování</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="quorum_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Typ kvóra
            </label>
            <select
              id="quorum_type"
              name="quorum_type"
              value={formData.quorum_type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <option value="PERCENTAGE">Procento</option>
              <option value="ABSOLUTE">Absolutní hodnota</option>
            </select>
          </div>
          <div>
            <label htmlFor="quorum_value" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Hodnota kvóra
            </label>
            <Input
              type="number"
              id="quorum_value"
              name="quorum_value"
              value={formData.quorum_value}
              onChange={handleChange}
              min={0}
              max={100}
              required
            />
          </div>
          <div>
            <label htmlFor="approval_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Typ schválení
            </label>
            <select
              id="approval_type"
              name="approval_type"
              value={formData.approval_type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <option value="PERCENTAGE">Procento</option>
              <option value="ABSOLUTE">Absolutní hodnota</option>
            </select>
          </div>
          <div>
            <label htmlFor="approval_value" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Hodnota schválení
            </label>
            <Input
              type="number"
              id="approval_value"
              name="approval_value"
              value={formData.approval_value}
              onChange={handleChange}
              min={0}
              max={100}
              required
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? 'Ukládám...' : 'Uložit změny'}
        </Button>
      </div>
    </form>
  );
}
