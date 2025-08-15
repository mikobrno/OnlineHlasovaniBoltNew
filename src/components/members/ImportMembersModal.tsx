import React, { useState } from 'react';
import { useApp } from '../../hooks/useApp';
import { useToast } from '../../contexts/ToastContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Member } from '../../data/mockData';
import { generateId } from '../../lib/utils';

interface ImportMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportMembersModal: React.FC<ImportMembersModalProps> = ({
  isOpen,
  onClose
}) => {
  const { selectedBuilding, importMembers } = useApp();
  const { showToast } = useToast();
  const [csvData, setCsvData] = useState('');

  const handleImport = () => {
    if (!selectedBuilding || !csvData.trim()) {
      showToast('Zadejte data pro import', 'error');
      return;
    }

    try {
      const lines = csvData.trim().split('\n');
      const members: Member[] = [];
      let errors = 0;

      lines.forEach((line, index) => {
        if (line.trim()) {
          // Try different separators
          const separators = [';', ',', '\t'];
          let parts: string[] = [];
          
          for (const sep of separators) {
            const testParts = line.split(sep);
            if (testParts.length >= 3) {
              parts = testParts;
              break;
            }
          }

          if (parts.length >= 3) {
            const member: Member = {
              id: generateId(),
              name: parts[0]?.trim() || '',
              email: parts[1]?.trim() || '',
              unit: parts[2]?.trim() || '',
              voteWeight: parseFloat(parts[3]?.trim()) || 1,
              phone: parts[4]?.trim() || '',
              buildingId: selectedBuilding.id
            };

            if (member.name && member.email && member.unit) {
              members.push(member);
            } else {
              errors++;
            }
          } else {
            errors++;
          }
        }
      });

      if (members.length > 0) {
        importMembers(members);
        showToast(`Importováno ${members.length} členů${errors > 0 ? `, ${errors} chyb přeskočeno` : ''}`, 'success');
        setCsvData('');
        onClose();
      } else {
        showToast('Žádní platní členové k importu', 'error');
      }
    } catch (error) {
      showToast('Chyba při importu dat', 'error');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import členů" size="lg">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Vložte data členů ve formátu CSV. Podporované oddělovače: středník (;), čárka (,), nebo tabulátor.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-sm font-mono text-gray-700 dark:text-gray-300 mb-4">
            <div className="font-medium mb-1">Formát řádku:</div>
            <div>Jméno;Email;Jednotka;VáhaHlasu;Telefon</div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Příklad:<br/>
              Jan Novák;jan.novak@email.cz;1.01;1.5;+420123456789<br/>
              Marie Svobodová;marie@email.cz;2.03;1.2;+420987654321
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            CSV Data
          </label>
          <textarea
            value={csvData}
            onChange={(e) => setCsvData(e.target.value)}
            rows={8}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
            placeholder="Vložte CSV data zde..."
          />
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <p className="font-medium text-blue-800 dark:text-blue-200">Poznámka:</p>
          <ul className="mt-1 list-disc list-inside space-y-1 text-blue-700 dark:text-blue-300">
            <li>Povinné jsou pouze Jméno, Email a Jednotka</li>
            <li>VáhaHlasu je nepovinná, výchozí hodnota je 1</li>
            <li>Telefon je nepovinný</li>
            <li>Import přepíše všechny stávající členy této budovy</li>
          </ul>
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose}>
            Zrušit
          </Button>
          <Button onClick={handleImport} disabled={!csvData.trim()}>
            Importovat členy
          </Button>
        </div>
      </div>
    </Modal>
  );
};
