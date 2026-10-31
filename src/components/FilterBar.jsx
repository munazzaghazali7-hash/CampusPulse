import { STRINGS } from '../modules/strings';

/**
 * Search box, category chips, status dropdown.
 * Chips follow rule 32: 8px radius, 1px Mist border; selected = Twilight + Linen.
 */
export default function FilterBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  statusFilter,
  onStatusChange,
}) {
  return (
    <div className="filter-bar" role="search" aria-label="Filter notices">
      <input
        id="search-input"
        className="search-input"
        type="text"
        placeholder={STRINGS.searchPlaceholder}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search notices"
      />
      <div className="chips" role="group" aria-label="Filter by category">
        {STRINGS.categories.map((cat) => (
          <button
            key={cat}
            id={`chip-${cat.toLowerCase()}`}
            className={`chip${category === cat ? ' chip--active' : ''}`}
            onClick={() => onCategoryChange(cat)}
            aria-pressed={category === cat}
          >
            {cat}
          </button>
        ))}
      </div>
      <select
        id="status-filter"
        className="status-select"
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        aria-label="Filter by status"
      >
        {STRINGS.statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
