// src/modules/buildings/components/BuildingForm.tsx
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@apollo/client';
import { CREATE_BUILDING, UPDATE_BUILDING } from '../graphql/mutations';
import { GET_BUILDINGS } from '../graphql/queries';
import { Building, BuildingFormData } from '../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { buildingsLogger } from '../utils/logger';
import { useBuildingContext } from '../context/BuildingContext';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const buildingSchema = z.object({
  name: z.string().min(1, { message: 'Název je povinný' }),
  address: z.string().min(1, { message: 'Adresa je povinná' }),
  totalUnits: z.number().min(1, { message: 'Minimální počet jednotek je 1' }),
  variables: z.record(z.string(), z.string()),
});

interface BuildingFormProps {
  onSuccess: () => void;
}

export const BuildingForm: FC<BuildingFormProps> = ({ onSuccess }) => {
  const { editingBuilding, closeForm } = useBuildingContext();

  const [createBuilding] = useMutation(CREATE_BUILDING, {
    refetchQueries: [{ query: GET_BUILDINGS }],
  });

  const [updateBuilding] = useMutation(UPDATE_BUILDING, {
    refetchQueries: [{ query: GET_BUILDINGS }],
  });

  const form = useForm<z.infer<typeof buildingSchema>>({
    resolver: zodResolver(buildingSchema),
    defaultValues: editingBuilding
      ? {
          name: editingBuilding.name,
          address: editingBuilding.address,
          totalUnits: editingBuilding.total_units,
          variables: editingBuilding.variables,
        }
      : {
          name: '',
          address: '',
          totalUnits: 1,
          variables: {},
        },
  });

  const onSubmit = async (data: BuildingFormData) => {
    try {
      buildingsLogger.info(
        `${editingBuilding ? 'Aktualizace' : 'Vytváření'} budovy:`,
        data
      );

      if (editingBuilding) {
        buildingsLogger.debug('Aktualizace existující budovy', {
          buildingId: editingBuilding.id,
          updates: data
        });

        await updateBuilding({
          variables: {
            id: editingBuilding.id,
            input: {
              name: data.name,
              address: data.address,
              total_units: data.totalUnits,
              variables: data.variables,
            },
          },
        });
        buildingsLogger.info('Budova byla úspěšně aktualizována', {
          buildingId: editingBuilding.id
        });
      } else {
        buildingsLogger.debug('Vytváření nové budovy', data);

        const result = await createBuilding({
          variables: {
            input: {
              name: data.name,
              address: data.address,
              total_units: data.totalUnits,
              variables: data.variables,
            },
          },
        });
        buildingsLogger.info('Nová budova byla úspěšně vytvořena', {
          buildingId: result.data?.insert_buildings_one?.id
        });
      }
      onSuccess();
      closeForm();
    } catch (error) {
      buildingsLogger.error(
        `Chyba při ${editingBuilding ? 'aktualizaci' : 'vytváření'} budovy`, 
        error
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Název budovy</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Zadejte název budovy" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresa</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Zadejte adresu budovy" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="totalUnits"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Počet jednotek</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    field.onChange(parseInt(e.target.value))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={closeForm}>
            Zrušit
          </Button>
          <Button type="submit">
            {editingBuilding ? 'Uložit změny' : 'Vytvořit budovu'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
