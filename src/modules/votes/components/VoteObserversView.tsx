// src/modules/votes/components/VoteObserversView.tsx
import { FC, useState } from 'react';
import { Eye, Plus, Search, Mail, UserCheck, Edit, Trash2, RotateCcw } from 'lucide-react';
import { Card } from '@/components/common';
import { Vote } from '../types';
import { ObserverModal } from './ObserverModal';
import { useQuery, useMutation, gql } from '@apollo/client';

interface VoteObserversViewProps {
  vote: Vote;
}

interface Observer {
  id: string;
  name: string;
  email: string;
  role: 'auditor' | 'observer' | 'legal';
  added_date: string;
  status: 'invited' | 'confirmed' | 'declined';
}

// GraphQL queries and mutations
const GET_OBSERVERS_QUERY = gql`
  query GetObservers($voteId: uuid!) {
    observers(where: { vote_id: { _eq: $voteId } }) {
      id
      name
      email
      role
      added_date
      status
    }
  }
`;

const ADD_OBSERVER_MUTATION = gql`
  mutation AddObserver($input: ObserverInput!) {
    insert_observers_one(object: $input) {
      id
    }
  }
`;

const UPDATE_OBSERVER_MUTATION = gql`
  mutation UpdateObserver($id: uuid!, $input: ObserverInput!) {
    update_observers_by_pk(pk_columns: { id: $id }, _set: $input) {
      id
    }
  }
`;

const REMOVE_OBSERVER_MUTATION = gql`
  mutation RemoveObserver($id: uuid!) {
    delete_observers_by_pk(id: $id) {
      id
    }
  }
`;

export const VoteObserversView: FC<VoteObserversViewProps> = ({ vote }) => {
  const { data, loading, error } = useQuery(GET_OBSERVERS_QUERY, {
    variables: { voteId: vote.id },
  });

  const [addObserver] = useMutation(ADD_OBSERVER_MUTATION);
  const [updateObserver] = useMutation(UPDATE_OBSERVER_MUTATION);
  const [removeObserver] = useMutation(REMOVE_OBSERVER_MUTATION);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingObserver, setEditingObserver] = useState<Observer | null>(null);

  const handleResendInvitation = async (observerId: string) => {
    const observer = observers.find(o => o.id === observerId);
    if (observer) {
      try {
        console.log(`Posílám znovu pozvánku pro ${observer.name} na ${observer.email}`);
        // TODO: Implementovat GraphQL mutaci pro opětovné poslání pozvánky
        alert(`Pozvánka byla znovu odeslána na ${observer.email}`);
      } catch (error) {
        console.error('Chyba při odesílání pozvánky:', error);
        alert('Chyba při odesílání pozvánky');
      }
    }
  };

  const handleEditObserver = (observerId: string) => {
    const observer = observers.find(o => o.id === observerId);
    if (observer) {
      setEditingObserver(observer);
      setShowModal(true);
    }
  };

  const handleRemoveObserver = async (observerId: string) => {
    const observer = observers.find(o => o.id === observerId);
    if (observer && window.confirm(`Opravdu chcete odebrat pozorovatele ${observer.name}?`)) {
      try {
        await removeObserver({ variables: { id: observerId } });
        alert(`Pozorovatel ${observer.name} byl odebrán`);
      } catch (error) {
        console.error('Chyba při odebírání pozorovatele:', error);
        alert('Chyba při odebírání pozorovatele');
      }
    }
  };

  const handleAddObserver = () => {
    setEditingObserver(null);
    setShowModal(true);
  };

  const handleSaveObserver = async (data: { name: string; email: string; role: string }) => {
    try {
      if (editingObserver) {
        await updateObserver({
          variables: {
            id: editingObserver.id,
            input: {
              name: data.name,
              email: data.email,
              role: data.role,
            },
          },
        });
      } else {
        await addObserver({
          variables: {
            input: {
              name: data.name,
              email: data.email,
              role: data.role,
              vote_id: vote.id,
              added_date: new Date().toISOString(),
              status: 'invited',
            },
          },
        });
      }
    } catch (error) {
      console.error('Chyba při ukládání pozorovatele:', error);
      throw error;
    }
  };

  const getRoleBadge = (role: Observer['role']) => {
    const styles = {
      auditor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      legal: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      observer: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
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
      invited: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      declined: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
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

  const observers: Observer[] = data?.observers || [];

  const filteredObservers: Observer[] = observers.filter(observer =>
    observer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    observer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmedCount = observers.filter(o => o.status === 'confirmed').length;

  const renderObserverAddedDate = (observer: Observer) => {
    return `Přidán ${new Date(observer.added_date).toLocaleDateString('cs-CZ')}`;
  };

  if (loading) return <div>Načítám pozorovatele...</div>;
  if (error) return <div>Chyba při načítání pozorovatelů: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Celkem pozvaných</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{observers.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Potvrzených</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">{confirmedCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Auditorů</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {observers.filter(o => o.role === 'auditor' && o.status === 'confirmed').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Hledat pozorovatele..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <button 
            onClick={handleAddObserver}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2 inline" />
            Přidat pozorovatele
          </button>
        </div>

        <div className="space-y-4">
          {filteredObservers.map((observer) => (
            <Card key={observer.id} className="p-4 border-l-4 border-l-blue-500 dark:border-l-blue-400">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">{observer.name}</h4>
                    {getRoleBadge(observer.role)}
                    {getStatusBadge(observer.status)}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <Mail className="w-3 h-3" />
                    {observer.email}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {renderObserverAddedDate(observer)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {observer.status === 'invited' && (
                    <button 
                      onClick={() => handleResendInvitation(observer.id)}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800/30 hover:border-blue-300 dark:hover:border-blue-700 transition-colors duration-200"
                      title="Poslat pozvánku znovu"
                    >
                      <RotateCcw className="w-4 h-4 mr-1.5" />
                      Poslat znovu
                    </button>
                  )}
                  <button 
                    onClick={() => handleEditObserver(observer.id)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200"
                    title="Upravit pozorovatele"
                  >
                    <Edit className="w-4 h-4 mr-1.5" />
                    Upravit
                  </button>
                  <button 
                    onClick={() => handleRemoveObserver(observer.id)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md hover:bg-red-200 dark:hover:bg-red-800/30 hover:border-red-300 dark:hover:border-red-700 transition-colors duration-200"
                    title="Odebrat pozorovatele"
                  >
                    <Trash2 className="w-4 h-4 mr-1.5" />
                    Odebrat
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredObservers.length === 0 && (
          <div className="text-center py-8">
            <Eye className="mx-auto w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Žádní pozorovatelé</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm ? 'Žádní pozorovatelé nenalezeni.' : 'Zatím nejsou přidání žádní pozorovatelé.'}
            </p>
            {!searchTerm && (
              <button 
                onClick={handleAddObserver}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2 inline" />
                Přidat prvního pozorovatele
              </button>
            )}
          </div>
        )}
      </Card>

      {/* Modal pro přidání/úpravu pozorovatele */}
      <ObserverModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditingObserver(null);
        }}
        onSubmit={handleSaveObserver}
        title={editingObserver ? 'Upravit pozorovatele' : 'Přidat pozorovatele'}
        initialData={editingObserver ? {
          name: editingObserver.name,
          email: editingObserver.email,
          role: editingObserver.role
        } : undefined}
      />
    </div>
  );
};
