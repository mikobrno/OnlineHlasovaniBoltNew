import { sendSMS } from './smsService';
import * as emailService from './emailService';

interface Owner {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  voting_token: string;
}

interface Voting {
  id: string;
  title: string;
  description?: string;
  end_date: string;
  start_date: string;
}

export type NotificationType = 'start' | 'reminder' | 'end';

interface NotificationResult {
  owner_id: string;
  name: string;
  email_sent: boolean;
  sms_sent: boolean;
  email_error: string | null;
  sms_error: string | null;
}

interface NotificationSummary {
  success: number;
  failed: number;
  details: NotificationResult[];
}

export const sendVotingNotifications = async (
  owners: Owner[],
  voting: Voting,
  type: NotificationType
): Promise<NotificationSummary> => {
  const results: NotificationSummary = {
    success: 0,
    failed: 0,
    details: []
  };

  const promises = owners.map(async (owner) => {
    const ownerResult: NotificationResult = {
      owner_id: owner.id,
      name: owner.name,
      email_sent: false,
      sms_sent: false,
      email_error: null,
      sms_error: null
    };

    // Odeslání emailu (pokud má email)
    if (owner.email) {
      try {
        let emailSent = false;
        
        switch (type) {
          case 'start':
            emailSent = await emailService.sendVotingStartEmail(
              { name: owner.name, email: owner.email, voting_token: owner.voting_token },
              voting
            );
            break;
          case 'reminder':
            emailSent = await emailService.sendVotingReminderEmail(
              { name: owner.name, email: owner.email, voting_token: owner.voting_token },
              voting
            );
            break;
          case 'end':
            emailSent = await emailService.sendVotingEndEmail(
              { name: owner.name, email: owner.email, voting_token: owner.voting_token },
              voting
            );
            break;
        }
        
        ownerResult.email_sent = emailSent;
        if (emailSent) {
          console.log(`Email sent successfully to ${owner.email}`);
        }
      } catch (error) {
        ownerResult.email_error = error instanceof Error ? error.message : 'Unknown email error';
        console.error(`Failed to send email to ${owner.email}:`, error);
      }
    }

    // Odeslání SMS (pokud má telefon)
    if (owner.phone) {
      try {
        const smsMessage = getSMSMessage(type, voting, owner);
        const smsResponse = await sendSMS(owner.phone, smsMessage);
        ownerResult.sms_sent = smsResponse.success;
        
        if (!smsResponse.success) {
          ownerResult.sms_error = smsResponse.message || 'SMS send failed';
        } else {
          console.log(`SMS sent successfully to ${owner.phone}`);
        }
      } catch (error) {
        ownerResult.sms_error = error instanceof Error ? error.message : 'Unknown SMS error';
        console.error(`Failed to send SMS to ${owner.phone}:`, error);
      }
    }

    // Započítání výsledků
    if (ownerResult.email_sent || ownerResult.sms_sent) {
      results.success++;
    } else {
      results.failed++;
    }

    results.details.push(ownerResult);
    return ownerResult;
  });

  await Promise.all(promises);

  console.log(`Notifications sent: ${results.success} successful, ${results.failed} failed`);
  return results;
};

const getSMSMessage = (type: NotificationType, voting: Voting, owner: Owner): string => {
  const baseUrl = window.location.origin;
  const votingUrl = `${baseUrl}/vote/${voting.id}?token=${owner.voting_token}`;
  
  switch (type) {
    case 'start':
      return `🗳️ Nové hlasování: ${voting.title}. Hlasovat můžete do ${new Date(voting.end_date).toLocaleDateString('cs-CZ')}. Link: ${votingUrl}`;
    
    case 'reminder':
      return `⏰ Připomínka hlasování: ${voting.title}. Hlasování končí ${new Date(voting.end_date).toLocaleDateString('cs-CZ')}. Link: ${votingUrl}`;
    
    case 'end':
      return `✅ Hlasování "${voting.title}" bylo ukončeno. Výsledky najdete v aplikaci: ${baseUrl}`;
    
    default:
      return `OnlineHlasování: ${voting.title}. Link: ${votingUrl}`;
  }
};

// Funkce pro plánování připomínek
export const scheduleVotingReminder = async (
  voting: Voting,
  owners: Owner[],
  reminderBeforeHours: number = 24
): Promise<void> => {
  const endDate = new Date(voting.end_date);
  const reminderTime = new Date(endDate.getTime() - (reminderBeforeHours * 60 * 60 * 1000));
  const now = new Date();

  if (reminderTime > now) {
    const timeoutMs = reminderTime.getTime() - now.getTime();
    
    setTimeout(async () => {
      console.log(`Sending reminder for voting: ${voting.title}`);
      await sendVotingNotifications(owners, voting, 'reminder');
    }, timeoutMs);
    
    console.log(`Reminder scheduled for ${reminderTime.toLocaleString('cs-CZ')}`);
  } else {
    console.log('Reminder time has already passed, sending immediately');
    await sendVotingNotifications(owners, voting, 'reminder');
  }
};

// Funkce pro testování notifikací
export const testNotificationSystem = async (): Promise<boolean> => {
  const testOwner: Owner = {
    id: 'test-1',
    name: 'Test Uživatel',
    email: 'test@example.com',
    phone: '+420123456789',
    voting_token: 'test-token-123'
  };

  const testVoting: Voting = {
    id: 'test-voting-1',
    title: 'Test hlasování systému',
    description: 'Toto je testovací hlasování pro ověření funkčnosti notifikací.',
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 dní od teď
  };

  try {
    const result = await sendVotingNotifications([testOwner], testVoting, 'start');
    console.log('Test notification result:', result);
    return result.success > 0;
  } catch (error) {
    console.error('Test notification failed:', error);
    return false;
  }
};

// Export pro snadné použití v komponentách
export const NotificationService = {
  sendVotingNotifications,
  scheduleVotingReminder,
  testNotificationSystem
};
