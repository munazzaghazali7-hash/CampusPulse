/**
 * Digest — "What do I need to know this week?" (architecture.md §5 module).
 * Gemini summary with local fallback (rule 14).
 */

const API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent';

function getApiKey() {
  return import.meta.env.VITE_GEMINI_API_KEY || '';
}

export async function generateDigest(notices) {
  const upcoming = getNextSevenDays(notices);

  if (upcoming.length === 0) {
    return { text: 'No upcoming notices this week. Enjoy your free time!', method: 'local' };
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return { text: localFallback(upcoming), method: 'fallback' };
  }

  try {
    const list = upcoming
      .map(
        (n) =>
          `${n.title}${n.date ? ` on ${n.date}` : ''}${n.time ? ` at ${n.time}` : ''}` +
          `${n.venue ? ` in ${n.venue}` : ''} [${n.category}]`
      )
      .join('\n');

    const prompt =
      `Write a digest under 100 words for a student: ` +
      `"What do I need to know this week?" ` +
      `Lead with urgent items, state the day, time and venue. ` +
      `Plain text, short bullet lines.\n\nNotices:\n${list}`;

    const res = await fetch(`${API_URL}?key=${getApiKey()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty');
    return { text, method: 'ai' };
  } catch {
    return { text: localFallback(upcoming), method: 'fallback' };
  }
}

/* ── Helpers ────────────────────────────────────────────────────────── */

function getNextSevenDays(notices) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(today);
  end.setDate(end.getDate() + 7);

  return notices.filter((n) => {
    if (!n.date) return true;
    const d = new Date(n.date + 'T00:00:00');
    return d >= today && d <= end;
  });
}

function localFallback(notices) {
  const lines = notices.map((n) => {
    let line = `• ${n.title}`;
    if (n.date) {
      const d = new Date(n.date + 'T00:00:00');
      line += ` — ${d.toLocaleDateString('en-US', { weekday: 'long' })}`;
    }
    if (n.time) line += ` at ${n.time}`;
    if (n.venue) line += `, ${n.venue}`;
    return line;
  });
  return `Your week ahead:\n${lines.join('\n')}`;
}
