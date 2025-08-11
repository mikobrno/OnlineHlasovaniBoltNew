import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle, AlertCircle, TestTube, CreditCard } from 'lucide-react';
import { smsService } from '../../lib/smsService';
import { useToast } from '../../contexts/ToastContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

type SMSResultView = { success: boolean; message: string; details?: string; errorCode?: number; rawResult?: string; normalizedNumber?: string };

export const SMSTestView: React.FC = () => {
  const { showToast } = useToast();
  const [testPhone, setTestPhone] = useState('');
  const [testMessage, setTestMessage] = useState('Testovací SMS z OnlineSpráva aplikace. SMS služba funguje správně!');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<SMSResultView | null>(null);
  const [creditInfo, setCreditInfo] = useState<{ credit?: number; message: string } | null>(null);
  const [isLoadingCredit, setIsLoadingCredit] = useState(false);

  const handleTestSMS = async () => {
    if (!testPhone.trim()) {
      showToast('Zadejte telefonní číslo', 'error');
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
  const result = await smsService.sendSMS(testPhone, testMessage);
  setTestResult(result as unknown as SMSResultView);
      
      if (result.success) {
        showToast('Test SMS byla úspěšně odeslána!', 'success');
      } else {
        showToast(`Chyba při odesílání: ${result.message}`, 'error');
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Neznámá chyba';
      setTestResult({ success: false, message: errorMessage });
      showToast(`Chyba při odesílání: ${errorMessage}`, 'error');
    } finally {
      setIsTesting(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    
    try {
      const isConnected = await smsService.testConnection();
      
      if (isConnected) {
        showToast('Připojení k SMSbrana.cz je funkční!', 'success');
      } else {
        showToast('Připojení k SMSbrana.cz se nezdařilo', 'error');
      }
  } catch {
      showToast('Chyba při testování připojení', 'error');
    } finally {
      setIsTesting(false);
    }
  };

  const handleGetCredit = async () => {
    setIsLoadingCredit(true);
    
    try {
      const creditResult = await smsService.getCredit();
      setCreditInfo(creditResult);
      
      if (creditResult.success) {
        showToast(creditResult.message, 'success');
      } else {
        showToast(`Chyba při zjišťování kreditu: ${creditResult.message}`, 'error');
      }
  } catch {
      showToast('Chyba při komunikaci se službou', 'error');
    } finally {
      setIsLoadingCredit(false);
    }
  };

  const formatPhoneNumberInput = (value: string) => {
    // Automatické formátování při psaní
    let formatted = value.replace(/[^\d]/g, '');
    
    if (formatted.length > 0 && !formatted.startsWith('420')) {
      if (formatted.length <= 9) {
        // Přidáme +420 prefix pro české číslo
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
        <MessageSquare className="w-8 h-8 text-green-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Test SMS služby
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Testování připojení a odesílání SMS přes SMSbrana.cz
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Connection & Credit */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <TestTube className="w-5 h-5 mr-2" />
            Test připojení a kredit
          </h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Ověří připojení k SMSbrana.cz a zobrazí dostupný kredit.
              </p>
              <div className="flex space-x-2">
                <Button
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  variant="secondary"
                  className="flex-1"
                >
                  {isTesting ? 'Testování...' : 'Test připojení'}
                </Button>
                <Button
                  onClick={handleGetCredit}
                  disabled={isLoadingCredit}
                  className="flex-1"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {isLoadingCredit ? 'Načítání...' : 'Zjistit kredit'}
                </Button>
              </div>
            </div>
            
            {creditInfo && (
              <div className={`p-4 rounded-lg ${
                creditInfo.credit !== undefined 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
                  : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
              }`}>
                <p className="font-medium">
                  {creditInfo.credit !== undefined ? '💰 Kredit dostupný' : '❌ Chyba kreditu'}
                </p>
                <p className="text-sm mt-1">{creditInfo.message}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Send Test SMS */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Send className="w-5 h-5 mr-2" />
            Odeslat test SMS
          </h2>
          
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
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                rows={3}
                maxLength={160}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Text SMS zprávy..."
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-1">
                <span>SMS zpráva (standardní tarif)</span>
                <span>{testMessage.length}/160 znaků</span>
              </div>
            </div>
            
            <Button
              onClick={handleTestSMS}
              disabled={isTesting || !testPhone.trim() || !testMessage.trim()}
              className="w-full"
            >
              {isTesting ? 'Odesílání...' : 'Odeslat test SMS'}
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
            Výsledek SMS testu
          </h3>
          <div className={`p-4 rounded-lg ${
            testResult.success 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
          }`}>
            <p className="font-medium">
              {testResult.success ? 'SMS úspěšně odeslána!' : 'Chyba při odesílání SMS!'}
            </p>
            <p className="text-sm mt-1">{testResult.message}</p>
            {(testResult.details || testResult.rawResult || testResult.normalizedNumber) && (
              <details className="mt-2">
                <summary className="text-xs cursor-pointer">Technické detaily</summary>
                {testResult.normalizedNumber && (
                  <div className="text-xs mt-1">normalizované číslo: {testResult.normalizedNumber}</div>
                )}
                {typeof testResult.errorCode !== 'undefined' && (
                  <div className="text-xs mt-1">kód chyby: {testResult.errorCode}</div>
                )}
                {testResult.details && (
                  <code className="text-xs mt-1 block">{testResult.details}</code>
                )}
                {testResult.rawResult && (
                  <code className="text-xs mt-1 block">{testResult.rawResult}</code>
                )}
              </details>
            )}
          </div>
        </Card>
      )}

      {/* Configuration Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Konfigurace SMSbrana.cz
        </h3>
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
        
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-lg">
          <p className="text-sm">
            <strong>💡 Tip:</strong> Přihlašovací údaje jsou nastaveny v .env souboru jako VITE_SMSBRANA_LOGIN a VITE_SMSBRANA_PASSWORD
          </p>
        </div>
      </Card>
    </div>
  );
};
