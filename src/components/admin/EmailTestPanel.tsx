import React, { useState } from 'react';
import { Send, Mail, TestTube, CheckCircle, XCircle } from 'lucide-react';
import * as emailService from '../../lib/emailService';
import { NotificationService } from '../../lib/notificationService';

interface TestResult {
  type: string;
  success: boolean;
  message: string;
  timestamp: string;
}

export const EmailTestPanel: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testEmail, setTestEmail] = useState('test@example.com');

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
      console.log('Starting Gmail API test...');
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
      const testOwner = {
        id: 'test-1',
        name: 'Test Uživatel',
        email: testEmail,
        voting_token: 'test-token-123'
      };

      const testVoting = {
        id: 'test-voting-1',
        title: 'Test hlasování emailu',
        description: 'Toto je testovací hlasování pro ověření email funkčnosti.',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };

      const result = await NotificationService.sendVotingNotifications([testOwner], testVoting, 'start');
      
      addTestResult(
        'Custom Email',
        result.success > 0,
        result.success > 0 
          ? `Email úspěšně odeslán na ${testEmail}` 
          : `Nepodařilo se odeslat email na ${testEmail}`
      );
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Email Systém - Test Panel</h2>
      </div>

      {/* Gmail API Info */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
        <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">📧 Gmail API Konfigurace</h3>
        <p className="text-sm text-blue-700 dark:text-blue-200 mb-2">
          <strong>Client ID:</strong> {import.meta.env.VITE_GOOGLE_CLIENT_ID ? '✓ Nakonfigurováno' : '❌ Není nakonfigurováno'}
        </p>
        <p className="text-sm text-blue-700 dark:text-blue-200 mb-2">
          <strong>Refresh Token:</strong> {import.meta.env.VITE_GOOGLE_REFRESH_TOKEN ? '✓ Nakonfigurováno' : '❌ Není nakonfigurováno'}
        </p>
        <div className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
          <p>
            Emails jsou odesílány přes Google Gmail API s OAuth2 autentizací. 
          </p>
          <p className="text-xs">
            <strong>Nastavení:</strong> Nakonfigurujte Google OAuth credentials v .env souboru pro plnou funkčnost.
          </p>
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
            Test Gmail API
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
            {testResults.map((result, index) => (
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
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Usage Instructions */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg">
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Jak používat</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
          <li>• <strong>Test Webhook:</strong> Ověří připojení k N8N webhook</li>
          <li>• <strong>Test Celého Systému:</strong> Otestuje kompletní notifikační systém</li>
          <li>• <strong>Test Email:</strong> Odešle skutečný email na zadanou adresu</li>
          <li>• Zkontrolujte konzoli prohlížeče pro podrobné logy</li>
        </ul>
      </div>
    </div>
  );
};
