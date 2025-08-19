import React, { useState, useMemo } from 'react';
import { Plus, Upload, Search } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client';
import { useToast } from '../../contexts/ToastContext';
import { PageHeader } from '../common/PageHeader';
import { Input } from '../common/Input';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { MemberFormModal } from './MemberFormModal';
import { ImportMembersModal } from './ImportMembersModal';
import {
    GET_MEMBERS,
    DELETE_MEMBER,
    type Member
} from '../../graphql/members';

interface MembersViewProps {
  buildingId: string;
}

export const MembersView: React.FC<MembersViewProps> = ({ buildingId }) => {
  // Strict validation - buildingId must be a valid UUID-like string
  const isValidBuildingId = typeof buildingId === 'string' && 
    buildingId.trim().length > 0 && 
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(buildingId.trim());
  
  const validBuildingId = isValidBuildingId ? buildingId.trim() : null;
  
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_MEMBERS, {
    variables: { buildingId: validBuildingId },
    skip: !validBuildingId,
  });

  const [deleteMemberMutation] = useMutation(DELETE_MEMBER, {
    onCompleted: () => {
        showToast('Člen byl úspěšně smazán', 'success');
        refetch();
    },
    onError: (error) => {
      showToast(`Chyba při mazání člena: ${error.message}`, 'error');
    }
  });

  const members = useMemo(() => (data?.members as Member[]) || [], [data]);

  const membersMap = useMemo(() =>
    members.reduce((acc: Record<string, Member>, member: Member) => {
      acc[member.id] = member;
      return acc;
    }, {}),
  [members]);
  
  const filteredMembers = useMemo(() =>
    members.filter((member: Member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.unit && member.unit.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [members, searchTerm]);

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleDelete = async (memberId: string) => {
    if (!window.confirm(`Opravdu chcete smazat tohoto člena?`)) {
      return;
    }
    await deleteMemberMutation({ variables: { id: memberId } });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingMember(null);
    refetch();
  };

  if (!validBuildingId) {
    return (
        <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300">Vyberte budovu</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Pro zobrazení členů je potřeba nejprve vybrat budovu.</p>
        </div>
    );
  }

  if (loading) return <div className="text-center p-8">Načítám členy...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Chyba při načítání členů: {error.message}</div>;

  return (
    <div>
      <PageHeader
        title="Členové"
        subtitle={`${filteredMembers.length} členů`}
        action={{
          label: 'Nový člen',
          onClick: () => { setEditingMember(null); setShowForm(true); },
          icon: <Plus className="w-4 h-4" />,
        }}
      />

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Hledat členy (jméno, email, jednotka)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="secondary" onClick={() => setShowImport(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Import členů
        </Button>
      </div>

      {filteredMembers.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            {searchTerm ? 'Žádní členové nevyhovují filtru' : 'V této budově zatím nejsou žádní členové.'}
          </div>
           <Button onClick={() => { setEditingMember(null); setShowForm(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Přidat prvního člena
            </Button>
        </div>
      ) : (
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Jméno
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Kontakt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Jednotka
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Váha hlasu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Zastupuje
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Akce</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMembers.map((member: Member) => {
                  const representative = member.representative_id
                    ? membersMap[member.representative_id]
                    : null;
                    
                  return (
                    <tr key={member.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {member.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div>
                          <div>{member.email}</div>
                          <div className="text-xs">{member.phone || '-'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {member.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {member.vote_weight}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {representative ? representative.name : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(member)}
                        >
                          Upravit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(member.id)}
                        >
                          Smazat
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <MemberFormModal
        isOpen={showForm}
        onClose={closeForm}
        member={editingMember}
        buildingId={buildingId}
      />

      <ImportMembersModal
        isOpen={showImport}
        onClose={() => {
          setShowImport(false);
          refetch();
        }}
        buildingId={buildingId}
      />
    </div>
  );
};