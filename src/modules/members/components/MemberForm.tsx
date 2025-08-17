import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_MEMBER, UPDATE_MEMBER } from '../graphql/mutations';
import { GET_MEMBERS } from '../graphql/queries';
import { GET_BUILDINGS } from '../../buildings/graphql/queries';
import { Member, MemberFormData } from '../types';
import { Building } from '../../buildings/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useMemberContext } from '../context/MemberContext';
import { membersLogger } from '../utils/logger';

const phoneRegex = /^(\+420)?\s*[1-9][0-9]{2}\s*[0-9]{3}\s*[0-9]{3}$/;

const memberSchema = z.object({
  email: z.string().email({ message: 'Neplatný formát emailu' }),
  phone: z.string().regex(phoneRegex, { 
    message: 'Neplatný formát telefonu (např. +420 777 888 999)'
  }).optional(),
  firstName: z.string().min(1, { message: 'Jméno je povinné' }),
  lastName: z.string().min(1, { message: 'Příjmení je povinné' }),
  buildingId: z.string().min(1, { message: 'Budova je povinná' }),
  unitNumber: z.string().min(1, { message: 'Číslo jednotky je povinné' }),
  isOwner: z.boolean(),
  isCommitteeMember: z.boolean(),
  isActive: z.boolean(),
});

interface MemberFormProps {
  onSuccess: () => void;
}

export const MemberForm: FC<MemberFormProps> = ({ onSuccess }) => {
  const { editingMember, closeForm } = useMemberContext();

  const { data: buildingsData, loading: buildingsLoading } = useQuery(GET_BUILDINGS);

  const [createMember] = useMutation(CREATE_MEMBER, {
    refetchQueries: [{ query: GET_MEMBERS }],
  });

  const [updateMember] = useMutation(UPDATE_MEMBER, {
    refetchQueries: [{ query: GET_MEMBERS }],
  });

  const form = useForm<z.infer<typeof memberSchema>>({
    resolver: zodResolver(memberSchema),
    defaultValues: editingMember
      ? {
          email: editingMember.email,
          phone: editingMember.phone || '',
          firstName: editingMember.first_name,
          lastName: editingMember.last_name,
          buildingId: editingMember.building_id,
          unitNumber: editingMember.unit_number,
          isOwner: editingMember.is_owner,
          isCommitteeMember: editingMember.is_committee_member,
          isActive: editingMember.is_active,
        }
      : {
          email: '',
          phone: '',
          firstName: '',
          lastName: '',
          buildingId: '',
          unitNumber: '',
          isOwner: false,
          isCommitteeMember: false,
          isActive: true,
        },
  });

  const onSubmit = async (data: z.infer<typeof memberSchema>) => {
    try {
      membersLogger.info(
        `${editingMember ? 'Aktualizace' : 'Vytváření'} člena:`,
        data
      );

      if (editingMember) {
        membersLogger.debug('Aktualizace existujícího člena', {
          memberId: editingMember.id,
          updates: data
        });

        await updateMember({
          variables: {
            id: editingMember.id,
            input: {
              email: data.email,
              phone: data.phone,
              first_name: data.firstName,
              last_name: data.lastName,
              building_id: data.buildingId,
              unit_number: data.unitNumber,
              is_owner: data.isOwner,
              is_committee_member: data.isCommitteeMember,
              is_active: data.isActive,
            },
          },
        });
        membersLogger.info('Člen byl úspěšně aktualizován', {
          memberId: editingMember.id
        });
      } else {
        membersLogger.debug('Vytváření nového člena', data);

        const result = await createMember({
          variables: {
            input: {
              email: data.email,
              phone: data.phone,
              first_name: data.firstName,
              last_name: data.lastName,
              building_id: data.buildingId,
              unit_number: data.unitNumber,
              is_owner: data.isOwner,
              is_committee_member: data.isCommitteeMember,
              is_active: data.isActive,
            },
          },
        });
        membersLogger.info('Nový člen byl úspěšně vytvořen', {
          memberId: result.data?.insert_members_one?.id
        });
      }
      onSuccess();
      closeForm();
    } catch (error) {
      membersLogger.error(
        `Chyba při ${editingMember ? 'aktualizaci' : 'vytváření'} člena`,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jméno</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Zadejte jméno" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Příjmení</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Zadejte příjmení" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="email@example.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefon</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="+420 777 888 999" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="buildingId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budova</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={buildingsLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Vyberte budovu" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {buildingsData?.buildings.map((building: Building) => (
                      <SelectItem key={building.id} value={building.id}>
                        {building.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unitNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Číslo jednotky</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Např. 42" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="isOwner"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Je vlastník</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isCommitteeMember"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Je člen výboru</FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Je aktivní</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={closeForm}>
            Zrušit
          </Button>
          <Button type="submit">
            {editingMember ? 'Uložit změny' : 'Vytvořit člena'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
