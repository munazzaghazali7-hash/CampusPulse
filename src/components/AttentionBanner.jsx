import { STRINGS } from '../modules/strings';

/**
 * "Needs attention today" banner — rule 31.
 * White Content Card, 1px Twilight border, serif heading at 27px.
 * Only renders when there are urgent notices.
 */
export default function AttentionBanner({ urgentNotices }) {
  if (urgentNotices.length === 0) return null;

  return (
    <section className="attention-banner" role="alert" aria-label="Urgent notices">
      <h2 className="attention-banner-title">{STRINGS.bannerTitle}</h2>
      <ul className="attention-banner-list">
        {urgentNotices.map((n) => (
          <li key={n.id} className="attention-banner-item">
            <span className="attention-banner-label">{n.title}</span>
            {n.time && (
              <span className="attention-banner-time"> at {n.time}</span>
            )}
            {n.venue && (
              <span className="attention-banner-venue"> — {n.venue}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
