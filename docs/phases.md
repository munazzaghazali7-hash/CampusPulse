# Campus Pulse: Build Phases

Read `design.md` (owned by the project owner) before Phase 1. Every phase must follow it for all visual decisions.

Each phase ends with something runnable. Do not start the next phase until the checkpoint passes.

## Phase 1: Skeleton and Input
**Build:** design tokens from `design.md` as CSS variables, page layout, header, textarea, "Extract notice" button, empty state.
**Checkpoint:** page loads, is responsive, textarea accepts text.

## Phase 2: Smart Extraction
**Build:** Gemini call with JSON output, validation, multiple-notice support, regex fallback, notice card component, localStorage save, duplicate check.
**Checkpoint:** pasting 3 different messy messages gives 3 correct cards; disabling the API still produces cards.

## Phase 3: Organised View
**Build:** search box, category chips, status filter, List/Calendar toggle, month grid, click-a-day filter, delete button.
**Checkpoint:** every filter narrows results correctly; calendar shows items on the right dates.

## Phase 4: Priority and Reminders
**Build:** status engine (Urgent / Upcoming / Expired), coloured badge plus text label, "Needs attention today" banner, relative labels ("Today", "In 3 days"), sort order (active first, expired last).
**Checkpoint:** a notice dated today is Urgent, yesterday is Expired, next month is Upcoming; banner updates live.

## Phase 5: AI Summary
**Build:** "What do I need to know this week?" button, Gemini digest prompt, loading state, local fallback digest.
**Checkpoint:** digest mentions the urgent items first and stays under about 100 words; fallback works offline.

## Phase 6: Polish and Usability
**Build:** "Try sample notices" button, toasts, Add to Google Calendar link, keyboard shortcut, focus states, mobile layout fixes, check against `design.md` and the Known Conflicts in `rules.md`.
**Checkpoint:** a new user completes paste, extract, and read the digest with no instructions, and every screen matches `design.md`.

## Phase 7: Test and Submit
**Build:** run the test list below, deploy to a static host, record a short demo.
**Checkpoint:** all tests pass on desktop and phone.

### Test List
| Input | Expected |
|---|---|
| "Exam on 5th Nov, 10 AM, Hall B" | date 5 Nov, 10:00, venue Hall B, Academic |
| "Registration closes tomorrow 11:59 PM" | tomorrow's date, 23:59, Deadline, Urgent |
| "Talk today 4 PM, Seminar Hall" | today, 16:00, Urgent |
| Message with a WhatsApp timestamp prefix | timestamp not used as event date |
| Two notices separated by `---` | two cards |
| Empty input | toast, no card |
| Same notice twice | second is rejected |
| API key missing | fallback parser used, app still works |

## Time Plan (hackathon)
| Phase | Target time |
|---|---|
| 1 | 10 min |
| 2 | 30 min |
| 3 | 25 min |
| 4 | 15 min |
| 5 | 15 min |
| 6 | 15 min |
| 7 | 10 min |
