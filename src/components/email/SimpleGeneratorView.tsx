import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useApp } from '../../contexts/AppContextCompat';
import { PageHeader } from '../common/PageHeader';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { replaceVariables } from '../../lib/utils';
import * as emailService from '../../lib/emailService';

export const SimpleGeneratorView: React.FC = () => {
  const { templates, members, selectedBuilding, globalVariables } = useApp();
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const [testEmail, setTestEmail] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [lastTestResult, setLastTestResult] = useState<{ ok: boolean; msg: string } | null>(null);

  const availableTemplates = templates.filter(t => 
    t.isGlobal || t.buildingId === selectedBuilding?.id
  );
  
  const buildingMembers = members.filter(m => m.buildingId === selectedBuilding?.id);
  const selectedTemplate = availableTemplates.find(t => t.id === selectedTemplateId);
  const currentMember = buildingMembers[currentMemberIndex];

  const generatedSubject = selectedTemplate && currentMember
    ? replaceVariables(selectedTemplate.subject, globalVariables, selectedBuilding!, currentMember)
    : '';

  const generatedBody = selectedTemplate && currentMember
    ? replaceVariables(selectedTemplate.body, globalVariables, selectedBuilding!, currentMember)
    : '';

  const nextMember = () => {
    if (currentMemberIndex < buildingMembers.length - 1) {
      setCurrentMemberIndex(currentMemberIndex + 1);
    }
  };

  const prevMember = () => {
    if (currentMemberIndex > 0) {
      setCurrentMemberIndex(currentMemberIndex - 1);
    }
  };

  const sendQuickTest = async () => {
    const to = testEmail || currentMember?.email || '';
    if (!to) {
      setLastTestResult({ ok: false, msg: 'Zadejte e‑mail příjemce nebo vyberte člena.' });
      return;
    }
    setIsSendingTest(true);
    setLastTestResult(null);
    try {
      const subject = selectedTemplate ? generatedSubject || 'Test e‑mail' : 'Test e‑mail z OnlineHlasování';
      const html = selectedTemplate ? (generatedBody || '<p>Test e‑mail</p>') : `
        <h2>Test e‑mail z OnlineHlasování</h2>
        <p>Tento e‑mail byl odeslán přes serverless funkci (Mailjet/SMTP).</p>
        <p>Čas: ${new Date().toLocaleString('cs-CZ')}</p>
      `;
      const res = await emailService.sendEmailViaGmail({ to, subject, html });
      if (res.success) {
        setLastTestResult({ ok: true, msg: `E‑mail odeslán na ${to}` });
      } else {
        setLastTestResult({ ok: false, msg: res.error || 'Odeslání se nezdařilo' });
      }
    } catch (e) {
      setLastTestResult({ ok: false, msg: e instanceof Error ? e.message : 'Neznámá chyba' });
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Generátor e-mailů"
        subtitle="Rychlé generování personalizovaných e-mailů ze šablon"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
            Nastavení
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Budova
              </label>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">
                {selectedBuilding?.name || 'Není vybrána'}
              </div>
            </div>

            <div>
              <label htmlFor="email-template-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                E-mailová šablona
              </label>
              <select
                id="email-template-select"
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Vyberte šablonu</option>
                {availableTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name} {template.isGlobal ? '(Globální)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {selectedTemplate && buildingMembers.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Příjemce ({currentMemberIndex + 1} z {buildingMembers.length})
                </label>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={prevMember}
                    disabled={currentMemberIndex === 0}
                    aria-label="Předchozí příjemce"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">
                    {currentMember?.name} ({currentMember?.email})
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={nextMember}
                    disabled={currentMemberIndex === buildingMembers.length - 1}
                    aria-label="Další příjemce"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Náhled e-mailu
            </h3>
            <Eye className="w-5 h-5 text-gray-400" />
          </div>

          {selectedTemplate && currentMember ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Předmět
                </label>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-sm font-medium">
                  {generatedSubject}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tělo e-mailu
                </label>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md text-sm whitespace-pre-wrap border max-h-96 overflow-y-auto">
                  {generatedBody}
                </div>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                E-mail personalizovaný pro: <strong>{currentMember.name}</strong>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {!selectedTemplate ? (
                <>
                  <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Vyberte šablonu pro zobrazení náhledu</p>
                </>
              ) : buildingMembers.length === 0 ? (
                <>
                  <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded opacity-50"></div>
                  </div>
                  <p>Žádní členové v budově</p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p>Načítání náhledu...</p>
                </>
              )}
            </div>
          )}
        </Card>
      </div>

      {buildingMembers.length === 0 && selectedBuilding && (
        <Card className="p-6 mt-6">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p className="mb-2">V této budově nejsou žádní členové.</p>
            <p className="text-sm">
              Přidejte členy v sekci "Členové" pro použití generátoru e-mailů.
            </p>
          </div>
        </Card>
      )}

      {/* Rychlý test odeslání e‑mailu přes backend */}
      <Card className="p-6 mt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Rychlý test odeslání e‑mailu
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cílový e‑mail
            </label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder={currentMember?.email || 'např. jan.novak@example.com'}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Pokud pole necháte prázdné a je vybrán člen, použije se jeho e‑mail.
            </p>
          </div>
          <div>
            <Button onClick={sendQuickTest} disabled={isSendingTest} className="w-full">
              {isSendingTest ? 'Odesílám…' : 'Odeslat test' }
            </Button>
          </div>
        </div>
        {lastTestResult && (
          <div className={`mt-4 text-sm ${lastTestResult.ok ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
            {lastTestResult.msg}
          </div>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          Odesíláno přes serverless funkci (.netlify/functions/send-email) napojenou na Mailjet.
        </p>
      </Card>
    </div>
  );
};
