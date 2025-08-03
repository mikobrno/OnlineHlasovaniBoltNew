import React, { useState } from 'react';
import { Plus, Mail, Trash2, Eye } from 'lucide-react';
import { Vote, Observer } from '../../data/mockData';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../contexts/ToastContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { generateId } from '../../lib/utils';

interface ObserversViewProps {
  vote: Vote;
}

export const ObserversView: React.FC<ObserversViewProps> = ({ vote }) => {
  const { observers, selectedBuilding, addObserver, deleteObserver, addVoteObserver, removeVoteObserver } = useApp();
  const { showToast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newObserver, setNewObserver] = useState({ name: '', email: '' });

  const buildingObservers = observers.filter(o => o.buildingId === selectedBuilding?.id);
  const voteObserverIds = vote.observers || [];
  const voteObservers = voteObserverIds.map(id => observers.find(o => o.id === id)).filter(Boolean) as Observer[];
  const availableObservers = buildingObservers.filter(o => !voteObserverIds.includes(o.id));

  const handleAddObserver = () => {
    if (!newObserver.name.trim() || !newObserver.email.trim() || !selectedBuilding) {
      showToast('Vyplňte všechna pole', 'error');
      return;
    }

    const observer: Observer = {
      id: generateId(),
      name: newObserver.name.trim(),
      email: newObserver.email.trim(),
      buildingId: selectedBuilding.id,
      createdAt: new Date().toISOString()
    };

    addObserver(observer);
    addVoteObserver(vote.id, observer.id);
    setNewObserver({ name: '', email: '' });
    setShowAddModal(false);
    showToast('Pozorovatel byl přidán', 'success');
  };

  const handleAddExistingObserver = (observerId: string) => {
    addVoteObserver(vote.id, observerId);
    showToast('Pozorovatel byl přidán k hlasování', 'success');
  };

  const handleRemoveObserver = (observerId: string) => {
    removeVoteObserver(vote.id, observerId);
    showToast('Pozorovatel byl odebrán z hlasování', 'success');
  };

  const handleDeleteObserver = (observer: Observer) => {
    if (window.confirm(`Opravdu chcete smazat pozorovatele ${observer.name}?`)) {
      removeVoteObserver(vote.id, observer.id);
      deleteObserver(observer.id);
      showToast('Pozorovatel byl smazán', 'success');
    }
  };

  const sendObserverInvitation = (observer: Observer) => {
    // Simulate sending email
    showToast(`Pozvánka byla odeslána na ${observer.email}`, 'success');
  };

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
                    onClick={() => sendObserverInvitation(observer)}
                  >
                    <Mail className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleRemoveObserver(observer.id)}
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
                    onClick={() => handleAddExistingObserver(observer.id)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Přidat
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