import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle, AlertCircle, TestTube } from 'lucide-react';
import { emailService } from '../../lib/emailService';
import { smsService } from '../../lib/smsService';
import { useToast } from '../../contexts/ToastContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

type ServiceType = 'email' | 'sms';

export const MessageTestView: React.FC = () => {
  const { showToast } = useToast();
  const [activeService, setActiveService] = useState<ServiceType>('email');
  
  // Email test state
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testSubject, setTestSubject] = useState('Test email z OnlineSpráva');
  const [testEmailMessage, setTestEmailMessage] = useState('<h1>Test email</h1><p>Toto je testovací email odeslaný přes N8N webhook z OnlineSpráva aplikace.</p>');
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
        html: testEmailMessage
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

  const handleTestConnection = async () => {
    if (activeService === 'email') {
      setIsTestingEmail(true);
      try {
        const isConnected = await emailService.testConnection();
        showToast(
          isConnected ? 'Připojení k N8N webhook je funkční!' : 'Připojení k N8N webhook se nezdařilo',
          isConnected ? 'success' : 'error'
        );
      } finally {
        setIsTestingEmail(false);
      }
    } else {
      setIsTestingSMS(true);
      try {
        const isConnected = await smsService.testConnection();
        showToast(
          isConnected ? 'Připojení k SMSbrana.cz je funkční!' : 'Připojení k SMSbrana.cz se nezdařilo',
          isConnected ? 'success' : 'error'
        );
      } finally {
        setIsTestingSMS(false);
      }
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
        {activeService === 'email' ? (
          <Mail className="w-8 h-8 text-blue-600" />
        ) : (
          <MessageSquare className="w-8 h-8 text-green-600" />
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Test komunikačních služeb
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Testování emailů (N8N webhook) a SMS (SMSbrana.cz)
          </p>
        </div>
      </div>

      {/* Service Selector */}
      <Card className="p-4">
        <div className="flex space-x-2">
          <Button
            onClick={() => setActiveService('email')}
            variant={activeService === 'email' ? 'primary' : 'secondary'}
            className="flex-1"
          >
            <Mail className="w-4 h-4 mr-2" />
            Email služba
          </Button>
          <Button
            onClick={() => setActiveService('sms')}
            variant={activeService === 'sms' ? 'primary' : 'secondary'}
            className="flex-1"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            SMS služba
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Connection */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <TestTube className="w-5 h-5 mr-2" />
            Test připojení
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {activeService === 'email' 
              ? 'Ověří, zda je N8N webhook dostupný a připravený přijímat požadavky.'
              : 'Ověří připojení k SMSbrana.cz a zobrazí dostupný kredit.'
            }
          </p>
          <Button
            onClick={handleTestConnection}
            disabled={isTestingEmail || isTestingSMS}
            className="w-full"
          >
            {(isTestingEmail || isTestingSMS) ? 'Testování...' : `Test ${activeService === 'email' ? 'email' : 'SMS'} připojení`}
          </Button>
        </Card>

        {/* Send Test Message */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Send className="w-5 h-5 mr-2" />
            Odeslat test {activeService === 'email' ? 'email' : 'SMS'}
          </h2>
          
          {activeService === 'email' ? (
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
                  value={testEmailMessage}
                  onChange={(e) => setTestEmailMessage(e.target.value)}
                  rows={4}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="<p>Obsah emailu v HTML</p>"
                />
              </div>
              
              <Button
                onClick={handleTestEmail}
                disabled={isTestingEmail || !testEmail.trim()}
                className="w-full"
              >
                {isTestingEmail ? 'Odesílání...' : 'Odeslat test email'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Input
                  label="Telefonní číslo"
                  type="tel"
                  value={testPhone}
                  onChange={(e) => setTestPhone(formatPhoneNumberInput(e.target.value))}
                  placeholder="+420 123 456 789"
                />
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Zadejte české telefonní číslo (9 číslic)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Text zprávy
                </label>
                <textarea
                  value={testSMSMessage}
                  onChange={(e) => setTestSMSMessage(e.target.value)}
                  rows={3}
                  maxLength={160}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Text SMS zprávy..."
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-1">
                  <span>SMS zpráva (standardní tarif)</span>
                  <span>{testSMSMessage.length}/160 znaků</span>
                </div>
              </div>
              
              <Button
                onClick={handleTestSMS}
                disabled={isTestingSMS || !testPhone.trim() || !testSMSMessage.trim()}
                className="w-full"
              >
                {isTestingSMS ? 'Odesílání...' : 'Odeslat test SMS'}
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Test Results */}
      {(emailTestResult && activeService === 'email') && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            {emailTestResult.success ? (
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
            )}
            Výsledek email testu
          </h3>
          <div className={`p-4 rounded-lg ${
            emailTestResult.success 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
          }`}>
            <p className="font-medium">
              {emailTestResult.success ? 'Email úspěšně odeslán!' : 'Chyba při odesílání emailu!'}
            </p>
            <p className="text-sm mt-1">{emailTestResult.message}</p>
          </div>
        </Card>
      )}

      {(smsTestResult && activeService === 'sms') && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            {smsTestResult.success ? (
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
            )}
            Výsledek SMS testu
          </h3>
          <div className={`p-4 rounded-lg ${
            smsTestResult.success 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
          }`}>
            <p className="font-medium">
              {smsTestResult.success ? 'SMS úspěšně odeslána!' : 'Chyba při odesílání SMS!'}
            </p>
            <p className="text-sm mt-1">{smsTestResult.message}</p>
            {smsTestResult.details && (
              <details className="mt-2">
                <summary className="text-xs cursor-pointer">Technické detaily</summary>
                <code className="text-xs mt-1 block">{smsTestResult.details}</code>
              </details>
            )}
          </div>
        </Card>
      )}

      {/* Configuration Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Konfigurace {activeService === 'email' ? 'N8N webhook' : 'SMSbrana.cz'}
        </h3>
        
        {activeService === 'email' ? (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              <strong>Endpoint (Development):</strong>
            </p>
            <code className="text-xs text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 p-2 rounded border block break-all">
              /api/email (proxy → {import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://n8n.srv882016.hstgr.cloud/webhook/ada15a58-b14f-4179-92a1-780b009669a4'})
            </code>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Development proxy obchází CORS omezení. Produkční URL je v .env jako VITE_N8N_WEBHOOK_URL
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <strong>API URL:</strong>
              </p>
              <code className="text-xs text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 p-2 rounded border block break-all">
                https://api.smsbrana.cz/smsconnect/http.php
              </code>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <strong>Přihlašovací údaje:</strong>
              </p>
              <div className="space-y-1">
                <div className="text-xs">
                  <strong>Login:</strong> {import.meta.env.VITE_SMSBRANA_LOGIN || '❌ Není nastaveno'}
                </div>
                <div className="text-xs">
                  <strong>Password:</strong> {import.meta.env.VITE_SMSBRANA_PASSWORD ? '✅ Nastaveno' : '❌ Není nastaveno'}
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
