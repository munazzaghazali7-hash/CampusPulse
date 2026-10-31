import { describe, it, expect } from 'vitest';
import { filterNotices } from '../src/modules/filters';

describe('Filter Engine Module', () => {
  const notices = [
    {
      id: '1',
      title: 'Machine Learning Seminar',
      venue: 'Seminar Hall',
      category: 'Event',
      note: 'Speaker from Google',
      date: '2026-11-05',
    },
    {
      id: '2',
      title: 'Data Structures Exam',
      venue: 'Hall B',
      category: 'Academic',
      note: 'Bring calculator',
      date: '2026-11-01',
    },
    {
      id: '3',
      title: 'Internship Deadline',
      venue: '',
      category: 'Deadline',
      note: 'Submit resume',
      date: '2026-10-31',
    },
  ];

  it('filters notices by keyword search across title, venue, and note', () => {
    const res1 = filterNotices(notices, { search: 'Machine' });
    expect(res1).toHaveLength(1);
    expect(res1[0].id).toBe('1');

    const res2 = filterNotices(notices, { search: 'calculator' });
    expect(res2).toHaveLength(1);
    expect(res2[0].id).toBe('2');
  });

  it('filters notices by category chip', () => {
    const res = filterNotices(notices, { category: 'Academic' });
    expect(res).toHaveLength(1);
    expect(res[0].category).toBe('Academic');
  });

  it('filters notices by status', () => {
    const res = filterNotices(notices, { status: 'Urgent' });
    expect(res.length).toBeGreaterThanOrEqual(1);
  });

  it('combines search and category filters', () => {
    const res = filterNotices(notices, { search: 'Hall', category: 'Academic' });
    expect(res).toHaveLength(1);
    expect(res[0].id).toBe('2');
  });
});
