import React, { useState, useEffect } from 'react';
import { Vote } from '../../data/mockData';
import { useApp } from '../../contexts/AppContextCompat';
import { useToast } from '../../contexts/ToastContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface ChangeRepresentativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  vote: Vote;
  memberId: string;
}

export const ChangeRepresentativeModal: React.FC<ChangeRepresentativeModalProps> = ({
  isOpen,
  onClose,
  vote,
  memberId
}) => {
  const { members, setRepresentative } = useApp();
  const { showToast } = useToast();
  const [selectedRepresentativeId, setSelectedRepresentativeId] = useState<string>('');

  const buildingMembers = members.filter(m => m.buildingId === vote.buildingId);
  const member = buildingMembers.find(m => m.id === memberId);
  const availableRepresentatives = buildingMembers.filter(m => m.id !== memberId);

  useEffect(() => {
    if (member) {
      const currentRepresentative = vote.memberRepresentatives?.[memberId] || member.representativeId || '';
      setSelectedRepresentativeId(currentRepresentative);
    }
  }, [member, vote.memberRepresentatives, memberId]);

  const handleSave = () => {
    if (!member) return;

    setRepresentative(vote.id, memberId, selectedRepresentativeId || undefined);
    
    const representativeName = selectedRepresentativeId 
      ? availableRepresentatives.find(m => m.id === selectedRepresentativeId)?.name
      : 'nikdo';
    
    showToast(`Zástupce pro ${member.name} byl změněn na: ${representativeName}`, 'success');
    onClose();
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
            Jednotka: {member.unit} | Váha hlasu: {member.voteWeight}
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
          <Button variant="secondary" onClick={onClose}>
            Zrušit
          </Button>
          <Button onClick={handleSave}>
            Uložit
          </Button>
        </div>
      </div>
    </Modal>
  );
};
