import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SMSService, sendSMS, getCredit, getCachedCredit } from './smsService';

// Jednoduchý mock localStorage pro node prostředí
if (!(globalThis as { localStorage?: Storage }).localStorage) {
  const store: Record<string,string> = {};
  const memoryStorage: Storage = {
    get length() { return Object.keys(store).length; },
    clear() { Object.keys(store).forEach(k => delete store[k]); },
    getItem(k: string) { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; },
    key(i: number) { return Object.keys(store)[i] || null; },
    removeItem(k: string) { delete store[k]; },
    setItem(k: string, v: string) { store[k] = v; },
  };
  (globalThis as unknown as { localStorage: Storage }).localStorage = memoryStorage;
}

const mockFetch = vi.fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>();
(globalThis as unknown as { fetch: typeof fetch }).fetch = mockFetch as unknown as typeof fetch;

beforeEach(() => {
  mockFetch.mockReset();
  globalThis.localStorage.clear();
});

describe('SMSService integration', () => {
  it('sendSMS success parses OK and id', async () => {
    mockFetch.mockResolvedValueOnce(new Response('OK:98765', { status: 200 }));
    const svc = new SMSService();
    // vnucení testovacích credentialů
  // @ts-expect-error přístup k privátní config pro test
  svc.config.login = 'user';
  // @ts-expect-error test only
  svc.config.password = 'pass';
    const res = await svc.sendSMS('+420777123456', 'Test zpráva');
    expect(res.success).toBe(true);
    expect(res.smsId).toBe('98765');
    expect(mockFetch).toHaveBeenCalledTimes(1);
  const calledUrl = (mockFetch.mock.calls[0]![0]) as string;
    expect(calledUrl).toContain('action=send_sms');
    expect(calledUrl).toContain('recipient=%2B420777123456');
  });

  it('sendSMS error maps message', async () => {
    mockFetch.mockResolvedValueOnce(new Response('ERROR Wrong password', { status: 200 }));
    const svc = new SMSService();
  // @ts-expect-error test only
  svc.config.login = 'user';
  // @ts-expect-error test only
  svc.config.password = 'bad';
    const res = await svc.sendSMS('777', 'Hi');
    expect(res.success).toBe(false);
    expect(res.message).toMatch(/chyba|error/i);
  });

  it('getCredit success second attempt', async () => {
    // první pokus nic, druhý vrátí kredit
    mockFetch
      .mockResolvedValueOnce(new Response('unknown format', { status: 200 }))
      .mockResolvedValueOnce(new Response('credit=150', { status: 200 }));
    const svc = new SMSService();
  // @ts-expect-error test only
  svc.config.login = 'u';
  // @ts-expect-error test only
  svc.config.password = 'p';
    const res = await svc.getCredit();
    expect(res.success).toBe(true);
    expect(res.credit).toBe(150);
    expect(res.attempts && res.attempts.length).toBeGreaterThan(0);
    // cache přítomnost
    const cached = svc.getCachedCredit();
    expect(cached).toBe(150);
  });

  it('getCachedCredit returns null when expired', async () => {
    const svc = new SMSService();
  globalThis.localStorage.setItem('sms_credit_cache', JSON.stringify({ credit: 10, ts: Date.now() - 10 * 60 * 1000 }));
    const cached = svc.getCachedCredit();
    expect(cached).toBeNull();
  });

  it('public helpers forward to instance', async () => {
    mockFetch.mockResolvedValueOnce(new Response('OK:123', { status: 200 }));
    await sendSMS('123', 'x');
    expect(mockFetch).toHaveBeenCalled();
    mockFetch.mockResolvedValueOnce(new Response('credit=5', { status: 200 }));
    const creditRes = await getCredit();
    expect(creditRes.success).toBe(true);
    expect(getCachedCredit()).toBe(5);
  });

  it('normalizes numbers (leading 0, spaces, 00 prefix)', async () => {
    mockFetch.mockResolvedValueOnce(new Response('OK:1', { status: 200 }));
    const svc = new SMSService();
    // @ts-expect-error test only
    svc.config.login = 'u';
    // @ts-expect-error test only
    svc.config.password = 'p';
    await svc.sendSMS(' 777 123 456 ', 'x');
    const url1 = mockFetch.mock.calls.pop()?.[0] as string;
    expect(url1).toContain('recipient=%2B420777123456');

    mockFetch.mockResolvedValueOnce(new Response('OK:2', { status: 200 }));
    await svc.sendSMS('0777123456', 'x');
    const url2 = mockFetch.mock.calls.pop()?.[0] as string;
    expect(url2).toContain('recipient=%2B420777123456');

    mockFetch.mockResolvedValueOnce(new Response('OK:3', { status: 200 }));
    await svc.sendSMS('00420777123456', 'x');
    const url3 = mockFetch.mock.calls.pop()?.[0] as string;
    expect(url3).toContain('recipient=%2B420777123456');
  });

  it('retries on 500 then succeeds', async () => {
    mockFetch
      .mockResolvedValueOnce(new Response('ERR temp', { status: 500 }))
      .mockResolvedValueOnce(new Response('ERR temp', { status: 503 }))
      .mockResolvedValueOnce(new Response('OK:999', { status: 200 }));
    const svc = new SMSService();
    svc.setDebug(true);
    // @ts-expect-error test only
    svc.config.login = 'u';
    // @ts-expect-error test only
    svc.config.password = 'p';
    const res = await svc.sendSMS('777123456', 'retry');
    expect(res.success).toBe(true);
    expect(mockFetch.mock.calls.length).toBe(3);
  });
});
