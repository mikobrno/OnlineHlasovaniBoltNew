import { FC } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SYSTEM_STATS } from '../graphql/queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminLogger } from '../utils/logger';

export const SystemStats: FC = () => {
  const { data, loading, error } = useQuery(GET_SYSTEM_STATS, {
    pollInterval: 30000, // Aktualizovat každých 30 sekund
  });

  if (loading) {
    adminLogger.info('Načítání systémových statistik...');
    return <div>Načítání...</div>;
  }

  if (error) {
    adminLogger.error('Chyba při načítání systémových statistik', error);
    return <div>Chyba: {error.message}</div>;
  }

  const stats = {
    buildings: {
      total: data?.buildings_aggregate.aggregate.count || 0,
      active: data?.buildings_aggregate.aggregate.count || 0,
    },
    members: {
      total: data?.members_aggregate.aggregate.count || 0,
      active: data?.members_aggregate.aggregate.count || 0,
      owners: data?.members_aggregate.aggregate.count || 0,
      committee: data?.members_aggregate.aggregate.count || 0,
    },
    votes: {
      total: data?.votes_aggregate.aggregate.count || 0,
      active: data?.votes_aggregate.aggregate.count || 0,
      completed: data?.votes_aggregate.aggregate.count || 0,
    },
  };

  adminLogger.debug('Načteny systémové statistiky', stats);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Budovy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.buildings.total}</div>
          <p className="text-xs text-muted-foreground">
            Aktivních: {stats.buildings.active}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Členové</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.members.total}</div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              Aktivních: {stats.members.active}
            </p>
            <p className="text-xs text-muted-foreground">
              Vlastníků: {stats.members.owners}
            </p>
            <p className="text-xs text-muted-foreground">
              Členů výboru: {stats.members.committee}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hlasování</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.votes.total}</div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              Aktivních: {stats.votes.active}
            </p>
            <p className="text-xs text-muted-foreground">
              Dokončených: {stats.votes.completed}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
