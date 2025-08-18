import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Wand2, Mail, Upload, X, Eye, Vote as VoteIcon, UserCheck, UserX, Bell } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { Button, Card, Input } from '@/components/common';
import { useMutation, useQuery } from '@apollo/client';
import { 
  CREATE_VOTE, 
  UPDATE_VOTE,
} from '../graphql/mutations';
import { GET_EMAIL_TEMPLATES } from '../graphql/queries';
import { GET_MEMBERS } from '@/graphql/members';
import { GET_GLOBAL_VARIABLES } from '@/graphql/globals';
import type { Vote } from '../types';
import { generateUUID, replaceVariables } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface VoteFormViewProps {
  vote?: Vote | null;
  onBack: () => void;
  buildingId: string;
}

interface FormQuestion {
  id: string;
  text: string;
  quorum_type: 'simple' | 'qualified' | 'unanimous' | 'custom';
  custom_quorum_numerator?: number;
  custom_quorum_denominator?: number;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

interface VoteVariable {
  name: string;
  description: string;
  type: 'global' | 'building' | 'member';
}

type TabType = 'vote' | 'representative' | 'represented' | 'reminder';

interface TabDefinition {
  id: TabType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const tabs: TabDefinition[] = [
  {
    id: 'vote',
    label: 'Nové hlasování',
    icon: <VoteIcon className="w-4 h-4" />,
    description: 'Vytvořit nebo upravit hlasování'
  },
  {
    id: 'representative',
    label: 'E-mail pro zástupce',
    icon: <UserCheck className="w-4 h-4" />,
    description: 'Šablona e-mailu pro zástupce za jednotku'
  },
  {
    id: 'represented',
    label: 'E-mail pro zastoupeného',
    icon: <UserX className="w-4 h-4" />,
    description: 'Šablona e-mailu pro zastoupeného člena'
  },
  {
    id: 'reminder',
    label: 'E-mail upomínky',
    icon: <Bell className="w-4 h-4" />,
    description: 'Upomínka pro nehlasující členy'
  }
];

export const VoteFormView: React.FC<VoteFormViewProps> = ({ vote, onBack, buildingId }) => {
  const { showToast } = useToast();
  
  // Stav pro záložky
  const [activeTab, setActiveTab] = useState<TabType>('vote');
  
  // Stavy pro hlasování
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'draft' | 'active'>('draft');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [votingDays, setVotingDays] = useState(30);
  const [questions, setQuestions] = useState<FormQuestion[]>([]);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [activeInput, setActiveInput] = useState<'title' | 'description' | null>(null);
  const [varSearch, setVarSearch] = useState('');

  // Stavy pro e-mailové šablony
  const [representativeEmailSubject, setRepresentativeEmailSubject] = useState('');
  const [representativeEmailBody, setRepresentativeEmailBody] = useState('');
  const [representedEmailSubject, setRepresentedEmailSubject] = useState('');
  const [representedEmailBody, setRepresentedEmailBody] = useState('');
  const [reminderEmailSubject, setReminderEmailSubject] = useState('');
  const [reminderEmailBody, setReminderEmailBody] = useState('');

  // Načtení e-mailových šablon
  const { data: templatesData } = useQuery(GET_EMAIL_TEMPLATES, {
    variables: { buildingId },
    skip: !buildingId
  });

  // Načtení členů pro ukázku proměnných
  const { data: membersData } = useQuery(GET_MEMBERS, {
    variables: { buildingId },
    skip: !buildingId,
  });

  // Načtení globálních proměnných
  const { data: globalsData } = useQuery(GET_GLOBAL_VARIABLES);

  const templates = templatesData?.email_templates || [];
  const buildingTemplates = templates.filter((t: EmailTemplate) => t.building_id === buildingId);

  // Funkce pro náhled šablony s nahrazením proměnných
  const getTemplatePreview = (templateId: string) => {
    const template = buildingTemplates.find(t => t.id === templateId);
    const sampleMember = membersData?.members?.[0];
    const globalVars = globalsData?.global_variables || [];
    
    if (!template || !sampleMember || !buildingId) return { subject: '', body: '' };

    const mockBuilding = { id: buildingId, name: 'Vybraná budova', variables: {} }; 
    
    return {
      subject: replaceVariables(template.subject, globalVars, mockBuilding, sampleMember),
      body: replaceVariables(template.body, globalVars, mockBuilding, sampleMember)
    };
  };

  // Sestavení seznamu dostupných proměnných
  const voteRelevantVariables: VoteVariable[] = [];

  // Globální proměnné
  if (globalsData?.global_variables) {
    globalsData.global_variables.forEach((g: { name: string; value: string }) => {
      voteRelevantVariables.push({
        name: g.name,
        description: `Globální proměnná: ${g.value}`,
        type: 'global',
      });
    });
  }

  // Základní systémové proměnné
  voteRelevantVariables.push(
    { name: 'datum_dnes', description: 'Aktuální datum', type: 'global' },
    { name: 'cas_ted', description: 'Aktuální čas', type: 'global' },
    { name: 'nazev_hlasovani', description: 'Název hlasování', type: 'global' },
    { name: 'popis_hlasovani', description: 'Popis hlasování', type: 'global' },
    { name: 'datum_zacatku', description: 'Datum začátku hlasování', type: 'global' },
    { name: 'datum_konce', description: 'Datum konce hlasování', type: 'global' },
    { name: 'stav_hlasovani', description: 'Stav hlasování', type: 'global' }
  );

  // Proměnné člena (na základě prvního člena jako vzoru)
  if (membersData?.members?.[0]) {
    const sampleMember = membersData.members[0];
    Object.keys(sampleMember).forEach(key => {
      if (key !== '__typename' && key !== 'id' && key !== 'building_id' && key !== 'user_id' && key !== 'created_at' && key !== 'updated_at') {
        voteRelevantVariables.push({
          name: key,
          description: `Vlastnost člena: ${key}`,
          type: 'member',
        });
      }
    });
  }

  // Funkce pro vkládání proměnných do textových polí
  const insertVariable = (variableName: string) => {
    const variable = `{{${variableName}}}`;
    
    if (activeInput === 'title') {
      const titleInput = document.querySelector('input[name="title"]') as HTMLInputElement;
      if (titleInput) {
        const start = titleInput.selectionStart || 0;
        const end = titleInput.selectionEnd || 0;
        const newTitle = title.substring(0, start) + variable + title.substring(end);
        setTitle(newTitle);
        
        // Restore cursor position
        setTimeout(() => {
          titleInput.focus();
          titleInput.setSelectionRange(start + variable.length, start + variable.length);
        }, 0);
      } else {
        setTitle(prev => prev + variable);
      }
    } else if (activeInput === 'description') {
      const descriptionTextarea = document.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
      if (descriptionTextarea) {
        const start = descriptionTextarea.selectionStart || 0;
        const end = descriptionTextarea.selectionEnd || 0;
        const newDescription = description.substring(0, start) + variable + description.substring(end);
        setDescription(newDescription);
        
        // Restore cursor position
        setTimeout(() => {
          descriptionTextarea.focus();
          descriptionTextarea.setSelectionRange(start + variable.length, start + variable.length);
        }, 0);
      } else {
        setDescription(prev => prev + variable);
      }
    }
  };

  // Načtení šablony a nahrazení proměnných
  const handleLoadFromTemplate = (templateId: string) => {
    const preview = getTemplatePreview(templateId);
    if (preview.subject) setTitle(preview.subject);
    if (preview.body) setDescription(preview.body);
    setShowTemplateModal(false);
    showToast('Šablona byla načtena a proměnné nahrazeny', 'success');
  };

  // Automatický výpočet konce hlasování
  useEffect(() => {
    if (startDate && votingDays > 0) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + votingDays);
      setEndDate(end.toISOString().slice(0, 16));
    }
  }, [startDate, votingDays]);

  useEffect(() => {
    if (vote) {
      setTitle(vote.title);
      setDescription(vote.description || '');
      setStatus(vote.status as 'draft' | 'active');
      setStartDate(vote.start_date ? new Date(vote.start_date).toISOString().slice(0, 16) : '');
      setEndDate(vote.end_date ? new Date(vote.end_date).toISOString().slice(0, 16) : '');
      
      // Vypočítej počet dní z existujícího hlasování
      if (vote.start_date && vote.end_date) {
        const start = new Date(vote.start_date);
        const end = new Date(vote.end_date);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setVotingDays(diffDays);
      }
      
      // Parsuj otázky z JSON
      try {
        const parsedQuestions = Array.isArray(vote.questions) 
          ? vote.questions as FormQuestion[]
          : JSON.parse(vote.questions as string || '[]') as FormQuestion[];
        setQuestions(parsedQuestions.map(q => ({ ...q, id: q.id || generateUUID() })));
      } catch {
        setQuestions([{ id: generateUUID(), text: '', quorum_type: 'simple' }]);
      }
    } else {
      // Initialize with one empty question
      setQuestions([{ id: generateUUID(), text: '', quorum_type: 'simple' }]);
    }
  }, [vote]);

  const addQuestion = () => {
    setQuestions([...questions, { id: generateUUID(), text: '', quorum_type: 'simple' }]);
  };

  const updateQuestion = (index: number, partial: Partial<FormQuestion>) => {
    setQuestions(qs => qs.map((q, i) => i === index ? { ...q, ...partial } : q));
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
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

  // GraphQL mutace pro přidání/aktualizaci hlasování
  const [createVoteMutation] = useMutation(CREATE_VOTE, {
    onError: (error) => {
      showToast(`Chyba při vytváření hlasování: ${error.message}`, 'error');
    }
  });

  const [updateVoteMutation] = useMutation(UPDATE_VOTE, {
    onError: (error) => {
      showToast(`Chyba při aktualizaci hlasování: ${error.message}`, 'error');
    }
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!buildingId) return;
    
    if (!title.trim() || !description.trim() || questions.some(q => !q.text.trim())) {
      showToast('Vyplňte všechna povinná pole', 'error');
      return;
    }

    const validQuestions = questions.filter(q => q.text.trim());
    
    const voteData = {
      building_id: buildingId,
      title: title.trim(),
      description: description.trim(),
      status: status,
      start_date: startDate ? new Date(startDate).toISOString() : undefined,
      end_date: endDate ? new Date(endDate).toISOString() : undefined,
      questions: JSON.stringify(validQuestions),
    };

    try {
      if (vote) {
        await updateVoteMutation({ 
          variables: { 
            id: vote.id, 
            updates: voteData 
          } 
        });
        showToast('Hlasování bylo aktualizováno', 'success');
      } else {
        await createVoteMutation({
          variables: { input: voteData }
        });
        showToast('Hlasování bylo vytvořeno', 'success');
      }
      onBack();
    } catch {
      // Chyby jsou již zpracovány v onError callbacku mutací
    }
  };

  const renderEmailTemplateForm = () => {
    switch (activeTab) {
      case 'representative':
        return (
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              E-mail pro zástupce za jednotku
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Předmět e-mailu *
                </label>
                <Input
                  value={representativeEmailSubject}
                  onChange={(e) => setRepresentativeEmailSubject(e.target.value)}
                  placeholder="např. Zastoupení při hlasování - {{vote.title}}"
                  onFocus={() => setActiveInput('title')}
                  onBlur={() => setActiveInput(null)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Obsah e-mailu *
                </label>
                <textarea
                  value={representativeEmailBody}
                  onChange={(e) => setRepresentativeEmailBody(e.target.value)}
                  onFocus={() => setActiveInput('description')}
                  onBlur={() => setActiveInput(null)}
                  rows={12}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Vážený/á {{member.name}},&#10;&#10;jste určen/a jako zástupce pro hlasování {{vote.title}}.&#10;&#10;Termín hlasování: {{vote.start_date}} - {{vote.end_date}}&#10;&#10;S pozdravem,&#10;{{company.name}}"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button type="button" variant="secondary" onClick={onBack}>
                  Zrušit
                </Button>
                <Button type="button">
                  <Mail className="w-4 h-4 mr-2" />
                  Uložit šablonu
                </Button>
              </div>
            </div>
          </Card>
        );

      case 'represented':
        return (
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              E-mail pro zastoupeného člena
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Předmět e-mailu *
                </label>
                <Input
                  value={representedEmailSubject}
                  onChange={(e) => setRepresentedEmailSubject(e.target.value)}
                  placeholder="např. Informace o zastoupení - {{vote.title}}"
                  onFocus={() => setActiveInput('title')}
                  onBlur={() => setActiveInput(null)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Obsah e-mailu *
                </label>
                <textarea
                  value={representedEmailBody}
                  onChange={(e) => setRepresentedEmailBody(e.target.value)}
                  onFocus={() => setActiveInput('description')}
                  onBlur={() => setActiveInput(null)}
                  rows={12}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Vážený/á {{member.name}},&#10;&#10;informujeme Vás, že při hlasování {{vote.title}} budete zastoupen/a následující osobou: {{representative.name}}.&#10;&#10;Termín hlasování: {{vote.start_date}} - {{vote.end_date}}&#10;&#10;S pozdravem,&#10;{{company.name}}"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button type="button" variant="secondary" onClick={onBack}>
                  Zrušit
                </Button>
                <Button type="button">
                  <Mail className="w-4 h-4 mr-2" />
                  Uložit šablonu
                </Button>
              </div>
            </div>
          </Card>
        );

      case 'reminder':
        return (
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              E-mail upomínky pro nehlasující
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Předmět e-mailu *
                </label>
                <Input
                  value={reminderEmailSubject}
                  onChange={(e) => setReminderEmailSubject(e.target.value)}
                  placeholder="např. Připomínka hlasování - {{vote.title}}"
                  onFocus={() => setActiveInput('title')}
                  onBlur={() => setActiveInput(null)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Obsah e-mailu *
                </label>
                <textarea
                  value={reminderEmailBody}
                  onChange={(e) => setReminderEmailBody(e.target.value)}
                  onFocus={() => setActiveInput('description')}
                  onBlur={() => setActiveInput(null)}
                  rows={12}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Vážený/á {{member.name}},&#10;&#10;připomínáme Vám, že dosud jste nehlasoval/a v hlasování {{vote.title}}.&#10;&#10;Termín hlasování končí: {{vote.end_date}}&#10;&#10;Hlasovat můžete na: {{vote.link}}&#10;&#10;S pozdravem,&#10;{{company.name}}"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button type="button" variant="secondary" onClick={onBack}>
                  Zrušit
                </Button>
                <Button type="button">
                  <Bell className="w-4 h-4 mr-2" />
                  Uložit šablonu
                </Button>
              </div>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zpět na přehled
        </Button>
      </div>

      <div className="max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {vote ? 'Upravit hlasování' : 'Nové hlasování'}
        </h1>

        {/* Záložky pro různé typy obsahu */}
        <Card className="p-4 mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                )}
                title={tab.description}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          
          {activeTab !== 'vote' && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                📧 {tabs.find(t => t.id === activeTab)?.description}
              </p>
            </div>
          )}
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-3">
            {activeTab === 'vote' ? (
              // Formulář pro hlasování
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Načtení ze šablony */}
                {buildingTemplates.length > 0 && (
                <Card className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Načíst z e-mailové šablony
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Můžete načíst název a popis hlasování z existující e-mailové šablony. 
                    Proměnné budou automaticky nahrazeny skutečnými hodnotami.
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowTemplateModal(true)}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Vybrat šablonu ({buildingTemplates.length} dostupných)
                  </Button>
                </Card>
              )}

              {/* Základní informace */}
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Základní informace
                </h3>
                <div className="space-y-4">
                  <Input
                    name="title"
                    label="Název hlasování *"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onFocus={() => setActiveInput('title')}
                    placeholder="např. Schválení ročního rozpočtu"
                    required
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Popis hlasování *
                    </label>
                    <textarea
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      onFocus={() => setActiveInput('description')}
                      rows={4}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Detailní popis hlasování..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Stav
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as 'draft' | 'active')}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-label="Stav hlasování"
                      >
                        <option value="draft">Návrh</option>
                        <option value="active">Aktivní</option>
                      </select>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Časové nastavení */}
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Časové nastavení
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Začátek hlasování"
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    helperText="Datum a čas spuštění hlasování"
                  />
                  
                  <Input
                    label="Počet dní na hlasování"
                    type="number"
                    min="1"
                    max="365"
                    value={votingDays}
                    onChange={(e) => setVotingDays(parseInt(e.target.value) || 30)}
                    helperText="Délka hlasování ve dnech"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Konec hlasování
                    </label>
                    <div className="h-10 flex items-center px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-600 dark:text-gray-400">
                      {endDate ? new Date(endDate).toLocaleString('cs-CZ') : 'Nastavte začátek hlasování'}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Hlasovací otázky */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Hlasovací otázky
                  </h3>
                  <Button type="button" onClick={addQuestion} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Přidat otázku
                  </Button>
                </div>

                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div key={question.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Otázka {index + 1}
                        </h4>
                        {questions.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuestion(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <Input
                          placeholder="Text otázky"
                          value={question.text}
                          onChange={(e) => updateQuestion(index, { text: e.target.value })}
                          required
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Typ kvóra
                            </label>
                            <select
                              value={question.quorum_type}
                              onChange={(e) => updateQuestion(index, { quorum_type: e.target.value as FormQuestion['quorum_type'] })}
                              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              aria-label="Typ kvóra"
                            >
                              <option value="simple">Prostá většina (1/2)</option>
                              <option value="qualified">Kvalifikovaná většina (2/3)</option>
                              <option value="unanimous">Jednomyslné</option>
                              <option value="custom">Vlastní</option>
                            </select>
                          </div>
                          {question.quorum_type === 'custom' && (
                            <div className="flex space-x-2">
                              <Input
                                type="number"
                                placeholder="Čitatel"
                                value={question.custom_quorum_numerator ?? ''}
                                onChange={(e) => updateQuestion(index, { custom_quorum_numerator: parseInt(e.target.value) || 1 })}
                                min="1"
                              />
                              <Input
                                type="number"
                                placeholder="Jmenovatel"
                                value={question.custom_quorum_denominator ?? ''}
                                onChange={(e) => updateQuestion(index, { custom_quorum_denominator: parseInt(e.target.value) || 2 })}
                                min="1"
                              />
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                            <strong>Možnosti hlasování:</strong>
                          </p>
                          <div className="flex space-x-4 text-sm text-blue-700 dark:text-blue-300">
                            <span>✅ Pro</span>
                            <span>❌ Proti</span>
                            <span>⚪ Zdržel se</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Přílohy */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Přílohy
                  </h3>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button type="button" size="sm" onClick={() => document.getElementById('file-upload')?.click()}>
                      <Upload className="w-4 h-4 mr-2" />
                      Nahrát soubory
                    </Button>
                  </label>
                </div>

                {attachments.length > 0 ? (
                  <div className="space-y-2">
                    {attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span className="text-sm">{attachment}</span>
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
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Žádné přílohy nepřidány</p>
                    <p className="text-xs mt-1">Podporované formáty: PDF, DOC, DOCX, JPG, PNG, TXT</p>
                  </div>
                )}
              </Card>

              {/* Akční tlačítka */}
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="secondary" onClick={onBack}>
                  Zrušit
                </Button>
                <Button type="submit">
                  {vote ? 'Aktualizovat' : 'Vytvořit'} hlasování
                </Button>
              </div>
            </form>
            ) : (
              // Formuláře pro e-mailové šablony
              <div className="space-y-6">
                {renderEmailTemplateForm()}
              </div>
            )}
          </div>

          {/* Boční panel s proměnnými */}
          <div className="xl:col-span-2">
            <div className="sticky top-4 space-y-4">
              <Card className="p-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                  Dostupné proměnné
                </h4>
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  {activeInput === 'title' && 'Klikněte na proměnnou pro vložení do názvu'}
                  {activeInput === 'description' && 'Klikněte na proměnnou pro vložení do popisu'}
                  {!activeInput && 'Klikněte do pole názvu nebo popisu a pak na proměnnou'}
                </div>
                
                {/* Vyhledávání v proměnných */}
                <div className="mb-3">
                  <input
                    type="text"
                    value={varSearch}
                    onChange={(e) => setVarSearch(e.target.value)}
                    placeholder="Hledat proměnnou podle názvu nebo popisu..."
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                  {voteRelevantVariables
                    .filter(v => {
                      if (!varSearch.trim()) return true;
                      const q = varSearch.toLowerCase();
                      return (
                        v.name.toLowerCase().includes(q) ||
                        (v.description || '').toLowerCase().includes(q)
                      );
                    })
                    .map((variable) => (
                    <button
                      key={variable.name}
                      type="button"
                      onClick={() => insertVariable(variable.name)}
                      disabled={!activeInput}
                      className={`w-full text-left p-2 text-xs rounded border transition-colors ${
                        activeInput
                          ? 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600 cursor-pointer'
                          : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <div className={`font-mono ${
                        variable.type === 'global' ? 'text-blue-600 dark:text-blue-400' :
                        variable.type === 'building' ? 'text-green-600 dark:text-green-400' :
                        'text-purple-600 dark:text-purple-400'
                      }`}>
                        {`{{${variable.name}}}`}
                      </div>
                      <div className="text-gray-900 dark:text-gray-100 mt-1">
                        {variable.description}
                      </div>
                      <div className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                        {variable.type === 'global' && '🌐 Globální'}
                        {variable.type === 'building' && '🏢 Budova'}
                        {variable.type === 'member' && '👤 Člen'}
                      </div>
                    </button>
                  ))}
                  {voteRelevantVariables.filter(v => {
                    if (!varSearch.trim()) return false;
                    const q = varSearch.toLowerCase();
                    return (
                      v.name.toLowerCase().includes(q) ||
                      (v.description || '').toLowerCase().includes(q)
                    );
                  }).length === 0 && varSearch.trim() && (
                    <div className="text-xs text-gray-600 dark:text-gray-400 p-2">
                      Žádné proměnné neodpovídají dotazu.
                    </div>
                  )}
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    <strong>Tip:</strong> Proměnné se automaticky nahradí skutečnými hodnotami při generování e-mailů nebo zobrazení hlasování.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Modal pro výběr šablony */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Vybrat e-mailovou šablonu
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTemplateModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                {/* Seznam šablon */}
                <div className="p-6 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Vyberte šablonu ze seznamu. Na pravé straně uvidíte náhled s nahrazenými proměnnými.
                  </div>
                  
                  <div className="space-y-3">
                    {buildingTemplates.map((template: EmailTemplate) => (
                      <div
                        key={template.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedTemplateId === template.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => setSelectedTemplateId(template.id)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                              {template.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              Předmět: {template.subject}
                            </p>
                            <div className="text-xs text-gray-500 dark:text-gray-500 line-clamp-3">
                              {template.body.substring(0, 200)}...
                            </div>
                          </div>
                          <div className="ml-3 flex-shrink-0">
                            <input
                              type="radio"
                              name="template"
                              checked={selectedTemplateId === template.id}
                              onChange={() => setSelectedTemplateId(template.id)}
                              className="text-blue-600"
                              aria-label={`Vybrat šablonu ${template.name}`}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>📧 E-mailová šablona</span>
                          {selectedTemplateId === template.id && (
                            <span className="flex items-center text-blue-600 dark:text-blue-400">
                              <Eye className="w-3 h-3 mr-1" />
                              Náhled →
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Náhled šablony */}
                <div className="p-6 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
                  {selectedTemplateId ? (
                    (() => {
                      const preview = getTemplatePreview(selectedTemplateId);
                      const template = buildingTemplates.find((t: EmailTemplate) => t.id === selectedTemplateId);
                      return (
                        <div className="space-y-4">
                          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                  📧 Náhled e-mailu
                                </h4>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Proměnné nahrazeny
                                </span>
                              </div>
                            </div>
                            
                            <div className="p-4 space-y-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  PŘEDMĚT:
                                </label>
                                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded border font-medium text-gray-900 dark:text-gray-100">
                                  {preview.subject || template?.subject || 'Bez předmětu'}
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  OBSAH:
                                </label>
                                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded border min-h-[300px] text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                                  {preview.body || template?.body || 'Prázdný obsah'}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <div className="flex items-start space-x-2">
                              <div className="flex-shrink-0 mt-1">
                                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">i</span>
                                </div>
                              </div>
                              <div>
                                <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                                  Informace o náhledu
                                </h5>
                                <p className="text-xs text-blue-700 dark:text-blue-300">
                                  Náhled ukazuje, jak bude e-mail vypadat s nahrazenými proměnnými. 
                                  Při načtení do formuláře se použijí původní proměnné (např. {'{'}{'{'}'název_proměnné'{'}'}{'}'}').
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="flex items-center justify-center h-full text-center">
                      <div className="text-gray-500 dark:text-gray-400">
                        <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-sm">Vyberte šablonu pro zobrazení náhledu</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {selectedTemplateId ? 'Šablona vybrána' : 'Vyberte šablonu'}
              </div>
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowTemplateModal(false)}
                >
                  Zrušit
                </Button>
                <Button
                  type="button"
                  onClick={() => selectedTemplateId && handleLoadFromTemplate(selectedTemplateId)}
                  disabled={!selectedTemplateId}
                  className="flex items-center"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Načíst šablonu
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
