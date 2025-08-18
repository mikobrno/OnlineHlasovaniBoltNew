// src/modules/votes/components/VoteMembersView.tsx
import { FC, useState } from 'react';
import { Users, Plus, Search, Mail, Phone, Vote as VoteIcon, FileText, CheckCircle, X, Upload, AlertCircle } from 'lucide-react';
import { Card } from '@/components/common';
import { useQuery } from '@apollo/client';
import { GET_VOTE_DETAILS } from '@/graphql/queries';

interface VoteMembersViewProps {
  voteId: string;
  buildingId: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  unit: string;
  weight: number;
  hasVoted: boolean;
  voteValue?: 'yes' | 'no' | 'abstain';
  hasProxy?: boolean;
  proxyFrom?: string;
  proxyDocument?: string;
}




export const VoteMembersView: FC<VoteMembersViewProps> = ({ voteId, buildingId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'voted' | 'not-voted'>('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Načtení členů a hlasů z GraphQL
  const { data, loading, error } = useQuery(GET_VOTE_DETAILS, {
    variables: { voteId, buildingId },
    fetchPolicy: 'cache-and-network',
  });

  // Mapování členů a hlasů na původní strukturu
  type GqlMember = { id: string; name: string; email: string; phone?: string; unit: string; vote_weight?: number };
  type GqlMemberVote = { member_id: string; answer?: 'yes' | 'no' | 'abstain' };
  const members: Member[] = (data?.members || []).map((m: GqlMember) => {
    const memberVote = data?.member_votes_aggregate?.nodes?.find((v: GqlMemberVote) => v.member_id === m.id);
    return {
      id: m.id,
      name: m.name,
      email: m.email,
      phone: m.phone,
      unit: m.unit,
      weight: m.vote_weight ?? 1,
      hasVoted: !!memberVote,
      voteValue: memberVote?.answer ?? undefined,
    };
  });

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.unit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' ||
      (filter === 'voted' && member.hasVoted) ||
      (filter === 'not-voted' && !member.hasVoted);
    return matchesSearch && matchesFilter;
  });

  const handleVoteForMember = (memberId: string, voteValue: 'yes' | 'no' | 'abstain') => {
    console.log(`Hlasování za člena ${memberId}: ${voteValue}`);
    // TODO: Implementovat GraphQL mutaci pro hlasování za člena
    setShowVoteModal(false);
    setSelectedMember(null);
  };

  const handleMemberClick = (member: Member) => {
    if (!member.hasVoted) {
      setSelectedMember(member);
      setShowVoteModal(true);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const getVoteStatusBadge = (member: Member) => {
    if (!member.hasVoted) {
      return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">Neodevzdal</span>;
    }
    
    switch (member.voteValue) {
      case 'yes':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Pro</span>;
      case 'no':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Proti</span>;
      case 'abstain':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Zdržel se</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Hlasoval</span>;
    }
  };

  const votedCount = members.filter(m => m.hasVoted).length;
  const totalWeight = members.reduce((sum, m) => sum + m.weight, 0);
  const votedWeight = members.filter(m => m.hasVoted).reduce((sum, m) => sum + m.weight, 0);

  if (loading) return <div>Načítám členy…</div>;
  if (error) return <div>Chyba při načítání členů: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Celkem členů</p>
              <p className="text-xl font-semibold">{mockMembers.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Hlasovalo</p>
              <p className="text-xl font-semibold">{votedCount}/{mockMembers.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Váha hlasů</p>
              <p className="text-xl font-semibold">{votedWeight.toFixed(1)}/{totalWeight.toFixed(1)}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Hledat člena..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select 
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'voted' | 'not-voted')}
              title="Filtrovat členy podle stavu hlasování"
            >
              <option value="all">Všichni</option>
              <option value="voted">Hlasovali</option>
              <option value="not-voted">Nehlasovali</option>
            </select>
            
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Plus className="w-4 h-4 mr-2 inline" />
              Přidat člena
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Člen</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Jednotka</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Váha</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Stav hlasu</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Akce</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr 
                  key={member.id} 
                  className={`border-b border-gray-100 transition-colors ${
                    !member.hasVoted 
                      ? 'hover:bg-blue-50 cursor-pointer' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleMemberClick(member)}
                  title={!member.hasVoted ? 'Klikněte pro ruční hlasování za tohoto člena' : ''}
                >
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        {member.name}
                        {!member.hasVoted && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Klikněte pro hlasování
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {member.email}
                        </div>
                        {member.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {member.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-900">{member.unit}</td>
                  <td className="py-4 px-4 text-gray-900">{member.weight.toFixed(1)}</td>
                  <td className="py-4 px-4">{getVoteStatusBadge(member)}</td>
                  <td className="py-4 px-4 text-right">
                    <button 
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Zde by byla logika pro úpravu člena
                      }}
                    >
                      Upravit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Žádní členové nenalezeni.
          </div>
        )}
      </Card>

      {/* Detailed member management section */}
      <Card className="mt-6">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailní správa hlasování</h3>
          
          <div className="grid gap-4">
            {filteredMembers.map(member => (
              <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{member.name}</h4>
                    <p className="text-sm text-gray-600">{member.email} • Jednotka: {member.unit}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Váha hlasu: {member.weight.toFixed(1)}</div>
                    {getVoteStatusBadge(member)}
                  </div>
                </div>
                
                {/* Proxy voting info */}
                {member.hasProxy && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <div className="flex items-center gap-2 text-blue-800">
                      <FileText size={16} />
                      <span className="font-medium">Plná moc od: {member.proxyFrom}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <button 
                        onClick={() => member.proxyDocument && window.open(member.proxyDocument, '_blank')}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                      >
                        <FileText size={14} />
                        Zobrazit dokument
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Vote on behalf section */}
                {!member.hasVoted && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Hlasovat za člena</h4>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleVoteForMember(member.id, 'yes')}
                        className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={16} />
                        PRO
                      </button>
                      <button 
                        onClick={() => handleVoteForMember(member.id, 'no')}
                        className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <VoteIcon size={16} />
                        PROTI
                      </button>
                      <button 
                        onClick={() => handleVoteForMember(member.id, 'abstain')}
                        className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        ZDRŽEL SE
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Proxy management section */}
      <Card className="mt-6">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="text-blue-600" size={20} />
            Správa plných mocí
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Nahrát novou plnou moc</h4>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FileText className="mx-auto text-gray-400 mb-3" size={32} />
                <p className="text-gray-600 mb-3">Přetáhněte soubor sem nebo klikněte pro výběr</p>
                <input 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png" 
                  className="hidden" 
                  id="proxy-upload"
                />
                <label 
                  htmlFor="proxy-upload"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  Vybrat soubor
                </label>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Aktivní plné moci</h4>
              <div className="space-y-3">
                {mockMembers.filter(m => m.hasProxy).map(member => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <div>
                      <p className="font-medium text-green-800">{member.name}</p>
                      <p className="text-sm text-green-600">od: {member.proxyFrom}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800" title="Zobrazit dokument">
                        <FileText size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-800" title="Odstranit">
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Modal pro ruční hlasování */}
      {showVoteModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Ruční hlasování za člena
                </h3>
                <button 
                  onClick={() => setShowVoteModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  title="Zavřít"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                      Hlasování na základě plné moci
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Můžete hlasovat za tohoto člena pouze pokud máte platnou plnou moc. 
                      Prosím nahrajte naskenovaný dokument plné moci před odevzdáním hlasu.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Hlasování za:</h4>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <p className="font-medium">{selectedMember.name}</p>
                  <p>{selectedMember.email}</p>
                  <p>Jednotka: {selectedMember.unit} • Váha hlasu: {selectedMember.weight.toFixed(1)}</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Otázky k hlasování:</h4>
                <div className="space-y-4">
                  {voteQuestions.map((question) => (
                    <div key={question.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <p className="text-gray-900 dark:text-gray-100 mb-3">{question.text}</p>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleVoteForMember(selectedMember.id, 'yes')}
                          className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={16} />
                          PRO
                        </button>
                        <button 
                          onClick={() => handleVoteForMember(selectedMember.id, 'no')}
                          className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <X size={16} />
                          PROTI
                        </button>
                        <button 
                          onClick={() => handleVoteForMember(selectedMember.id, 'abstain')}
                          className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          ZDRŽEL SE
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Nahrání plné moci</h4>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  {uploadedFile ? (
                    <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                      <FileText size={20} />
                      <span>Nahráno: {uploadedFile.name}</span>
                      <button 
                        onClick={() => setUploadedFile(null)}
                        className="text-red-500 hover:text-red-700 ml-2"
                        title="Odstranit soubor"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto text-gray-400 dark:text-gray-500 mb-3" size={32} />
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        Přetáhněte soubor sem nebo klikněte pro výběr
                      </p>
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png" 
                        className="hidden" 
                        id="proxy-upload-modal"
                        onChange={handleFileUpload}
                      />
                      <label 
                        htmlFor="proxy-upload-modal"
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
                      >
                        Vybrat soubor plné moci
                      </label>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Podporované formáty: PDF, JPG, PNG (max. 10MB)
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                <button 
                  onClick={() => setShowVoteModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                >
                  Zrušit
                </button>
                <button 
                  disabled={!uploadedFile}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    uploadedFile 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {uploadedFile ? 'Pokračovat v hlasování' : 'Nejdříve nahrajte plnou moc'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
