import React, { useState } from 'react';
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

export const MembersView: React.FC = () => {
  const { members, selectedBuilding, deleteMember, importMembers } = useApp();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberType | null>(null);

  const buildingMembers = members.filter(m => m.buildingId === selectedBuilding?.id);
  
  const filteredMembers = buildingMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (member: MemberType) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleDelete = (member: MemberType) => {
    if (window.confirm(`Opravdu chcete smazat člena ${member.name}?`)) {
      deleteMember(member.id);
    }
  };
  const handleSeedMembers = async () => {
    if (!selectedBuilding) {
      showToast('Nejprve vyberte budovu', 'error');
      return;
    }
    const bId = selectedBuilding.id;
    const demo: Omit<MemberType, 'id'>[] = [
      { name: 'Jan Novák', email: 'jan.novak+demo@example.com', phone: '+420601000001', unit: '1.01', voteWeight: 1.0, buildingId: bId },
      { name: 'Marie Svobodová', email: 'marie.svobodova+demo@example.com', phone: '+420601000002', unit: '1.02', voteWeight: 1.2, buildingId: bId },
      { name: 'Petr Dvořák', email: 'petr.dvorak+demo@example.com', phone: '+420601000003', unit: '2.01', voteWeight: 0.8, buildingId: bId },
      { name: 'Lucie Procházková', email: 'lucie.prochazkova+demo@example.com', phone: '+420601000004', unit: '2.02', voteWeight: 1.0, buildingId: bId },
      { name: 'Karel Černý', email: 'karel.cerny+demo@example.com', phone: '+420601000005', unit: '3.01', voteWeight: 1.5, buildingId: bId },
      { name: 'Eva Králová', email: 'eva.kralova+demo@example.com', phone: '+420601000006', unit: '3.02', voteWeight: 1.1, buildingId: bId },
      { name: 'Tomáš Pokorný', email: 'tomas.pokorny+demo@example.com', phone: '+420601000007', unit: '4.01', voteWeight: 0.9, buildingId: bId },
      { name: 'Alena Jelínková', email: 'alena.jelinkova+demo@example.com', phone: '+420601000008', unit: '4.02', voteWeight: 1.3, buildingId: bId },
      { name: 'Milan Beneš', email: 'milan.benes+demo@example.com', phone: '+420601000009', unit: '5.01', voteWeight: 1.0, buildingId: bId },
      { name: 'Hana Fialová', email: 'hana.fialova+demo@example.com', phone: '+420601000010', unit: '5.02', voteWeight: 1.0, buildingId: bId }
    ];
    try {
      await importMembers(demo);
      showToast(`Přidáno ${demo.length} demo členů`, 'success');
    } catch {
      showToast('Nepodařilo se přidat demo členy', 'error');
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
