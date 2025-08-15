import React, { useState, useEffect } from 'react';
import { useApp } from '../../hooks/useApp';
import { useToast } from '../../contexts/ToastContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_MEMBERS,
  ADD_MEMBER,
  UPDATE_MEMBER,
  type Member
} from '../../graphql/members';

interface MemberFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  member?: Member | null;
}

export const MemberFormModal: React.FC<MemberFormModalProps> = ({
  isOpen,
  onClose,
  member
}) => {
  const { selectedBuilding } = useApp();
  const { showToast } = useToast();

  // GraphQL mutace
  const [addMemberMutation] = useMutation(ADD_MEMBER, {
    refetchQueries: [
      {
        query: GET_MEMBERS,
        variables: { buildingId: selectedBuilding?.id },
      },
    ],
    onError: (error) => {
      showToast(`Chyba při přidání člena: ${error.message}`, 'error');
    }
  });

  const [updateMemberMutation] = useMutation(UPDATE_MEMBER, {
    refetchQueries: [
      {
        query: GET_MEMBERS,
        variables: { buildingId: selectedBuilding?.id },
      },
    ],
    onError: (error) => {
      showToast(`Chyba při aktualizaci člena: ${error.message}`, 'error');
    }
  });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    unit: '',
    vote_weight: 1,
    representative_id: ''
  });

  const { data: membersData } = useQuery(GET_MEMBERS, {
    variables: { buildingId: selectedBuilding?.id },
    skip: !selectedBuilding?.id,
  });

  const buildingMembers = (membersData?.members || []).filter((m: Member) => 
    m.id !== member?.id
  );

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        phone: member.phone,
        unit: member.unit,
        vote_weight: member.vote_weight,
        representative_id: member.representative_id || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        unit: '',
        vote_weight: 1,
        representative_id: ''
      });
    }
  }, [member]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBuilding) return;
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.unit.trim()) {
      showToast('Vyplňte všechna povinná pole', 'error');
      return;
    }

    const memberData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      unit: formData.unit.trim(),
      vote_weight: formData.vote_weight,
      representative_id: formData.representative_id || null,
      building_id: selectedBuilding.id
    };

    try {
      if (member) {
        await updateMemberMutation({
          variables: {
            id: member.id,
            ...memberData,
          },
        });
        showToast('Člen byl aktualizován', 'success');
      } else {
        await addMemberMutation({
          variables: memberData,
        });
        showToast('Člen byl přidán', 'success');
      }
      onClose();
    } catch {
      // Chyby už jsou zpracovány v konfiguraci mutací
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={member ? 'Upravit člena' : 'Nový člen'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Jméno a příjmení *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Jan Novák"
          required
        />

        <Input
          label="E-mail *"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="jan.novak@email.cz"
          required
        />

        <Input
          label="Telefon"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+420 123 456 789"
        />

        <Input
          label="Číslo jednotky *"
          value={formData.unit}
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          placeholder="1.01"
          required
        />

        <Input
          label="Váha hlasu"
          type="number"
          step="0.1"
          min="0.1"
          value={formData.vote_weight}
          onChange={(e) => setFormData({ ...formData, vote_weight: parseFloat(e.target.value) || 1 })}
          helperText="Váha hlasu podle velikosti podílu"
        />

        <div>
          <label htmlFor="representative" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Zástupce
          </label>
          <select
            id="representative"
            aria-label="Vyberte zástupce"
            value={formData.representative_id}
            onChange={(e) => setFormData({ ...formData, representative_id: e.target.value })}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Žádný zástupce</option>
            {buildingMembers.map((rep) => (
              <option key={rep.id} value={rep.id}>
                {rep.name} (jednotka {rep.unit})
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Vyberte člena, který bude zastupovat tohoto člena při hlasování
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Zrušit
          </Button>
          <Button type="submit">
            {member ? 'Aktualizovat' : 'Přidat'} člena
          </Button>
        </div>
      </form>
    </Modal>
  );
};
