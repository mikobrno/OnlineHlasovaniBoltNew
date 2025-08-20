import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useVote } from '../hooks/useVotes';
import { FullPageSpinner } from '../../shared/components/FullPageSpinner';
import { Tab } from '@headlessui/react';
import { cn } from '../../shared/utils/cn';
import { VoteDetailHeader } from './VoteDetailHeader';
import { VoteOverview } from './VoteOverview';
import { VoteMembers } from './VoteMembers';
import { VoteAttachments } from './VoteAttachments';
import { VoteResults } from './VoteResults';
import { VoteSettings } from './VoteSettings';

const tabs = [
  { id: 'overview', name: 'Přehled' },
  { id: 'members', name: 'Členové' },
  { id: 'attachments', name: 'Přílohy' },
  { id: 'results', name: 'Výsledky' },
  { id: 'settings', name: 'Nastavení' },
];

export function VoteDetailView() {
  const { voteId } = useParams<{ voteId: string }>();
  const { data, loading, error } = useVote(voteId!);
  const [selectedTab, setSelectedTab] = useState(0);

  if (loading) {
    return <FullPageSpinner message="Načítám detail hlasování..." />;
  }

  if (error || !data?.vote) {
    return (
      <div className="text-center p-8 text-red-600">
        Nepodařilo se načíst detail hlasování.
      </div>
    );
  }

  const { vote } = data;

  return (
    <div className="space-y-6">
      <VoteDetailHeader vote={vote} />
      
      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              className={({ selected }) => cn(
                'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                'ring-white ring-opacity-60 ring-offset-2 focus:outline-none',
                selected
                  ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-500'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              )}
            >
              {tab.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-4">
          <Tab.Panel>
            <VoteOverview vote={vote} />
          </Tab.Panel>
          <Tab.Panel>
            <VoteMembers vote={vote} />
          </Tab.Panel>
          <Tab.Panel>
            <VoteAttachments vote={vote} />
          </Tab.Panel>
          <Tab.Panel>
            <VoteResults vote={vote} />
          </Tab.Panel>
          <Tab.Panel>
            <VoteSettings vote={vote} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
