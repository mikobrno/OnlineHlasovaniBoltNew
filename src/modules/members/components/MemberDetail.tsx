import { FC } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Member } from '../types';
import { GET_MEMBER } from '../graphql/queries';
import { DEACTIVATE_MEMBER, REACTIVATE_MEMBER } from '../graphql/mutations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { membersLogger } from '../utils/logger';
import { useState } from 'react';

interface MemberDetailProps {
  memberId: string;
  onClose: () => void;
  onEdit: (member: Member) => void;
}

export const MemberDetail: FC<MemberDetailProps> = ({ memberId, onClose, onEdit }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'activate' | 'deactivate' | null>(null);

  const { data, loading, error } = useQuery(GET_MEMBER, {
    variables: { id: memberId },
  });

  const [deactivateMember] = useMutation(DEACTIVATE_MEMBER, {
    refetchQueries: [{ query: GET_MEMBER, variables: { id: memberId } }],
  });

  const [reactivateMember] = useMutation(REACTIVATE_MEMBER, {
    refetchQueries: [{ query: GET_MEMBER, variables: { id: memberId } }],
  });

  if (loading) {
    membersLogger.info('Načítání detailu člena...', { memberId });
    return <div>Načítání...</div>;
  }

  if (error) {
    membersLogger.error('Chyba při načítání detailu člena', error);
    return <div>Chyba: {error.message}</div>;
  }

  const member = data?.members_by_pk;
  if (!member) {
    membersLogger.error('Člen nebyl nalezen', { memberId });
    return <div>Člen nebyl nalezen</div>;
  }

  const handleStatusChange = async () => {
    try {
      if (member.is_active) {
        membersLogger.info('Deaktivace člena', { memberId });
        await deactivateMember({ variables: { id: memberId } });
        membersLogger.debug('Člen byl úspěšně deaktivován', { memberId });
      } else {
        membersLogger.info('Aktivace člena', { memberId });
        await reactivateMember({ variables: { id: memberId } });
        membersLogger.debug('Člen byl úspěšně aktivován', { memberId });
      }
      setShowConfirmDialog(false);
    } catch (error) {
      membersLogger.error(
        `Chyba při ${member.is_active ? 'deaktivaci' : 'aktivaci'} člena`,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  };

  const openConfirmDialog = (action: 'activate' | 'deactivate') => {
    setConfirmAction(action);
    setShowConfirmDialog(true);
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>
                {member.first_name} {member.last_name}
              </CardTitle>
              <CardDescription>{member.email}</CardDescription>
            </div>
            <div className="flex gap-2">
              {!member.is_active && (
                <Badge variant="secondary">Neaktivní</Badge>
              )}
              {member.is_owner && (
                <Badge>Vlastník</Badge>
              )}
              {member.is_committee_member && (
                <Badge variant="outline">Člen výboru</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Kontaktní údaje</h4>
              <div className="mt-1 space-y-1">
                <p>{member.email}</p>
                {member.phone && <p>{member.phone}</p>}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Jednotka</h4>
              <p className="mt-1">{member.unit_number}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Role</h4>
            <div className="mt-1 space-y-1">
              <p>{member.is_owner ? 'Vlastník' : 'Nájemník'}</p>
              {member.is_committee_member && <p>Člen výboru</p>}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Časové údaje</h4>
            <div className="mt-1 space-y-1">
              <p>Vytvořeno: {new Date(member.created_at).toLocaleString('cs-CZ')}</p>
              <p>Aktualizováno: {new Date(member.updated_at).toLocaleString('cs-CZ')}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>
            Zavřít
          </Button>
          <Button variant="outline" onClick={() => onEdit(member)}>
            Upravit
          </Button>
          <Button
            variant={member.is_active ? 'destructive' : 'default'}
            onClick={() => openConfirmDialog(member.is_active ? 'deactivate' : 'activate')}
          >
            {member.is_active ? 'Deaktivovat' : 'Aktivovat'}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction === 'deactivate' 
                ? 'Deaktivovat člena' 
                : 'Aktivovat člena'}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === 'deactivate'
                ? 'Opravdu chcete deaktivovat tohoto člena? Deaktivovaný člen nebude mít přístup k systému.'
                : 'Opravdu chcete aktivovat tohoto člena? Aktivovaný člen získá přístup k systému.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Zrušit
            </Button>
            <Button
              variant={confirmAction === 'deactivate' ? 'destructive' : 'default'}
              onClick={handleStatusChange}
            >
              {confirmAction === 'deactivate' ? 'Deaktivovat' : 'Aktivovat'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
