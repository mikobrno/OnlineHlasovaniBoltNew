// src/modules/buildings/components/BuildingsModule.tsx
import { FC } from 'react';
import { BuildingProvider } from '../context/BuildingContext';
import { BuildingList } from './BuildingList';
import { BuildingForm } from './BuildingForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useBuildingContext } from '../context/BuildingContext';

const BuildingsModuleContent: FC = () => {
  const { isFormOpen, closeForm, openForm } = useBuildingContext();

  return (
    <div className="container mx-auto py-8">
      <BuildingList onAddBuilding={openForm} />

      <Dialog 
        open={isFormOpen} 
        onOpenChange={(open: boolean) => !open && closeForm()}
      >
        <DialogContent className="sm:max-w-[600px]">
          <div className="py-4">
            <BuildingForm onSuccess={closeForm} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const BuildingsModule: FC = () => {
  return (
    <BuildingProvider>
      <BuildingsModuleContent />
    </BuildingProvider>
  );
};
