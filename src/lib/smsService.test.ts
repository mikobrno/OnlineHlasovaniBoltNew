import { describe, it, expect } from 'vitest';
import { SMSParser } from './smsService';

describe('SMSParser.parseSend', () => {
  it('parses OK simple', () => {
    const r = SMSParser.parseSend('OK');
    expect(r.success).toBe(true);
    expect(r.code).toBe('OK');
  });
  it('parses OK with id after colon', () => {
    const r = SMSParser.parseSend('OK:123456');
    expect(r.success).toBe(true);
    expect(r.smsId).toBe('123456');
  });
  it('parses ID= pattern', () => {
    const r = SMSParser.parseSend('ID=ABCDEF OK');
    expect(r.success).toBe(true);
    expect(r.smsId).toBe('ABCDEF');
  });
  it('parses error', () => {
    const r = SMSParser.parseSend('ERROR 23 Wrong password');
    expect(r.success).toBe(false);
    expect(r.code).toBe('ERROR');
  });
});

describe('SMSParser.parseCredit', () => {
  it('keyword credit', () => {
    const { credit } = SMSParser.parseCredit('credit=123.5');
    expect(credit).toBe(123.5);
  });
  it('kredit cz', () => {
    const { credit } = SMSParser.parseCredit('KREDIT: 45');
    expect(credit).toBe(45);
  });
  it('whole number only', () => {
    const { credit } = SMSParser.parseCredit('78');
    expect(credit).toBe(78);
  });
  it('multiple numbers chooses last', () => {
    const { credit } = SMSParser.parseCredit('stav pred 10 po 15');
    expect(credit).toBe(15);
  });
  it('returns null when none', () => {
    const { credit } = SMSParser.parseCredit('neni dostupne');
    expect(credit).toBeNull();
  });
});
