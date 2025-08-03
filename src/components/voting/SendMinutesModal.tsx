import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Mail, Wand2, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Vote } from '../../data/mockData';
import { useApp } from '../../contexts/AppContextCompat';
import { useToast } from '../../contexts/ToastContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { emailService } from '../../lib/emailService';
import { calculateQuorum, replaceVariables } from '../../lib/utils';

interface SendMinutesModalProps {
  isOpen: boolean;
  onClose: () => void;
  vote: Vote;
}

export const SendMinutesModal: React.FC<SendMinutesModalProps> = ({
  isOpen,
  onClose,
  vote
}) => {
  const { members, selectedBuilding, templates, globalVariables, observers } = useApp();
  const { showToast } = useToast();
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [generatedMinutes, setGeneratedMinutes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sendingStatus, setSendingStatus] = useState<Record<string, 'pending' | 'sending' | 'sent' | 'error'>>({});
  const [isSending, setIsSending] = useState(false);

  const buildingMembers = members.filter(m => m.buildingId === vote.buildingId);
  const voteObservers = (vote.observers || []).map(id => 
    observers.find(o => o.id === id)
  ).filter(Boolean);
  
  const allRecipients = [...buildingMembers, ...voteObservers];
  
  const availableTemplates = templates.filter(t => 
    t.isGlobal || t.buildingId === selectedBuilding?.id
  );

  const generateMinutes = async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      showToast('API klíč pro Gemini není nastaven', 'error');
      return;
    }

    setIsGenerating(true);
    
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const totalWeight = buildingMembers.reduce((sum, member) => sum + member.voteWeight, 0);
      const votedMembers = Object.keys(vote.memberVotes);

      // Prepare results data
      const resultsData = vote.questions.map((question, index) => {
        let yes = 0, no = 0, abstain = 0;
        
        votedMembers.forEach(memberId => {
          const member = buildingMembers.find(m => m.id === memberId);
          const memberVote = vote.memberVotes[memberId]?.[question.id];
          const weight = member?.voteWeight || 0;
          
          if (memberVote === 'yes') yes += weight;
          else if (memberVote === 'no') no += weight;
          else if (memberVote === 'abstain') abstain += weight;
        });

        const requiredQuorum = calculateQuorum(question.quorumType, totalWeight, question.customQuorum);
        const approved = yes >= requiredQuorum;

        return {
          index: index + 1,
          text: question.text,
          quorumType: question.quorumType,
          yes,
          no,
          abstain,
          requiredQuorum,
          approved
        };
      });

      const prompt = `
Vygeneruj formální zápis ze shromáždění vlastníků jednotek (SVJ) v českém jazyce na základě následujících dat:

INFORMACE O HLASOVÁNÍ:
- Název: ${vote.title}
- Popis: ${vote.description}
- Budova: ${selectedBuilding?.name || ''}
- Adresa: ${selectedBuilding?.address || ''}
- Datum ukončení: ${vote.endDate ? new Date(vote.endDate).toLocaleDateString('cs-CZ') : ''}

ÚČAST:
- Celkem členů: ${buildingMembers.length}
- Hlasovalo: ${votedMembers.length}
- Účast: ${Math.round((votedMembers.length / buildingMembers.length) * 100)}%
- Celková váha hlasů: ${totalWeight.toFixed(1)}

VÝSLEDKY HLASOVÁNÍ:
${resultsData.map(result => `
Otázka ${result.index}: ${result.text}
- Ano: ${result.yes.toFixed(1)} hlasů
- Ne: ${result.no.toFixed(1)} hlasů  
- Zdržel se: ${result.abstain.toFixed(1)} hlasů
- Potřebné kvórum: ${result.requiredQuorum.toFixed(1)} hlasů
- Výsledek: ${result.approved ? 'SCHVÁLENO' : 'ZAMÍTNUTO'}
`).join('')}

Vygeneruj strukturovaný zápis ve formátu:
1. Úvodní část s názvem, datem a místem
2. Seznam přítomných/hlasujících
3. Program jednání
4. Projednávané body s výsledky hlasování
5. Závěr a podpisy

Použij formální jazyk odpovídající právním předpisům ČR pro SVJ/BD.
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setGeneratedMinutes(text);
      showToast('Zápis byl vygenerován', 'success');
    } catch (error) {
      console.error('Error generating AI content:', error);
      showToast('Chyba při generování zápisu', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const sendMinutesToRecipient = async (recipientId: string): Promise<boolean> => {
    const recipient = allRecipients.find(r => r.id === recipientId);
    if (!recipient) return false;

    setSendingStatus(prev => ({ ...prev, [recipientId]: 'sending' }));

    try {
      const template = availableTemplates.find(t => t.id === selectedTemplateId);
      if (!template) {
        throw new Error('Šablona nebyla nalezena');
      }

      const customVariables = {
        zapis_z_hlasovani: generatedMinutes
      };

      const emailSubject = replaceVariables(
        template.subject, 
        globalVariables, 
        selectedBuilding!, 
        'email' in recipient ? recipient : undefined, 
        vote, 
        customVariables
      );

      const emailBody = replaceVariables(
        template.body, 
        globalVariables, 
        selectedBuilding!, 
        'email' in recipient ? recipient : undefined, 
        vote, 
        customVariables
      );

      // Odesílání emailu přes N8N webhook
      const emailResult = await emailService.sendEmail({
        to: recipient.email,
        subject: emailSubject,
        html: emailBody
      });

      if (!emailResult.success) {
        throw new Error(emailResult.message);
      }
      
      setSendingStatus(prev => ({ ...prev, [recipientId]: 'sent' }));
      return true;
    } catch (error) {
      console.error('Error sending minutes:', error);
      setSendingStatus(prev => ({ ...prev, [recipientId]: 'error' }));
      return false;
    }
  };

  const sendAllMinutes = async () => {
    if (!selectedTemplateId) {
      showToast('Vyberte e-mailovou šablonu', 'error');
      return;
    }

    if (!generatedMinutes) {
      showToast('Nejprve vygenerujte zápis', 'error');
      return;
    }

    setIsSending(true);
    let successCount = 0;
    let errorCount = 0;

    // Reset status
    const initialStatus: Record<string, 'pending' | 'sending' | 'sent' | 'error'> = {};
    allRecipients.forEach(recipient => {
      initialStatus[recipient.id] = 'pending';
    });
    setSendingStatus(initialStatus);

    // Send emails sequentially
    for (const recipient of allRecipients) {
      const success = await sendMinutesToRecipient(recipient.id);
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
      showToast(`Zápis byl odeslán všem (${successCount})`, 'success');
    } else {
      showToast(`Odesláno ${successCount} e-mailů, ${errorCount} chyb`, 'warning');
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
    <Modal isOpen={isOpen} onClose={onClose} title="Odeslat zápis z hlasování" size="xl">
      <div className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            📝 Automatické generování a odesílání zápisu
          </h4>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <p>• AI vygeneruje formální zápis na základě výsledků hlasování</p>
            <p>• Zápis bude odeslán všem členům a pozorovatelům</p>
            <p>• V e-mailové šabloně použijte proměnnou: <code>{'{{zapis_z_hlasovani}}'}</code></p>
          </div>
        </div>

        {!generatedMinutes && (
          <Card className="p-6">
            <div className="text-center">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
                Vygenerovat zápis pomocí AI
              </h4>
              <Button 
                onClick={generateMinutes} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Generuje se zápis...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Vygenerovat zápis z hlasování
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}

        {generatedMinutes && (
          <>
            <Card className="p-6">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
                Vygenerovaný zápis
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-64 overflow-y-auto">
                <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-sans">
                  {generatedMinutes}
                </pre>
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="secondary" onClick={() => setGeneratedMinutes('')}>
                  Vygenerovat znovu
                </Button>
              </div>
            </Card>

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
                V šabloně použijte proměnnou: <code>{'{{zapis_z_hlasovani}}'}</code>
              </p>
            </div>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  Příjemci ({allRecipients.length})
                </h4>
                <Button
                  onClick={sendAllMinutes}
                  disabled={isSending || !selectedTemplateId}
                  size="sm"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSending ? 'Odesílá se...' : 'Odeslat všem'}
                </Button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {allRecipients.map((recipient) => {
                  const status = sendingStatus[recipient.id] || 'pending';
                  const isObserver = !('unit' in recipient);
                  
                  return (
                    <div key={recipient.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {recipient.name}
                          </div>
                          {isObserver && (
                            <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200 px-2 py-1 rounded-full">
                              Pozorovatel
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {recipient.email}
                          {'unit' in recipient && ` | ${recipient.unit}`}
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
          </>
        )}

        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose} disabled={isSending}>
            {isSending ? 'Odesílá se...' : 'Zavřít'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
