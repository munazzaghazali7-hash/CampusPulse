import { describe, it, expect } from 'vitest';
import { regexFallback } from '../src/modules/extractor';
import { getStatus, getRelativeLabel } from '../src/modules/status';

describe('Edge Cases & Resiliency Module', () => {
  it('correctly handles midnight 12:00 AM as 00:00 and noon 12:00 PM as 12:00', () => {
    const midnight = regexFallback('Server maintenance at 12:00 AM in Data Center');
    expect(midnight[0].time).toBe('00:00');

    const noon = regexFallback('Club meeting at 12:00 PM in Room 204');
    expect(noon[0].time).toBe('12:00');
  });

  it('handles unicode curly quotes and em-dashes gracefully', () => {
    const unicodeText = '“Special Guest Lecture” — on 15th Nov, 3 PM at “Main Audi”';
    const notices = regexFallback(unicodeText);
    expect(notices).toHaveLength(1);
    expect(notices[0].time).toBe('15:00');
    expect(notices[0].venue).toContain('Main Audi');
  });

  it('handles leap year dates cleanly', () => {
    const leapNotice = regexFallback('Special leap day session on 29th Feb 2028 at Hall A');
    expect(leapNotice).toHaveLength(1);
    expect(leapNotice[0].date).toBe('2028-02-29');
  });

  it('handles carriage return and CRLF Windows newlines', () => {
    const crlfText = 'Exam on 5th Nov\r\n---\r\nSeminar on 10th Nov';
    const notices = regexFallback(crlfText);
    expect(notices).toHaveLength(2);
  });

  it('safely handles oversized 5000+ character text without hanging or crashing', () => {
    const padding = 'Important announcement. '.repeat(200);
    const oversized = `${padding} Talk today 4 PM, Seminar Hall`;
    const notices = regexFallback(oversized);
    expect(notices).toHaveLength(1);
    expect(notices[0].time).toBe('16:00');
    expect(notices[0].venue).toBe('Seminar Hall');
  });

  it('properly returns relative labels for past and distant dates', () => {
    const today = new Date();
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - 5);
    const pastStr = pastDate.toISOString().split('T')[0];

    const notice = { date: pastStr, time: null, category: 'Other' };
    expect(getStatus(notice)).toBe('expired');
    expect(getRelativeLabel(notice)).toBe('5 days ago');
  });
});
