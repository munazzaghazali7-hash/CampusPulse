import { useState, useEffect, useCallback, useMemo } from 'react';
import { loadNotices, isDuplicate, addNotice, removeNotice } from './modules/store';
import { getStatus, sortByStatus } from './modules/status';
import { filterNotices } from './modules/filters';
import { extractWithGemini } from './modules/extractor';
import { getSampleNotices } from './modules/samples';
import { STRINGS } from './modules/strings';
import Header from './components/Header';
import InputSection from './components/InputSection';
import FilterBar from './components/FilterBar';
import AttentionBanner from './components/AttentionBanner';
import ListView from './components/ListView';
import CalendarView from './components/CalendarView';
import DigestPanel from './components/DigestPanel';
import Toast from './components/Toast';
import EmptyState from './components/EmptyState';
import './App.css';

export default function App() {
  const [notices, setNotices] = useState([]);
  const [view, setView] = useState('list');
  const [inputText, setInputText] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedDate, setSelectedDate] = useState(null);
  const [toasts, setToasts] = useState([]);

  /* Load from localStorage on mount */
  useEffect(() => {
    setNotices(loadNotices());
  }, []);

  /* Toast helpers */
  const showToast = useCallback((message) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /* ── Extract notices ─────────────────────────────────────────────── */
  async function handleExtract() {
    if (!inputText.trim()) {
      showToast(STRINGS.toastEmpty);
      return;
    }
    setExtracting(true);
    try {
      const { notices: extracted, method } = await extractWithGemini(inputText);
      let added = 0;
      let dupes = 0;
      let current = [...notices];

      for (const n of extracted) {
        if (isDuplicate(current, n)) {
          dupes++;
        } else {
          current = addNotice(current, n);
          added++;
        }
      }
      setNotices(current);
      setInputText('');
      if (added > 0) showToast(STRINGS.toastExtracted(added, method));
      if (dupes > 0) showToast(STRINGS.toastDuplicate);
    } catch {
      showToast(STRINGS.toastError);
    }
    setExtracting(false);
  }

  /* ── Remove ──────────────────────────────────────────────────────── */
  function handleRemove(id) {
    setNotices((prev) => removeNotice(prev, id));
    showToast(STRINGS.toastRemoved);
  }

  /* ── Load samples ────────────────────────────────────────────────── */
  function handleLoadSamples() {
    const samples = getSampleNotices();
    let current = [...notices];
    let added = 0;
    for (const s of samples) {
      if (!isDuplicate(current, s)) {
        current = addNotice(current, s);
        added++;
      }
    }
    setNotices(current);
    if (added > 0) showToast(STRINGS.toastExtracted(added, 'samples'));
    else showToast(STRINGS.toastDuplicate);
  }

  /* ── Derived state ───────────────────────────────────────────────── */
  const filtered = useMemo(
    () => filterNotices(notices, { search, category, status: statusFilter }),
    [notices, search, category, statusFilter]
  );
  const sorted = useMemo(() => sortByStatus(filtered), [filtered]);
  const urgentNotices = useMemo(
    () => notices.filter((n) => getStatus(n) === 'urgent'),
    [notices]
  );

  return (
    <div className="app">
      <Header view={view} onViewChange={setView} />

      <main className="main-content">
        <InputSection
          inputText={inputText}
          onInputChange={setInputText}
          onExtract={handleExtract}
          onLoadSamples={handleLoadSamples}
          extracting={extracting}
        />

        <AttentionBanner urgentNotices={urgentNotices} />

        <FilterBar
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />

        <DigestPanel notices={notices} />

        {sorted.length === 0 && notices.length === 0 ? (
          <EmptyState onLoadSamples={handleLoadSamples} />
        ) : sorted.length === 0 ? (
          <div className="no-results">
            <p>{STRINGS.noResults}</p>
          </div>
        ) : view === 'list' ? (
          <ListView notices={sorted} onRemove={handleRemove} />
        ) : (
          <CalendarView
            notices={sorted}
            onRemove={handleRemove}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        )}
      </main>

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
