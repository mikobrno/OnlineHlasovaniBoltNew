import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Send, Mail } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { useToast } from '../../contexts/ToastContext';
import { SEND_TEST_EMAIL_MUTATION } from '../../graphql/email';

export const EmailTestPanel: React.FC = () => {
  const { showToast } = useToast();
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('Testovací e-mail z OnlineHlasovani');
  const [body, setBody] = useState(
    `<p>Dobrý den,</p><p>toto je testovací e-mail odeslaný z administračního rozhraní aplikace OnlineHlasovani.</p><p>Čas odeslání: ${new Date().toLocaleString(
      'cs-CZ'
    )}</p><p>S pozdravem,<br>Váš systém</p>`
  );

  const [sendTestEmail, { loading, data, error }] = useMutation(
    SEND_TEST_EMAIL_MUTATION
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !subject || !body) {
      showToast('Všechna pole jsou povinná.', 'warning');
      return;
    }
    try {
      await sendTestEmail({ variables: { to, subject, body } });
      showToast('Příkaz k odeslání byl úspěšně předán.', 'success');
    } catch (err) {
      // Chyba je již zpracována v `error` proměnné z hooku
      console.error('Chyba při odesílání testovacího e-mailu:', err);
      showToast('Došlo k chybě při odesílání.', 'error');
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Test odeslání e-mailu
        </h2>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Tento panel umožňuje odeslat testovací e-mail přes GraphQL mutaci, která
        využívá nakonfigurovanou serverless funkci (např. s Mailjet).
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Příjemce (To)"
          type="email"
          id="to"
          value={to}
          onChange={e => setTo(e.target.value)}
          placeholder="zadejte.email@adresa.cz"
          required
        />
        <Input
          label="Předmět"
          type="text"
          id="subject"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          required
        />
        <Textarea
          label="Tělo e-mailu (HTML)"
          id="body"
          value={body}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setBody(e.target.value)
          }
          rows={8}
          required
          helperText="Můžete použít HTML tagy pro formátování."
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            <Send className="w-4 h-4 mr-2" />
            {loading ? 'Odesílám...' : 'Odeslat testovací e-mail'}
          </Button>
        </div>
      </form>

      {(data || error) && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Výsledek posledního odeslání
          </h3>
          {data?.sendEmail?.success && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg text-green-800 dark:text-green-200">
              <p className="font-bold">Úspěch!</p>
              <p className="text-sm">{data.sendEmail.message}</p>
            </div>
          )}
          {(error || !data?.sendEmail?.success) && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
              <p className="font-bold">Chyba!</p>
              <p className="text-sm">
                {error?.message ||
                  data?.sendEmail?.message ||
                  'Neznámá chyba při odesílání.'}
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
