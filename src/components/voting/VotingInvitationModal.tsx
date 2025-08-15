import React, { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useQuery } from '@apollo/client';
import { GET_DATA_FOR_INVITATION_MODAL } from '../../graphql/queries';
import { Vote, Member, EmailTemplate, GlobalVariable, Building } from '../../types';
import { useToast } from '../../contexts/ToastContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { votingTokenService } from '../../lib/votingTokenService';
// import { smsService } from '../../lib/smsService'; // Budeme řešit později
import { replaceVariables } from '../../lib/utils';

interface VotingInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  vote: Vote;
  buildingId: string;
}

export const VotingInvitationModal: React.FC<VotingInvitationModalProps> = ({
  isOpen,
  onClose,
  vote,
  buildingId,
}) => {
  const { showToast } = useToast();
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [sendingStatus, setSendingStatus] = useState<Record<string, 'pending' | 'sending' | 'sent' | 'error'>>({});
  const [isSending, setIsSending] = useState(false);

  const { data, loading, error } = useQuery(GET_DATA_FOR_INVITATION_MODAL, {
    variables: { buildingId },
    skip: !isOpen,
  });

  const building: Building & { members: Member[] } = data?.building;
  const availableTemplates: EmailTemplate[] = data?.email_templates || [];
  const globalVariables: GlobalVariable[] = data?.global_variables || [];
  const buildingMembers = building?.members || [];

  useEffect(() => {
    // Reset state when modal opens or data changes
    if (isOpen) {
      setSelectedTemplateId('');
      setSendingStatus({});
      setIsSending(false);
    }
  }, [isOpen, data]);

  const generateVotingLink = (token: string): string => {
    return `${window.location.origin}/vote/${token}`;
  };

  const sendInvitationToMember = async (memberId: string): Promise<boolean> => {
    const member = buildingMembers.find(m => m.id === memberId);
    if (!member || !building) return false;

    setSendingStatus(prev => ({ ...prev, [memberId]: 'sending' }));

    try {
      // Generate unique token for this member and vote
      const votingToken = votingTokenService.generateToken(vote.id, memberId);
      const votingLink = generateVotingLink(votingToken.token);

      const template = availableTemplates.find(t => t.id === selectedTemplateId);
      if (!template) {
        throw new Error('Šablona nebyla nalezena');
      }

      const allVariables = [
        ...globalVariables.map(gv => ({ name: gv.name, value: gv.value })),
        { name: 'jmeno_prijmeni', value: member.name },
        { name: 'email', value: member.email },
        { name: 'nazev_budovy', value: building.name },
        { name: 'adresa_budovy', value: building.address },
        { name: 'nazev_hlasovani', value: vote.title },
        { name: 'odkaz_hlasovani', value: votingLink },
        { name: 'datum_zacatku', value: new Date(vote.start_date).toLocaleDateString() },
        { name: 'datum_konce', value: new Date(vote.end_date).toLocaleDateString() },
      ];

      const emailSubject = replaceVariables(template.subject, allVariables);
      const emailBody = replaceVariables(template.body, allVariables);

      // TODO: Implement actual email sending via Nhost function
      console.log('Sending email:', {
        to: member.email,
        subject: emailSubject,
        body: emailBody,
      });
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
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

    // Send invitations sequentially
    for (const member of buildingMembers) {
      const success = await sendInvitationToMember(member.id);
      if (success) {
        successCount++;
      } else {
        errorCount++;
      }
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

  if (loading && isOpen) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Odeslat pozvánky k hlasování" size="lg">
            <p>Načítání dat...</p>
        </Modal>
    );
  }

  if (error && isOpen) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Chyba" size="lg">
            <p>Nepodařilo se načíst data pro odeslání pozvánek: {error.message}</p>
        </Modal>
    );
  }

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
          <label htmlFor="email-template-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            E-mailová šablona *
          </label>
          <select
            id="email-template-select"
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSending}
          >
            <option value="">Vyberte šablonu</option>
            {availableTemplates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name} {template.is_global ? '(Globální)' : ''}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            V šabloně můžete použít proměnnou: <code>{'{{odkaz_na_hlasovani}}'}</code>
            {' '}nebo alias <code>{'{{odkaz_s_hlasovanim}}'}</code>
          </p>
        </div>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">
              Příjemci ({buildingMembers.length})
            </h4>
            <Button
              onClick={sendAllInvitations}
              disabled={isSending || !selectedTemplateId}
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
                      {member.email}
                      {/* TODO: Doplnit telefon a další info, až budou v DB */}
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
            <p>• Ujistěte se, že máte nakonfigurované SMS služby (např. přes Nhost funkci)</p>
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
