import { FC, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_AUDIT_LOG } from '../graphql/queries';
import { AuditLogFilters } from '../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { adminLogger } from '../utils/logger';

const ITEMS_PER_PAGE = 20;

export const AuditLog: FC = () => {
  const [filters, setFilters] = useState<AuditLogFilters>({});
  const [page, setPage] = useState(1);

  const { data, loading, error } = useQuery(GET_AUDIT_LOG, {
    variables: {
      tableName: filters.tableName,
      action: filters.action,
      userId: filters.userId,
      startDate: filters.startDate,
      endDate: filters.endDate,
      searchQuery: filters.searchQuery ? `%${filters.searchQuery}%` : undefined,
      limit: ITEMS_PER_PAGE,
      offset: (page - 1) * ITEMS_PER_PAGE,
    },
  });

  if (loading) {
    adminLogger.info('Načítání auditního logu...');
    return <div>Načítání...</div>;
  }

  if (error) {
    adminLogger.error('Chyba při načítání auditního logu', error);
    return <div>Chyba: {error.message}</div>;
  }

  const entries = data?.audit_log || [];
  const totalCount = data?.audit_log_aggregate.aggregate.count || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  adminLogger.debug('Načten auditní log', { 
    entries: entries.length,
    page,
    totalPages,
    filters 
  });

  const handleFilterChange = (key: keyof AuditLogFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined }));
    setPage(1);
    adminLogger.debug('Změna filtrů auditního logu', { key, value });
  };

  const formatData = (data: Record<string, unknown> | null) => {
    if (!data) return '';
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return 'Neplatná data';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Auditní log</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Select
            value={filters.tableName}
            onValueChange={(value) => handleFilterChange('tableName', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Vyberte tabulku" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Všechny tabulky</SelectItem>
              <SelectItem value="buildings">Budovy</SelectItem>
              <SelectItem value="members">Členové</SelectItem>
              <SelectItem value="votes">Hlasování</SelectItem>
              <SelectItem value="settings">Nastavení</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            value={filters.action}
            onValueChange={(value) => handleFilterChange('action', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Vyberte akci" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Všechny akce</SelectItem>
              <SelectItem value="INSERT">Vytvoření</SelectItem>
              <SelectItem value="UPDATE">Úprava</SelectItem>
              <SelectItem value="DELETE">Smazání</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Input
            type="text"
            placeholder="Hledat..."
            value={filters.searchQuery || ''}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Čas</TableHead>
            <TableHead>Tabulka</TableHead>
            <TableHead>Akce</TableHead>
            <TableHead>ID záznamu</TableHead>
            <TableHead>Původní data</TableHead>
            <TableHead>Nová data</TableHead>
            <TableHead>Uživatel</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                {new Date(entry.created_at).toLocaleString('cs-CZ')}
              </TableCell>
              <TableCell>{entry.table_name}</TableCell>
              <TableCell>{entry.action}</TableCell>
              <TableCell>{entry.record_id}</TableCell>
              <TableCell>
                <pre className="text-xs whitespace-pre-wrap">
                  {formatData(entry.old_data)}
                </pre>
              </TableCell>
              <TableCell>
                <pre className="text-xs whitespace-pre-wrap">
                  {formatData(entry.new_data)}
                </pre>
              </TableCell>
              <TableCell>{entry.user_id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center">
        <div>
          Celkem záznamů: {totalCount}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Předchozí
          </Button>
          <span>
            Strana {page} z {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Další
          </Button>
        </div>
      </div>
    </div>
  );
};
