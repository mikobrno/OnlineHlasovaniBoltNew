import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Wand2, Mail, Upload, X } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Card } from '../common/Card';
import { Modal } from '../common/Modal';
import { useMutation, useQuery } from '@apollo/client';
import { 
  ADD_VOTE, 
  UPDATE_VOTE, 
  type Vote, 
  type Question,
  type VoteInput 
} from '../../graphql/votes';
import { 
  GET_EMAIL_TEMPLATES,
  type EmailTemplate 
} from '../../graphql/templates';
import { 
  GET_MEMBERS,
  type Member 
} from '../../graphql/members';
import { 
  GET_GLOBAL_VARIABLES,
  type GlobalVariable 
} from '../../graphql/globals';
import { availableVariables } from '../../data/mockData';
import { replaceVariables, generateUUID } from '../../lib/utils';

interface VoteFormViewProps {
  vote?: Vote | null;
  onBack: () => void;
}

export const VoteFormView: React.FC<VoteFormViewProps> = ({ vote, onBack }) => {
  const { selectedBuilding } = useApp();
  const { showToast } = useToast();

  // Načtení šablon
  const { data: templatesData } = useQuery(GET_EMAIL_TEMPLATES, {
    variables: { buildingId: selectedBuilding?.id },
  });

  // Načtení členů pro ukázku proměnných
  const { data: membersData } = useQuery(GET_MEMBERS, {
    variables: { buildingId: selectedBuilding?.id },
  });

  // Načtení globálních proměnných
  const { data: globalsData } = useQuery(GET_GLOBAL_VARIABLES);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'draft' | 'active'>('draft');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [votingDays, setVotingDays] = useState(30);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [activeInput, setActiveInput] = useState<'title' | 'description' | null>(null);
  const [observers, setObservers] = useState<string[]>([]);
  // Vyhledávání v seznamu proměnných v pravém panelu
  const [varSearch, setVarSearch] = useState('');

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
      setDescription(vote.description);
      setStatus(vote.status as 'draft' | 'active');
      setStartDate(vote.startDate ? new Date(vote.startDate).toISOString().slice(0, 16) : '');
      setEndDate(vote.endDate ? new Date(vote.endDate).toISOString().slice(0, 16) : '');
      // Vypočítej počet dní z existujícího hlasování
      if (vote.startDate && vote.endDate) {
        const start = new Date(vote.startDate);
        const end = new Date(vote.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setVotingDays(diffDays);
      }
      setQuestions(vote.questions);
      setAttachments(vote.attachments || []);
      setObservers(vote.observers || []);
    } else {
      // Initialize with one empty question
      setQuestions([{
        id: generateId(),
        text: '',
        quorumType: 'simple'
      }]);
    }
  }, [vote]);

  const handleLoadFromTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      // Use the first member as sample data for preview
      const sampleMember = members.find(m => m.buildingId === selectedBuilding?.id);
      
      if (sampleMember && selectedBuilding) {
        const processedTitle = replaceVariables(template.subject, globalVariables, selectedBuilding, sampleMember);
        const processedDescription = replaceVariables(template.body, globalVariables, selectedBuilding, sampleMember);
        
        setTitle(processedTitle);
        setDescription(processedDescription);
      } else {
        // Fallback to simple replacement if no sample data
        setTitle(template.subject.replace(/{{.*?}}/g, '[hodnota]'));
        setDescription(template.body.replace(/{{.*?}}/g, '[hodnota]'));
      }
      
      showToast('Šablona byla načtena', 'success');
      setShowTemplateModal(false);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      id: generateId(),
      text: '',
      quorumType: 'simple'
    }]);
  };

  const updateQuestion = (
    index: number,
    field: keyof Question,
    value: string | number | Question['customQuorum']
  ) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
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
  const [addVoteMutation] = useMutation(ADD_VOTE, {
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
    
    if (!selectedBuilding) return;
    
    if (!title.trim() || !description.trim() || questions.some(q => !q.text.trim())) {
      showToast('Vyplňte všechna povinná pole', 'error');
      return;
    }

    const voteData: VoteInput = {
      building_id: selectedBuilding.id,
      title: title.trim(),
      description: description.trim(),
      status: 'draft', // Vždy se ukládá jako návrh
      questions: questions.filter(q => q.text.trim()),
      start_date: startDate ? new Date(startDate).toISOString() : undefined,
      end_date: endDate ? new Date(endDate).toISOString() : undefined,
      observers: observers.length > 0 ? observers : undefined
    };

    try {
      if (vote) {
        await updateVoteMutation({
          variables: { id: vote.id, vote: voteData }
        });
        showToast('Hlasování bylo aktualizováno', 'success');
      } else {
        await addVoteMutation({
          variables: { vote: voteData }
        });
        showToast('Hlasování bylo vytvořeno', 'success');
      }
      onBack();
    } catch {
      // Chyby jsou již zpracovány v onError callbacku mutací
    }
  };

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

  const templates = templatesData?.email_templates || [];

  const getTemplatePreview = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    const sampleMember = membersData?.members?.[0];
    const globalVars = globalsData?.global_variables || [];
    
    if (!template || !sampleMember || !selectedBuilding) return { subject: '', body: '' };

    const globalVarsObject = Object.fromEntries(
      globalVars.map(v => [v.name, v.value])
    );
    
    return {
      subject: replaceVariables(template.subject, globalVarsObject, selectedBuilding, sampleMember),
      body: replaceVariables(template.body, globalVarsObject, selectedBuilding, sampleMember)
    };
  };

  // Filter variables relevant for vote context
  const voteRelevantVariables = availableVariables.filter(v => 
    v.type === 'global' || v.type === 'building' || v.type === 'member'
  );

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

  <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <Modal
                isOpen={showTemplateModal}
                onClose={() => setShowTemplateModal(false)}
                title="Vybrat e-mailovou šablonu"
                size="lg"
              >
                <div className="space-y-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Vyberte šablonu, ze které chcete načíst název a popis hlasování. 
                    Proměnné budou automaticky nahrazeny hodnotami pro aktuální budovu.
                  </div>
                  
                  <div className="space-y-3">
                    {buildingTemplates.map((template) => {
                      const preview = getTemplatePreview(template.id);
                      return (
                        <div
                          key={template.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            selectedTemplateId === template.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                          onClick={() => setSelectedTemplateId(template.id)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                              {template.name}
                            </h4>
                            <input
                              type="radio"
                              name="template"
                              checked={selectedTemplateId === template.id}
                              onChange={() => setSelectedTemplateId(template.id)}
                              className="mt-1"
                              aria-label={`Vybrat šablonu ${template.name}`}
                            />
                          </div>
                          
                          <div className="text-sm space-y-2">
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">Předmět:</span>
                              <div className="text-gray-600 dark:text-gray-400 truncate">
                                {preview.subject || template.subject}
                              </div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700 dark:text-gray-300">Náhled:</span>
                              <div className="text-gray-600 dark:text-gray-400 line-clamp-2">
                                {preview.body ? preview.body.substring(0, 150) + '...' : template.body.substring(0, 150) + '...'}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
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
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      Načíst šablonu
                    </Button>
                  </div>
                </div>
              </Modal>

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
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Automaticky vypočítáno
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

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
                          onChange={(e) => updateQuestion(index, 'text', e.target.value)}
                          required
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Typ kvóra
                            </label>
                            <select
                              value={question.quorumType}
                              onChange={(e) => updateQuestion(index, 'quorumType', e.target.value)}
                              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              aria-label="Typ kvóra"
                            >
                              <option value="simple">Prostá většina (1/2)</option>
                              <option value="qualified">Kvalifikovaná většina (2/3)</option>
                              <option value="unanimous">Jednomyslné</option>
                              <option value="custom">Vlastní</option>
                            </select>
                          </div>
                          
                          {question.quorumType === 'custom' && (
                            <div className="flex space-x-2">
                              <Input
                                type="number"
                                placeholder="Čitatel"
                                value={question.customQuorum?.numerator || ''}
                                onChange={(e) => {
                                  const num = parseInt(e.target.value) || 1;
                                  const current = question.customQuorum || { numerator: 1, denominator: 2 };
                                  updateQuestion(index, 'customQuorum', { numerator: num, denominator: current.denominator });
                                }}
                                min="1"
                              />
                              <Input
                                type="number"
                                placeholder="Jmenovatel"
                                value={question.customQuorum?.denominator || ''}
                                onChange={(e) => {
                                  const den = parseInt(e.target.value) || 2;
                                  const current = question.customQuorum || { numerator: 1, denominator: 2 };
                                  updateQuestion(index, 'customQuorum', { numerator: current.numerator, denominator: den });
                                }}
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

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Přílohy
                  </h3>
                  <div>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                      aria-label="Přidat přílohy"
                      title="Přidat přílohy"
                      aria-hidden="true"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Přidat přílohy
                    </Button>
                  </div>
                </div>

                {attachments.length > 0 ? (
                  <div className="space-y-2">
                    {attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          📎 {attachment}
                        </span>
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
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="secondary" onClick={onBack}>
                  Zrušit
                </Button>
                <Button type="submit">
                  {vote ? 'Aktualizovat' : 'Vytvořit'} hlasování
                </Button>
              </div>
            </form>
          </div>

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
                  if (!varSearch.trim()) return false; // pokud je prázdný dotaz, neukazuj hlášku
                  const q = varSearch.toLowerCase();
                  return (
                    v.name.toLowerCase().includes(q) ||
                    (v.description || '').toLowerCase().includes(q)
                  );
                }).length === 0 && (
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
    </div>
  );
};
