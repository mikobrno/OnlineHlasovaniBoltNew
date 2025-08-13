import React, { useState } from 'react';
import { Save, RotateCcw, Globe, Mail, Shield, Database, Bell, Palette, Send, TestTube, CreditCard } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { smsService } from '../../lib/smsService';

interface AppSettings {
  // Obecné nastavení
  appName: string;
  appDescription: string;
  defaultLanguage: string;
  timezone: string;
  
  // SMS nastavení
  smsProvider: string;
  smsUsername: string;
  smsPassword: string;
  
  // Bezpečnost
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  requireTwoFactor: boolean;
  
  // Notifikace
  emailNotifications: boolean;
  smsNotifications: boolean;
  browserNotifications: boolean;
  
  // Vzhled
  defaultTheme: 'light' | 'dark' | 'system';
  primaryColor: string;
  logoUrl: string;
}

const defaultSettings: AppSettings = {
  appName: 'OnlineSprava',
  appDescription: 'Systém pro správu hlasování a komunikace v SVJ/BD',
  defaultLanguage: 'cs',
  timezone: 'Europe/Prague',
  
  smsProvider: 'smsbrana',
  smsUsername: '',
  smsPassword: '',
  
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  passwordMinLength: 8,
  requireTwoFactor: false,
  
  emailNotifications: true,
  smsNotifications: true,
  browserNotifications: false,
  
  defaultTheme: 'system',
  primaryColor: '#3b82f6',
  logoUrl: ''
};

export const SettingsView: React.FC = () => {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('general');
  
  // SMS test state
  const [testPhone, setTestPhone] = useState('');
  const [testMessage, setTestMessage] = useState('Testovací SMS z OnlineSpráva aplikace. SMS služba funguje správně!');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [creditInfo, setCreditInfo] = useState<{ credit?: number; message: string } | null>(null);
  const [isLoadingCredit, setIsLoadingCredit] = useState(false);

  const handleSettingChange = (key: keyof AppSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // V reálné aplikaci by se zde uložilo do databáze
    console.log('Saving settings:', settings);
    setHasChanges(false);
    showToast('Nastavení bylo uloženo', 'success');
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setHasChanges(false);
    showToast('Nastavení bylo resetováno', 'info');
  };

  // SMS test functions
  const handleTestSMS = async () => {
    if (!testPhone.trim()) {
      showToast('Zadejte telefonní číslo', 'error');
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await smsService.sendSMS(testPhone, testMessage);
      setTestResult(result);
      
      if (result.success) {
        showToast('Test SMS byla úspěšně odeslána!', 'success');
      } else {
        showToast(`Chyba při odesílání: ${result.message}`, 'error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Neznámá chyba';
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
    } catch (error) {
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
    } catch (error) {
      showToast('Chyba při komunikaci se službou', 'error');
    } finally {
      setIsLoadingCredit(false);
    }
  };

  const sections = [
    { id: 'general', label: 'Obecné', icon: <Globe className="w-4 h-4" /> },
    { id: 'sms', label: 'SMS', icon: <div className="w-4 h-4 flex items-center justify-center text-xs">📱</div> },
    { id: 'security', label: 'Bezpečnost', icon: <Shield className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifikace', icon: <Bell className="w-4 h-4" /> },
    { id: 'appearance', label: 'Vzhled', icon: <Palette className="w-4 h-4" /> },
    { id: 'database', label: 'Databáze', icon: <Database className="w-4 h-4" /> }
  ];

  const renderGeneralSettings = () => (
    <Card className="p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        Obecné nastavení
      </h3>
      <div className="space-y-4">
        <Input
          label="Název aplikace"
          value={settings.appName}
          onChange={(e) => handleSettingChange('appName', e.target.value)}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Popis aplikace
          </label>
          <textarea
            value={settings.appDescription}
            onChange={(e) => handleSettingChange('appDescription', e.target.value)}
            rows={3}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Výchozí jazyk
            </label>
            <select
              value={settings.defaultLanguage}
              onChange={(e) => handleSettingChange('defaultLanguage', e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="cs">Čeština</option>
              <option value="sk">Slovenština</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Časové pásmo
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => handleSettingChange('timezone', e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Europe/Prague">Europe/Prague</option>
              <option value="Europe/Bratislava">Europe/Bratislava</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
        </div>
      </div>
    </Card>
  );



  const renderSMSSettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          SMS nastavení
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              SMS poskytovatel
            </label>
            <select
              value={settings.smsProvider}
              onChange={(e) => handleSettingChange('smsProvider', e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="smsbrana">SMSbrana.cz</option>
              <option value="twilio">Twilio</option>
              <option value="nexmo">Vonage (Nexmo)</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Uživatelské jméno"
              value={settings.smsUsername}
              onChange={(e) => handleSettingChange('smsUsername', e.target.value)}
            />
            <Input
              label="Heslo"
              type="password"
              value={settings.smsPassword}
              onChange={(e) => handleSettingChange('smsPassword', e.target.value)}
            />
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Poznámka:</strong> Pro SMSbrana.cz použijte přihlašovací údaje z vašeho účtu. 
              Tyto údaje jsou také potřeba v .env souboru jako VITE_SMSBRANA_LOGIN a VITE_SMSBRANA_PASSWORD.
            </p>
          </div>
        </div>
      </Card>

      {/* SMS Test Section */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <TestTube className="w-5 h-5 mr-2" />
          Test SMS služby
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test Connection & Credit */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Test připojení a kredit</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
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

          {/* Send Test SMS */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Odeslat test SMS</h4>
            
            <Input
              label="Telefonní číslo"
              type="tel"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              placeholder="+420 123 456 789"
            />
            
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
              <Send className="w-4 h-4 mr-2" />
              {isTesting ? 'Odesílání...' : 'Odeslat test SMS'}
            </Button>
          </div>
        </div>

        {/* Test Result */}
        {testResult && (
          <div className="mt-6 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Výsledek testu</h4>
            <div className={`p-3 rounded ${
              testResult.success 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' 
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
            }`}>
              <p className="font-medium">
                {testResult.success ? 'SMS úspěšně odeslána!' : 'Chyba při odesílání SMS!'}
              </p>
              <p className="text-sm mt-1">{testResult.message}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );

  const renderSecuritySettings = () => (
    <Card className="p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        Bezpečnostní nastavení
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Timeout relace (minuty)"
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
            min="5"
            max="480"
          />
          <Input
            label="Max. pokusů o přihlášení"
            type="number"
            value={settings.maxLoginAttempts}
            onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
            min="3"
            max="10"
          />
          <Input
            label="Min. délka hesla"
            type="number"
            value={settings.passwordMinLength}
            onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
            min="6"
            max="20"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="requireTwoFactor"
            checked={settings.requireTwoFactor}
            onChange={(e) => handleSettingChange('requireTwoFactor', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
          />
          <label htmlFor="requireTwoFactor" className="text-sm text-gray-700 dark:text-gray-300">
            Vyžadovat dvoufaktorové ověření
          </label>
        </div>
      </div>
    </Card>
  );

  const renderNotificationSettings = () => (
    <Card className="p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        Nastavení notifikací
      </h3>
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="emailNotifications"
              checked={settings.emailNotifications}
              onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <label htmlFor="emailNotifications" className="text-sm text-gray-700 dark:text-gray-300">
              E-mailové notifikace
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="smsNotifications"
              checked={settings.smsNotifications}
              onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <label htmlFor="smsNotifications" className="text-sm text-gray-700 dark:text-gray-300">
              SMS notifikace
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="browserNotifications"
              checked={settings.browserNotifications}
              onChange={(e) => handleSettingChange('browserNotifications', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
            />
            <label htmlFor="browserNotifications" className="text-sm text-gray-700 dark:text-gray-300">
              Notifikace v prohlížeči
            </label>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderAppearanceSettings = () => (
    <Card className="p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        Nastavení vzhledu
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Výchozí téma
          </label>
          <select
            value={settings.defaultTheme}
            onChange={(e) => handleSettingChange('defaultTheme', e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="system">Podle systému</option>
            <option value="light">Světlé</option>
            <option value="dark">Tmavé</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Primární barva
            </label>
            <div className="flex space-x-2">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
              />
              <Input
                value={settings.primaryColor}
                onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                placeholder="#3b82f6"
                className="flex-1"
              />
            </div>
          </div>
          <Input
            label="URL loga"
            value={settings.logoUrl}
            onChange={(e) => handleSettingChange('logoUrl', e.target.value)}
            placeholder="https://example.com/logo.png"
          />
        </div>
      </div>
    </Card>
  );

  const renderDatabaseSettings = () => (
    <Card className="p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        Databázové nastavení
      </h3>
      <div className="space-y-4">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Upozornění:</strong> Změny databázového nastavení mohou ovlivnit funkčnost aplikace. 
            Doporučujeme provádět změny pouze s technickou podporou.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Záloha dat</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Vytvořit zálohu všech dat aplikace
            </p>
            <Button size="sm" variant="secondary">
              Vytvořit zálohu
            </Button>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Obnovení dat</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Obnovit data ze zálohy
            </p>
            <Button size="sm" variant="secondary">
              Obnovit ze zálohy
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'general': return renderGeneralSettings();
      case 'sms': return renderSMSSettings();
      case 'security': return renderSecuritySettings();
      case 'notifications': return renderNotificationSettings();
      case 'appearance': return renderAppearanceSettings();
      case 'database': return renderDatabaseSettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Nastavení aplikace
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Konfigurace systému a globálních parametrů
          </p>
        </div>
        {hasChanges && (
          <div className="flex space-x-2">
            <Button variant="secondary" onClick={handleReset} size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Zrušit změny
            </Button>
            <Button onClick={handleSave} size="sm">
              <Save className="w-4 h-4 mr-2" />
              Uložit nastavení
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-4">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                >
                  {section.icon}
                  <span>{section.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};
