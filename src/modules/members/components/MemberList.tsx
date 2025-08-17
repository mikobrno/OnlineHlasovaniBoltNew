import { FC, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Member } from '../types';
import { useMemberContext } from '../context/MemberContext';
import { GET_MEMBERS } from '../graphql/queries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { membersLogger } from '../utils/logger';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { MemberDetail } from './MemberDetail';

export const MemberList: FC = () => {
  const { filters, setSelectedMember, setEditingMember, openForm } = useMemberContext();
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const { data, loading, error } = useQuery(GET_MEMBERS, {
    variables: {
      buildingId: filters.buildingId,
      isActive: filters.isActive,
      isOwner: filters.isOwner,
      isCommitteeMember: filters.isCommitteeMember,
      searchQuery: filters.searchQuery ? `%${filters.searchQuery}%` : undefined,
    },
  });

  if (loading) {
    membersLogger.info('Načítání seznamu členů...');
    return <div>Načítání...</div>;
  }

  if (error) {
    membersLogger.error('Chyba při načítání seznamu členů', error);
    return <div>Chyba: {error.message}</div>;
  }

  const members = data?.members || [];
  membersLogger.debug('Načteno členů:', { count: members.length });

  const handleEdit = (member: Member) => {
    membersLogger.debug('Úprava člena', { memberId: member.id });
    setEditingMember(member);
    openForm();
  };

  const handleSelect = (member: Member) => {
    membersLogger.debug('Výběr člena', { memberId: member.id });
    setSelectedMember(member);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Seznam členů</h2>
        <Button onClick={() => openForm()}>Přidat člena</Button>
      </div>

      <div className="grid gap-4">
        {members.map((member: Member) => (
          <div
            key={member.id}
            className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
            onClick={() => handleSelect(member)}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-semibold">
                  {member.first_name} {member.last_name}
                </h3>
                <p className="text-sm text-gray-600">{member.email}</p>
                {member.phone && (
                  <p className="text-sm text-gray-600">{member.phone}</p>
                )}
                <p className="text-sm">Jednotka: {member.unit_number}</p>
                <div className="flex gap-2 mt-2">
                  {!member.is_active && (
                    <Badge variant="secondary">Neaktivní</Badge>
                  )}
                  {member.is_owner && (
                    <Badge>Vlastník</Badge>
                  )}
                  {member.is_committee_member && (
                    <Badge variant="outline">Člen výboru</Badge>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleEdit(member);
                }}
              >
                Upravit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
