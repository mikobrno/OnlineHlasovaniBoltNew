import { FC, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Member } from '../types';
import { DEACTIVATE_MEMBER, REACTIVATE_MEMBER } from '../graphql/mutations';
import { GET_MEMBERS } from '../graphql/queries';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { membersLogger } from '../utils/logger';

interface BatchOperationsProps {
  members: Member[];
  onComplete: () => void;
}

export const BatchOperations: FC<BatchOperationsProps> = ({ members, onComplete }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [operationType, setOperationType] = useState<'activate' | 'deactivate' | null>(null);

  const [deactivateMembers] = useMutation(DEACTIVATE_MEMBER);
  const [reactivateMembers] = useMutation(REACTIVATE_MEMBER);

  const handleToggleAll = () => {
    if (selectedIds.size === members.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(members.map(m => m.id)));
    }
  };

  const handleToggleMember = (id: string) => {
    const newIds = new Set(selectedIds);
    if (newIds.has(id)) {
      newIds.delete(id);
    } else {
      newIds.add(id);
    }
    setSelectedIds(newIds);
  };

  const handleOperation = async () => {
    if (!operationType || selectedIds.size === 0) return;

    const mutation = operationType === 'deactivate' ? deactivateMembers : reactivateMembers;
    const ids = Array.from(selectedIds);

    membersLogger.info(
      `Hromadná operace: ${operationType === 'deactivate' ? 'deaktivace' : 'aktivace'}`,
      { count: ids.length }
    );

    try {
      // Provést operace sekvenčně pro každého člena
      for (const id of ids) {
        membersLogger.debug(`Zpracování člena`, { memberId: id });
        await mutation({
          variables: { id },
          refetchQueries: [{ query: GET_MEMBERS }],
        });
      }

      membersLogger.info('Hromadná operace byla úspěšně dokončena', {
        operation: operationType,
        processedCount: ids.length
      });

      setSelectedIds(new Set());
      setShowConfirmDialog(false);
      setOperationType(null);
      onComplete();
    } catch (error) {
      membersLogger.error('Chyba při hromadné operaci', error instanceof Error ? error : new Error(String(error)));
    }
  };

  const startOperation = (type: 'activate' | 'deactivate') => {
    setOperationType(type);
    setShowConfirmDialog(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <Checkbox
            checked={selectedIds.size === members.length}
            onClick={handleToggleAll}
          />
          <span className="text-sm">
            Vybráno: {selectedIds.size} z {members.length}
          </span>
        </div>

        {selectedIds.size > 0 && (
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => startOperation('activate')}
            >
              Aktivovat vybrané
            </Button>
            <Button
              variant="destructive"
              onClick={() => startOperation('deactivate')}
            >
              Deaktivovat vybrané
            </Button>
          </div>
        )}
      </div>

      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center space-x-2 p-2 hover:bg-gray-50"
        >
          <Checkbox
            checked={selectedIds.has(member.id)}
            onClick={() => handleToggleMember(member.id)}
          />
          <span>
            {member.first_name} {member.last_name}
          </span>
        </div>
      ))}

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {operationType === 'deactivate'
                ? 'Hromadná deaktivace členů'
                : 'Hromadná aktivace členů'}
            </DialogTitle>
            <DialogDescription>
              {operationType === 'deactivate'
                ? `Opravdu chcete deaktivovat ${selectedIds.size} vybraných členů? 
                   Deaktivovaní členové ztratí přístup k systému.`
                : `Opravdu chcete aktivovat ${selectedIds.size} vybraných členů? 
                   Aktivovaní členové získají přístup k systému.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Zrušit
            </Button>
            <Button
              variant={operationType === 'deactivate' ? 'destructive' : 'default'}
              onClick={handleOperation}
            >
              {operationType === 'deactivate' ? 'Deaktivovat' : 'Aktivovat'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
