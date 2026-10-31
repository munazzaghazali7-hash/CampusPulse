# Campus Pulse: Rules for the AI Builder

Follow these rules in every prompt and every code change.

## Source of Truth
0. Read these files before writing any code: `pr.md` (what to build), `architecture.md` (how it is structured), `phases.md` (build order), `design.md` (how it looks).
0a. `design.md` is owned by the project owner and is the only authority on visual design: colours, typography, spacing, components, layout and motion. Follow it exactly. Do not edit, override or reinterpret it.
0b. If `design.md` conflicts with any rule below on visual matters, `design.md` wins. Accessibility rules (16 to 18) still apply, and if `design.md` would break one of them, flag it to the owner instead of silently changing it.
0c. If `design.md` does not specify something, choose the simplest option that matches its existing style and note the choice in a comment.

## Scope
1. Build only what is in `pr.md`. Do not add accounts, backends or extra pages.
2. Follow `phases.md` in order. Finish and verify each phase before the next.
3. Keep the app as one page with one clear primary action: paste, then extract.

## Code
4. Use small, named modules as described in `architecture.md`. No file over 300 lines.
5. Keep all user-facing strings in one place so wording stays consistent.
6. Never hardcode the API key. Read it from an environment variable.
7. Never put pasted text into `innerHTML` without escaping it.
8. Wrap every `localStorage` and API call in try/catch and degrade gracefully.
9. No dead code, no unused dependencies, no console errors.

## AI Behaviour
10. Ask Gemini for JSON only, then validate every field before using it.
11. Always pass today's date in the prompt so relative dates resolve correctly.
12. Dates are day-first (DD/MM). Ignore message timestamps and sender names.
13. Never invent missing details. Use `null` for an unknown date or time and an empty string for an unknown venue.
14. Every AI feature must have a non-AI fallback so the app never breaks.

## UX and Design
14a. Take every design token (colours, fonts, radii, spacing, shadows) from `design.md` and define them once as CSS variables. Never hardcode a colour or font in a component.
14b. Build components (card, chip, banner, button, calendar cell) to match `design.md`, and reuse them instead of restyling per screen.
15. A first-time user must understand the app without instructions.
16. Status is shown with text and colour, never colour alone.
17. Layout works from 360px width up. Tap targets are at least 40px.
18. The app is light theme only, as `design.md` defines. Provide visible focus and reduced-motion support.
19. Errors say what happened and what to do. Empty states invite action.
20. Use the same word for the same action everywhere ("Extract notice", "Remove").

## Applying design.md to Campus Pulse
`design.md` is a brand style reference for a marketing site, so map it to this app as follows. These choices stay inside its palette and rules.

25. **Fonts:** headings 27px and above use the display serif (`--font-ppmondwest`, substitute Fraunces) at weight 400. All UI text uses the sans (`--font-af`, substitute Inter). Load substitutes from Google Fonts with the fallback stack from `design.md`.
26. **Canvas and surfaces:** page is Parchment, notice cards and calendar are Paper, inputs are Linen. Max width 1200px, card padding 16px, element gap 8 to 12px.
27. **Notice card:** White Content Card (12px radius, 1px Mist border, `--shadow-subtle`).
28. **Inputs:** textarea and search follow the Input Field spec (Linen fill, flat edges, bottom border only).
29. **Buttons:** "Extract notice" is the Primary Outlined CTA (Signal Blue border and text, no fill). "What do I need to know this week?" and "Try sample notices" are Secondary Outlined (Twilight). Remove and filter buttons are Ghost Text Links. No shadows on buttons. Never fill a button with a blue.
30. **Status badges (no new colours allowed):** Urgent = filled Dusk badge with white text. Upcoming = outlined badge, Signal Blue border, Twilight text. Expired = Fog border, Ash text, card text muted. The word Urgent, Upcoming or Expired is always visible.
31. **Attention banner:** White Content Card with a 1px Twilight border and a serif heading at 27px. Do not use Cerulean in the app unless the owner approves.
32. **Category chips and filters:** 8px radius, 1px Mist border; the selected chip uses a 1px Twilight border and Linen fill.
33. **Header:** a Frosted Navigation Pill (50px radius) containing the app name and the List/Calendar toggle.
34. **Imagery:** no illustrations or photos are required. The app is text-first on the Parchment canvas.
35. **Text colour:** solid hex only, as in `design.md` (Graphite headings, Charcoal body, Ash muted). Never `#000000` and never rgba on text.

## Known Conflicts to Confirm with the Owner
- Signal Blue (`#41a1cf`) text on Parchment is about 2.9:1 contrast, below the 4.5:1 WCAG AA target for small text. Build it as `design.md` specifies and add a comment so the owner can decide. Status is never conveyed by this colour alone (rule 30).
- The Primary Outlined CTA padding (5px 12px) gives a button under 40px tall. On screens under 640px, use `min-height: 40px` for tap targets (rule 17) and leave the desktop look unchanged.

## Data
21. Allowed categories: Academic, Deadline, Placement, Sports, Event, Other.
22. Date format `YYYY-MM-DD`, time format `HH:MM` (24h).
23. Status logic lives in one function and nowhere else.
24. Dedupe on title plus date.

## Definition of Done
- The UI matches `design.md` (colours, type, components, layout) and rules 25 to 35, with no unapproved deviations.
- All five core requirements work in the demo script from `pr.md`.
- The test list in `phases.md` passes.
- The app works with the AI call disabled.
- No console errors; usable on a phone.
