/**
 * All user-facing strings in one place (rule 5).
 * Use the same word for the same action everywhere (rule 20).
 */
export const STRINGS = {
  appName: 'Campus Pulse',

  /* Input */
  extractButton: 'Extract notice',
  extracting: 'Extracting\u2026',
  inputPlaceholder: 'Paste your notice, WhatsApp message, or email here\u2026',
  shortcutHint: 'Ctrl+Enter to extract',

  /* Actions */
  trySamples: 'Try sample notices',
  removeButton: 'Remove',
  calendarLink: 'Add to Google Calendar',

  /* Views */
  listView: 'List',
  calendarView: 'Calendar',

  /* Filters */
  searchPlaceholder: 'Search notices\u2026',
  categories: ['All', 'Academic', 'Deadline', 'Placement', 'Sports', 'Event', 'Other'],
  statuses: ['All', 'Urgent', 'Upcoming', 'Expired'],

  /* Banner */
  bannerTitle: 'Needs attention today',

  /* Digest */
  digestButton: 'What do I need to know this week?',
  digestGenerating: 'Generating\u2026',
  digestTitle: 'Your weekly digest',

  /* Empty / feedback */
  emptyTitle: 'No notices yet',
  emptySubtitle: 'Paste a WhatsApp message or email above, then hit Extract notice.',
  noResults: 'No notices match your filters.',

  /* Toasts */
  toastEmpty: 'Paste a notice first',
  toastDuplicate: 'Already in your list',
  toastRemoved: 'Notice removed',
  toastError: 'Something went wrong. Please try again.',
  toastExtracted(count, method) {
    const s = count > 1 ? 's' : '';
    const suffix = method === 'fallback' ? ' with built-in parser' : '';
    return `Extracted ${count} notice${s}${suffix}`;
  },
};
