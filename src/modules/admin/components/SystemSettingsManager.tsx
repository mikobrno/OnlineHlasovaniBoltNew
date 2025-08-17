import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation } from '@apollo/client';
import { GET_SYSTEM_SETTINGS } from '../graphql/queries';
import { UPDATE_SYSTEM_SETTING, CREATE_SYSTEM_SETTING, DELETE_SYSTEM_SETTING } from '../graphql/mutations';
import { SystemSettings, SettingFormData } from '../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { adminLogger } from '../utils/logger';

const settingSchema = z.object({
  key: z.string().min(1, { message: 'Klíč je povinný' }),
  value: z.string().min(1, { message: 'Hodnota je povinná' }),
  description: z.string().optional(),
  category: z.string().min(1, { message: 'Kategorie je povinná' }),
  isPublic: z.boolean(),
});

export const SystemSettingsManager: FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<SystemSettings | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [settingToDelete, setSettingToDelete] = useState<SystemSettings | null>(null);

  const { data, loading, error } = useQuery(GET_SYSTEM_SETTINGS);

  const [updateSetting] = useMutation(UPDATE_SYSTEM_SETTING, {
    refetchQueries: [{ query: GET_SYSTEM_SETTINGS }],
  });

  const [createSetting] = useMutation(CREATE_SYSTEM_SETTING, {
    refetchQueries: [{ query: GET_SYSTEM_SETTINGS }],
  });

  const [deleteSetting] = useMutation(DELETE_SYSTEM_SETTING, {
    refetchQueries: [{ query: GET_SYSTEM_SETTINGS }],
  });

  const form = useForm<z.infer<typeof settingSchema>>({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      key: '',
      value: '',
      description: '',
      category: '',
      isPublic: false,
    },
  });

  if (loading) {
    adminLogger.info('Načítání systémových nastavení...');
    return <div>Načítání...</div>;
  }

  if (error) {
    adminLogger.error('Chyba při načítání systémových nastavení', error);
    return <div>Chyba: {error.message}</div>;
  }

  const settings = data?.settings || [];
  adminLogger.debug('Načtena systémová nastavení', { count: settings.length });

  const handleEdit = (setting: SystemSettings) => {
    adminLogger.debug('Úprava nastavení', { settingId: setting.id });
    setEditingSetting(setting);
    form.reset({
      key: setting.key,
      value: setting.value,
      description: setting.description || '',
      category: setting.category,
      isPublic: setting.is_public,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (setting: SystemSettings) => {
    adminLogger.debug('Příprava smazání nastavení', { settingId: setting.id });
    setSettingToDelete(setting);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!settingToDelete) return;

    try {
      adminLogger.info('Mazání nastavení', { settingId: settingToDelete.id });
      await deleteSetting({
        variables: { id: settingToDelete.id },
      });
      adminLogger.debug('Nastavení bylo úspěšně smazáno', { settingId: settingToDelete.id });
      setShowDeleteDialog(false);
      setSettingToDelete(null);
    } catch (error) {
      adminLogger.error('Chyba při mazání nastavení', error instanceof Error ? error : new Error(String(error)));
    }
  };

  const onSubmit = async (data: z.infer<typeof settingSchema>) => {
    try {
      if (editingSetting) {
        adminLogger.info('Aktualizace nastavení', {
          settingId: editingSetting.id,
          updates: data
        });

        await updateSetting({
          variables: {
            id: editingSetting.id,
            input: {
              key: data.key,
              value: data.value,
              description: data.description,
              category: data.category,
              is_public: data.isPublic,
            },
          },
        });
        adminLogger.debug('Nastavení bylo úspěšně aktualizováno', { 
          settingId: editingSetting.id 
        });
      } else {
        adminLogger.info('Vytváření nového nastavení', data);

        const result = await createSetting({
          variables: {
            input: {
              key: data.key,
              value: data.value,
              description: data.description,
              category: data.category,
              is_public: data.isPublic,
            },
          },
        });
        adminLogger.debug('Nové nastavení bylo úspěšně vytvořeno', {
          settingId: result.data?.insert_settings_one?.id
        });
      }

      setIsFormOpen(false);
      setEditingSetting(null);
      form.reset();
    } catch (error) {
      adminLogger.error(
        `Chyba při ${editingSetting ? 'aktualizaci' : 'vytváření'} nastavení`,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Systémová nastavení</h2>
          <Button onClick={() => {
            setEditingSetting(null);
            form.reset();
            setIsFormOpen(true);
          }}>
            Přidat nastavení
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Klíč</TableHead>
              <TableHead>Hodnota</TableHead>
              <TableHead>Kategorie</TableHead>
              <TableHead>Veřejné</TableHead>
              <TableHead>Akce</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {settings.map((setting: SystemSettings) => (
              <TableRow key={setting.id}>
                <TableCell className="font-medium">{setting.key}</TableCell>
                <TableCell>{setting.value}</TableCell>
                <TableCell>{setting.category}</TableCell>
                <TableCell>{setting.is_public ? 'Ano' : 'Ne'}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(setting)}
                  >
                    Upravit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(setting)}
                  >
                    Smazat
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSetting ? 'Upravit nastavení' : 'Přidat nastavení'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Klíč</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hodnota</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategorie</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Popis</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Veřejné nastavení</FormLabel>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">
                  {editingSetting ? 'Uložit změny' : 'Vytvořit'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Smazat nastavení</DialogTitle>
            <DialogDescription>
              Opravdu chcete smazat toto nastavení? Tuto akci nelze vrátit zpět.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Zrušit
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Smazat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
