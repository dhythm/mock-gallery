# Gallery redesign QA results

Date: 2026-10-01, working tree in `/workspace/shared/mock-gallery`.
This report covers the uncommitted redesign, including the shared gallery styles.
No publication, deployment, push, or merge was performed.

## Passed

- `pnpm check`: aggregate lint, build, static and interaction checks pass
- `git diff --check`: no whitespace errors
- `pnpm build`: TypeScript build, production Vite bundle, and SPA `404.html` copy
- `pnpm lint`: Oxlint
- `node scripts/qa-gallery-static.mjs`: all 22 unique catalog slugs have matching
  registered components; portal/detail/fallback routes and base path exist;
  mock source has no direct network API or external form action; toast live-status
  and keyboard-focus rules are present
- `node scripts/qa-gallery-interactions.mjs`: 30 component/state assertions,
  including one meaningful interaction flow for each of the 22 demos

The interaction script executes the actual TSX component and event-handler code
with a small in-memory hook/JSX/router adapter. No runtime dependencies were added.
It checks generated element props, state updates, content, and toast calls. It
is **not** a React renderer or browser and does not validate real reconciliation,
effects, DOM semantics, native event delivery/validation, computed accessibility,
CSS, focus, URL history, layout, or console output.

## Interaction coverage

| Screen | Verified component behavior |
| --- | --- |
| Portal | All 22 cards; every industry count; search; empty state; clear; search-parameter state |
| Detail routes | All 22 detail components; one H1; title; workspace element; unknown-route fallback |
| Construction daily report | Work edit reaches preview; confirm; photo change returns to draft |
| Construction corrections | Mark corrected; action count decreases; corrected filter |
| Construction board | Move assignment to in-progress, then completed |
| Logistics driver log | Wait tag updates total; confirm; subsequent change returns to draft |
| Manufacturing inspection | Record abnormal result and photo; resolve abnormal status |
| Manufacturing checklist | Incomplete submission is rejected; complete and record; edit invalidates |
| Care handover | Add note; export CSV preview |
| Care paper bridge | Classify scan; unclassified count updates; export preview |
| Care shift board | Cycle named person's day; apply requested leave |
| Shift Excel bridge | Export TSV preview; edited selection invalidates preview |
| Restaurant order/loss | Change order quantity; confirm; edit invalidates; invalid loss values rejected |
| Restaurant shift | Fill cell; publish; edit returns to draft; duplicate/blank role rejected |
| Property owner report | Create pack; month change invalidates; monthly repair figure updates |
| Farm GAP log | Export evidence; add work; previous output invalidates |
| Professional case ledger | Complete overdue case; overdue notice updates |
| Professional intake | Classify document into processed column |
| FAX inbox | Confirm selected fax; action disables; empty search state |
| Wholesale hub | Confirm order; channel filter |
| E-book law lite | Register document; invalid numeric amount rejected |
| SME order web | Confirm increments version; quantity edit returns row to draft |
| Clinic document export | Save copy; switch template; re-clicking active template preserves edits |
| Paper form kit | Edit fields; save summary; CSV preview; template round trip preserves fields |

Additional generated-element checks cover input/button naming, required-field
whitespace patterns, item-specific stepper action labels, and the zero floor.

## Independent review follow-up

- Fixed a phone CSS cascade issue in digital-paper inputs: the <=640px rule now
  matches `.doc-digital-sheet .paper-table .input` specificity and sets 16px,
  overriding the domain stylesheet’s 13px rule to avoid iOS focus zoom
- Added a targeted source regression for the matching selector, phone breakpoint,
  and gallery stylesheet import order. This is not a computed-style browser test
- Corrected stylesheet import order to base primitives, App/domain styles, then
  gallery overrides. This preserves the domain grid, board and paper-sheet rules
  instead of allowing the legacy base stylesheet to override them
- Rebuilt and checked actual production CSS order for `.stats` / `.field-stats`,
  `.board-col` / `.field-board-col`, and `.paper` / `.field-checklist`
- Re-ran `pnpm check` and `git diff --check` after these fixes; both passed

## Small defects fixed during QA

- Added native whitespace-rejection patterns to shared required text inputs
- Added item-specific names to +/- stepper buttons and disabled decrement at zero
- Rejected invalid, infinite, negative, and zero restaurant loss quantities
- Rejected duplicate or blank restaurant shift role names, avoiding duplicate row keys
- Preserved edited clinic body text when the already-selected template is clicked

## Browser QA: blocked

Installed browser: Chromium 151.0.7922.173 (Debian).
Normal headless startup with a writable `/tmp` profile failed before loading any
page, including `about:blank`:

`FATAL:chrome/browser/process_singleton_posix.cc:297: socket() failed: Operation not permitted (1)`

The same normal invocation with the supported execution escalation request was
admitted but failed identically (exit 134). No `--no-sandbox`, web-security bypass,
or certificate-warning bypass flags were used. Prior cloud browser localhost
access was also reported as `ERR_BLOCKED_BY_CLIENT`.

Therefore these checks are **BLOCKED / NOT RUN**, not passes:

- Visual screenshots and desktop/mobile review at 1440x1000, 390x844, and 320x800
- Page and bounded-table horizontal overflow measurements
- Real keyboard/tab/focus behavior, computed accessible names, screen reader output
- Native form validation, pointer/touch interaction, repeated rapid clicks
- Browser Back/Forward, direct-route HTTP behavior, scroll restoration
- Browser console/uncaught errors and actual external-request observation

The remaining manual/browser matrix is in `qa-gallery-plan.md`. Re-run build,
lint, both scripts, and that browser matrix after subsequent changes and before
publication. Source/component success does not establish a full UI pass.
