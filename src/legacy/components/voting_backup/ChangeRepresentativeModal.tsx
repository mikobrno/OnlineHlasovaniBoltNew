import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Vote, Member } from '../../types';
import { SET_VOTE_REPRESENTATIVE } from '../../graphql/mutations';
import { useToast } from '../../contexts/ToastContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface ChangeRepresentativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  vote: Vote;
  member: Member;
  buildingMembers: Member[];
}

export const ChangeRepresentativeModal: React.FC<ChangeRepresentativeModalProps> = ({
  isOpen,
  onClose,
  vote,
  member,
  buildingMembers,
}) => {
  const { showToast } = useToast();
  const [setVoteRepresentative, { loading: isSubmitting }] = useMutation(SET_VOTE_REPRESENTATIVE);
  const [selectedRepresentativeId, setSelectedRepresentativeId] = useState<string>('');

  const availableRepresentatives = buildingMembers.filter(m => m.id !== member.id);

  useEffect(() => {
    if (isOpen && member) {
      // TODO: Načíst zástupce pro hlasování z vote objektu, až bude k dispozici
      const currentRepresentative = member.representative_id || '';
      setSelectedRepresentativeId(currentRepresentative);
    }
  }, [isOpen, member]);

  const handleSave = async () => {
    if (!member) return;

    try {
      await setVoteRepresentative({
        variables: {
          vote_id: vote.id,
          member_id: member.id,
          representative_id: selectedRepresentativeId || null,
        },
      });
      const representativeName = selectedRepresentativeId
        ? availableRepresentatives.find(m => m.id === selectedRepresentativeId)?.name
        : 'nikdo';
      showToast(`Zástupce pro ${member.name} byl změněn na: ${representativeName}`, 'success');
      onClose();
    } catch (error: any) {
      console.error('Error setting representative:', error);
      showToast(`Chyba při nastavování zástupce: ${error.message}`, 'error');
    }
  };

  if (!member) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Změnit zástupce">
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-gray-100">
            Člen: {member.name}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Jednotka: {member.unit} | Váha hlasu: {member.vote_weight}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Vyberte zástupce pro toto hlasování
          </label>
          <select
            value={selectedRepresentativeId}
            onChange={(e) => setSelectedRepresentativeId(e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            title="Zástupce pro hlasování"
            disabled={isSubmitting}
          >
            <option value="">Žádný zástupce</option>
            {availableRepresentatives.map((rep) => (
              <option key={rep.id} value={rep.id}>
                {rep.name} (jednotka {rep.unit})
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>
            Tato změna platí pouze pro aktuální hlasování. 
            Trvalou změnu zástupce můžete provést v sekci Členové.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Zrušit
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? 'Ukládání...' : 'Uložit'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
