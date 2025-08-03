import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Wand2, Copy, Loader } from 'lucide-react';
import { Vote } from '../../data/mockData';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../contexts/ToastContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { calculateQuorum } from '../../lib/utils';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  vote: Vote;
}

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({
  isOpen,
  onClose,
  vote
}) => {
  const { members, selectedBuilding } = useApp();
  const { showToast } = useToast();
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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

      const buildingMembers = members.filter(m => m.buildingId === vote.buildingId);
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
      
      setGeneratedText(text);
      showToast('Zápis byl vygenerován', 'success');
    } catch (error) {
      console.error('Error generating AI content:', error);
      showToast('Chyba při generování zápisu', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    showToast('Text byl zkopírován do schránky', 'success');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Generátor zápisu" size="xl">
      <div className="space-y-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Vygeneruje formální zápis ze shromáždění na základě výsledků hlasování pomocí AI.
        </div>

        {!generatedText && (
          <Button 
            onClick={generateMinutes} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Generuje se...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Vygenerovat zápis
              </>
            )}
          </Button>
        )}

        {generatedText && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Vygenerovaný zápis
              </h4>
              <Button variant="secondary" size="sm" onClick={copyToClipboard}>
                <Copy className="w-4 h-4 mr-2" />
                Kopírovat
              </Button>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-sans">
                {generatedText}
              </pre>
            </div>

            <div className="flex space-x-2">
              <Button variant="secondary" onClick={() => setGeneratedText('')}>
                Vygenerovat znovu
              </Button>
              <Button onClick={onClose}>
                Hotovo
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};