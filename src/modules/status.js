/**
 * Status engine — the ONLY place status logic lives (rule 23).
 *
 * Status rules (architecture.md §6):
 *   Expired  – date before today, OR today and event time + 1 hour has passed
 *   Urgent   – today, within 2 days, or a Deadline within 3 days
 *   Upcoming – everything else (including notices with no date)
 */

/** Returns 'urgent' | 'upcoming' | 'expired'. */
export function getStatus(notice) {
  if (!notice.date) return 'upcoming';

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const noticeDate = new Date(notice.date + 'T00:00:00');
  const diffMs = noticeDate.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  /* Expired */
  if (diffDays < 0) return 'expired';
  if (diffDays === 0 && notice.time) {
    const [h, m] = notice.time.split(':').map(Number);
    const eventEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
    eventEnd.setHours(eventEnd.getHours() + 1);
    if (now > eventEnd) return 'expired';
  }

  /* Urgent */
  if (diffDays >= 0 && diffDays <= 2) return 'urgent';
  if (notice.category === 'Deadline' && diffDays >= 0 && diffDays <= 3) return 'urgent';

  return 'upcoming';
}

/** Human-friendly relative label: "Today", "Tomorrow", "In 3 days", etc. */
export function getRelativeLabel(notice) {
  if (!notice.date) return '';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const noticeDate = new Date(notice.date + 'T00:00:00');
  const diffDays = Math.round((noticeDate - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
  return '';
}

/** Sort: active (urgent) first, upcoming second, expired last. */
export function sortByStatus(notices) {
  const order = { urgent: 0, upcoming: 1, expired: 2 };
  return [...notices].sort((a, b) => {
    return (order[getStatus(a)] ?? 1) - (order[getStatus(b)] ?? 1);
  });
}
