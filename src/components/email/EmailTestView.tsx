import React, { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle, TestTube, MessageSquare } from 'lucide-react';
import { emailService } from '../../lib/emailService';
import { smsService } from '../../lib/smsService';
import { useToast } from '../../contexts/ToastContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export const EmailTestView: React.FC = () => {
  const { showToast } = useToast();
  
  // Email test state
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testSubject, setTestSubject] = useState('Test email z OnlineSpráva');
  const [testMessage, setTestMessage] = useState('<h1>Test email</h1><p>Toto je testovací email odeslaný přes N8N webhook z OnlineSpráva aplikace.</p>');
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [emailTestResult, setEmailTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // SMS test state  
  const [testPhone, setTestPhone] = useState('');
  const [testSMSMessage, setTestSMSMessage] = useState('Testovací SMS z OnlineSpráva aplikace. SMS služba funguje správně!');
  const [isTestingSMS, setIsTestingSMS] = useState(false);
  const [smsTestResult, setSMSTestResult] = useState<{ success: boolean; message: string; details?: string } | null>(null);

  const handleTestEmail = async () => {
    if (!testEmail.trim()) {
      showToast('Zadejte emailovou adresu', 'error');
      return;
    }

    setIsTestingEmail(true);
    setEmailTestResult(null);

    try {
      const result = await emailService.sendEmail({
        to: testEmail,
        subject: testSubject,
        html: testMessage
      });

      setEmailTestResult(result);
      
      if (result.success) {
        showToast('Test email byl úspěšně odeslán!', 'success');
      } else {
        showToast(`Chyba při odesílání emailu: ${result.message}`, 'error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Neznámá chyba';
      setEmailTestResult({ success: false, message: errorMessage });
      showToast(`Chyba při odesílání emailu: ${errorMessage}`, 'error');
    } finally {
      setIsTestingEmail(false);
    }
  };

  const handleTestSMS = async () => {
    if (!testPhone.trim()) {
      showToast('Zadejte telefonní číslo', 'error');
      return;
    }

    setIsTestingSMS(true);
    setSMSTestResult(null);

    try {
      const result = await smsService.sendSMS({
        phoneNumber: testPhone,
        message: testSMSMessage
      });

      setSMSTestResult(result);
      
      if (result.success) {
        showToast('Test SMS byla úspěšně odeslána!', 'success');
      } else {
        showToast(`Chyba při odesílání SMS: ${result.message}`, 'error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Neznámá chyba';
      setSMSTestResult({ success: false, message: errorMessage });
      showToast(`Chyba při odesílání SMS: ${errorMessage}`, 'error');
    } finally {
      setIsTestingSMS(false);
    }
  };

  const handleTestEmailConnection = async () => {
    setIsTestingEmail(true);
    
    try {
      const isConnected = await emailService.testConnection();
      
      if (isConnected) {
        showToast('Připojení k N8N webhook je funkční!', 'success');
      } else {
        showToast('Připojení k N8N webhook se nezdařilo', 'error');
      }
    } finally {
      setIsTestingEmail(false);
    }
  };

  const handleTestSMSConnection = async () => {
    setIsTestingSMS(true);
    
    try {
      const isConnected = await smsService.testConnection();
      
      if (isConnected) {
        showToast('Připojení k SMSbrana.cz je funkční!', 'success');
      } else {
        showToast('Připojení k SMSbrana.cz se nezdařilo', 'error');
      }
    } finally {
      setIsTestingSMS(false);
    }
  };

  const formatPhoneNumberInput = (value: string) => {
    let formatted = value.replace(/[^\d]/g, '');
    
    if (formatted.length > 0 && !formatted.startsWith('420')) {
      if (formatted.length <= 9) {
        formatted = '+420 ' + formatted;
      }
    } else if (formatted.startsWith('420')) {
      formatted = '+' + formatted.substring(0, 3) + ' ' + formatted.substring(3);
    }
    
    return formatted;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Mail className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Test N8N Email služby
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Testování připojení a odesílání emailů přes N8N webhook
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Connection */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <TestTube className="w-5 h-5 mr-2" />
            Test připojení
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Ověří, zda je N8N webhook dostupný a připravený přijímat požadavky.
          </p>
          <Button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="w-full"
          >
            {isTesting ? 'Testování...' : 'Test připojení'}
          </Button>
        </Card>

        {/* Send Test Email */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Send className="w-5 h-5 mr-2" />
            Odeslat test email
          </h2>
          
          <div className="space-y-4">
            <Input
              label="Email adresa"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
            />
            
            <Input
              label="Předmět"
              value={testSubject}
              onChange={(e) => setTestSubject(e.target.value)}
              placeholder="Předmět emailu"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                HTML obsah
              </label>
              <textarea
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="<p>Obsah emailu v HTML</p>"
              />
            </div>
            
            <Button
              onClick={handleTestEmail}
              disabled={isTesting || !testEmail.trim()}
              className="w-full"
            >
              {isTesting ? 'Odesílání...' : 'Odeslat test email'}
            </Button>
          </div>
        </Card>
      </div>

      {/* Test Result */}
      {testResult && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            {testResult.success ? (
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
            )}
            Výsledek testu
          </h3>
          <div className={`p-4 rounded-lg ${
            testResult.success 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
          }`}>
            <p className="font-medium">
              {testResult.success ? 'Úspěch!' : 'Chyba!'}
            </p>
            <p className="text-sm mt-1">{testResult.message}</p>
          </div>
        </Card>
      )}

      {/* Configuration Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Konfigurace N8N webhook
        </h3>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            <strong>Webhook URL:</strong>
          </p>
          <code className="text-xs text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 p-2 rounded border block break-all">
            {import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://n8n.srv882016.hstgr.cloud/webhook/ada15a58-b14f-4179-92a1-780b009669a4'}
          </code>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            URL je nastavena v .env souboru jako VITE_N8N_WEBHOOK_URL
          </p>
        </div>
      </Card>
    </div>
  );
};
