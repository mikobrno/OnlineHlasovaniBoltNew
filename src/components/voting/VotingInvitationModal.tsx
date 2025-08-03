import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Vote } from '../../data/mockData';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../contexts/ToastContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { votingTokenService } from '../../lib/votingTokenService';
import { smsService } from '../../lib/smsService';
import { replaceVariables } from '../../lib/utils';

interface VotingInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  vote: Vote;
}

export const VotingInvitationModal: React.FC<VotingInvitationModalProps> = ({
  isOpen,
  onClose,
  vote
}) => {
  const { members, selectedBuilding, templates, globalVariables } = useApp();
  const { showToast } = useToast();
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [sendingStatus, setSendingStatus] = useState<Record<string, 'pending' | 'sending' | 'sent' | 'error'>>({});
  const [isSending, setIsSending] = useState(false);

  const buildingMembers = members.filter(m => m.buildingId === vote.buildingId);
  const availableTemplates = templates.filter(t => 
    t.isGlobal || t.buildingId === selectedBuilding?.id
  );

  const generateVotingLink = (token: string): string => {
    return `${window.location.origin}/vote/${token}`;
  };

  const sendInvitationToMember = async (memberId: string): Promise<boolean> => {
    const member = buildingMembers.find(m => m.id === memberId);
    if (!member) return false;

    setSendingStatus(prev => ({ ...prev, [memberId]: 'sending' }));

    try {
      // Generate unique token for this member and vote
      const votingToken = votingTokenService.generateToken(vote.id, memberId);
      const votingLink = generateVotingLink(votingToken.token);

      const template = availableTemplates.find(t => t.id === selectedTemplateId);
      if (!template) {
        throw new Error('Šablona nebyla nalezena');
      }

      const customVariables = {
        odkaz_na_hlasovani: votingLink,
        overovaci_kod: votingToken.verificationCode
      };

      const emailSubject = replaceVariables(
        template.subject, 
        globalVariables, 
        selectedBuilding!, 
        member, 
        vote, 
        customVariables
      );

      const emailBody = replaceVariables(
        template.body, 
        globalVariables, 
        selectedBuilding!, 
        member, 
        vote, 
        customVariables
      );

      // Simulate email sending (in real app, this would be actual email service)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSendingStatus(prev => ({ ...prev, [memberId]: 'sent' }));
      return true;
    } catch (error) {
      console.error('Error sending invitation:', error);
      setSendingStatus(prev => ({ ...prev, [memberId]: 'error' }));
      return false;
    }
  };

  const sendAllInvitations = async () => {
    if (!selectedTemplateId) {
      showToast('Vyberte e-mailovou šablonu', 'error');
      return;
    }

    setIsSending(true);
    let successCount = 0;
    let errorCount = 0;

    // Reset status
    const initialStatus: Record<string, 'pending' | 'sending' | 'sent' | 'error'> = {};
    buildingMembers.forEach(member => {
      initialStatus[member.id] = 'pending';
    });
    setSendingStatus(initialStatus);

    // Send invitations sequentially to avoid overwhelming services
    for (const member of buildingMembers) {
      const success = await sendInvitationToMember(member.id);
      if (success) {
        successCount++;
      } else {
        errorCount++;
      }
      
      // Small delay between sends
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsSending(false);
    
    if (errorCount === 0) {
      showToast(`Všechny pozvánky byly odeslány (${successCount})`, 'success');
    } else {
      showToast(`Odesláno ${successCount} pozvánek, ${errorCount} chyb`, 'warning');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sending':
        return <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-300" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sending': return 'Odesílá se...';
      case 'sent': return 'Odesláno';
      case 'error': return 'Chyba';
      default: return 'Čeká';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Odeslat pozvánky k hlasování" size="lg">
      <div className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            🔐 Bezpečné hlasování s SMS ověřením na vyžádání
          </h4>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <p>• Každý člen dostane unikátní odkaz na hlasování</p>
            <p>• SMS s kódem se odešle až po kliknutí na odkaz</p>
            <p>• Pro přístup k hlasování je nutné ověření SMS kódem</p>
            <p>• Každý odkaz lze použít pouze jednou</p>
            <p>• Odkazy jsou platné 24 hodin</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            E-mailová šablona *
          </label>
          <select
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSending}
          >
            <option value="">Vyberte šablonu</option>
            {availableTemplates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name} {template.isGlobal ? '(Globální)' : ''}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            V šabloně můžete použít proměnnou: <code>{'{{odkaz_na_hlasovani}}'}</code>
          </p>
        </div>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">
              Příjemci ({buildingMembers.length})
            </h4>
            <Button
              onClick={sendAllInvitations}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              size="sm"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSending ? 'Odesílá se...' : 'Odeslat všem'}
            </Button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {buildingMembers.map((member) => {
              const status = sendingStatus[member.id] || 'pending';
              return (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {member.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {member.email} | {member.unit}
                      {member.phone && (
                        <span className="ml-2 text-green-600 dark:text-green-400">
                          📱 SMS: {member.phone}
                        </span>
                      )}
                      {!member.phone && (
                        <span className="ml-2 text-yellow-600 dark:text-yellow-400">
                          ⚠️ Bez telefonu
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(status)}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {getStatusText(status)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
            ⚠️ Důležité upozornění
          </h4>
          <div className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
            <p>• Členové bez telefonního čísla nebudou moci hlasovat (chybí SMS ověření)</p>
            <p>• Členové se zástupcem dostanou pouze notifikaci, hlasovací odkaz půjde zástupci</p>
            <p>• SMS se odešle až když člen klikne na odkaz a požádá o kód</p>
            <p>• Ujistěte se, že máte nakonfigurované SMS služby (SMSbrana.cz)</p>
            <p>• Každé odeslání pozvánek vygeneruje nové unikátní odkazy</p>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose} disabled={isSending}>
            {isSending ? 'Odesílá se...' : 'Zavřít'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};