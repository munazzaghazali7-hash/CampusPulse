/**
 * Notice store — CRUD, dedupe (title + date), localStorage sync.
 * All localStorage access wrapped in try/catch (rule 8).
 */

const STORAGE_KEY = 'campus-pulse-notices';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

/** Load notices from localStorage; returns [] on failure. */
export function loadNotices() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/** Persist the full notices array. */
export function saveNotices(notices) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notices));
  } catch {
    /* localStorage blocked — app works in memory for the session (rule 8) */
  }
}

/** Dedupe check: same title (case-insensitive) + same date (rule 24). */
export function isDuplicate(notices, notice) {
  return notices.some(
    (n) =>
      n.title.toLowerCase().trim() === notice.title.toLowerCase().trim() &&
      n.date === notice.date
  );
}

/** Add a notice, assign an id, persist. Returns the new array. */
export function addNotice(notices, notice) {
  const newNotice = { ...notice, id: generateId() };
  const updated = [newNotice, ...notices];
  saveNotices(updated);
  return updated;
}

/** Remove a notice by id, persist. Returns the new array. */
export function removeNotice(notices, id) {
  const updated = notices.filter((n) => n.id !== id);
  saveNotices(updated);
  return updated;
}
