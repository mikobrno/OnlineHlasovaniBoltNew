import { useState, useEffect, useMemo } from 'react';
import { Save, RotateCcw, Globe, AlertCircle, PlusCircle } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
// Apollo hooky (Nhost poskytuje klienta, ale hooky bereme z @apollo/client)
import { useQuery, useMutation } from '@apollo/client';
import { GET_GLOBAL_VARIABLES_QUERY, UPDATE_GLOBAL_VARIABLES_MUTATION } from '../../graphql/globalVariables';
import type { GlobalVariable } from '../../graphql/globalVariables';

// Klíče proměnných, které budeme mapovat do uživatelského rozhraní
// Pokud je třeba přidat další, stačí doplnit do pole nebo pracovat dynamicky
// Níže zvolíme jen část, kterou chceme zobrazit – zbytek proměnných se zobrazí v sekci "Ostatní".
const KNOWN_VARIABLE_ORDER = [
  'app_name',
  'app_description',
  'default_language',
  'timezone',
  'sms_provider',
  'sms_username',
  'sms_password',
  'session_timeout',
  'max_login_attempts',
  'password_min_length',
  'require_two_factor',
  'email_notifications',
  'sms_notifications',
  'browser_notifications',
  'default_theme',
  'primary_color',
  'logo_url',
  'podpis_spravce',
  'pravni_upozorneni'
] as const;

type VariableEditState = Record<string, string>;

export const SettingsView = () => {
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState<'general' | 'security' | 'notifications' | 'appearance' | 'advanced'>('general');
  const [edited, setEdited] = useState<VariableEditState>({});
  // Stav pro přidání nové proměnné v sekci "Ostatní"
  const [newVarName, setNewVarName] = useState('');
  const [newVarValue, setNewVarValue] = useState('');
  const [newVarDescription, setNewVarDescription] = useState('');
  const [initialLoaded, setInitialLoaded] = useState(false);

  // Načtení všech globálních proměnných
  const { data, loading, error, refetch } = useQuery<{ global_variables: GlobalVariable[] }>(GET_GLOBAL_VARIABLES_QUERY, { fetchPolicy: 'network-only' });
  const globalVariables = useMemo<GlobalVariable[]>(() => data?.global_variables ?? [], [data]);

  // Lookup map
  const globalMap = useMemo(() => {
    const m: Record<string, GlobalVariable> = {};
    globalVariables.forEach((v: GlobalVariable) => { m[v.name] = v; });
    return m;
  }, [globalVariables]);

  // Inicializace lokálního edit stavu po prvním načtení
  useEffect(() => {
    if (!initialLoaded && globalVariables.length) {
      const init: VariableEditState = {};
      globalVariables.forEach((v: GlobalVariable) => { init[v.name] = v.value ?? ''; });
      setEdited(init);
      setInitialLoaded(true);
    }
  }, [initialLoaded, globalVariables]);

  const [updateMany, { loading: saving }] = useMutation(UPDATE_GLOBAL_VARIABLES_MUTATION, {
    refetchQueries: [{ query: GET_GLOBAL_VARIABLES_QUERY }],
    awaitRefetchQueries: true,
    onCompleted: () => showToast('Nastavení uloženo', 'success'),
    onError: (e: unknown) => {
      console.error(e);
      showToast('Chyba při ukládání', 'error');
    },
  });

  const sections = [
    { id: 'general' as const, label: 'Obecné', icon: <Globe className="w-4 h-4" /> },
    { id: 'security' as const, label: 'Bezpečnost', icon: <div className="w-4 h-4 flex items-center justify-center text-xs">🔒</div> },
    { id: 'notifications' as const, label: 'Notifikace', icon: <div className="w-4 h-4 flex items-center justify-center text-xs">🔔</div> },
    { id: 'appearance' as const, label: 'Vzhled', icon: <div className="w-4 h-4 flex items-center justify-center text-xs">🎨</div> },
    { id: 'advanced' as const, label: 'Ostatní', icon: <div className="w-4 h-4 flex items-center justify-center text-xs">⚙️</div> }
  ];

  const setValue = (name: string, value: string) => setEdited(prev => ({ ...prev, [name]: value }));

  // Změny: zahrň i nové proměnné, které nejsou v globalMap
  const changedVariables = useMemo(() => {
    return Object.keys(edited).filter(name => {
      const existing = globalMap[name];
      if (!existing) return true; // nová ještě neuložená proměnná
      return existing.value !== edited[name];
    });
  }, [edited, globalMap]);

  const hasAnyChanges = changedVariables.length > 0;

  const handleSaveAll = () => {
    if (!hasAnyChanges) {
      showToast('Žádné změny k uložení', 'info');
      return;
    }
    const updates = changedVariables.map(name => {
      const existing = globalMap[name];
      const description = existing?.description || name.replace(/_/g, ' ');
      // Vždy posíláme description kvůli NOT NULL constraintu a is_editable (true pro nové, zachová se u existujících)
      return {
        name,
        value: edited[name],
        description,
        is_editable: existing?.is_editable ?? true
      };
    });
    updateMany({ variables: { updates } });
  };

  const handleResetAll = () => {
    const reset: VariableEditState = {};
    Object.keys(globalMap).forEach(name => { reset[name] = globalMap[name].value ?? ''; });
    setEdited(reset);
    showToast('Změny zrušeny', 'info');
  };

  const renderToolbar = () => (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Nastavení aplikace</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">Konfigurace systému a globálních parametrů</p>
      </div>
      <div className="flex space-x-2">
        <Button variant="secondary" size="sm" onClick={handleResetAll} disabled={saving || !hasAnyChanges}>
          <RotateCcw className="w-4 h-4 mr-2" />Zrušit
        </Button>
        <Button size="sm" onClick={handleSaveAll} disabled={saving || !hasAnyChanges}>
          <Save className="w-4 h-4 mr-2" />{saving ? 'Ukládám...' : 'Uložit'}
        </Button>
      </div>
    </div>
  );

  // (Odstraněno: stará hlavička pro global variables; sjednoceno do hlavního toolbaru)

  const renderGeneralSettings = () => {
    const fields = [
      { name: 'app_name', label: 'Název aplikace', type: 'text' },
      { name: 'app_description', label: 'Popis aplikace', type: 'textarea' },
      { name: 'default_language', label: 'Výchozí jazyk', type: 'select', options: [ ['cs','Čeština'], ['sk','Slovenština'], ['en','English'] ] },
      { name: 'timezone', label: 'Časové pásmo', type: 'select', options: [ ['Europe/Prague','Europe/Prague'], ['Europe/Bratislava','Europe/Bratislava'], ['UTC','UTC'] ] }
    ];
    return (
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Obecné</h3>
        <div className="space-y-4">
          {fields.map(f => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{f.label}</label>
              {f.type === 'textarea' && (
                <textarea
                  value={edited[f.name] ?? ''}
                  onChange={e => setValue(f.name, e.target.value)}
                  rows={3}
                  placeholder={f.label}
                  aria-label={f.label}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                />
              )}
              {f.type === 'text' && (
                <Input value={edited[f.name] ?? ''} onChange={e => setValue(f.name, e.target.value)} placeholder={f.label} aria-label={f.label} />
              )}
              {f.type === 'select' && (
                <select
                  value={edited[f.name] ?? ''}
                  onChange={e => setValue(f.name, e.target.value)}
                  aria-label={f.label}
                  title={f.label}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                >
                  {f.options?.map(opt => <option key={opt[0]} value={opt[0]}>{opt[1]}</option>)}
                </select>
              )}
            </div>
          ))}
        </div>
      </Card>
    );
  };



  // (Odstraněno: kompletní SMS testovací / provider sekce – již mimo rozsah nové architektury)

  const renderSecuritySettings = () => {
    const fields = [
      { name: 'session_timeout', label: 'Timeout relace (minuty)', type: 'number', min:5, max:480 },
      { name: 'max_login_attempts', label: 'Max. pokusů o přihlášení', type: 'number', min:1, max:20 },
      { name: 'password_min_length', label: 'Min. délka hesla', type: 'number', min:4, max:64 },
      { name: 'require_two_factor', label: 'Vyžadovat 2FA', type: 'checkbox' }
    ];
    return (
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Bezpečnost</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fields.filter(f => f.type !== 'checkbox').map(f => (
            <Input
              key={f.name}
              label={f.label}
              type="number"
              value={edited[f.name] ?? ''}
              onChange={e => setValue(f.name, e.target.value)}
            />
          ))}
        </div>
        <div className="mt-4 flex items-center space-x-2">
            <input
              id="require_two_factor"
              type="checkbox"
              checked={(edited['require_two_factor'] ?? 'false') === 'true'}
              onChange={e => setValue('require_two_factor', String(e.target.checked))}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
              aria-label="Vyžadovat dvoufaktorové ověření"
            />
          <label htmlFor="require_two_factor" className="text-sm">Vyžadovat dvoufaktorové ověření</label>
        </div>
      </Card>
    );
  };

  const renderNotificationSettings = () => (
    <Card className="p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Notifikace</h3>
      <div className="space-y-3">
        {['email_notifications','sms_notifications','browser_notifications'].map(name => (
          <div className="flex items-center space-x-2" key={name}>
            <input
              type="checkbox"
              id={name}
              checked={(edited[name] ?? 'false') === 'true'}
              onChange={e => setValue(name, String(e.target.checked))}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor={name} className="text-sm capitalize">{name.replace(/_/g,' ')}</label>
          </div>
        ))}
      </div>
    </Card>
  );

  const renderAppearanceSettings = () => (
    <Card className="p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Vzhled</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Výchozí téma</label>
          <select
            value={edited['default_theme'] ?? 'system'}
            onChange={e => setValue('default_theme', e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
            aria-label="Výchozí téma"
            title="Výchozí téma"
          >
            <option value="system">Podle systému</option>
            <option value="light">Světlé</option>
            <option value="dark">Tmavé</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Primární barva</label>
            <div className="flex space-x-2">
              <input
                  type="color"
                  value={edited['primary_color'] ?? '#3b82f6'}
                  onChange={e => setValue('primary_color', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
                  aria-label="Primární barva"
                  title="Primární barva"
                />
                <Input value={edited['primary_color'] ?? ''} onChange={e => setValue('primary_color', e.target.value)} placeholder="Primární barva" aria-label="Primární barva" />
            </div>
          </div>
          <Input
            label="URL loga"
            value={edited['logo_url'] ?? ''}
            onChange={e => setValue('logo_url', e.target.value)}
            placeholder="https://example.com/logo.png"
          />
        </div>
      </div>
    </Card>
  );

  // Ostatní / všechny proměnné (pokud bychom chtěli zobrazit vše)
  const renderAdvanced = () => {
    const known: Set<string> = new Set(KNOWN_VARIABLE_ORDER as readonly string[]);
    // Spoj existující "neznámé" + nově přidané (newVarName je zatím mimo edited dokud nepotvrdíme)
    const rest = globalVariables.filter((v: GlobalVariable) => !known.has(v.name));

    const handleAddNewVariable = () => {
      const name = newVarName.trim();
      if (!name) {
        showToast('Zadej název proměnné', 'warning');
        return;
      }
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
        showToast('Název musí být ve formátu snake_case / alfanumerický s podtržítky', 'error');
        return;
      }
      if (globalMap[name]) {
        showToast('Proměnná již existuje', 'info');
        return;
      }
      setEdited(prev => ({ ...prev, [name]: newVarValue }));
      // Do budoucna by bylo možné uložit description separátně – zatím se využije při ukládání (replace underscores)
      if (newVarDescription) {
        // Nepřepisujeme description v DB hned – nastaví se až při uložení handleSaveAll (description se generuje z name, pokud v DB neexistuje)
      }
      setNewVarName('');
      setNewVarValue('');
      setNewVarDescription('');
      showToast('Proměnná přidána do změn – nezapomeň uložit', 'success');
    };

    const newVarPending = newVarName.trim().length > 0;

    return (
      <Card className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Ostatní proměnné</h3>
          <div className="space-y-4">
            {rest.map((v: GlobalVariable) => (
              <div key={v.name}>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{v.description || v.name}</label>
                  <code className="text-xs text-gray-500">{`{{${v.name}}}`}</code>
                </div>
                <Input value={edited[v.name] ?? ''} onChange={e => setValue(v.name, e.target.value)} placeholder={v.name} aria-label={v.name} />
              </div>
            ))}
            {rest.length === 0 && (
              <p className="text-sm text-gray-500">Žádné další proměnné.</p>
            )}
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> Přidat novou proměnnou
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <Input
              value={newVarName}
              onChange={e => setNewVarName(e.target.value)}
              placeholder="název (např. custom_limit)"
              aria-label="Název proměnné"
            />
            <Input
              value={newVarValue}
              onChange={e => setNewVarValue(e.target.value)}
              placeholder="hodnota"
              aria-label="Hodnota proměnné"
            />
            <Input
              value={newVarDescription}
              onChange={e => setNewVarDescription(e.target.value)}
              placeholder="Popis (volitelný)"
              aria-label="Popis proměnné"
            />
          </div>
          <div className="flex justify-end">
            <Button size="sm" variant="secondary" disabled={!newVarPending} onClick={handleAddNewVariable}>
              Přidat do změn
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 leading-snug">Nová proměnná se uloží při kliknutí na Uložit. Popis se aktuálně generuje z názvu (lze rozšířit pro uložení vlastního popisu).</p>
        </div>
      </Card>
    );
  };

  // (Odstraněno: databázové operace – mimo rozsah této refaktorizace)

  const renderActiveSection = () => {
    if (loading && !initialLoaded) {
      return (
        <div className="flex items-center justify-center h-48">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent" />
            <p className="text-sm text-gray-600 dark:text-gray-300">Načítání…</p>
          </div>
        </div>
      );
    }
    if (error) {
      return (
        <Card className="p-6">
          <div className="flex flex-col items-center space-y-4 py-8">
            <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-medium">Chyba načítání</h3>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">Nepodařilo se načíst data. Zkuste to znovu.</p>
            <Button onClick={() => refetch()}>Zkusit znovu</Button>
          </div>
        </Card>
      );
    }
    switch (activeSection) {
      case 'general': return renderGeneralSettings();
      case 'security': return renderSecuritySettings();
      case 'notifications': return renderNotificationSettings();
      case 'appearance': return renderAppearanceSettings();
      case 'advanced': return renderAdvanced();
      default: return null;
    }
  };

  return (
    <div>
      {renderToolbar()}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-4">
            <nav className="space-y-2">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === section.id ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'}`}
                >
                  {section.icon}
                  <span>{section.label}</span>
                  {sections.length && (
                    <span className="ml-auto text-xs text-gray-400">
                      {activeSection === section.id && hasAnyChanges && '•'}
                    </span>
                  )}
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
