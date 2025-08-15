import React, { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useMutation } from '@apollo/client';
import { ADD_MEMBER, GET_MEMBERS } from '../../graphql/members';

interface ImportMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  buildingId: string;
}

export const ImportMembersModal: React.FC<ImportMembersModalProps> = ({
  isOpen,
  onClose,
  buildingId
}) => {
  const { showToast } = useToast();
  const [csvData, setCsvData] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [addMemberMutation] = useMutation(ADD_MEMBER, {
     refetchQueries: [{ query: GET_MEMBERS, variables: { buildingId } }],
  });

  const handleImport = async () => {
    if (!buildingId || !csvData.trim()) {
      showToast('Vyberte budovu a zadejte data pro import.', 'error');
      return;
    }
    setIsLoading(true);

    try {
      const lines = csvData.trim().split('\n');
      const membersToImport = [];
      let errorsCount = 0;

      for (const line of lines) {
        if (!line.trim()) continue;

        const separators = [';', ',', '\t'];
        let parts: string[] = [];
        for (const sep of separators) {
            const testParts = line.split(sep);
            if (testParts.length >= 3) {
                parts = testParts.map(p => p.trim());
                break;
            }
        }

        if (parts.length >= 3) {
          const [name, email, unit, vote_weight_str, phone] = parts;
          if (name && email && unit) {
            membersToImport.push({
              name,
              email,
              unit,
              vote_weight: parseFloat(vote_weight_str) || 1,
              phone: phone || null,
              building_id: buildingId,
            });
          } else {
            errorsCount++;
          }
        } else {
          errorsCount++;
        }
      }

      if (membersToImport.length > 0) {
        // TODO: Zvážit smazání stávajících členů před importem, pokud je to požadováno.
        // Prozatím jen přidáváme nové.

        for (const member of membersToImport) {
            await addMemberMutation({ variables: { member } });
        }
        
        showToast(`Úspěšně importováno ${membersToImport.length} členů. ${errorsCount > 0 ? `Přeskočeno ${errorsCount} chybných řádků.` : ''}`, 'success');
        setCsvData('');
        onClose();
      } else {
        showToast('Nenalezena žádná platná data pro import.', 'warning');
      }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Neznámá chyba';
        showToast(`Chyba při importu: ${message}`, 'error');
    } finally {
        setIsLoading(false);
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
              Marie Svobodová;marie@email.cz;2.03;1.2;
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
            disabled={isLoading}
          />
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
          <p className="font-medium text-yellow-800 dark:text-yellow-200">Důležité:</p>
          <ul className="mt-1 list-disc list-inside space-y-1 text-yellow-700 dark:text-yellow-300">
            <li>Povinné sloupce jsou: Jméno, Email, Jednotka.</li>
            <li>VáhaHlasu a Telefon jsou nepovinné.</li>
            <li>Tato operace pouze přidá nové členy. Stávající členové nebudou ovlivněni.</li>
          </ul>
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Zrušit
          </Button>
          <Button onClick={handleImport} disabled={!csvData.trim() || isLoading}>
            {isLoading ? 'Importuji...' : 'Importovat členy'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
