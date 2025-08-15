import React, { useState } from 'react';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useToast } from '../../contexts/ToastContext';
import { PageHeader } from '../common/PageHeader';
import { Input } from '../common/Input';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { MemberFormModal } from './MemberFormModal';
import { ImportMembersModal } from './ImportMembersModal';

// GraphQL dotaz pro načtení členů
const GET_MEMBERS_QUERY = gql`
  query GetMembers($building_id: uuid!) {
    members(where: { building_id: { _eq: $building_id } }) {
      id
      name
      email
      phone
      unit
      vote_weight
      representative_id
      building_id
    }
  }
`;

// GraphQL mutace pro smazání člena
const DELETE_MEMBER_MUTATION = gql`
  mutation DeleteMember($id: uuid!) {
    delete_members_by_pk(id: $id) {
      id
    }
  }
`;

// Typ pro člena
export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  unit: string;
  vote_weight: number;
  representative_id?: string;
  building_id: string;
}t, { useState } from 'react';
import { Plus, Upload, Search, Users } from 'lucide-react';
import { useApp } from '../../contexts/AppContextCompat';
import { useToast } from '../../contexts/ToastContext';
import { PageHeader } from '../common/PageHeader';
import { Input } from '../common/Input';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { MemberFormModal } from './MemberFormModal';
import { ImportMembersModal } from './ImportMembersModal';
import type { Member as MemberType } from '../../data/mockData';

interface MembersViewProps {
  selectedBuilding?: {
    id: string;
    name: string;
  };
}

export const MembersView: React.FC<MembersViewProps> = ({ selectedBuilding }) => {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Načtení členů pomocí GraphQL
  const { data, loading, error, refetch } = useQuery(GET_MEMBERS_QUERY, {
    variables: { building_id: selectedBuilding?.id },
    skip: !selectedBuilding?.id
  });

  // Mutace pro smazání člena
  const [deleteMemberMutation] = useMutation(DELETE_MEMBER_MUTATION, {
    refetchQueries: [
      {
        query: GET_MEMBERS_QUERY,
        variables: { building_id: selectedBuilding?.id }
      }
    ]
  });

  const members: Member[] = data?.members || [];
  
  const filteredMembers = members.filter((member: Member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleDelete = (member: Member) => {
    if (window.confirm(`Opravdu chcete smazat člena ${member.name}?`)) {
      deleteMemberMutation({ 
        variables: { id: member.id }
      }).then(() => {
        showToast('Člen byl úspěšně smazán', 'success');
      }).catch((err) => {
        showToast(`Chyba při mazání člena: ${err.message}`, 'error');
      });
    }
  };

  const handleSeedMembers = async () => {
    if (!selectedBuilding) {
      showToast('Nejprve vyberte budovu', 'error');
      return;
    }
    
    // TODO: Implementovat přes GraphQL mutaci
    showToast('Funkce není zatím implementována', 'error');
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingMember(null);
    refetch(); // Aktualizace seznamu členů po uzavření formuláře
  };

  return (
    <div>
      <PageHeader
        title="Členové"
        subtitle={`${filteredMembers.length} členů v budově ${selectedBuilding?.name}`}
        action={{
          label: 'Nový člen',
          onClick: () => setShowForm(true),
          icon: <Plus className="w-4 h-4" />
        }}
      />

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Hledat členy..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="secondary" onClick={() => setShowImport(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Import členů
        </Button>
        <Button variant="secondary" onClick={handleSeedMembers} disabled={!selectedBuilding}>
          <Users className="w-4 h-4 mr-2" />
          Naplnit test data
        </Button>
      </div>

      {filteredMembers.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            {searchTerm 
              ? 'Žádní členové nevyhovují filtru'
              : 'Zatím žádní členové'
            }
          </div>
        </div>
      ) : (
        <Card className="p-6">
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Akce
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMembers.map((member) => {
                  const representative = member.representative_id 
                    ? members.find(m => m.id === member.representative_id)
                    : null;
                    
                  return (
                    <tr key={member.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {member.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div>
                          <div>{member.email}</div>
                          <div className="text-xs">{member.phone}</div>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
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
                          onClick={() => handleDelete(member)}
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
        member={editingMember ? {
          ...editingMember,
          voteWeight: editingMember.vote_weight,
          buildingId: editingMember.building_id
        } : null}
      />

      <ImportMembersModal
        isOpen={showImport}
        onClose={() => {
          setShowImport(false);
          refetch(); // Aktualizace seznamu po importu
        }}
      />
    </div>
  );
};
