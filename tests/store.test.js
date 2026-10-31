import { describe, it, expect, beforeEach } from 'vitest';
import { isDuplicate, addNotice, removeNotice, loadNotices } from '../src/modules/store';

describe('Store Module', () => {
  beforeEach(() => {
    let store = {};
    globalThis.localStorage = {
      getItem: (key) => (key in store ? store[key] : null),
      setItem: (key, val) => {
        store[key] = String(val);
      },
      removeItem: (key) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  });

  it('detects duplicate notices matching same title (case-insensitive) and same date', () => {
    const existing = [{ title: 'Midterm Exam', date: '2026-11-05' }];
    expect(isDuplicate(existing, { title: 'midterm exam', date: '2026-11-05' })).toBe(true);
    expect(isDuplicate(existing, { title: 'Midterm Exam ', date: '2026-11-05' })).toBe(true);
  });

  it('allows same title with different dates', () => {
    const existing = [{ title: 'Midterm Exam', date: '2026-11-05' }];
    expect(isDuplicate(existing, { title: 'Midterm Exam', date: '2026-11-06' })).toBe(false);
  });

  it('adds notice with generated unique id and persists to localStorage', () => {
    let list = [];
    list = addNotice(list, { title: 'Workshop', date: '2026-11-10' });
    expect(list).toHaveLength(1);
    expect(list[0].id).toBeDefined();
    expect(loadNotices()).toHaveLength(1);
  });

  it('removes notice by id and updates localStorage', () => {
    let list = [];
    list = addNotice(list, { title: 'Notice A', date: '2026-11-01' });
    const id = list[0].id;
    list = removeNotice(list, id);
    expect(list).toHaveLength(0);
    expect(loadNotices()).toHaveLength(0);
  });
});
