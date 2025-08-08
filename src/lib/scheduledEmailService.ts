// scheduledEmailService.ts - Služba pro plánování emailů
import * as emailService from './emailService';

interface ScheduledEmail {
  id: string;
  to: string;
  subject: string;
  html: string;
  scheduledTime: Date;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  createdAt: Date;
  sentAt?: Date;
  error?: string;
}

class ScheduledEmailService {
  private scheduledEmails: Map<string, ScheduledEmail> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Naplánuje odeslání emailu na určitý čas
   */
  scheduleEmail(
    to: string,
    subject: string,
    html: string,
    scheduledTime: Date,
    id: string = this.generateId()
  ): string {
    const scheduledEmail: ScheduledEmail = {
      id,
      to,
      subject,
      html,
      scheduledTime,
      status: 'pending',
      createdAt: new Date()
    };

    // Uložení do mapy
    this.scheduledEmails.set(id, scheduledEmail);

    // Výpočet delay
    const now = new Date();
    const delay = scheduledEmail.scheduledTime.getTime() - now.getTime();

    if (delay <= 0) {
      // Odeslat okamžitě
      this.sendScheduledEmail(id);
    } else {
      // Nastavit timer
      const timer = setTimeout(() => {
        this.sendScheduledEmail(id);
      }, delay);
      
      this.timers.set(id, timer);
    }

    console.log(`Email naplánován na ${scheduledEmail.scheduledTime.toLocaleString('cs-CZ')} (ID: ${id})`);
    return id;
  }

  /**
   * Zruší naplánovaný email
   */
  cancelScheduledEmail(id: string): boolean {
    const email = this.scheduledEmails.get(id);
    if (!email || email.status !== 'pending') {
      return false;
    }

    // Zrušit timer
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }

    // Aktualizovat status
    email.status = 'cancelled';
    console.log(`Email zrušen (ID: ${id})`);
    return true;
  }

  /**
   * Odešle naplánovaný email
   */
  private async sendScheduledEmail(id: string): Promise<void> {
    const email = this.scheduledEmails.get(id);
    if (!email || email.status !== 'pending') {
      return;
    }

    try {
      console.log(`Odesílám naplánovaný email (ID: ${id})`);
      
      const result = await emailService.sendEmailViaGmail({
        to: email.to,
        subject: email.subject,
        html: email.html
      });

      if (result.success) {
        email.status = 'sent';
        email.sentAt = new Date();
        console.log(`Email úspěšně odeslán (ID: ${id})`);
      } else {
        email.status = 'failed';
        email.error = result.error;
        console.error(`Chyba při odesílání emailu (ID: ${id}):`, result.error);
      }
    } catch (error) {
      email.status = 'failed';
      email.error = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Chyba při odesílání emailu (ID: ${id}):`, error);
    } finally {
      // Vyčištění timeru
      this.timers.delete(id);
    }
  }

  /**
   * Vrátí seznam všech naplánovaných emailů
   */
  getScheduledEmails(): ScheduledEmail[] {
    return Array.from(this.scheduledEmails.values());
  }

  /**
   * Vrátí konkrétní naplánovaný email
   */
  getScheduledEmail(id: string): ScheduledEmail | undefined {
    return this.scheduledEmails.get(id);
  }

  /**
   * Vrátí počet čekajících emailů
   */
  getPendingCount(): number {
    return Array.from(this.scheduledEmails.values())
      .filter(email => email.status === 'pending').length;
  }

  /**
   * Vyčistí staré záznamy (starší než 30 dní)
   */
  cleanup(olderThanDays: number = 30): number {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - olderThanDays);
    
    let removedCount = 0;
    for (const [id, email] of this.scheduledEmails.entries()) {
      if (email.createdAt < cutoff && email.status !== 'pending') {
        this.scheduledEmails.delete(id);
        removedCount++;
      }
    }
    
    console.log(`Vyčištěno ${removedCount} starých záznamů`);
    return removedCount;
  }

  /**
   * Naplánuje připomínku hlasování
   */
  scheduleVotingReminder(
    owners: Array<{id: string, name: string, email: string, voting_token: string}>,
    voting: {id: string, title: string, end_date: string},
    hoursBeforeEnd: number = 24
  ): string[] {
    const endDate = new Date(voting.end_date);
    const reminderTime = new Date(endDate.getTime() - (hoursBeforeEnd * 60 * 60 * 1000));
    
    const scheduledIds: string[] = [];
    
    owners.forEach(owner => {
      if (owner.email) {
        const subject = emailService.getEmailSubject('reminder', voting);
        const html = emailService.getEmailTemplate('reminder', voting, owner);
        
        const id = this.scheduleEmail(
          owner.email,
          subject,
          html,
          reminderTime,
          `reminder_${voting.id}_${owner.id}`
        );
        
        scheduledIds.push(id);
      }
    });
    
    console.log(`Naplánováno ${scheduledIds.length} připomínek pro hlasování "${voting.title}"`);
    return scheduledIds;
  }

  /**
   * Naplánuje konec hlasování
   */
  scheduleVotingEnd(
    owners: Array<{id: string, name: string, email: string, voting_token: string}>,
    voting: {id: string, title: string, end_date: string}
  ): string[] {
    const endDate = new Date(voting.end_date);
    const scheduledIds: string[] = [];
    
    owners.forEach(owner => {
      if (owner.email) {
        const subject = emailService.getEmailSubject('end', voting);
        const html = emailService.getEmailTemplate('end', voting, owner);
        
        const id = this.scheduleEmail(
          owner.email,
          subject,
          html,
          endDate,
          `end_${voting.id}_${owner.id}`
        );
        
        scheduledIds.push(id);
      }
    });
    
    console.log(`Naplánováno ${scheduledIds.length} ukončení pro hlasování "${voting.title}"`);
    return scheduledIds;
  }

  private generateId(): string {
    return `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance
export const scheduledEmailService = new ScheduledEmailService();

// Utility funkce pro snadné použití
export const scheduleEmail = (
  to: string,
  subject: string,
  html: string,
  scheduledTime: Date
): string => {
  return scheduledEmailService.scheduleEmail(to, subject, html, scheduledTime);
};

export const cancelEmail = (id: string): boolean => {
  return scheduledEmailService.cancelScheduledEmail(id);
};

export const getScheduledEmails = (): ScheduledEmail[] => {
  return scheduledEmailService.getScheduledEmails();
};

export type { ScheduledEmail };
