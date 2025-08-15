import { useState } from 'react';
import { Save, RotateCcw, Globe, Shield, Database, Bell, Palette, Send, TestTube, CreditCard } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { GET_SETTINGS, UPDATE_SETTINGS } from '../../graphql/settings';
import { SEND_TEST_SMS_MUTATION, GET_SMS_CREDIT_QUERY, TEST_SMS_CONNECTION_QUERY } from '../../graphql/sms';

// Definice typů pro jednotlivé sekce nastavení
interface GeneralSettings {
  appName: string;
  appDescription: string;
  defaultLanguage: string;
  timezone: string;
}

interface SmsSettings {
  provider: string;
  username: string;
  password?: string; // Heslo je citlivý údaj, nemusí být vždy posíláno
}

interface SecuritySettings {
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  requireTwoFactor: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  browserNotifications: boolean;
}

interface AppearanceSettings {
  defaultTheme: 'light' | 'dark' | 'system';
  primaryColor: string;
  logoUrl: string;
}

// Hlavní typ pro všechna nastavení
type AppSettings = {
  general: GeneralSettings;
  sms: SmsSettings;
  security: SecuritySettings;
  notifications: NotificationSettings;
  appearance: AppearanceSettings;
};

const initialSettings: AppSettings = {
    general: { appName: '', appDescription: '', defaultLanguage: 'cs', timezone: 'Europe/Prague' },
    sms: { provider: 'smsbrana', username: '', password: '' },
    security: { sessionTimeout: 30, maxLoginAttempts: 5, passwordMinLength: 8, requireTwoFactor: false },
    notifications: { emailNotifications: true, smsNotifications: true, browserNotifications: false },
    appearance: { defaultTheme: 'system', primaryColor: '#3b82f6', logoUrl: '' },
};

export const SettingsView = () => {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [originalSettings, setOriginalSettings] = useState<AppSettings>(initialSettings);
  const [activeSection, setActiveSection] = useState<keyof AppSettings | 'database'>('general');
  
  // SMS test state
  const [testPhone, setTestPhone] = useState('');
  const [testMessage, setTestMessage] = useState('Testovací SMS z OnlineSpráva aplikace. SMS služba funguje správně!');

  const { loading: loadingSettings, error: settingsError } = useQuery(GET_SETTINGS, {
    onCompleted: (data) => {
      if (data && data.settings) {
        const fetchedSettingsAsObject = data.settings.reduce((obj: Record<string, unknown>, item: { key: string; value: unknown }) => {
            obj[item.key] = item.value;
            return obj;
        }, {});
        
        const newSettings: AppSettings = {
            general: { ...initialSettings.general, ...(fetchedSettingsAsObject.general as Partial<GeneralSettings> || {}) },
            sms: { ...initialSettings.sms, ...(fetchedSettingsAsObject.sms as Partial<SmsSettings> || {}) },
            security: { ...initialSettings.security, ...(fetchedSettingsAsObject.security as Partial<SecuritySettings> || {}) },
            notifications: { ...initialSettings.notifications, ...(fetchedSettingsAsObject.notifications as Partial<NotificationSettings> || {}) },
            appearance: { ...initialSettings.appearance, ...(fetchedSettingsAsObject.appearance as Partial<AppearanceSettings> || {}) },
        };

        if (!newSettings.sms.password) {
            newSettings.sms.password = '';
        }

        setSettings(newSettings);
        const deepClonedSettings = JSON.parse(JSON.stringify(newSettings));
        if (deepClonedSettings.sms.password) {
            deepClonedSettings.sms.password = '';
        }
        setOriginalSettings(deepClonedSettings);
      }
    },
    onError: (error) => {
        showToast(`Chyba při načítání nastavení: ${error.message}`, 'error');
    }
  });

  const [updateSettingsMutation, { loading: isSaving }] = useMutation(UPDATE_SETTINGS);
  
  const [sendTestSms, { loading: isSendingSms }] = useMutation(SEND_TEST_SMS_MUTATION, {
    onCompleted: (data) => {
        const result = data.sendTestSms;
        showToast(result.message, result.success ? 'success' : 'error');
    },
    onError: (error) => showToast(`Chyba: ${error.message}`, 'error')
  });

  const [getSmsCredit, { loading: isLoadingCredit }] = useLazyQuery(GET_SMS_CREDIT_QUERY, {
      onCompleted: (data) => {
          const result = data.getSmsCredit;
          showToast(result.message, result.success ? 'success' : 'error');
      },
      onError: (error) => showToast(`Chyba: ${error.message}`, 'error')
  });

  const [testSmsConnection, { loading: isTestingConnection }] = useLazyQuery(TEST_SMS_CONNECTION_QUERY, {
      onCompleted: (data) => {
          const result = data.testSmsConnection;
          showToast(result.message, result.success ? 'success' : 'error');
      },
      onError: (error) => showToast(`Chyba: ${error.message}`, 'error')
  });


  const handleSettingChange = <T extends keyof AppSettings, K extends keyof AppSettings[T]>(
    section: T,
    key: K,
    value: AppSettings[T][K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleSave = async (section: keyof AppSettings) => {
    const dataToSave = { ...settings[section] };
    
    if (section === 'sms' && (dataToSave as SmsSettings).password === '') {
        delete (dataToSave as SmsSettings).password;
    }

    try {
      await updateSettingsMutation({ variables: { key: section, value: dataToSave } });
      showToast('Nastavení bylo uloženo', 'success');
      
      const newSectionState = { ...settings[section] };
      if (section === 'sms') {
          (newSectionState as SmsSettings).password = '';
      }
      
      const newOriginalSettings = { ...originalSettings, [section]: newSectionState };
      setOriginalSettings(newOriginalSettings);

    } catch (error) {
      console.error('Chyba při ukládání nastavení:', error);
      showToast('Nepodařilo se uložit nastavení', 'error');
    }
  };

  const handleReset = (section: keyof AppSettings) => {
    setSettings(prev => ({
        ...prev,
        [section]: originalSettings[section]
    }));
    showToast('Změny byly zrušeny', 'info');
  };

  const hasChanges = (section: keyof AppSettings) => {
      if (!originalSettings[section]) return false;
      return JSON.stringify(settings[section]) !== JSON.stringify(originalSettings[section]);
  }

  // SMS test functions
  const handleTestSMS = () => {
    if (!testPhone.trim()) {
      showToast('Zadejte telefonní číslo', 'error');
      return;
    }
    sendTestSms({ variables: { to: testPhone, message: testMessage } });
  };

  const handleTestConnection = () => testSmsConnection();
  const handleGetCredit = () => getSmsCredit();

  const sections = [
    { id: 'general' as const, label: 'Obecné', icon: <Globe className="w-4 h-4" /> },
    { id: 'sms' as const, label: 'SMS', icon: <div className="w-4 h-4 flex items-center justify-center text-xs">📱</div> },
    { id: 'security' as const, label: 'Bezpečnost', icon: <Shield className="w-4 h-4" /> },
    { id: 'notifications' as const, label: 'Notifikace', icon: <Bell className="w-4 h-4" /> },
    { id: 'appearance' as const, label: 'Vzhled', icon: <Palette className="w-4 h-4" /> },
    { id: 'database' as const, label: 'Databáze', icon: <Database className="w-4 h-4" /> }
  ];

  const renderSectionHeader = (title: string, sectionKey: keyof AppSettings) => (
    <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {title}
        </h3>
        {hasChanges(sectionKey) && (
            <div className="flex space-x-2">
                <Button variant="secondary" onClick={() => handleReset(sectionKey)} size="sm" disabled={isSaving}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Zrušit
                </Button>
                <Button onClick={() => handleSave(sectionKey)} size="sm" disabled={isSaving}>
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Ukládání...' : 'Uložit'}
                </Button>
            </div>
        )}
    </div>
  );

  const renderGeneralSettings = () => (
    <Card className="p-6">
      {renderSectionHeader('Obecné nastavení', 'general')}
      <div className="space-y-4">
        <Input
          label="Název aplikace"
          value={settings.general.appName}
          onChange={(e) => handleSettingChange('general', 'appName', e.target.value)}
        />
        <div>
          <label htmlFor="appDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Popis aplikace
          </label>
          <textarea
            id="appDescription"
            value={settings.general.appDescription}
            onChange={(e) => handleSettingChange('general', 'appDescription', e.target.value)}
            rows={3}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="defaultLanguage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Výchozí jazyk
            </label>
            <select
              id="defaultLanguage"
              value={settings.general.defaultLanguage}
              onChange={(e) => handleSettingChange('general', 'defaultLanguage', e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="cs">Čeština</option>
              <option value="sk">Slovenština</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Časové pásmo
            </label>
            <select
              id="timezone"
              value={settings.general.timezone}
              onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
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
        {renderSectionHeader('SMS nastavení', 'sms')}
        <div className="space-y-4">
          <div>
            <label htmlFor="smsProvider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              SMS poskytovatel
            </label>
            <select
              id="smsProvider"
              value={settings.sms.provider}
              onChange={(e) => handleSettingChange('sms', 'provider', e.target.value)}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="smsbrana">SMSbrana.cz</option>
              <option value="twilio" disabled>Twilio (již brzy)</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Uživatelské jméno"
              value={settings.sms.username}
              onChange={(e) => handleSettingChange('sms', 'username', e.target.value)}
            />
            <Input
              label="Heslo"
              type="password"
              value={settings.sms.password || ''}
              onChange={(e) => handleSettingChange('sms', 'password', e.target.value)}
              placeholder="Zadejte pro změnu"
              helperText="Z bezpečnostních důvodů se heslo nezobrazuje. Pro aktualizaci zadejte nové."
            />
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
              Ověří připojení k SMS bráně a zobrazí dostupný kredit.
            </p>
            <div className="flex space-x-2">
              <Button
                onClick={handleTestConnection}
                disabled={isTestingConnection}
                variant="secondary"
                className="flex-1"
              >
                {isTestingConnection ? 'Testování...' : 'Test připojení'}
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
              <label htmlFor="testMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Text zprávy
              </label>
              <textarea
                id="testMessage"
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
              disabled={isSendingSms || !testPhone.trim() || !testMessage.trim()}
              className="w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSendingSms ? 'Odesílání...' : 'Odeslat test SMS'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSecuritySettings = () => (
    <Card className="p-6">
      {renderSectionHeader('Bezpečnostní nastavení', 'security')}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Timeout relace (minuty)"
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
            min="5"
            max="480"
          />
          <Input
            label="Max. pokusů o přihlášení"
            type="number"
            value={settings.security.maxLoginAttempts}
            onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
            min="3"
            max="10"
          />
          <Input
            label="Min. délka hesla"
            type="number"
            value={settings.security.passwordMinLength}
            onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
            min="6"
            max="20"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="requireTwoFactor"
            checked={settings.security.requireTwoFactor}
            onChange={(e) => handleSettingChange('security', 'requireTwoFactor', e.target.checked)}
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
      {renderSectionHeader('Nastavení notifikací', 'notifications')}
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="emailNotifications"
              checked={settings.notifications.emailNotifications}
              onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
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
              checked={settings.notifications.smsNotifications}
              onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
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
              checked={settings.notifications.browserNotifications}
              onChange={(e) => handleSettingChange('notifications', 'browserNotifications', e.target.checked)}
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
      {renderSectionHeader('Nastavení vzhledu', 'appearance')}
      <div className="space-y-4">
        <div>
          <label htmlFor="defaultTheme" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Výchozí téma
          </label>
          <select
            id="defaultTheme"
            value={settings.appearance.defaultTheme}
            onChange={(e) => handleSettingChange('appearance', 'defaultTheme', e.target.value as AppSettings['appearance']['defaultTheme'])}
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
                value={settings.appearance.primaryColor}
                onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
                className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
                title="Výběr primární barvy"
              />
              <Input
                value={settings.appearance.primaryColor}
                onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
                placeholder="#3b82f6"
                className="flex-1"
              />
            </div>
          </div>
          <Input
            label="URL loga"
            value={settings.appearance.logoUrl}
            onChange={(e) => handleSettingChange('appearance', 'logoUrl', e.target.value)}
            placeholder="https://example.com/logo.png"
          />
        </div>
      </div>
    </Card>
  );

  const renderDatabaseSettings = () => (
    <Card className="p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        Databázové operace
      </h3>
      <div className="space-y-4">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Upozornění:</strong> Tyto operace mohou být nevratné a ovlivnit funkčnost aplikace. 
            Provádějte je s opatrností.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Záloha dat</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Vytvořit zálohu všech dat aplikace (funkce není implementována).
            </p>
            <Button size="sm" variant="secondary" disabled>
              Vytvořit zálohu
            </Button>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Obnovení dat</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Obnovit data ze zálohy (funkce není implementována).
            </p>
            <Button size="sm" variant="secondary" disabled>
              Obnovit ze zálohy
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderActiveSection = () => {
    if (loadingSettings) return <p>Načítání nastavení...</p>;
    if (settingsError) return <p>Chyba při načítání nastavení. Zkuste to prosím znovu.</p>;

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
