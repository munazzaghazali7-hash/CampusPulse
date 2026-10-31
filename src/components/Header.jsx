import { STRINGS } from '../modules/strings';

/**
 * Frosted Navigation Pill (rule 33).
 * Contains app name and the List/Calendar toggle.
 */
export default function Header({ view, onViewChange }) {
  return (
    <header className="header">
      <nav className="header-nav" aria-label="Main navigation">
        <h1 className="header-brand">{STRINGS.appName}</h1>
        <div className="view-toggle" role="tablist" aria-label="View mode">
          <button
            id="toggle-list"
            className={`view-toggle-btn${view === 'list' ? ' view-toggle-btn--active' : ''}`}
            onClick={() => onViewChange('list')}
            role="tab"
            aria-selected={view === 'list'}
          >
            {STRINGS.listView}
          </button>
          <button
            id="toggle-calendar"
            className={`view-toggle-btn${view === 'calendar' ? ' view-toggle-btn--active' : ''}`}
            onClick={() => onViewChange('calendar')}
            role="tab"
            aria-selected={view === 'calendar'}
          >
            {STRINGS.calendarView}
          </button>
        </div>
      </nav>
    </header>
  );
}
