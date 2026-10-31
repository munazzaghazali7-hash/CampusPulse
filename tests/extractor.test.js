import { describe, it, expect } from 'vitest';
import { regexFallback, cleanMessyText } from '../src/modules/extractor';

describe('Extractor & Parser Module', () => {
  it('extracts "Exam on 5th Nov, 10 AM, Hall B" with correct date, time, venue, category', () => {
    const notices = regexFallback('Exam on 5th Nov, 10 AM, Hall B');
    expect(notices).toHaveLength(1);
    const n = notices[0];
    expect(n.date).toMatch(/^\d{4}-11-05$/);
    expect(n.time).toBe('10:00');
    expect(n.venue).toBe('Hall B');
    expect(n.category).toBe('Academic');
  });

  it('extracts "Registration closes tomorrow 11:59 PM" as a Deadline', () => {
    const notices = regexFallback('Registration closes tomorrow 11:59 PM');
    expect(notices).toHaveLength(1);
    const n = notices[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const expectedDate = tomorrow.toISOString().split('T')[0];
    expect(n.date).toBe(expectedDate);
    expect(n.time).toBe('23:59');
    expect(n.category).toBe('Deadline');
  });

  it('extracts "Talk today 4 PM, Seminar Hall" with today date and 16:00 time', () => {
    const notices = regexFallback('Talk today 4 PM, Seminar Hall');
    expect(notices).toHaveLength(1);
    const n = notices[0];
    const today = new Date().toISOString().split('T')[0];
    expect(n.date).toBe(today);
    expect(n.time).toBe('16:00');
    expect(n.venue).toBe('Seminar Hall');
    expect(n.category).toBe('Event');
  });

  it('ignores WhatsApp timestamp prefix and sender name', () => {
    const messy = '[24/10/26, 14:32] Prof Sharma: Exam on 5th Nov, 10 AM, Hall B';
    const cleaned = cleanMessyText(messy);
    expect(cleaned).toBe('Exam on 5th Nov, 10 AM, Hall B');

    const notices = regexFallback(messy);
    expect(notices).toHaveLength(1);
    expect(notices[0].title).not.toContain('14:32');
    expect(notices[0].title).not.toContain('Prof Sharma:');
    expect(notices[0].time).toBe('10:00');
    expect(notices[0].venue).toBe('Hall B');
  });

  it('splits multiple notices separated by "---"', () => {
    const multi = 'Exam on 5th Nov, 10 AM, Hall B\n---\nTalk today 4 PM, Seminar Hall';
    const notices = regexFallback(multi);
    expect(notices).toHaveLength(2);
    expect(notices[0].venue).toBe('Hall B');
    expect(notices[1].venue).toBe('Seminar Hall');
  });

  it('returns empty array for empty input', () => {
    expect(regexFallback('')).toHaveLength(0);
    expect(regexFallback('   \n\n  ')).toHaveLength(0);
  });

  it('safely handles inputs with potential script tags without corruption', () => {
    const xss = '<script>alert("hack")</script> Hackathon registration closes tomorrow 11:59 PM in Auditorium';
    const notices = regexFallback(xss);
    expect(notices).toHaveLength(1);
    expect(notices[0].venue).toBe('Auditorium');
    expect(notices[0].time).toBe('23:59');
  });
});
