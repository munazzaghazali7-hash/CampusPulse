# Campus Pulse 🏛️⚡

> **Intelligent campus notice board for students.**  
> Transforms chaotic WhatsApp forwards and department emails into structured, prioritized notices with AI extraction, calendar sync, and weekly digests.

---

## ✨ Features

- **🧠 Smart Extraction & Normalization**:
  - Paste messy forwarded text from WhatsApp or email.
  - Gemini API (`gemini-3.5-flash`) extracts clean structured fields: title, date (`YYYY-MM-DD`), time (`HH:MM`), venue, category, and notes.
  - Automatically detects and ignores WhatsApp timestamps (`[24/10/26, 14:32] Prof Sharma:`) so sender names or timestamps are never mistaken for event details.
  - Multi-notice support: handles multiple notices separated by `---` or block breaks.

- **🛡️ Built-in Non-AI Fallback**:
  - Works 100% offline or with zero API key configured.
  - Regex parser intelligently extracts day-first dates, relative dates (*"today"*, *"tomorrow"*, *"yesterday"*, *"5th Nov"*), times (*"10 AM"*, *"4 PM"*, *"23:59"*), and campus venues (*"Hall B"*, *"Seminar Hall"*, *"Auditorium"*).

- **🚨 Priority Engine & Attention Banner**:
  - Live **"Needs attention today"** banner rendered per design specs.
  - Dynamic status labeling:
    - **Urgent**: Today, within 2 days, or a Deadline within 3 days.
    - **Expired**: Past date or event time + 1 hour has elapsed.
    - **Upcoming**: Future notices.
  - Dual accessibility: status is **always** conveyed via explicit text label and color.

- **📅 Organized Views & Filtering**:
  - **List View**: Active urgent items first, upcoming second, expired notices muted last.
  - **Month Calendar View**: Interactive month grid with notice count badges and click-to-filter day inspection.
  - **Search & Chips**: Live search across title, venue, category, and notes; category chips (`Academic`, `Deadline`, `Placement`, `Sports`, `Event`, `Other`).
  - **Google Calendar Sync**: 1-click button to export events with date, time, venue, and notes to Google Calendar.

- **📝 Weekly Digest**:
  - *"What do I need to know this week?"* button generates a sub-100-word digest summarizing immediate priorities.
  - Instant local bullet-point summary fallback if offline.

- **🎨 Editorial Design System**:
  - Built to match the style reference (`DESIGN-3.md`) and strict design rules:
    - Warm Parchment canvas (`#fefffc`), Paper cards (`#ffffff`), Linen inputs (`#f9faf7`).
    - Typography: Fraunces display serif (400 weight) for headings 27px+; Inter sans for all UI.
    - Primary Outlined CTA button in Signal Blue (`#41a1cf`, border/text only, no fill).
    - Secondary Outlined button in Twilight (`#282834`).
    - Frosted Navigation Pill (50px radius) with backdrop blur.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
git clone https://github.com/munazzaghazali7-hash/CampusPulse.git
cd CampusPulse
npm install
```

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your Gemini API key (optional — app works completely without it via built-in fallback parser):
```env
VITE_GEMINI_API_KEY=your_key_here
```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing

Campus Pulse features a comprehensive test suite covering all core requirements, edge cases, date parsing, status rules, deduplication, and XSS sanitization:

```bash
npm test
```

### Build for Production
```bash
npm run build
```

---

## 🔒 Security & Privacy

- **Zero Secret Leaks**: API keys are read strictly from environment variables and excluded from git.
- **XSS Protection**: Pasted text is rendered strictly as React children with automatic HTML sanitization.
- **Safe External Links**: All external URLs use `rel="noopener noreferrer"`.
- **LocalStorage Resilience**: All storage accesses are wrapped in `try/catch` with graceful in-memory fallbacks.

---

## 📄 License
MIT
