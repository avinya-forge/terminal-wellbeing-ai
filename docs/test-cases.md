# test-cases

Manual / e2e cases that must pass before any release tag. Automated
equivalents live alongside the source files; this list is the human
walkthrough script.

## golden path
1. **Boot animation** — open app cold; boot messages animate one at a time;
   no horizontal overflow at 320px; status reaches `Connected` or
   `Using fallback responses` within 30s.
2. **Send a neutral message** — typing "hello there" returns a greeting
   variant; user message renders immediately; bot message uses typewriter
   reveal; scroll snaps to bottom.
3. **Help command** — `/help` lists General / Mental Health / Utilities /
   System sections; mobile view flips to indented format under 768px.
4. **Theme switch** — `/theme dracula` flips palette; reload preserves theme;
   legacy JSON-encoded value (`"modern"`) still loads.

## safety path
5. **Tier 1 immediate emergency** — input "I want to kill myself" produces
   the EMERGENCY_RESPONSE block, halts inference, archives entry under
   `twa_archived_conversations`. Repeat in mixed case ("I WaNt To KiLl
   MySelF") — must still trigger.
6. **Tier 2 unsafe territory** — input "best way to die" returns the safe
   handoff message and archives the conversation.
7. **Tier 3 high sensitivity** — input "I feel hopeless and worthless"
   does NOT halt; the active model is `Zephyr 7B`.
8. **Panic command** — `/panic`, `panic`, and `Ctrl+Shift+P` all open the
   focus-trapped overlay. Tab cycles back to the close button. Escape closes.

## privacy path
9. **Privacy mode on** — `/privacy` clears `terminal_messages`,
   `wellbeing_user_profile`, `wellbeing_journal`, and clears
   `MemoryService.memories`.
10. **Privacy mode off** — re-enables persistence; new messages save again.

## resilience path
11. **Backend down** — clear `VITE_HF_TOKEN`, send a message, verify local
    `transformers.js` model loads or static fallback fires.
12. **NHS API rate limit** — send 11 NHS lookups in <60s; eleventh returns
    cached data or a graceful error.
13. **Circuit breaker open** — force three init failures; subsequent sends
    return `SYSTEM_RESPONSES.fallback` immediately, status shows
    `Service Status: Unavailable (Circuit Breaker)`.

## accessibility path
14. **Skip link** — Tab from page load reveals "Skip to terminal input".
15. **Reduced motion** — set `prefers-reduced-motion: reduce`; typewriter
    becomes instant render.
16. **Screen reader** — typing indicator announces "thinking…"; status
    region announces transitions.
17. **axe-core** — initial load and post-`/help` show zero violations.

## input UX
18. **Up/down arrow recall** — sent messages cycle through `history` prop;
    Down at end restores the in-progress draft.
19. **Multi-line paste** — paste content with newlines; flattens to single
    line preserving cursor position.
20. **Disabled state** — while a response is generating, input is disabled
    and placeholder reads `Processing...`.

## persistence
21. **Reload survives** — send 5 messages, reload, all 5 are restored from
    `terminal_messages`.
22. **Memory recall** — after 3 distinct sessions on related topics,
    `retrieveRelevantContext` returns the most-similar prior entry.
23. **Archive cap** — flood 105 tier-1/tier-2 messages; archive trims to 100,
    oldest dropped first.
