# Gallery regression checklist

This plan covers the portal and all 22 mock routes. Run against the final local
build at `/mock-gallery/`, not the public site until the redesign is deployed.
The application is a memory-only mock; no real send, upload, or backend request
is expected. A build/typecheck alone does not establish browser coverage.

## Environment and evidence

- Run `pnpm lint` and `pnpm build` against the final source
- Run `node scripts/qa-gallery-static.mjs` for catalog/route and mock-network checks
- Run `node scripts/qa-gallery-interactions.mjs` for 30 component/state checks
  using the dependency-free TSX adapter. This is not browser coverage; see
  `qa-gallery-report.md` for its limits and the current execution blocker.
- Start `pnpm dev --host 127.0.0.1 --port 5173`
- Use the supported browser-control surface. If localhost is blocked, report that
  limitation instead of marking UI checks passed
- Record browser, tested commit or working-tree date, viewport dimensions, and
  screenshots of the portal and representative detail views
- Check at 1440×1000, 390×844, and 320×800 CSS pixels, at 100% browser zoom
- Open every route directly and navigate to it through the portal at least once
- Collect console errors and uncaught page errors throughout

## Each route, each viewport (69 views)

1. Page loads a matching non-empty title and one main heading
2. No page-level horizontal overflow: document scrollWidth ≤ clientWidth + 1px
3. Navigation, headings, controls, cards, and status text remain inside the page
4. Wide shift/table content may scroll inside an obvious bounded table region;
   it must not stretch the document or hide actions beyond an unscrollable edge
5. Long Japanese text, filenames, and status labels wrap without overlap
6. Inputs and buttons remain usable with keyboard and visible focus treatment
7. All controls have meaningful accessible names, including +/- and shift cells
8. Submit/control actions have at least a 44px-high practical touch target
9. Activate the meaningful route action below, then verify the specified visible
   result. Check page overflow again after mutation and when a toast is present
10. The back link returns to the portal; browser Back/Forward produces the
    expected page without a crash or stuck overlay

## Portal scenarios

- Initial state contains all 22 unique catalog cards
- Every industry chip filters to its own category; pressed state changes
- `すべて` restores all 22 results
- Search matches a known title, industry, and description fragment
- A nonmatching query shows an intentional empty state
- Clear/reset restores cards and updates the count
- Combine a category and search; result count equals visible cards
- Open a card with Enter; return through the back link and browser Back
- Verify intentional filter/search restoration behavior after return

## Route action matrix

| Route slug | Meaningful action | Verify |
| --- | --- | --- |
| construction-daily-report | Edit work detail, then 日報を確定 | Saved state and updated PDF image |
| construction-corrective-photos | Mark an open issue corrected | Issue status/count changes; toast |
| construction-subcontractor-board | 作業開始 | Ticket moves to work-in-progress column |
| logistics-driver-log | Change a wait tag, then 日報を確定 | Wait total and confirmed state update |
| manufacturing-inspection | Open an equipment item and change inspection status | Selected equipment/status and progress update |
| manufacturing-checklist-digital | Mark a checklist item 良/否 | Cell selection and recorded status update |
| care-handover | Fill 内容 and 記録を追加 | New resident note appears |
| care-paper-bridge | Classify a scan or CSVを出す | Category/status or CSV image appears |
| care-shift-board | Change one named person's day cell | Day value and shortage count update |
| shift-excel-bridge | Excel形式で書き出し | Tab-separated preview appears |
| restaurant-order-loss | Increment quantity, then 発注を確定 | Quantity and confirmed state update |
| restaurant-shift-exit | Toggle an empty shift cell, then シフトを公開 | Person appears and published badge changes |
| property-owner-report | PDFパックを作成 | PDF preview heading and success toast |
| farm-gap-log | 証跡PDFを出す | Evidence PDF image appears |
| professional-case-ledger | 完了にする | Row becomes completed and count updates |
| professional-intake-box | Classify an unprocessed document | Document moves to processed column |
| fax-structured-inbox | 受注確定 | Selected fax becomes confirmed |
| wholesale-order-hub | 確認済にする | Selected order changes status |
| ebook-law-lite | Fill registration partner/amount and 書類を登録 | New indexed document row appears |
| sme-order-web | この版を確定 | Version number increments and drafts become confirmed |
| clinic-doc-export | 控えを保管 | New stored copy row appears |
| paper-form-kit | Enter a form value and 入力を一覧へ | New saved record contains typed value |

## Additional state checks

- Repeat non-destructive actions twice; status remains coherent
- Invalid or blank required input is rejected without a phantom row
- Search/filter interactions do not clear unrelated edits unexpectedly
- Inspect a long generated CSV/PDF preview at both mobile widths
- With reduced motion enabled, content and focus remain understandable
- Unknown slug shows a useful not-found state and a working way back

## Acceptance record

For each check record PASS / FAIL / BLOCKED / NOT RUN. Include exact route,
viewport, action, expected/actual result, and screenshot for any defect. Never
summarize static checks as an end-to-end or responsive-browser pass.
