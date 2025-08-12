import React, { useEffect, useState } from 'react';
import { Send, Mail, TestTube, CheckCircle, XCircle } from 'lucide-react';
import * as emailService from '../../lib/emailService';
import { NotificationService } from '../../lib/notificationService';

interface TestResult {
  type: string;
  success: boolean;
  message: string;
  timestamp: string;
  details?: unknown;
}

export const EmailTestPanel: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  // V produkci pošleme defaultně na provozní adresu (lze přepsat přes VITE_TEST_EMAIL_DEFAULT), v devu zůstává bezpečné test@example.com
  const defaultTestEmail = ((import.meta as unknown as { env: { PROD?: boolean; VITE_TEST_EMAIL_DEFAULT?: string } }).env?.PROD
    ? ((import.meta as unknown as { env: { VITE_TEST_EMAIL_DEFAULT?: string } }).env?.VITE_TEST_EMAIL_DEFAULT || 'kost@onlinesprava.cz')
    : 'test@example.com');
  const [testEmail, setTestEmail] = useState(defaultTestEmail);
  const [backendStatus, setBackendStatus] = useState<{ configured: boolean; fromEmail?: string; fromName?: string; missing?: string[] } | null>(null);

  const addTestResult = (type: string, success: boolean, message: string) => {
    const result: TestResult = {
      type,
      success,
      message,
      timestamp: new Date().toLocaleString('cs-CZ')
    };
    setTestResults(prev => [result, ...prev]);
  };

  const testGmailConnection = async () => {
    setIsLoading(true);
    try {
  const result = await emailService.testEmailGmail();
      addTestResult(
        'Gmail API Test',
        result.success,
        result.message
      );
    } catch (error) {
      console.error('Gmail API test error:', error);
      addTestResult('Gmail API Test', false, `Chyba: ${error instanceof Error ? error.message : 'Neznámá chyba'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testCustomEmail = async () => {
    if (!testEmail) {
      addTestResult('Custom Email', false, 'Zadejte email adresu');
      return;
    }

    setIsLoading(true);
    try {
      // Pošleme přímo přes serverless funkci, abychom viděli plnou odpověď (providerResponse)
      const envBase = (import.meta as unknown as { env: { VITE_FUNCTIONS_BASE_URL?: string; DEV: boolean } }).env?.VITE_FUNCTIONS_BASE_URL;
      const isDev = (import.meta as unknown as { env: { VITE_FUNCTIONS_BASE_URL?: string; DEV: boolean } }).env?.DEV;
      const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
      const isEnvLocalhost = !!envBase && /^https?:\/\/localhost(?::\d+)?/i.test(envBase);
      const base = envBase
        ? (isEnvLocalhost ? (isDev || hostname === 'localhost' ? envBase : '') : envBase)
        : (isDev ? 'http://localhost:8888' : '');
      const url = `${base || ''}/.netlify/functions/send-email`;

      const subject = `Test email z portálu (${new Date().toLocaleString('cs-CZ')})`;
      const html = `<p>Toto je testovací zpráva z OnlineHlasování.</p><p>Čas: ${new Date().toISOString()}</p>`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: testEmail, subject, html })
      });

      const data = await res.json().catch(() => ({}));
      const ok = res.ok && data?.success;
      addTestResult(
        'Custom Email',
        !!ok,
        ok ? `Email úspěšně odeslán na ${testEmail}` : `Nepodařilo se odeslat email na ${testEmail} (HTTP ${res.status})`
      );
      if (!ok) {
        setTestResults(prev => [
          {
            type: 'Detail odpovědi',
            success: false,
            message: 'Plná odpověď serveru',
            timestamp: new Date().toLocaleString('cs-CZ'),
            details: data || { note: 'Bez JSON těla' }
          },
          ...prev,
        ]);
      } else {
        setTestResults(prev => [
          {
            type: 'Detail odpovědi',
            success: true,
            message: `ID zprávy: ${data?.messageId || data?.messageIdNumeric || 'neznámé'}`,
            timestamp: new Date().toLocaleString('cs-CZ'),
            details: data
          },
          ...prev,
        ]);
      }
    } catch (error) {
      addTestResult('Custom Email', false, `Chyba: ${error instanceof Error ? error.message : 'Neznámá chyba'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testFullNotificationSystem = async () => {
    setIsLoading(true);
    try {
      const success = await NotificationService.testNotificationSystem();
      addTestResult(
        'Full System Test',
        success,
        success ? 'Celý notifikační systém funguje správně' : 'Notifikační systém má problémy'
      );
    } catch (error) {
      addTestResult('Full System Test', false, `Chyba: ${error instanceof Error ? error.message : 'Neznámá chyba'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // Načti stav backendu při otevření panelu
  useEffect(() => {
    const loadStatus = async () => {
      try {
        const envBase = (import.meta as unknown as { env: { VITE_FUNCTIONS_BASE_URL?: string; DEV: boolean } }).env?.VITE_FUNCTIONS_BASE_URL;
        const isDev = (import.meta as unknown as { env: { VITE_FUNCTIONS_BASE_URL?: string; DEV: boolean } }).env?.DEV;
        const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
        const isEnvLocalhost = !!envBase && /^https?:\/\/localhost(?::\d+)?/i.test(envBase);
        const base = envBase
          ? (isEnvLocalhost ? (isDev || hostname === 'localhost' ? envBase : '') : envBase)
          : (isDev ? 'http://localhost:8888' : '');
        const url = `${base || ''}/.netlify/functions/send-email`;
        const res = await fetch(url, { method: 'GET' });
        if (res.ok) {
          const data = await res.json();
          setBackendStatus({
            configured: !!data.configured,
            fromEmail: data.fromEmail,
            fromName: data.fromName,
            missing: data.missing || [],
          });
        } else {
          setBackendStatus({ configured: false, missing: [`HTTP ${res.status}`] });
        }
      } catch {
        setBackendStatus({ configured: false, missing: ['network'] });
      }
    };
    loadStatus();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Email Systém - Test Panel</h2>
      </div>

      {/* Email Backend Info (Mailjet only) */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
        <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">📧 Odesílání e‑mailů – Mailjet</h3>
        <div className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
          <p>
            E‑maily se odesílají výhradně přes serverless funkci <code>send-email</code> napojenou na Mailjet.
          </p>
          <p className="text-xs">
            Pro odesílání je potřeba mít v prostředí nastavené proměnné: MAILJET_API_KEY, MAILJET_API_SECRET, MAILJET_FROM_EMAIL, MAILJET_FROM_NAME.
          </p>
          <div className="mt-2 p-2 rounded border border-blue-200 dark:border-blue-800 bg-white/50 dark:bg-blue-950/20">
            {backendStatus ? (
              backendStatus.configured ? (
                <div className="text-blue-800 dark:text-blue-200 text-sm">
                  Stav: ✅ Nakonfigurováno<br />
                  Odesílatel: {backendStatus.fromName} &lt;{backendStatus.fromEmail}&gt;
                </div>
              ) : (
                <div className="text-blue-800 dark:text-blue-200 text-sm">
                  Stav: ⚠️ Chybí konfigurace: {backendStatus.missing?.join(', ')}
                </div>
              )
            ) : (
              <div className="text-blue-800 dark:text-blue-200 text-sm">Načítám stav…</div>
            )}
          </div>
        </div>
      </div>

      {/* Test Controls */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-4">
          <button
            onClick={testGmailConnection}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TestTube className="w-4 h-4" />
            Test Mailjet backendu
          </button>

          <button
            onClick={testFullNotificationSystem}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-4 h-4" />
            Test Celého Systému
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Test Email Adresa
            </label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            onClick={testCustomEmail}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 dark:bg-purple-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            Odeslat Test Email
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-300">Testování...</span>
        </div>
      )}

      {/* Results */}
      {testResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 dark:text-white">Výsledky Testů</h3>
            <button
              onClick={clearResults}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              Vymazat
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {testResults.map((result, index) => {
              const detailText = result.details ? (() => { try { return JSON.stringify(result.details, null, 2); } catch { return String(result.details); } })() : null;
              return (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  result.success 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' 
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {result.success ? (
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  )}
                  <span className="font-medium text-sm text-gray-900 dark:text-white">
                    {result.type}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                    {result.timestamp}
                  </span>
                </div>
                <p className={`text-sm ${
                  result.success 
                    ? 'text-green-700 dark:text-green-300' 
                    : 'text-red-700 dark:text-red-300'
                }`}>
                  {result.message}
                </p>
                {detailText && (
                  <pre className="mt-2 text-xs bg-black/5 dark:bg-white/5 rounded p-2 overflow-x-auto whitespace-pre-wrap break-all">
                    {detailText}
                  </pre>
                )}
              </div>
            )})}
          </div>
        </div>
      )}

      {/* Usage Instructions */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg">
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Jak používat</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
          <li>• <strong>Test Mailjet backendu:</strong> Ověří dostupnost serverless funkce pro odesílání</li>
          <li>• <strong>Test Celého Systému:</strong> Otestuje kompletní notifikační tok (email + případně SMS)</li>
          <li>• <strong>Odeslat Test Email:</strong> Odešle skutečný email na zadanou adresu přes backend</li>
          <li>• Podrobné výsledky sledujte ve „Výsledky Testů” a v konzoli prohlížeče</li>
        </ul>
      </div>
    </div>
  );
};
