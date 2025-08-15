import React, { useState } from 'react';
import { Plus, Mail, Trash2, Eye } from 'lucide-react';
import { useMutation, useQuery } from '@apollo/client';
import { Vote, Observer } from '../../types';
import { useToast } from '../../contexts/ToastContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { GET_OBSERVERS_BY_BUILDING_ID } from '../../graphql/queries';
import { 
  CREATE_OBSERVER, 
  ADD_OBSERVER_TO_VOTE, 
  REMOVE_OBSERVER_FROM_VOTE, 
  DELETE_OBSERVER,
  SEND_OBSERVER_INVITATION
} from '../../graphql/mutations';

interface ObserversViewProps {
  vote: Vote;
  buildingId: string;
}

export const ObserversView: React.FC<ObserversViewProps> = ({ vote, buildingId }) => {
  const { showToast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newObserver, setNewObserver] = useState({ name: '', email: '' });

  const { data: observersData, loading: observersLoading, refetch: refetchObservers } = useQuery(GET_OBSERVERS_BY_BUILDING_ID, {
    variables: { buildingId },
    skip: !buildingId,
  });

  // Observers v votes jsou pole textů (emailů)
  const voteObserverEmails = vote.observers || [];
  const buildingObservers: Observer[] = observersData?.observers || [];
  const voteObservers = buildingObservers.filter(o => voteObserverEmails.includes(o.email));
  const availableObservers = buildingObservers.filter(o => !voteObserverEmails.includes(o.email));

  const [createObserver] = useMutation(CREATE_OBSERVER);
  const [addObserverToVote] = useMutation(ADD_OBSERVER_TO_VOTE, {
    refetchQueries: ['GetVoteDetails']
  });
  const [removeObserverFromVote] = useMutation(REMOVE_OBSERVER_FROM_VOTE, {
    refetchQueries: ['GetVoteDetails']
  });
  const [deleteObserver] = useMutation(DELETE_OBSERVER);
  const [sendInvitation] = useMutation(SEND_OBSERVER_INVITATION);

  const handleAddObserver = async () => {
    if (!newObserver.name.trim() || !newObserver.email.trim()) {
      showToast('Vyplňte všechna pole', 'error');
      return;
    }

    try {
      const { data } = await createObserver({
        variables: {
          name: newObserver.name.trim(),
          email: newObserver.email.trim(),
          building_id: buildingId,
        },
      });
      const createdObserver = data?.insert_observers_one;
      if (createdObserver) {
        // Předáváme pouze email, ne celý observer objekt
        await addObserverToVote({ 
          variables: { 
            vote_id: vote.id, 
            observer_email: createdObserver.email 
          } 
        });
        showToast('Nový pozorovatel byl vytvořen a přiřazen k hlasování.', 'success');
        setNewObserver({ name: '', email: '' });
        setShowAddModal(false);
        refetchObservers();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Neznámá chyba';
      showToast(`Chyba při vytváření pozorovatele: ${message}`, 'error');
    }
  };

  const handleAddExistingObserver = async (observer: Observer) => {
    try {
      await addObserverToVote({ variables: { vote_id: vote.id, observer_email: observer.email } });
      showToast('Pozorovatel byl přidán k hlasování.', 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Neznámá chyba';
      showToast(`Chyba při přidávání pozorovatele: ${message}`, 'error');
    }
  };

  const handleRemoveObserver = async (observer: Observer) => {
    if (window.confirm('Opravdu chcete odebrat tohoto pozorovatele z hlasování?')) {
      try {
        await removeObserverFromVote({ variables: { vote_id: vote.id, observer_email: observer.email } });
        showToast('Pozorovatel byl odebrán z hlasování.', 'success');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Neznámá chyba';
        showToast(`Chyba při odebírání pozorovatele: ${message}`, 'error');
      }
    }
  };

  const handleDeleteObserver = async (observer: Observer) => {
    if (window.confirm(`Opravdu chcete trvale smazat pozorovatele ${observer.name}? Tato akce je nevratná.`)) {
      try {
        // Nejprve odebrat z hlasování, pokud je přiřazen
        if (voteObserverEmails.includes(observer.email)) {
          await removeObserverFromVote({ variables: { vote_id: vote.id, observer_email: observer.email } });
        }
        await deleteObserver({ variables: { id: observer.id } });
        showToast('Pozorovatel byl smazán.', 'success');
        refetchObservers();
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Neznámá chyba';
        showToast(`Chyba při mazání pozorovatele: ${message}`, 'error');
      }
    }
  };

  const sendObserverInvitation = async (observer: Observer, isResend = false) => {
    try {
      await sendInvitation({ variables: { vote_id: vote.id, observer_id: observer.id, resend: isResend } });
      showToast(`Pozvánka ${isResend ? 'znovu ' : ''}odeslána na ${observer.email}`, 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Neznámá chyba';
      showToast(`Chyba při odesílání pozvánky: ${message}`, 'error');
    }
  };

  if (observersLoading) {
    return <p>Načítání pozorovatelů...</p>;
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Pozorovatelé hlasování
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Pozorovatelé mohou sledovat průběh hlasování, ale nemohou hlasovat
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Přidat pozorovatele
        </Button>
      </div>

      {/* Current observers */}
      <Card className="p-6">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
          Přiřazení pozorovatelé ({voteObservers.length})
        </h4>
        
        {voteObservers.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Žádní pozorovatelé nejsou přiřazeni</p>
          </div>
        ) : (
          <div className="space-y-3">
            {voteObservers.map((observer) => (
              <div key={observer.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {observer.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {observer.email}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => sendObserverInvitation(observer, true)}
                    title="Znovu poslat pozvánku"
                    aria-label="Znovu poslat pozvánku"
                  >
                    <Mail className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleRemoveObserver(observer)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Available observers */}
      {availableObservers.length > 0 && (
        <Card className="p-6">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
            Dostupní pozorovatelé
          </h4>
          <div className="space-y-3">
            {availableObservers.map((observer) => (
              <div key={observer.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {observer.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {observer.email}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleAddExistingObserver(observer)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Přidat
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => sendObserverInvitation(observer, false)}
                    title="Poslat pozvánku"
                    aria-label="Poslat pozvánku"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Poslat
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDeleteObserver(observer)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setNewObserver({ name: '', email: '' });
        }}
        title="Přidat nového pozorovatele"
      >
        <div className="space-y-4">
          <Input
            label="Jméno *"
            value={newObserver.name}
            onChange={(e) => setNewObserver({ ...newObserver, name: e.target.value })}
            placeholder="Jan Novák"
          />
          
          <Input
            label="E-mail *"
            type="email"
            value={newObserver.email}
            onChange={(e) => setNewObserver({ ...newObserver, email: e.target.value })}
            placeholder="jan.novak@email.cz"
          />

          <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <p className="font-medium text-blue-800 dark:text-blue-200">Poznámka:</p>
            <p className="text-blue-700 dark:text-blue-300">
              Pozorovatel bude automaticky přidán k tomuto hlasování a bude moci sledovat jeho průběh.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddModal(false);
                setNewObserver({ name: '', email: '' });
              }}
            >
              Zrušit
            </Button>
            <Button onClick={handleAddObserver}>
              Přidat pozorovatele
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
