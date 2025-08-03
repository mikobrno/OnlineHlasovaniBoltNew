import React, { useState } from 'react';
import { Download, FileText, Wand2, Mail } from 'lucide-react';
import { Vote } from '../../data/mockData';
import { useApp } from '../../contexts/AppContext';
import { useToast } from '../../contexts/ToastContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { calculateQuorum } from '../../lib/utils';
import { AIGeneratorModal } from './AIGeneratorModal';
import { SendMinutesModal } from './SendMinutesModal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface ResultsViewProps {
  vote: Vote;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ vote }) => {
  const { members, selectedBuilding } = useApp();
  const { showToast } = useToast();
  const [showIndividual, setShowIndividual] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  
  const buildingMembers = members.filter(m => m.buildingId === vote.buildingId);
  const totalWeight = buildingMembers.reduce((sum, member) => sum + member.voteWeight, 0);
  const votedMembers = Object.keys(vote.memberVotes);

  const getQuestionResults = (questionId: string) => {
    const question = vote.questions.find(q => q.id === questionId);
    if (!question) return { yes: 0, no: 0, abstain: 0, total: 0, approved: false, requiredQuorum: 0 };

    let yes = 0, no = 0, abstain = 0;
    
    votedMembers.forEach(memberId => {
      const member = buildingMembers.find(m => m.id === memberId);
      const memberVote = vote.memberVotes[memberId]?.[questionId];
      const weight = member?.voteWeight || 0;
      
      if (memberVote === 'yes') yes += weight;
      else if (memberVote === 'no') no += weight;
      else if (memberVote === 'abstain') abstain += weight;
    });

    const requiredQuorum = calculateQuorum(question.quorumType, totalWeight, question.customQuorum);
    const approved = yes >= requiredQuorum;
    
    return { yes, no, abstain, total: yes + no + abstain, approved, requiredQuorum };
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.text('Protokol o výsledku hlasování', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Budova: ${selectedBuilding?.name || ''}`, 20, 35);
    doc.text(`Hlasování: ${vote.title}`, 20, 45);
    doc.text(`Datum ukončení: ${vote.endDate ? new Date(vote.endDate).toLocaleDateString('cs-CZ') : ''}`, 20, 55);
    
    // Summary
    doc.text('Souhrn účasti:', 20, 75);
    doc.text(`Celkem členů: ${buildingMembers.length}`, 30, 85);
    doc.text(`Hlasovalo: ${votedMembers.length}`, 30, 95);
    doc.text(`Účast: ${Math.round((votedMembers.length / buildingMembers.length) * 100)}%`, 30, 105);
    
    let yPosition = 125;
    
    // Results for each question
    vote.questions.forEach((question, index) => {
      const results = getQuestionResults(question.id);
      
      doc.text(`${index + 1}. ${question.text}`, 20, yPosition);
      yPosition += 10;
      
      doc.text(`Ano: ${results.yes.toFixed(1)} hlasů`, 30, yPosition);
      doc.text(`Ne: ${results.no.toFixed(1)} hlasů`, 100, yPosition);
      doc.text(`Zdržel se: ${results.abstain.toFixed(1)} hlasů`, 170, yPosition);
      yPosition += 10;
      
      doc.text(`Výsledek: ${results.approved ? 'SCHVÁLENO' : 'ZAMÍTNUTO'}`, 30, yPosition);
      yPosition += 20;
      
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
    });
    
    // Individual votes table
    if (showIndividual || true) {
      doc.addPage();
      doc.text('Individuální přehled hlasování', 20, 20);
      
      const tableData = buildingMembers.map(member => {
        const hasVoted = votedMembers.includes(member.id);
        const row = [member.name, member.unit, member.voteWeight.toString()];
        
        vote.questions.forEach(question => {
          const memberVote = vote.memberVotes[member.id]?.[question.id];
          row.push(hasVoted ? (memberVote === 'yes' ? 'Ano' : memberVote === 'no' ? 'Ne' : 'Zdržel se') : '-');
        });
        
        return row;
      });
      
      const tableHeaders = ['Člen', 'Jednotka', 'Váha', ...vote.questions.map((_, i) => `Otázka ${i + 1}`)];
      
      doc.autoTable({
        head: [tableHeaders],
        body: tableData,
        startY: 30,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] }
      });
    }
    
    doc.save(`protokol-hlasovani-${vote.id}.pdf`);
    showToast('PDF protokol byl vygenerován', 'success');
  };

  if (showIndividual) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Individuální výsledky hlasování
          </h3>
          <Button variant="secondary" onClick={() => setShowIndividual(false)}>
            Zobrazit souhrnné výsledky
          </Button>
        </div>

        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Člen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Jednotka
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Váha
                  </th>
                  {vote.questions.map((question, index) => (
                    <th key={question.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Otázka {index + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {buildingMembers.map((member) => {
                  const hasVoted = votedMembers.includes(member.id);
                  const hasAttachments = vote.manualVoteAttachments?.[member.id]?.length > 0;
                  const hasNote = vote.manualVoteNotes?.[member.id];
                  return (
                    <tr key={member.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        <div className="flex items-center space-x-2">
                          <span>{member.name}</span>
                          {hasAttachments && (
                            <Paperclip className="w-4 h-4 text-blue-500" title={`${vote.manualVoteAttachments![member.id].length} příloh`} />
                          )}
                          {hasNote && (
                            <FileText className="w-4 h-4 text-green-500" title="Má poznámku" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {member.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {member.voteWeight}
                      </td>
                      {vote.questions.map((question) => {
                        const memberVote = vote.memberVotes[member.id]?.[question.id];
                        return (
                          <td key={question.id} className="px-6 py-4 whitespace-nowrap text-sm">
                            {hasVoted ? (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                memberVote === 'yes' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200' :
                                memberVote === 'no' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                              }`}>
                                {memberVote === 'yes' && 'Ano'}
                                {memberVote === 'no' && 'Ne'}
                                {memberVote === 'abstain' && 'Zdržel se'}
                              </span>
                            ) : (
                              <span className="text-gray-400">Nehlasoval</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Finální výsledky hlasování
        </h3>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={() => setShowIndividual(true)}>
            <FileText className="w-4 h-4 mr-2" />
            Individuální přehled
          </Button>
          <Button variant="secondary" onClick={() => setShowAIModal(true)}>
            <Wand2 className="w-4 h-4 mr-2" />
            Vygenerovat zápis (AI)
          </Button>
          <Button variant="secondary" onClick={() => setShowSendModal(true)}>
            <Mail className="w-4 h-4 mr-2" />
            Odeslat zápis
          </Button>
          <Button onClick={exportToPDF}>
            <Download className="w-4 h-4 mr-2" />
            Exportovat PDF
          </Button>
        </div>
      </div>

      <div className="space-y-4">        
        {vote.questions.map((question, index) => {
          const results = getQuestionResults(question.id);
          const totalVoted = results.total;
          
          return (
            <Card key={question.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h5 className="font-medium text-gray-900 dark:text-gray-100">
                  {index + 1}. {question.text}
                </h5>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  results.approved
                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'
                }`}>
                  {results.approved ? 'SCHVÁLENO' : 'ZAMÍTNUTO'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {results.yes.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Ano ({totalVoted > 0 ? ((results.yes / totalVoted) * 100).toFixed(1) : 0}%)
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {results.no.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Ne ({totalVoted > 0 ? ((results.no / totalVoted) * 100).toFixed(1) : 0}%)
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                    {results.abstain.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Zdržel se ({totalVoted > 0 ? ((results.abstain / totalVoted) * 100).toFixed(1) : 0}%)
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {results.requiredQuorum.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Potřebné kvórum
                  </div>
                </div>
              </div>

              {totalVoted > 0 && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div className="h-full flex">
                    <div 
                      className="bg-green-500 transition-all"
                      style={{ width: `${(results.yes / totalVoted) * 100}%` }}
                    />
                    <div 
                      className="bg-red-500 transition-all"
                      style={{ width: `${(results.no / totalVoted) * 100}%` }}
                    />
                    <div 
                      className="bg-gray-400 transition-all"
                      style={{ width: `${(results.abstain / totalVoted) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  Kvórum: {question.quorumType === 'simple' && 'Prostá většina (1/2)'}
                  {question.quorumType === 'qualified' && 'Kvalifikovaná většina (2/3)'}
                  {question.quorumType === 'unanimous' && 'Jednomyslné'}
                  {question.quorumType === 'custom' && question.customQuorum && 
                    `Vlastní (${question.customQuorum.numerator}/${question.customQuorum.denominator})`
                  }
                </p>
                <p>
                  Pro schválení bylo potřeba {results.requiredQuorum.toFixed(1)} hlasů, 
                  získáno {results.yes.toFixed(1)} hlasů.
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      <AIGeneratorModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        vote={vote}
      />
      
      <SendMinutesModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        vote={vote}
      />
    </div>
  );
};