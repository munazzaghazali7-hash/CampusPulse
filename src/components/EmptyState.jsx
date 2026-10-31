import { STRINGS } from '../modules/strings';

/**
 * Empty state — invites action (rule 19).
 * "Try sample notices" button so first-time users can explore immediately.
 */
export default function EmptyState({ onLoadSamples }) {
  return (
    <div className="empty-state" aria-label="No notices">
      <div className="empty-state-icon" aria-hidden="true">📋</div>
      <h2 className="empty-state-title">{STRINGS.emptyTitle}</h2>
      <p className="empty-state-text">{STRINGS.emptySubtitle}</p>
      <button id="btn-samples-empty" className="btn-secondary" onClick={onLoadSamples}>
        {STRINGS.trySamples}
      </button>
    </div>
  );
}
