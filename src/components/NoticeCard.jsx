import { getStatus, getRelativeLabel } from '../modules/status';
import { STRINGS } from '../modules/strings';

/**
 * Notice card — White Content Card (rule 27).
 * Status shown with text AND colour (rule 16).
 * Actions are Ghost Text Links (rule 29).
 */

function buildCalendarUrl(notice) {
  if (!notice.date) return null;
  const date = notice.date.replace(/-/g, '');
  const start = notice.time ? notice.time.replace(':', '') + '00' : '000000';
  let endH = notice.time ? parseInt(notice.time.split(':')[0], 10) + 1 : 1;
  if (endH > 23) endH = 23;
  const endMin = notice.time ? notice.time.split(':')[1] : '00';
  const end = String(endH).padStart(2, '0') + endMin + '00';

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: notice.title,
    dates: `${date}T${start}/${date}T${end}`,
    location: notice.venue || '',
    details: notice.note || '',
  });
  return `https://www.google.com/calendar/render?${params}`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function NoticeCard({ notice, onRemove, onCopy }) {
  const status = getStatus(notice);
  const relative = getRelativeLabel(notice);
  const calUrl = buildCalendarUrl(notice);

  return (
    <article
      className={`notice-card${status === 'expired' ? ' notice-card--expired' : ''}`}
      aria-label={`${notice.title} — ${status}`}
    >
      <div className="notice-header">
        <div className="notice-meta">
          <span className={`notice-badge notice-badge--${status}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
          <span className="notice-category">{notice.category}</span>
          {relative && <span className="notice-relative">{relative}</span>}
        </div>
      </div>

      <h3 className="notice-title">{notice.title}</h3>

      <div className="notice-details">
        {notice.date && (
          <span className="notice-detail">📅 {formatDate(notice.date)}</span>
        )}
        {notice.time && <span className="notice-detail">🕐 {notice.time}</span>}
        {notice.venue && <span className="notice-detail">📍 {notice.venue}</span>}
      </div>

      {notice.note && <p className="notice-note">{notice.note}</p>}

      <div className="notice-actions">
        {calUrl && (
          <a
            className="btn-ghost"
            href={calUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${STRINGS.calendarLink} for ${notice.title}`}
          >
            {STRINGS.calendarLink} ↗
          </a>
        )}
        {onCopy && (
          <button
            className="btn-ghost"
            onClick={() => onCopy(notice)}
            aria-label={`${STRINGS.copyButton} ${notice.title}`}
          >
            {STRINGS.copyButton}
          </button>
        )}
        <button
          className="btn-ghost btn-ghost--danger"
          onClick={() => onRemove(notice.id)}
          aria-label={`${STRINGS.removeButton} ${notice.title}`}
        >
          {STRINGS.removeButton}
        </button>
      </div>
    </article>
  );
}
