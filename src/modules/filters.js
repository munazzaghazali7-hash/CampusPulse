/**
 * Filter engine — search text, category chip, status filter.
 */
import { getStatus } from './status';

export function filterNotices(notices, { search, category, status }) {
  let filtered = [...notices];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.venue.toLowerCase().includes(q) ||
        n.note.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q)
    );
  }

  if (category && category !== 'All') {
    filtered = filtered.filter((n) => n.category === category);
  }

  if (status && status !== 'All') {
    filtered = filtered.filter((n) => getStatus(n) === status.toLowerCase());
  }

  return filtered;
}
