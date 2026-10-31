import { describe, it, expect, vi } from 'vitest';
import { generateDigest } from '../src/modules/digest';

describe('Weekly Digest Module', () => {
  it('returns empty message if there are no upcoming notices in the next 7 days', async () => {
    const res = await generateDigest([]);
    expect(res.text).toContain('No upcoming notices this week');
    expect(res.method).toBe('local');
  });

  it('uses graceful local fallback if API call fails or times out', async () => {
    const today = new Date().toISOString().split('T')[0];
    const notices = [
      {
        title: 'Tech Talk: Intro to AI',
        date: today,
        time: '16:00',
        venue: 'Seminar Hall',
        category: 'Event',
      },
      {
        title: 'Data Structures Exam',
        date: today,
        time: '10:00',
        venue: 'Hall B',
        category: 'Academic',
      },
    ];

    // Mock fetch to simulate an offline/network failure
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network down'));

    try {
      const res = await generateDigest(notices);
      expect(res.method).toBe('fallback');
      expect(res.text).toContain('Your week ahead:');
      expect(res.text).toContain('Tech Talk: Intro to AI');
      expect(res.text).toContain('Data Structures Exam');
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
