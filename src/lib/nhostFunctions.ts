import { nhost } from '../lib/nhost';

export interface EmailResponse {
  success: boolean;
  message: string;
}

export const sendTestEmail = async (to: string, subject: string, body: string): Promise<EmailResponse> => {
  try {
    const { res, error } = await nhost.functions.call('send-test-email', {
      to,
      subject,
      body
    });

    if (error) {
      console.error('Error calling Nhost function:', error);
      return {
        success: false,
        message: error.message || 'Chyba při volání Nhost funkce'
      };
    }

    return {
      success: true,
      message: res.message || 'Email byl úspěšně odeslán'
    };
  } catch (err) {
    console.error('Error sending test email:', err);
    return {
      success: false,
      message: (err as Error)?.message || 'Neznámá chyba při odesílání emailu'
    };
  }
};
