import { FC } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SystemStats } from './SystemStats';
import { SystemSettingsManager } from './SystemSettingsManager';
import { AuditLog } from './AuditLog';
import { adminLogger } from '../utils/logger';

export const AdminModule: FC = () => {
  adminLogger.info('Inicializace admin modulu');

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Administrace systému</h1>

      <Tabs defaultValue="stats" className="space-y-4">
        <TabsList>
          <TabsTrigger value="stats" onClick={() => adminLogger.debug('Přepnutí na přehled')}>
            Přehled
          </TabsTrigger>
          <TabsTrigger value="settings" onClick={() => adminLogger.debug('Přepnutí na nastavení')}>
            Nastavení
          </TabsTrigger>
          <TabsTrigger value="audit" onClick={() => adminLogger.debug('Přepnutí na audit log')}>
            Audit log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stats">
          <SystemStats />
        </TabsContent>

        <TabsContent value="settings">
          <SystemSettingsManager />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLog />
        </TabsContent>
      </Tabs>
    </div>
  );
};
