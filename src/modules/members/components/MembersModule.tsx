import { FC } from 'react';
import { MemberProvider } from '../context/MemberContext';
import { MemberList } from './MemberList';
import { MemberFilters } from './MemberFilters';
import { MemberForm } from './MemberForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useMemberContext } from '../context/MemberContext';
import { membersLogger } from '../utils/logger';

const MembersModuleContent: FC = () => {
  const { isFormOpen, closeForm } = useMemberContext();

  return (
    <div className="container mx-auto py-8 space-y-6">
      <MemberFilters />
      <MemberList />

      <Dialog 
        open={isFormOpen} 
        onOpenChange={(open: boolean) => {
          if (!open) {
            membersLogger.debug('Zavírání formuláře člena');
            closeForm();
          }
        }}
      >
        <DialogContent className="sm:max-w-[700px]">
          <div className="py-4">
            <h2 className="text-lg font-semibold mb-4">
              Správa člena
            </h2>
            <MemberForm onSuccess={closeForm} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const MembersModule: FC = () => {
  membersLogger.info('Inicializace modulu členů');
  
  return (
    <MemberProvider>
      <MembersModuleContent />
    </MemberProvider>
  );
};
