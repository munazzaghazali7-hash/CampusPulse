/**
 * Extractor — builds prompt, calls Gemini (JSON mode), validates, regex fallback.
 * Every AI feature has a non-AI fallback (rule 14).
 * API calls wrapped in try/catch (rule 8).
 */

const API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent';

const CATEGORIES = ['Academic', 'Deadline', 'Placement', 'Sports', 'Event', 'Other'];

function getApiKey() {
  return import.meta.env.VITE_GEMINI_API_KEY || '';
}

/**
 * Strips WhatsApp header timestamps and sender prefixes:
 * e.g. "[24/10/26, 14:32] Prof Sharma: " or "24/10/2026, 14:32 - Sender: "
 */
export function cleanMessyText(text) {
  if (!text) return '';
  return text
    .replace(
      /^\[?\d{1,2}[\/\-.]\d{1,2}(?:[\/\-.]\d{2,4})?,?\s+\d{1,2}:\d{2}(?::\d{2})?\s*(?:am|pm|AM|PM)?\]?\s*(?:-|:)?\s*(?:[^:\n]{1,50}:)?\s*/gim,
      ''
    )
    .replace(/^\*?Forwarded(?:\s+as\s+received)?\*?:?\s*/gim, '')
    .trim();
}

/* ── Gemini extraction ──────────────────────────────────────────────── */

function buildPrompt(text) {
  const today = new Date().toISOString().split('T')[0];
  return (
    `Today is ${today}. Extract every campus notice from the text below. ` +
    `Return ONLY a JSON array of objects with these fields:\n` +
    `- title: string (concise notice headline)\n` +
    `- date: string in YYYY-MM-DD format, or null if unknown\n` +
    `- time: string in HH:MM (24h format, e.g. 10:00, 16:00, 23:59), or null if unknown\n` +
    `- venue: string (or empty string "" if unknown)\n` +
    `- category: strictly one of [Academic, Deadline, Placement, Sports, Event, Other]\n` +
    `- note: string (one-line key detail or instruction)\n\n` +
    `Rules:\n` +
    `1. Resolve relative dates (today, tomorrow, Friday, next week) from today (${today}).\n` +
    `2. Any dates in text are day-first (DD/MM).\n` +
    `3. Ignore message timestamps and sender names.\n` +
    `4. Never invent missing details — use null for unknown date/time, "" for unknown venue.\n\n` +
    `Text:\n${text}`
  );
}

export async function extractWithGemini(text) {
  const cleaned = cleanMessyText(text);
  const apiKey = getApiKey();
  if (!apiKey) {
    return { notices: regexFallback(cleaned), method: 'fallback' };
  }

  try {
    const res = await fetch(`${API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(cleaned) }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    });

    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) throw new Error('Empty response');

    const parsed = parseJson(raw);
    const validated = parsed.map(validateNotice).filter(Boolean);
    if (validated.length === 0) throw new Error('No valid notices');

    return {
      notices: validated.map((n) => ({ ...n, raw: text.substring(0, 500) })),
      method: 'ai',
    };
  } catch {
    return { notices: regexFallback(cleaned), method: 'fallback' };
  }
}

/* ── JSON parsing & validation ──────────────────────────────────────── */

function parseJson(text) {
  const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  try {
    const result = JSON.parse(cleaned);
    return Array.isArray(result) ? result : [result];
  } catch {
    return [];
  }
}

function validateNotice(n) {
  if (!n || !n.title) return null;
  return {
    title: String(n.title).trim(),
    date: isValidDate(n.date) ? n.date : null,
    time: normalizeTime(n.time),
    venue: typeof n.venue === 'string' ? n.venue.trim() : '',
    category: normalizeCategory(n.category),
    note: typeof n.note === 'string' ? n.note.trim() : '',
  };
}

function isValidDate(d) {
  return typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d) && !isNaN(new Date(d + 'T00:00:00').getTime());
}

function normalizeTime(t) {
  if (!t || typeof t !== 'string') return null;
  const matchColon = t.trim().match(/^(\d{1,2})[:\.](\d{2})\s*(am|pm)?$/i);
  if (matchColon) {
    let h = parseInt(matchColon[1], 10);
    const min = matchColon[2];
    const period = matchColon[3]?.toLowerCase();
    if (period === 'pm' && h < 12) h += 12;
    if (period === 'am' && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:${min}`;
  }
  const matchAmPm = t.trim().match(/^(\d{1,2})\s*(am|pm)$/i);
  if (matchAmPm) {
    let h = parseInt(matchAmPm[1], 10);
    const period = matchAmPm[2].toLowerCase();
    if (period === 'pm' && h < 12) h += 12;
    if (period === 'am' && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:00`;
  }
  return null;
}

function normalizeCategory(cat) {
  if (!cat || typeof cat !== 'string') return 'Other';
  const c = cat.trim();
  if (CATEGORIES.includes(c)) return c;
  const lower = c.toLowerCase();
  if (/acad|edu|exam|class|course|assign|syllab|study/i.test(lower)) return 'Academic';
  if (/dead|due|last|regis/i.test(lower)) return 'Deadline';
  if (/place|job|hire|recruit|intern|career/i.test(lower)) return 'Placement';
  if (/sport|game|match|cricket|football/i.test(lower)) return 'Sports';
  if (/event|fest|seminar|webinar|talk|work|cultur|meet/i.test(lower)) return 'Event';
  return 'Other';
}

/* ── Regex fallback ─────────────────────────────────────────────────── */

export function regexFallback(text) {
  // Split multiple notices separated by "---" line or triple newlines
  const rawBlocks = text.split(/(?:\r?\n)+\s*---+\s*(?:\r?\n)+|(?:\r?\n){3,}/).map((b) => b.trim()).filter(Boolean);
  const blocks = rawBlocks.length > 0 ? rawBlocks : [text.trim()];

  const today = new Date();
  const notices = [];

  for (const block of blocks) {
    const t = cleanMessyText(block);
    if (!t) continue;
    const date = extractDate(t, today);
    const time = extractTime(t);
    const venue = extractVenue(t);
    const category = detectCategory(t);
    const lines = t.split('\n').map((l) => l.trim()).filter(Boolean);
    const title = lines[0]?.substring(0, 120) || 'Untitled Notice';
    const note = lines.length > 1 ? lines[1].substring(0, 120) : '';

    notices.push({ title, date, time, venue, category, note, raw: t.substring(0, 500) });
  }

  return notices;
}

function extractDate(text, today) {
  /* Relative dates */
  if (/\btomorrow\b/i.test(text)) {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return fmt(d);
  }
  if (/\btoday\b/i.test(text)) return fmt(today);
  if (/\byesterday\b/i.test(text)) {
    const d = new Date(today);
    d.setDate(d.getDate() - 1);
    return fmt(d);
  }

  /* "5th Nov", "5 November", "5 Nov" — day-first */
  const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const mMatch = text.match(/(\d{1,2})(?:st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*/i);
  if (mMatch) {
    const day = mMatch[1].padStart(2, '0');
    const mi = monthNames.indexOf(mMatch[2].toLowerCase().substring(0, 3));
    if (mi !== -1) return `${today.getFullYear()}-${String(mi + 1).padStart(2, '0')}-${day}`;
  }

  /* DD/MM/YYYY or DD-MM-YYYY (day-first, rule 12) */
  const dMatch = text.match(/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/);
  if (dMatch) {
    const day = dMatch[1].padStart(2, '0');
    const month = dMatch[2].padStart(2, '0');
    let year = dMatch[3];
    if (year.length === 2) year = '20' + year;
    const candidate = `${year}-${month}-${day}`;
    if (!isNaN(new Date(candidate + 'T00:00:00').getTime())) return candidate;
  }

  return null;
}

function extractTime(text) {
  // Pattern 1: HH:MM with optional am/pm
  const matchColon = text.match(/\b(\d{1,2})[:\.](\d{2})\s*(am|pm)?\b/i);
  if (matchColon) {
    let h = parseInt(matchColon[1], 10);
    const min = matchColon[2];
    const period = matchColon[3]?.toLowerCase();
    if (period === 'pm' && h < 12) h += 12;
    if (period === 'am' && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:${min}`;
  }

  // Pattern 2: Standalone hour with AM/PM like "10 AM", "4 PM"
  const matchAmPm = text.match(/\b(\d{1,2})\s*(am|pm)\b/i);
  if (matchAmPm) {
    let h = parseInt(matchAmPm[1], 10);
    const period = matchAmPm[2].toLowerCase();
    if (period === 'pm' && h < 12) h += 12;
    if (period === 'am' && h === 12) h = 0;
    return `${String(h).padStart(2, '0')}:00`;
  }

  return null;
}

function extractVenue(text) {
  // Explicit label: Venue: Hall B, Location: Auditorium
  const explicit = text.match(/(?:venue|location|place)\s*[:\-]\s*([^\n,;]+)/i);
  if (explicit) return explicit[1].trim();

  // Named halls/rooms/buildings: "Hall B", "Seminar Hall", "Auditorium", "Main Building"
  const named = text.match(
    /\b((?:Seminar\s+Hall|Conference\s+Hall|Auditorium|Main\s+Building|Central\s+Library|College\s+Ground|(?:Hall|Room|Lab|Block|Building)\s+[A-Za-z0-9\-]+)(?:\s*,\s*[A-Za-z0-9\s]+)?)\b/i
  );
  if (named) return named[1].trim();

  // Standalone venue words
  const standalone = text.match(/\b(Seminar\s+Hall|Auditorium|Library|Ground)\b/i);
  if (standalone) return standalone[1].trim();

  return '';
}

function detectCategory(text) {
  if (/exam|class|lecture|assignment|syllabus|academic|test/i.test(text)) return 'Academic';
  if (/deadline|submit|due|last date|registration closes|apply by/i.test(text)) return 'Deadline';
  if (/placement|interview|hiring|recruit|company|job|internship/i.test(text)) return 'Placement';
  if (/sport|match|tournament|cricket|football|game/i.test(text)) return 'Sports';
  if (/event|fest|seminar|workshop|talk|cultural|concert|conference/i.test(text)) return 'Event';
  return 'Other';
}

function fmt(d) {
  return d.toISOString().split('T')[0];
}
