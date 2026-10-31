import { STRINGS } from '../modules/strings';

/**
 * Textarea input with Extract button and Ctrl/Cmd+Enter shortcut.
 * Input Field spec (rule 28): Linen fill, flat edges, bottom border only.
 */
export default function InputSection({
  inputText,
  onInputChange,
  onExtract,
  onLoadSamples,
  extracting,
}) {
  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onExtract();
    }
  }

  return (
    <section className="input-section" aria-label="Notice input">
      <textarea
        id="notice-input"
        className="input-textarea"
        placeholder={STRINGS.inputPlaceholder}
        value={inputText}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={5}
        maxLength={20000}
        aria-label="Paste your notice here"
        aria-describedby="shortcut-hint"
      />
      <div className="input-actions">
        <button
          id="btn-extract"
          className="btn-primary"
          onClick={onExtract}
          disabled={extracting}
        >
          {extracting ? STRINGS.extracting : STRINGS.extractButton}
          {!extracting && <span className="btn-arrow" aria-hidden="true">→</span>}
        </button>
        <button
          id="btn-samples"
          className="btn-secondary"
          onClick={onLoadSamples}
        >
          {STRINGS.trySamples}
        </button>
        <span id="shortcut-hint" className="shortcut-hint" aria-hidden="true">
          {STRINGS.shortcutHint}
        </span>
      </div>
    </section>
  );
}
