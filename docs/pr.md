# Campus Pulse: Product Requirements (PRD)

## 1. Problem
Students get notices scattered across WhatsApp groups and emails. Deadlines get missed, event details are unclear, and there is no single place to see what is happening.

## 2. Goal
One clear, intelligent place for a student to stay on top of campus life, built using only natural-language prompts.

## 3. Target User
College students who read many forwarded messages every day and need a fast, no-training tool.

## 4. Core Requirements (from the challenge)
| ID | Requirement | Acceptance criteria |
|---|---|---|
| R1 | Smart input | User pastes messy text; AI returns title, date, time, venue, category as a clean card. Multiple notices in one paste produce multiple cards. |
| R2 | Organised view | Searchable, filterable list; month calendar view by date; filter by category and status. |
| R3 | Priority and reminders | Each item is labelled Urgent, Upcoming or Expired; a banner highlights what needs attention today. |
| R4 | AI summary | A "What do I need to know this week?" button generates a short readable digest. |
| R5 | Usable interface | Responsive on mobile and desktop; a first-time user understands it without instructions. |

## 5. User Stories
1. As a student, I paste a WhatsApp forward and instantly get a card with the key details.
2. As a student, I see what is urgent today before anything else.
3. As a student, I search or filter to find a specific event or deadline.
4. As a student, I tap one button and get my week in under 100 words.
5. As a student, I add an event to Google Calendar from its card.

## 6. Functional Requirements
- Textarea input with "Extract notice" button and Ctrl/Cmd+Enter shortcut.
- AI extraction with a regex fallback, so the app works if the API fails.
- Card shows: date, time, status badge, category, title, venue, note, actions.
- Search box, category chips, status dropdown, List/Calendar toggle.
- Attention banner listing all Urgent items.
- Weekly digest panel.
- Delete a notice; "Try sample notices" button; data saved in localStorage.
- Visual design follows `design.md` (owned by the project owner); see rules 25 to 35 in `rules.md`.

## 7. Non-Functional Requirements
- Responsive from 360px wide upwards.
- Status shown with text as well as colour (accessible).
- Light theme only, styled per `design.md`; visible keyboard focus.
- Extraction returns in under 5 seconds on a normal connection.
- No login, no backend, no personal data stored on a server.

## 8. Out of Scope
Accounts, push notifications, multi-user sharing, OCR of poster images, WhatsApp integration.

## 9. Success Metrics (for evaluation)
- All five core requirements demonstrably work in a 2-minute demo.
- Sample notices produce correct title, date, time, venue, category.
- Relative dates ("tomorrow", "Friday") resolve correctly.
- App still works with the AI call disabled.

## 10. Demo Script
1. Click "Try sample notices" and show populated cards and the attention banner.
2. Paste a fresh messy WhatsApp message and extract it.
3. Search, filter by category, switch to Calendar view.
4. Click "What do I need to know this week?"
5. Resize to mobile width.
