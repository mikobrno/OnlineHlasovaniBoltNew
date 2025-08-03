import React, { useState, useEffect } from 'react';
import { Upload, X, FileText, Paperclip } from 'lucide-react';
import { Vote } from '../../data/mockData';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../contexts/ToastContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface ManualVoteEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  vote: Vote;
  memberId: string;
}

export const ManualVoteEntryModal: React.FC<ManualVoteEntryModalProps> = ({
  isOpen,
  onClose,
  vote,
  memberId
}) => {
  const { members, castVote } = useApp();
  const { showToast } = useToast();
  const [answers, setAnswers] = useState<Record<string, 'yes' | 'no' | 'abstain'>>({});
  const [attachments, setAttachments] = useState<string[]>([]);
  const [note, setNote] = useState('');

  const buildingMembers = members.filter(m => m.buildingId === vote.buildingId);
  const member = buildingMembers.find(m => m.id === memberId);
  const currentVotes = vote.memberVotes[memberId] || {};
  const currentAttachments = vote.manualVoteAttachments?.[memberId] || [];
  const currentNote = vote.manualVoteNotes?.[memberId] || '';

  useEffect(() => {
    setAnswers(currentVotes);
    setAttachments(currentAttachments);
    setNote(currentNote);
  }, [currentVotes, currentAttachments, currentNote]);

  const handleAnswerChange = (questionId: string, answer: 'yes' | 'no' | 'abstain') => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = () => {
    if (!member) return;

    const allAnswered = vote.questions.every(q => answers[q.id]);
    if (!allAnswered) {
      showToast('Odpovězte prosím na všechny otázky', 'error');
      return;
    }

    castVote(vote.id, memberId, answers, attachments.length > 0 ? attachments : undefined, note.trim() || undefined, true);
    showToast(`Hlas za ${member.name} byl zaznamenán`, 'success');
    onClose();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newAttachments = Array.from(files).map(file => file.name);
      setAttachments([...attachments, ...newAttachments]);
      showToast(`Přidáno ${newAttachments.length} příloh`, 'success');
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };
  if (!member) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ruční zadání hlasu" size="lg">
      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-gray-100">
            Zadat hlas za: {member.name}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Jednotka: {member.unit} | Váha hlasu: {member.voteWeight}
          </p>
        </div>

        <div className="space-y-6">
          {vote.questions.map((question, index) => (
            <div key={question.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                {index + 1}. {question.text}
              </h5>
              
              <div className="space-y-2">
                {(['yes', 'no', 'abstain'] as const).map((option) => (
                  <label key={option} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option}
                      checked={answers[question.id] === option}
                      onChange={() => handleAnswerChange(question.id, option)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-600 dark:bg-gray-700"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {option === 'yes' && 'Ano'}
                      {option === 'no' && 'Ne'}
                      {option === 'abstain' && 'Zdržuji se'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
            Dokumenty a poznámky
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Poznámka k ručnímu hlasu
              </label>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="např. Plná moc od 15.1.2024, Hlasovací lístek předán osobně..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Přílohy (plná moc, hlasovací lístek)
                </label>
                <div>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="manual-vote-upload"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => document.getElementById('manual-vote-upload')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Přidat soubory
                  </Button>
                </div>
              </div>

              {attachments.length > 0 ? (
                <div className="space-y-2">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {attachment}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  <Paperclip className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Žádné přílohy nepřidány
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Podporované formáty: PDF, DOC, DOCX, JPG, PNG, TXT
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-sm text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
          <p className="font-medium">Upozornění:</p>
          <p>
            Ruční zadání hlasu by mělo být použito pouze ve výjimečných případech, 
            například když člen nemůže hlasovat elektronicky nebo předal plnou moc či hlasovací lístek.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose}>
            Zrušit
          </Button>
          <Button onClick={handleSubmit}>
            Zadat hlas
          </Button>
        </div>
      </div>
    </Modal>
  );
};