import React, { useState } from 'react';
import { Plus, Upload, Search } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { PageHeader } from '../common/PageHeader';
import { Input } from '../common/Input';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { MemberFormModal } from './MemberFormModal';
import { ImportMembersModal } from './ImportMembersModal';
import { Member } from '../../data/mockData';

export const MembersView: React.FC = () => {
  const { members, selectedBuilding, deleteMember } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const buildingMembers = members.filter(m => m.buildingId === selectedBuilding?.id);
  
  const filteredMembers = buildingMembers.filter(member =>
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
      deleteMember(member.id);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingMember(null);
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
                  const representative = member.representativeId 
                    ? buildingMembers.find(m => m.id === member.representativeId)
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
                        {member.voteWeight}
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
        member={editingMember}
      />

      <ImportMembersModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
      />
    </div>
  );
};