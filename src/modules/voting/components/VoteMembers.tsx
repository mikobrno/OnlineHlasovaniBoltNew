import type { Vote } from '../types/vote';
import { Card } from '../../shared/components/Card';
import { Input } from '../../shared/components/Input';
import { useState } from 'react';

interface VoteMembersProps {
  vote: Vote;
}

export function VoteMembers({ vote }: VoteMembersProps) {
  const [search, setSearch] = useState('');
  const members = vote.members || [];

  const filteredMembers = members.filter((member) => 
    member.member.name.toLowerCase().includes(search.toLowerCase()) ||
    member.member.unit_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <Input
          type="search"
          placeholder="Vyhledat podle jména nebo čísla jednotky..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card>

      <div className="space-y-4">
        {filteredMembers.map((voteMember) => (
          <Card key={voteMember.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{voteMember.member.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Jednotka: {voteMember.member.unit_number}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Váha hlasu: {voteMember.vote_weight}
                </p>
              </div>
              {voteMember.vote_date && (
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {voteMember.vote_option}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {new Date(voteMember.vote_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
