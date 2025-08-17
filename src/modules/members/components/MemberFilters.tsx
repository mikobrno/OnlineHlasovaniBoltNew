import { FC } from 'react';
import { useMemberContext } from '../context/MemberContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useQuery } from '@apollo/client';
import { GET_BUILDINGS } from '../../buildings/graphql/queries';
import { Building } from '../../buildings/types';
import { membersLogger } from '../utils/logger';

export const MemberFilters: FC = () => {
  const { filters, setFilters } = useMemberContext();
  const { data: buildingsData, loading: buildingsLoading } = useQuery(GET_BUILDINGS);

  const handleBuildingChange = (buildingId: string) => {
    setFilters({ ...filters, buildingId });
    membersLogger.debug('Změna filtru budovy', { buildingId });
  };

  const handleSearchChange = (searchQuery: string) => {
    setFilters({ ...filters, searchQuery: searchQuery || undefined });
    membersLogger.debug('Změna vyhledávacího dotazu', { searchQuery });
  };

  const handleSwitchChange = (key: keyof typeof filters) => (checked: boolean) => {
    setFilters({ ...filters, [key]: checked });
    membersLogger.debug(`Změna přepínače ${key}`, { value: checked });
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Budova</Label>
          <Select
            value={filters.buildingId}
            onValueChange={handleBuildingChange}
            disabled={buildingsLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Vyberte budovu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Všechny budovy</SelectItem>
              {buildingsData?.buildings.map((building: Building) => (
                <SelectItem key={building.id} value={building.id}>
                  {building.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Vyhledávání</Label>
          <Input
            type="text"
            placeholder="Hledat podle jména, emailu..."
            value={filters.searchQuery || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={filters.isActive}
              onCheckedChange={handleSwitchChange('isActive')}
            />
            <Label>Pouze aktivní</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={filters.isOwner}
              onCheckedChange={handleSwitchChange('isOwner')}
            />
            <Label>Pouze vlastníci</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={filters.isCommitteeMember}
              onCheckedChange={handleSwitchChange('isCommitteeMember')}
            />
            <Label>Pouze členové výboru</Label>
          </div>
        </div>
      </div>
    </div>
  );
};
