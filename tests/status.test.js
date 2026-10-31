import { describe, it, expect } from 'vitest';
import { getStatus, getRelativeLabel, sortByStatus } from '../src/modules/status';

describe('Status Engine Module', () => {
  const fmt = (d) => d.toISOString().split('T')[0];
  const daysFromNow = (n) => {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return fmt(d);
  };

  it('marks notice dated today as urgent', () => {
    const notice = { date: daysFromNow(0), time: '23:59', category: 'Event' };
    expect(getStatus(notice)).toBe('urgent');
    expect(getRelativeLabel(notice)).toBe('Today');
  });

  it('marks notice within 2 days as urgent', () => {
    const notice = { date: daysFromNow(2), time: '10:00', category: 'Academic' };
    expect(getStatus(notice)).toBe('urgent');
    expect(getRelativeLabel(notice)).toBe('In 2 days');
  });

  it('marks Deadline within 3 days as urgent', () => {
    const notice = { date: daysFromNow(3), time: '18:00', category: 'Deadline' };
    expect(getStatus(notice)).toBe('urgent');
    expect(getRelativeLabel(notice)).toBe('In 3 days');
  });

  it('marks notice dated yesterday as expired', () => {
    const notice = { date: daysFromNow(-1), time: '10:00', category: 'Academic' };
    expect(getStatus(notice)).toBe('expired');
    expect(getRelativeLabel(notice)).toBe('Yesterday');
  });

  it('marks notice today whose event time + 1 hour has passed as expired', () => {
    const notice = { date: daysFromNow(0), time: '01:00', category: 'Event' };
    expect(getStatus(notice)).toBe('expired');
  });

  it('marks notice dated next month as upcoming', () => {
    const notice = { date: daysFromNow(30), time: '10:00', category: 'Academic' };
    expect(getStatus(notice)).toBe('upcoming');
  });

  it('marks notice without a date as upcoming', () => {
    const notice = { date: null, time: null, category: 'Other' };
    expect(getStatus(notice)).toBe('upcoming');
    expect(getRelativeLabel(notice)).toBe('');
  });

  it('sorts notices with urgent first, upcoming second, and expired last', () => {
    const urgent = { id: '1', date: daysFromNow(1), time: '12:00', category: 'Event' };
    const upcoming = { id: '2', date: daysFromNow(10), time: '12:00', category: 'Event' };
    const expired = { id: '3', date: daysFromNow(-2), time: '12:00', category: 'Event' };

    const sorted = sortByStatus([expired, upcoming, urgent]);
    expect(sorted.map((n) => n.id)).toEqual(['1', '2', '3']);
  });
});
