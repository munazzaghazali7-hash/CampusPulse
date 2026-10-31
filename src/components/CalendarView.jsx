import { useState } from 'react';
import NoticeCard from './NoticeCard';

/**
 * Month-grid calendar view.
 * Click a day to see notices for that date below the grid.
 */
export default function CalendarView({ notices, onRemove, selectedDate, onDateSelect }) {
  const [current, setCurrent] = useState(new Date());
  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = current.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const prev = () => setCurrent(new Date(year, month - 1, 1));
  const next = () => setCurrent(new Date(year, month + 1, 1));

  /* Build cells: leading blanks + day objects */
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push({ day: d, dateStr, count: notices.filter((n) => n.date === dateStr).length });
  }

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const detailNotices = selectedDate ? notices.filter((n) => n.date === selectedDate) : [];

  return (
    <div className="calendar" aria-label="Calendar view">
      {/* Month navigation */}
      <div className="calendar-header">
        <button className="btn-ghost" onClick={prev} aria-label="Previous month">
          ←
        </button>
        <h2 className="calendar-month">{monthLabel}</h2>
        <button className="btn-ghost" onClick={next} aria-label="Next month">
          →
        </button>
      </div>

      {/* Day-of-week labels */}
      <div className="calendar-day-labels">
        {dayLabels.map((l) => (
          <div key={l} className="calendar-day-label">{l}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="calendar-grid" role="grid">
        {cells.map((cell, i) => (
          <button
            key={i}
            className={
              'calendar-cell' +
              (!cell ? ' calendar-cell--empty' : '') +
              (cell?.dateStr === selectedDate ? ' calendar-cell--selected' : '') +
              (cell?.count > 0 ? ' calendar-cell--has-notices' : '')
            }
            onClick={() =>
              cell && onDateSelect(cell.dateStr === selectedDate ? null : cell.dateStr)
            }
            disabled={!cell}
            aria-label={
              cell
                ? `${cell.day} ${monthLabel}, ${cell.count} notice${cell.count !== 1 ? 's' : ''}`
                : undefined
            }
          >
            {cell && (
              <>
                <span className="calendar-cell-day">{cell.day}</span>
                {cell.count > 0 && (
                  <span className="calendar-cell-count">{cell.count}</span>
                )}
              </>
            )}
          </button>
        ))}
      </div>

      {/* Detail panel for selected date */}
      {selectedDate && detailNotices.length > 0 && (
        <div className="calendar-detail">
          <h3 className="calendar-detail-title">
            Notices for{' '}
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
            })}
          </h3>
          {detailNotices.map((n) => (
            <NoticeCard key={n.id} notice={n} onRemove={onRemove} />
          ))}
        </div>
      )}
    </div>
  );
}
