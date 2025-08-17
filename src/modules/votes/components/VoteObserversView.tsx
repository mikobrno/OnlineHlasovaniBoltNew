// src/modules/votes/components/VoteObserversView.tsx
import { FC, useState } from 'react';
import { Eye, Plus, Search, Mail, UserCheck } from 'lucide-react';
import { Card } from '@/components/common';
import { Vote } from '../types';

interface VoteObserversViewProps {
  vote: Vote;
}

interface Observer {
  id: string;
  name: string;
  email: string;
  role: 'auditor' | 'observer' | 'legal';
  addedDate: string;
  status: 'invited' | 'confirmed' | 'declined';
}

// Mock data
const mockObservers: Observer[] = [
  {
    id: '1',
    name: 'Ing. Jana Procházková',
    email: 'jana.prochazkova@audit.cz',
    role: 'auditor',
    addedDate: '2025-08-15',
    status: 'confirmed'
  },
  {
    id: '2',
    name: 'JUDr. Martin Svoboda',
    email: 'martin.svoboda@legal.cz',
    role: 'legal',
    addedDate: '2025-08-16',
    status: 'invited'
  },
  {
    id: '3',
    name: 'Petr Novotný',
    email: 'petr.novotny@email.cz',
    role: 'observer',
    addedDate: '2025-08-14',
    status: 'confirmed'
  }
];

export const VoteObserversView: FC<VoteObserversViewProps> = ({ vote }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredObservers = mockObservers.filter(observer =>
    observer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    observer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: Observer['role']) => {
    const styles = {
      auditor: 'bg-purple-100 text-purple-800',
      legal: 'bg-blue-100 text-blue-800',
      observer: 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      auditor: 'Auditor',
      legal: 'Právník',
      observer: 'Pozorovatel'
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles[role]}`}>
        {labels[role]}
      </span>
    );
  };

  const getStatusBadge = (status: Observer['status']) => {
    const styles = {
      invited: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      declined: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      invited: 'Pozván',
      confirmed: 'Potvrzen',
      declined: 'Odmítnut'
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const confirmedCount = mockObservers.filter(o => o.status === 'confirmed').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Celkem pozvaných</p>
              <p className="text-xl font-semibold">{mockObservers.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Potvrzených</p>
              <p className="text-xl font-semibold">{confirmedCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Eye className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Auditorů</p>
              <p className="text-xl font-semibold">
                {mockObservers.filter(o => o.role === 'auditor' && o.status === 'confirmed').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Hledat pozorovatele..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Plus className="w-4 h-4 mr-2 inline" />
            Přidat pozorovatele
          </button>
        </div>

        <div className="space-y-4">
          {filteredObservers.map((observer) => (
            <Card key={observer.id} className="p-4 border-l-4 border-l-blue-500">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-gray-900">{observer.name}</h4>
                    {getRoleBadge(observer.role)}
                    {getStatusBadge(observer.status)}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                    <Mail className="w-3 h-3" />
                    {observer.email}
                  </div>
                  <p className="text-xs text-gray-500">
                    Přidán {new Date(observer.addedDate).toLocaleDateString('cs-CZ')}
                  </p>
                </div>
                <div className="flex gap-2">
                  {observer.status === 'invited' && (
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      Poslat znovu
                    </button>
                  )}
                  <button className="text-gray-600 hover:text-gray-800 text-sm">
                    Upravit
                  </button>
                  <button className="text-red-600 hover:text-red-800 text-sm">
                    Odebrat
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredObservers.length === 0 && (
          <div className="text-center py-8">
            <Eye className="mx-auto w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Žádní pozorovatelé</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Žádní pozorovatelé nenalezeni.' : 'Zatím nejsou přidání žádní pozorovatelé.'}
            </p>
            {!searchTerm && (
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2 inline" />
                Přidat prvního pozorovatele
              </button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
