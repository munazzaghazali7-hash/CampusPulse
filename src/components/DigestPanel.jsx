import { useState } from 'react';
import { generateDigest } from '../modules/digest';
import { STRINGS } from '../modules/strings';

/**
 * "What do I need to know this week?" digest panel.
 * Secondary Outlined button (Twilight), digest in a White Content Card.
 */
export default function DigestPanel({ notices }) {
  const [digest, setDigest] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    try {
      const result = await generateDigest(notices);
      setDigest(result);
    } catch {
      setDigest({ text: 'Could not generate a digest right now.', method: 'error' });
    }
    setLoading(false);
  }

  return (
    <div className="digest-panel">
      <button
        id="btn-digest"
        className="btn-secondary"
        onClick={handleGenerate}
        disabled={loading || notices.length === 0}
      >
        {loading ? STRINGS.digestGenerating : STRINGS.digestButton}
      </button>

      {digest && (
        <div className="digest-content">
          <h2 className="digest-title">{STRINGS.digestTitle}</h2>
          <div className="digest-text">
            {digest.text.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          {digest.method === 'fallback' && (
            <p className="digest-method">Generated with built-in summary</p>
          )}
        </div>
      )}
    </div>
  );
}
