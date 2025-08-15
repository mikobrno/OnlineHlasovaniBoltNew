import React, { useState } from 'react';
import { ArrowLeft, Edit, Mail, Download, FileText, BarChart3, Eye, Play, Paperclip, FileDown } from 'lucide-react';
import { Vote } from '../../data/mockData';
import { useApp } from '../../hooks/useApp';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Modal } from '../common/Modal';
import { formatDate, getVoteStatusText, getVoteStatusColor } from '../../lib/utils';
import { VotingProgressView } from './VotingProgressView';
import { ResultsView } from './ResultsView';
import { MemberManagementView } from './MemberManagementView';
import { ObserversView } from './ObserversView';
import { BallotTemplateModal } from './BallotTemplateModal';

interface VoteDetailViewProps {
  vote: Vote;
  onBack: () => void;
  onEdit: (vote: Vote) => void;
}

export const VoteDetailView: React.FC<VoteDetailViewProps> = ({
  vote,
  onBack,
  onEdit
}) => {
  const { members } = useApp();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'info' | 'members' | 'observers' | 'progress' | 'results' | 'attachments'>('info');
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [selectedMemberAttachments, setSelectedMemberAttachments] = useState<{ member: string; attachments: string[]; note?: string } | null>(null);
  const [showBallotModal, setShowBallotModal] = useState(false);
  
  const buildingMembers = members.filter(m => m.buildingId === vote.buildingId);
  const votedMembers = Object.keys(vote.memberVotes).length;
  const hasManualVoteAttachments = vote.manualVoteAttachments && Object.keys(vote.manualVoteAttachments).length > 0;

  const handleStartVote = () => {
    if (window.confirm('Opravdu chcete spustit hlasování? Tato akce je nevratná.')) {
      // TODO: implementace startVote v kontextu
      showToast('Spuštění hlasování zatím není implementováno', 'info');
    }
  };

  const showMemberAttachments = (memberId: string) => {
    const member = buildingMembers.find(m => m.id === memberId);
    const attachments = vote.manualVoteAttachments?.[memberId] || [];
    const note = vote.manualVoteNotes?.[memberId];
    
    if (member && (attachments.length > 0 || note)) {
      setSelectedMemberAttachments({
        member: member.name,
        attachments,
        note
      });
      setShowAttachmentModal(true);
    }
  };
  
  const tabs = [
    { id: 'info', label: 'Informace', icon: <FileText className="w-4 h-4" /> },
    { id: 'members', label: 'Členové', icon: <Mail className="w-4 h-4" /> },
    { id: 'observers', label: 'Pozorovatelé', icon: <Eye className="w-4 h-4" /> },
    ...(hasManualVoteAttachments ? [{ id: 'attachments', label: 'Přílohy', icon: <Paperclip className="w-4 h-4" /> }] : []),
    ...(vote.status === 'active' ? [{ id: 'progress', label: 'Průběh', icon: <BarChart3 className="w-4 h-4" /> }] : []),
    ...(vote.status === 'completed' ? [{ id: 'results', label: 'Výsledky', icon: <BarChart3 className="w-4 h-4" /> }] : [])
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'members':
        return <MemberManagementView vote={vote} />;
      case 'observers':
        return <ObserversView vote={vote} />;
      case 'attachments':
        return renderAttachmentsView();
      case 'progress':
        return vote.status === 'active' ? <VotingProgressView vote={vote} /> : null;
      case 'results':
        return vote.status === 'completed' ? <ResultsView vote={vote} /> : null;
      default:
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {vote.title}
                  </h2>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVoteStatusColor(vote.status)}`}>
                    {getVoteStatusText(vote.status)}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => setShowBallotModal(true)} size="sm" title="Vytvořit / vytisknout hlasovací listinu">
                    <FileDown className="w-4 h-4 mr-2" />
                    Hlasovací listina
                  </Button>
                  {vote.status === 'draft' && (
                    <Button onClick={handleStartVote} size="sm">
                      <Play className="w-4 h-4 mr-2" />
                      Spustit hlasování
                    </Button>
                  )}
                  <Button onClick={() => onEdit(vote)} size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Upravit
                  </Button>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none mb-6">
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {vote.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Časové údaje
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <div>Vytvořeno: {formatDate(vote.createdAt)}</div>
                    {vote.startDate && (
                      <div>Začátek: {formatDate(vote.startDate)}</div>
                    )}
                    {vote.endDate && (
                      <div>Konec: {formatDate(vote.endDate)}</div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Účast
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <div>Hlasovalo: {votedMembers} z {buildingMembers.length} členů</div>
                    <div>Účast: {buildingMembers.length > 0 ? Math.round((votedMembers / buildingMembers.length) * 100) : 0}%</div>
                    {hasManualVoteAttachments && (
                      <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
                        <Paperclip className="w-3 h-3" />
                        <span>Obsahuje přílohy k ručním hlasům</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Hlasovací otázky ({vote.questions.length})
              </h3>
              <div className="space-y-4">
                {vote.questions.map((question, index) => (
                  <div key={question.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          {index + 1}. {question.text}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Kvórum: {question.quorumType === 'simple' && 'Prostá většina (1/2)'}
                          {question.quorumType === 'qualified' && 'Kvalifikovaná většina (2/3)'}
                          {question.quorumType === 'unanimous' && 'Jednomyslné'}
                          {question.quorumType === 'custom' && question.customQuorum && 
                            `Vlastní (${question.customQuorum.numerator}/${question.customQuorum.denominator})`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );
    }
  };

  const renderAttachmentsView = () => {
    if (!vote.manualVoteAttachments) return null;

    const membersWithAttachments = Object.entries(vote.manualVoteAttachments)
      .filter((entry) => entry[1].length > 0)
      .map(([memberId, attachments]) => {
        const member = buildingMembers.find(m => m.id === memberId);
        const note = vote.manualVoteNotes?.[memberId];
        return { memberId, member, attachments, note };
      })
      .filter(item => item.member);

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Přílohy k ručním hlasům
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {membersWithAttachments.length} členů s přílohami
          </div>
        </div>

        {membersWithAttachments.length === 0 ? (
          <Card className="p-8">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Paperclip className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Žádné přílohy k ručním hlasům</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {membersWithAttachments.map(({ memberId, member, attachments, note }) => (
              <Card key={memberId} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {member!.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Jednotka: {member!.unit} | {attachments.length} příloh
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => showMemberAttachments(memberId)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Zobrazit
                  </Button>
                </div>

                {note && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Poznámka:</strong> {note}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                        {attachment}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zpět na přehled
        </Button>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'info' | 'members' | 'observers' | 'progress' | 'results' | 'attachments')}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.id === 'attachments' && hasManualVoteAttachments && (
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200 text-xs px-2 py-0.5 rounded-full">
                  {Object.keys(vote.manualVoteAttachments!).length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {renderTabContent()}

      <Modal
        isOpen={showAttachmentModal}
        onClose={() => setShowAttachmentModal(false)}
        title={`Přílohy - ${selectedMemberAttachments?.member}`}
        size="lg"
      >
        {selectedMemberAttachments && (
          <div className="space-y-4">
            {selectedMemberAttachments.note && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Poznámka</h4>
                <p className="text-blue-800 dark:text-blue-200">
                  {selectedMemberAttachments.note}
                </p>
              </div>
            )}

            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                Přílohy ({selectedMemberAttachments.attachments.length})
              </h4>
              <div className="space-y-2">
                {selectedMemberAttachments.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {attachment}
                      </span>
                    </div>
                    <Button size="sm" variant="secondary">
                      <Download className="w-4 h-4 mr-2" />
                      Stáhnout
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

  <BallotTemplateModal vote={vote} isOpen={showBallotModal} onClose={() => setShowBallotModal(false)} />
    </div>
  );
};
