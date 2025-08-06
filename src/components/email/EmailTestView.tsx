import React, { useState } from 'react';
import { Send, Mail, TestTube, CheckCircle, XCircle } from 'lucide-react';
import * as emailService from '../../lib/emailService';
import { NotificationService } from '../../lib/notificationService';
import { useToast } from '../../contexts/ToastContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

interface TestResult {
  id: number;
  test: string;
  success: boolean;
  message: string;
  details?: unknown;
  timestamp: string;
}

export const EmailTestView: React.FC = () => {
  const { showToast } = useToast();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addTestResult = (test: string, success: boolean, message: string, details?: unknown) => {
    const result = {
      id: Date.now(),
      test,
      success,
      message,
      details,
      timestamp: new Date().toLocaleString('cs-CZ')
    };
    setTestResults(prev => [result, ...prev]);
  };

  const testWebhookConnection = async () => {
    setIsLoading(true);
    try {
      const success = await emailService.testEmailWebhook();
      addTestResult(
        'Test Webhook', 
        success, 
        success ? 'N8N webhook připojení je funkční' : 'N8N webhook připojení selhalo'
      );
      
      if (success) {
        showToast('N8N webhook test proběhl úspěšně!', 'success');
      } else {
        showToast('N8N webhook test selhal', 'error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Neznámá chyba';
      addTestResult('Test Webhook', false, `Chyba: ${errorMessage}`);
      showToast(`Chyba webhook testu: ${errorMessage}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const testCustomEmail = async () => {
    setIsLoading(true);
    const testEmail = 'ngkost@gmail.com'; // Použiju email ze screenshotu
    
    try {
      const success = await emailService.sendEmailViaWebhook({
        to: testEmail,
        subject: '🧪 Test OnlineHlasování Email Systému',
        html: `
          <h2>Test Email z OnlineHlasování</h2>
          <p>Tento email slouží k ověření funkčnosti N8N webhook integrace.</p>
          <p><strong>Čas odeslání:</strong> ${new Date().toLocaleString('cs-CZ')}</p>
          <p><strong>Systém:</strong> OnlineHlasování</p>
          <hr>
          <p><em>Pokud vidíte tento email, N8N webhook funguje správně!</em></p>
        `
      });

      addTestResult(
        'Odeslat Test Email',
        success,
        success ? `Email úspěšně odeslán na ${testEmail}` : `Nepodařilo se odeslat email na ${testEmail}`
      );

      if (success) {
        showToast(`Test email odeslán na ${testEmail}!`, 'success');
      } else {
        showToast(`Chyba při odesílání na ${testEmail}`, 'error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Neznámá chyba';
      addTestResult('Odeslat Test Email', false, `Chyba: ${errorMessage}`);
      showToast(`Chyba při odesílání emailu: ${errorMessage}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const testCompleteSystem = async () => {
    setIsLoading(true);
    
    try {
      const success = await NotificationService.testNotificationSystem();
      addTestResult(
        'Test Celého Systému',
        success,
        success ? 'Kompletní test notifikačního systému proběhl úspěšně' : 'Kompletní test notifikačního systému selhal'
      );

      if (success) {
        showToast('Kompletní test systému úspěšný!', 'success');
      } else {
        showToast('Kompletní test systému selhal', 'error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Neznámá chyba';
      addTestResult('Test Celého Systému', false, `Chyba: ${errorMessage}`);
      showToast(`Chyba kompletního testu: ${errorMessage}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
    showToast('Výsledky testů vymazány', 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            📧 Email Systém - Test Panel
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Testování N8N webhook email systému a notifikačních služeb
          </p>
        </div>
        {testResults.length > 0 && (
          <Button
            onClick={clearResults}
            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            size="sm"
          >
            Vymazat
          </Button>
        )}
      </div>

      {/* N8N Webhook Configuration Info */}
      <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          N8N Webhook Konfigurace
        </h2>
        <div className="space-y-2">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Webhook URL:</strong> Není nakonfigurována
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-300">
            Emailová integrace je připravena pro spojení s N8N workflow systémem pro odesílání notifikací vlastníkům jednotek.
          </p>
        </div>
      </Card>

      {/* Test Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          onClick={testWebhookConnection}
          disabled={isLoading}
          className="h-20 flex flex-col items-center justify-center space-y-2"
        >
          <TestTube className="w-6 h-6" />
          <span>Test Webhook Připojení</span>
        </Button>

        <Button
          onClick={testCompleteSystem}
          disabled={isLoading}
          className="h-20 flex flex-col items-center justify-center space-y-2 bg-green-600 hover:bg-green-700"
        >
          <Send className="w-6 h-6" />
          <span>Test Celého Systému</span>
        </Button>

        <Button
          onClick={testCustomEmail}
          disabled={isLoading}
          className="h-20 flex flex-col items-center justify-center space-y-2 bg-purple-600 hover:bg-purple-700"
        >
          <Mail className="w-6 h-6" />
          <span>Odeslat Test Email</span>
        </Button>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Výsledky Testů
          </h2>
          <div className="space-y-3">
            {testResults.map((result) => (
              <div
                key={result.id}
                className={`p-4 rounded-lg border-l-4 ${
                  result.success
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-200'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {result.success ? (
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{result.test}</h3>
                      <span className="text-xs opacity-75">{result.timestamp}</span>
                    </div>
                    <p className="text-sm mt-1">{result.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Usage Instructions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Jak používat
        </h3>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-start space-x-3">
            <TestTube className="w-4 h-4 mt-1 flex-shrink-0" />
            <div>
              <strong>Test Webhook:</strong> Ověří připojení k N8N webhook URL
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Send className="w-4 h-4 mt-1 flex-shrink-0" />
            <div>
              <strong>Test Celého Systému:</strong> Otestuje kompletní notifikační systém včetně email šablon
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Mail className="w-4 h-4 mt-1 flex-shrink-0" />
            <div>
              <strong>Test Email:</strong> Odešle skutečný test email na zadanou adresu
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
