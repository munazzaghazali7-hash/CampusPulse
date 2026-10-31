# Campus Pulse: Architecture

## 1. Overview
A client-side single-page web app. Students paste messy text; Gemini extracts a structured notice; the app stores, filters, prioritises and summarises notices. No backend, no login.

## 2. Tech Stack
| Layer | Choice | Reason |
|---|---|---|
| UI | React + Vite (or plain HTML/JS) | Fast to build, easy to prompt |
| Styling | CSS variables generated from `design.md` (Tailwind optional) | Single source of truth for design (light theme only) |
| AI | Gemini API (`gemini-2.5-flash`) | Fast, JSON output mode |
| Storage | `localStorage` | Zero setup, persists between visits |
| Hosting | Static host (Vercel, Netlify, AI Studio deploy) | Free, one click |

## 3. Data Flow
```
Pasted text
   │
   ▼
[Extractor] ──(Gemini JSON mode)──► Notice[]      fallback: regex parser
   │
   ▼
[Store] (state + localStorage)
   │
   ├──► [Status Engine]  → urgent | upcoming | expired
   ├──► [Filter/Search]  → list view / calendar view
   ├──► [Attention Banner] → urgent items
   └──► [Digest]  → Gemini summary of next 7 days (fallback: local text)
```

## 4. Data Model
```ts
type Notice = {
  id: string;
  title: string;
  date: string | null;      // YYYY-MM-DD
  time: string | null;      // HH:MM (24h)
  venue: string;
  category: 'Academic' | 'Deadline' | 'Placement' | 'Sports' | 'Event' | 'Other';
  note: string;             // one-line key detail
  raw: string;              // original pasted text (truncated)
};
```

## 5. Modules
| Module | Responsibility |
|---|---|
| `extractor` | Builds the prompt, calls Gemini, validates JSON, falls back to regex |
| `store` | CRUD on notices, dedupe (title + date), localStorage sync |
| `status` | Computes Urgent / Upcoming / Expired from date, time, category |
| `filters` | Search text, category chip, status filter, selected day |
| `views` | ListView, CalendarView (month grid), NoticeCard, AttentionBanner |
| `digest` | Sends next 7 days of notices to Gemini, renders short summary |
| `ui` | Toasts, empty state, sample notices |

## 6. Status Rules
- **Expired:** date is before today, or today and event time + 1 hour has passed
- **Urgent:** today, within 2 days, or a Deadline within 3 days
- **Upcoming:** everything else (including notices with no date)

## 7. Gemini Contract
**Extraction prompt (summary):** "Today is {date}. Extract every campus notice from the text. Return ONLY a JSON array of {title, date, time, venue, category, note}. Resolve relative dates from today. Dates are day-first. Ignore timestamps and sender names. Never invent facts."

**Digest prompt (summary):** "Write a digest under 100 words for a student: 'What do I need to know this week?' Lead with urgent items, state the day, time and venue. Plain text, short bullet lines."

Validation: parse JSON, strip code fences, check date `YYYY-MM-DD`, time `HH:MM`, category in allowed list; otherwise reject and use the fallback.

## 8. Error Handling
| Failure | Behaviour |
|---|---|
| API down / quota / bad JSON | Use regex fallback, show "Extracted with built-in parser" |
| Empty input | Toast: "Paste a notice first" |
| Duplicate notice | Toast: "Already in your list" |
| localStorage blocked | App works in memory for the session |

## 9. Security and Privacy
- Keep the API key in an environment variable; never commit it.
- Render user text with escaping (no raw `innerHTML` of pasted content).
- Data never leaves the browser except the text sent to Gemini.
