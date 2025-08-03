import React, { useState } from 'react';
import { Mail, UserCheck, Edit, FileDown, Send } from 'lucide-react';
import { Vote } from '../../data/mockData';
import { useApp } from '../../contexts/AppContextCompat';
import { useToast } from '../../contexts/ToastContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ChangeRepresentativeModal } from './ChangeRepresentativeModal';
import { ManualVoteEntryModal } from './ManualVoteEntryModal';
import { VotingInvitationModal } from './VotingInvitationModal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface MemberManagementViewProps {
  vote: Vote;
}

export const MemberManagementView: React.FC<MemberManagementViewProps> = ({ vote }) => {
  const { members } = useApp();
  const { showToast } = useToast();
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [showRepresentativeModal, setShowRepresentativeModal] = useState(false);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [showInvitationModal, setShowInvitationModal] = useState(false);
  
  const buildingMembers = members.filter(m => m.buildingId === vote.buildingId);
  const votedMembers = Object.keys(vote.memberVotes);

  const sendInvitation = (memberId: string) => {
    const member = buildingMembers.find(m => m.id === memberId);
    if (member) {
      // Simulate sending email
      showToast(`Pozvánka byla odeslána na ${member.email}`, 'success');
    }
  };

  const resendInvitation = (memberId: string) => {
    const member = buildingMembers.find(m => m.id === memberId);
    if (member) {
      // Simulate resending email
      showToast(`Pozvánka byla znovu odeslána na ${member.email}`, 'success');
    }
  };

  const exportVotingBallots = () => {
    const doc = new jsPDF();
    
    buildingMembers.forEach((member, index) => {
      if (index > 0) {
        doc.addPage();
      }
      
      // Header
      doc.setFontSize(16);
      doc.text('HLASOVACÍ LÍSTEK', 105, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text(`Hlasování: ${vote.title}`, 20, 40);
      doc.text(`Člen: ${member.name}`, 20, 50);
      doc.text(`Jednotka: ${member.unit}`, 20, 60);
      doc.text(`Váha hlasu: ${member.voteWeight}`, 20, 70);
      
      let yPosition = 90;
      
      // Questions
      vote.questions.forEach((question, qIndex) => {
        doc.setFontSize(11);
        doc.text(`${qIndex + 1}. ${question.text}`, 20, yPosition);
        yPosition += 15;
        
        // Answer options
        doc.rect(25, yPosition, 5, 5);
        doc.text('ANO', 35, yPosition + 4);
        
        doc.rect(70, yPosition, 5, 5);
        doc.text('NE', 80, yPosition + 4);
        
        doc.rect(115, yPosition, 5, 5);
        doc.text('ZDRŽUJI SE', 125, yPosition + 4);
        
        yPosition += 20;
        
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
      });
      
      // Footer
      doc.setFontSize(10);
      doc.text('Podpis: ________________________', 20, yPosition + 20);
      doc.text('Datum: ________________________', 20, yPosition + 35);
    });
    
    doc.save(`hlasovaci-listky-${vote.id}.pdf`);
    showToast('Hlasovací lístky byly vygenerovány', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Správa členů pro hlasování
        </h3>
        <Button onClick={exportVotingBallots}>
          <FileDown className="w-4 h-4 mr-2" />
          Exportovat lístky
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
                  Kontakt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Jednotka
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Váha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Zastupuje
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Stav
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Akce
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {buildingMembers.map((member) => {
                const hasVoted = votedMembers.includes(member.id);
                const representative = vote.memberRepresentatives?.[member.id] 
                  ? buildingMembers.find(m => m.id === vote.memberRepresentatives[member.id])
                  : buildingMembers.find(m => m.id === member.representativeId);
                const hasAttachments = vote.manualVoteAttachments?.[member.id]?.length > 0;
                const hasNote = vote.manualVoteNotes?.[member.id];
                
                return (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      <div className="flex items-center space-x-2">
                        <span>{member.name}</span>
                        {hasAttachments && (
                          <Paperclip className="w-4 h-4 text-blue-500" title="Má přílohy" />
                        )}
                        {hasNote && (
                          <FileText className="w-4 h-4 text-green-500" title="Má poznámku" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div>
                        <div>{member.email}</div>
                        <div className="text-xs">{member.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {member.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {member.voteWeight}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {representative ? representative.name : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          hasVoted 
                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
                        }`}>
                          {hasVoted ? 'Hlasoval' : 'Nehlasoval'}
                        </span>
                        {hasVoted && (hasAttachments || hasNote) && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {hasAttachments && `${vote.manualVoteAttachments![member.id].length} příloh`}
                            {hasAttachments && hasNote && ', '}
                            {hasNote && 'poznámka'}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {!hasVoted ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => sendInvitation(member.id)}
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => resendInvitation(member.id)}
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedMemberId(member.id);
                          setShowRepresentativeModal(true);
                        }}
                      >
                        <UserCheck className="w-4 h-4" />
                      </Button>
                      
                      {vote.status === 'active' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedMemberId(member.id);
                            setShowVoteModal(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          <div className="flex space-x-2">
            <Button onClick={() => setShowInvitationModal(true)}>
              <Send className="w-4 h-4 mr-2" />
              Odeslat pozvánky
            </Button>
            <Button variant="secondary" onClick={exportVotingBallots}>
              <FileDown className="w-4 h-4 mr-2" />
              Exportovat lístky
            </Button>
          </div>
        </div>
      </Card>

      {selectedMemberId && (
        <>
          <ChangeRepresentativeModal
            isOpen={showRepresentativeModal}
            onClose={() => {
              setShowRepresentativeModal(false);
              setSelectedMemberId(null);
            }}
            vote={vote}
            memberId={selectedMemberId}
          />
          
          <ManualVoteEntryModal
            isOpen={showVoteModal}
            onClose={() => {
              setShowVoteModal(false);
              setSelectedMemberId(null);
            }}
            vote={vote}
            memberId={selectedMemberId}
          />
          
          <VotingInvitationModal
            isOpen={showInvitationModal}
            onClose={() => setShowInvitationModal(false)}
            vote={vote}
          />
        </>
      )}
    </div>
  );
};
